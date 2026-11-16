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

    def test_pages_and_primary_contact_link(self):
        for path in (["/", "/services", "/robots.txt", "/sitemap.xml", "/llms.txt"] +
                     ["/services/" + s["slug"] for s in site.SERVICES] +
                     [page["path"] for page in site.SEO_PAGES]):
            with self.subTest(path=path):
                with self.client.get(path) as response:
                    self.assertEqual(response.status_code, 200)
        self.assertIn(b'Start a project', self.client.get("/").data)
        self.assertIn(b'class="floating-project-cta"', self.client.get("/").data)
        self.assertIn(b"/services/ongoing-support", self.client.get("/services").data)
        self.assertEqual(self.client.get("/services/unknown").status_code, 404)

    def test_public_pages_have_distinct_seo_metadata_and_brand_logo(self):
        paths = (["/", "/services"] + ["/services/" + s["slug"] for s in site.SERVICES] +
                 [page["path"] for page in site.SEO_PAGES])
        titles = set()
        for path in paths:
            with self.subTest(path=path):
                html = self.client.get(path).get_data(as_text=True)
                self.assertIn(f'<link rel="canonical" href="{site.SITE_URL}{path}">', html)
                self.assertIn('<meta name="description" content="', html)
                self.assertIn('/static/images/official-logo.png', html)
                self.assertEqual(html.count('<h1'), 1)
                title = html.split('<title>', 1)[1].split('</title>', 1)[0]
                self.assertNotIn(title, titles)
                titles.add(title)
        home = self.client.get('/').get_data(as_text=True)
        self.assertIn('AI-powered operator uses technology to move faster', home)
        self.assertIn('action="https://api.web3forms.com/submit"', home)
        self.assertIn('name="redirect" value="https://www.wetakefwd.online/thank-you/"', home)
        self.assertIn('"@type": "Organization"', home)
        self.assertIn('"@type": "WebSite"', home)
        self.assertIn('/ai-development-company-india', home)
        self.assertIn('/ai-automation-for-clinics-delhi-ncr', home)
        clinic = self.client.get('/ai-automation-for-clinics-delhi-ncr').get_data(as_text=True)
        self.assertIn('Free 20-minute AI Automation Audit', clinic)
        self.assertIn('"@type": "Offer"', clinic)
        self.assertNotIn('class="intro-skip"', home)
        self.assertIn('WeTakeFWD turns ambitious businesses', home)
        self.assertIn('<em>AI-powered operators.</em>', home)
        self.assertIn('data-video-intro', home)
        self.assertIn('/static/video/wetakefwd-intro.mp4', home)
        self.assertIn('playsinline', home)
        self.assertIn('<meta name="viewport" content="width=device-width,initial-scale=1">', home)
        directory = self.client.get('/services').get_data(as_text=True)
        self.assertIn('data-filter="systems"', directory)
        self.assertIn('data-filter-count', directory)
        service = self.client.get('/services/ai-business-automation').get_data(as_text=True)
        self.assertIn('data-example-tab="future"', service)
        self.assertIn('data-example-panel="future" hidden', service)
        sitemap = self.client.get('/sitemap.xml').get_data(as_text=True)
        self.assertEqual(sitemap.count('<url>'), len(paths))
        self.assertEqual(sitemap.count('<lastmod>2026-11-16</lastmod>'), len(paths))
        self.assertIn('<priority>1.0</priority>', sitemap)

    def test_keyword_landing_pages_own_their_search_intent(self):
        for page in site.SEO_PAGES:
            with self.subTest(path=page["path"]):
                html = self.client.get(page["path"]).get_data(as_text=True)
                self.assertIn(page["primary_keyword"], html)
                self.assertIn(f'<link rel="canonical" href="{site.SITE_URL}{page["path"]}">', html)
                self.assertIn('"@type": "Service"', html)
                self.assertIn('"@type": "FAQPage"', html)

    def test_local_marketing_pages_are_unique_and_discoverable(self):
        self.assertEqual(len(site.LOCATION_MARKETING_PAGES), 9)
        titles = {page["meta_title"] for page in site.LOCATION_MARKETING_PAGES}
        descriptions = {page["meta_description"] for page in site.LOCATION_MARKETING_PAGES}
        self.assertEqual(len(titles), 9)
        self.assertEqual(len(descriptions), 9)
        directory = self.client.get("/services").get_data(as_text=True)
        for page in site.LOCATION_MARKETING_PAGES:
            with self.subTest(path=page["path"]):
                self.assertIn(f'href="{page["path"]}"', directory)
                html = self.client.get(page["path"]).get_data(as_text=True)
                self.assertIn(page["location"], html)
                self.assertIn('"areaServed"', html)

    def test_local_ai_pages_are_unique_and_discoverable(self):
        self.assertEqual(len(site.AI_LOCATION_PAGES), 6)
        self.assertEqual(len({page["meta_title"] for page in site.AI_LOCATION_PAGES}), 6)
        self.assertEqual(len({page["meta_description"] for page in site.AI_LOCATION_PAGES}), 6)
        directory = self.client.get("/services").get_data(as_text=True)
        for page in site.AI_LOCATION_PAGES:
            with self.subTest(path=page["path"]):
                self.assertIn(f'href="{page["path"]}"', directory)
                html = self.client.get(page["path"]).get_data(as_text=True)
                self.assertIn(page["primary_keyword"], html)
                self.assertIn(page["location"], html)
                self.assertIn('"areaServed"', html)

    def test_legacy_keyword_urls_redirect_permanently(self):
        for old_slug, new_slug in site.LEGACY_SEO_REDIRECTS.items():
            with self.subTest(old_slug=old_slug):
                response = self.client.get(f"/{old_slug}")
                self.assertEqual(response.status_code, 301)
                self.assertEqual(response.headers["Location"], f"/{new_slug}")

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
