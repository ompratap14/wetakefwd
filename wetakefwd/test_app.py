import os
from contextlib import closing
import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch, Mock

import requests
from werkzeug.security import generate_password_hash
import app as site


class WebsiteTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.database = patch.object(site, "DB_PATH", Path(self.temp.name) / "leads.db")
        self.database.start()
        self.addCleanup(self.database.stop)
        self.env = patch.dict(os.environ, {}, clear=True)
        self.env.start()
        self.addCleanup(self.env.stop)
        self.client = site.app.test_client()
        self.values = dict(name="Test visitor", email="test@example.com", company="", service="Not sure yet", message="Test enquiry")

    def test_pages_and_work_link(self):
        for path in ["/", "/services", "/robots.txt", "/sitemap.xml"] + ["/services/" + s["slug"] for s in site.SERVICES]:
            with self.subTest(path=path):
                with self.client.get(path) as response:
                    self.assertEqual(response.status_code, 200)
        self.assertIn(b'href="#work">Explore our work', self.client.get("/").data)
        self.assertIn(b"10 / CARE", self.client.get("/services").data)
        self.assertEqual(self.client.get("/services/unknown").status_code, 404)

    def test_old_database_preserved_and_contact_saved(self):
        with closing(sqlite3.connect(site.DB_PATH)) as db, db:
            db.execute("CREATE TABLE leads (id INTEGER PRIMARY KEY, name TEXT, email TEXT, company TEXT, service TEXT, message TEXTn)")
            db.execute("INSERT INTO leads VALUES (1, 'Existing', 'old@example.com', '', '', 'Keep this')")
        result = self.client.post("/contact", data=self.values, follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn(b"email notification could not be sent", result.data)
        with closing(sqlite3.connect(site.DB_PATH)) as db, db:
            rows = db.execute("SELECT name, message, created_at FROM leads ORDER BY id").fetchall()
        self.assertEqual(rows[0], ("Existing", "Keep this", None))
        self.assertEqual(rows[1][0], "Test visitor")
        self.assertTrue(rows[1][2])
        self.client.post("/contact", data=self.values)

    def test_invalid_form_does_not_send_email(self):
        with patch.object(site, "send_enquiry_email") as mail:
            for changes in [dict(email="bad"), dict(name=""), dict(message=""), dict(message="x" * 5001)]:
                self.assertEqual(self.client.post("/contact", data=self.values | changes).status_code, 400)
            mail.assert_not_called()

    def test_email_success(self):
        with patch.dict(os.environ, {"RESEND_API_KEY": "test-key"}), patch.object(site.requests, "post", return_value=Mock()) as mail:
            result = self.client.post("/contact", data=self.values, follow_redirects=True)
        self.assertIn(b"enquiry has been sent", result.data)
        self.assertEqual(mail.call_args.kwargs["timeout"], 15)
        self.assertEqual(mail.call_args.kwargs["json"]["reply_to"], "test@example.com")

    def test_email_failure_keeps_enquiry(self):
        for failure in [requests.Timeout("simulated"), requests.HTTPError("simulated")]:
            with self.subTest(failure=type(failure).__name__), patch.dict(os.environ, {"RESEND_API_KEY": "test-key"}), patch.object(site.requests, "post", side_effect=failure), self.assertLogs(site.app.logger, level="ERROR"):
                result = self.client.post("/contact", data=self.values, follow_redirects=True)
                self.assertIn(b"email notification could not be sent", result.data)
        with closing(sqlite3.connect(site.DB_PATH)) as db, db:
            self.assertEqual(db.execute("SELECT COUNT(*) FROM leads").fetchone()[0], 2)

    def test_admin_without_stable_secret_stays_disabled(self):
        with patch.dict(os.environ, {"ADMIN_USERNAME": "test-admin", "ADMIN_PASSWORD_HASH": generate_password_hash("test-password")}):
            result = self.client.post("/login", data=dict(username="test-admin", password="test-password"))
            self.assertEqual(result.status_code, 503)
            self.assertNotIn(b'type="password"', result.data)
            self.assertEqual(self.client.get("/admin").status_code, 302)

    def test_admin_requires_configured_credentials_and_csrf(self):
        self.assertEqual(self.client.get("/login").status_code, 503)
        self.assertEqual(self.client.get("/admin").status_code, 302)
        with patch.dict(os.environ, {"SECRET_KEY": "test-only-secret", "ADMIN_USERNAME": "test-admin", "ADMIN_PASSWORD_HASH": generate_password_hash("test-password")}):
            self.assertEqual(self.client.post("/login", data=dict(username="test-admin", password="wrong")).status_code, 401)
            result = self.client.post("/login", data=dict(username="test-admin", password="test-password"), follow_redirects=True)
            self.assertEqual(result.status_code, 200)
            self.client.post("/contact", data=self.values)
            self.assertIn(b"Test visitor", self.client.get("/admin").data)
            self.assertEqual(self.client.post("/delete/1").status_code, 403)
            self.client.get("/logout")
            self.assertEqual(self.client.get("/admin").status_code, 302)


if __name__ == "__main__":
    unittest.main()
