import os
import re
import secrets
import smtplib
import sqlite3
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path

import requests
from flask import Flask, abort, redirect, render_template, request, send_from_directory, session, url_for
from werkzeug.security import check_password_hash

from content import HOME_FAQ, SERVICES, SITE_URL

APP_DIR = Path(__file__).resolve().parent


def load_local_env():
    """Load simple KEY=value settings from .env without replacing host settings."""
    env_file = APP_DIR / ".env"
    if not env_file.is_file():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        if re.fullmatch(r"[A-Z][A-Z0-9_]*", key):
            value = value.strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            os.environ.setdefault(key, value)


load_local_env()
DB_PATH = Path(os.getenv("DATABASE_PATH") or APP_DIR / "database.db")
CONTACT_EMAIL = "wetakefwd@gmail.com"
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY") or secrets.token_hex(32)
app.config.update(SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Lax")
if os.getenv("FLASK_ENV") == "production":
    app.config["SESSION_COOKIE_SECURE"] = True

SERVICE_BY_SLUG = {service["slug"]: service for service in SERVICES}
FEATURED_SLUGS = ["ai-business-automation", "ai-agents-chatbots", "whatsapp-crm-automation", "lead-generation", "website-app-development", "meta-google-ads"]


def db_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.execute("CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, company TEXT, service TEXT, message TEXT NOT NULL, created_at TEXT)")
    return connection


def breadcrumb(items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": index, "name": name, "item": url}
        for index, (name, url) in enumerate(items, 1)
    ]}


ORGANIZATION_SCHEMA = {
    "@context": "https://schema.org", "@type": "Organization", "@id": f"{SITE_URL}/#organization",
    "name": "WeTakeFWD", "alternateName": "We Take Forward", "url": SITE_URL,
    "logo": f"{SITE_URL}/static/app-icon.svg", "description": "AI Automation & Digital Growth Agency serving businesses in India.",
    "email": "wetakefwd@gmail.com", "telephone": "+91-8191904121",
    "areaServed": {"@type": "Country", "name": "India"},
    "sameAs": ["https://www.linkedin.com/company/wetakefwd-369/", "https://www.instagram.com/weta_kefwd", "https://x.com/wetakefwd"],
}


@app.context_processor
def site_context():
    return {"site_url": SITE_URL, "services": SERVICES, "current_year": datetime.now(timezone.utc).year}


@app.route("/")
def home():
    faq_schema = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": item["question"], "acceptedAnswer": {"@type": "Answer", "text": item["answer"]}}
        for item in HOME_FAQ
    ]}
    return render_template("home.html", organization_schema=ORGANIZATION_SCHEMA, home_faq=HOME_FAQ,
                           home_faq_schema=faq_schema, featured_services=[SERVICE_BY_SLUG[slug] for slug in FEATURED_SLUGS])


@app.route("/services")
def services_index():
    return render_template("services.html", breadcrumb_schema=breadcrumb([("Home", f"{SITE_URL}/"), ("Services", f"{SITE_URL}/services")]))


@app.route("/services/<slug>")
def service_page(slug):
    service = SERVICE_BY_SLUG.get(slug)
    if service is None:
        abort(404)
    canonical = f"{SITE_URL}/services/{slug}"
    service_schema = {"@context": "https://schema.org", "@type": "Service", "name": service["title"],
                      "description": service["intro"], "url": canonical, "provider": {"@id": f"{SITE_URL}/#organization"},
                      "areaServed": {"@type": "Country", "name": "India"}}
    faq_schema = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": question, "acceptedAnswer": {"@type": "Answer", "text": answer}}
        for question, answer in service["faq"]
    ]}
    return render_template("service.html", service=service, service_schema=service_schema, service_faq_schema=faq_schema,
                           breadcrumb_schema=breadcrumb([("Home", f"{SITE_URL}/"), ("Services", f"{SITE_URL}/services"), (service["title"], canonical)]))


@app.route("/robots.txt")
def robots():
    return send_from_directory(APP_DIR / "static", "robots.txt", mimetype="text/plain")


@app.route("/sitemap.xml")
def sitemap():
    urls = [f"{SITE_URL}/", f"{SITE_URL}/services"] + [f"{SITE_URL}/services/{s['slug']}" for s in SERVICES]
    body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f"<url><loc>{url}</loc></url>\n" for url in urls) + "</urlset>"
    return app.response_class(body, mimetype="application/xml")


def send_enquiry_email(values):
    """Return sent, failed, or not_configured; never report a saved lead as emailed by default."""
    body = "New enquiry from the WeTakeFWD website\n\n" + "\n".join(
        f"{key.title()}: {value}" for key, value in values.items()
    )
    api_key = os.getenv("RESEND_API_KEY")
    # Match the sender used by the existing Render deployment until a verified
    # WeTakeFWD sending domain is configured.
    sender = os.getenv("RESEND_FROM_EMAIL") or "onboarding@resend.dev"
    gmail_app_password = os.getenv("GMAIL_APP_PASSWORD", "").replace(" ", "")
    try:
        if api_key and sender:
            response = requests.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {api_key}"},
                json={"from": sender, "to": [CONTACT_EMAIL], "reply_to": values["email"],
                      "subject": "New WeTakeFWD enquiry", "text": body},
                timeout=15,
            )
            response.raise_for_status()
            return "sent"
        if gmail_app_password:
            message = EmailMessage()
            message["Subject"] = "New WeTakeFWD enquiry"
            message["From"] = CONTACT_EMAIL
            message["To"] = CONTACT_EMAIL
            message["Reply-To"] = values["email"]
            message.set_content(body)
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as smtp:
                smtp.login(CONTACT_EMAIL, gmail_app_password)
                smtp.send_message(message)
            return "sent"
    except (requests.RequestException, OSError, smtplib.SMTPException, ValueError):
        app.logger.exception("Enquiry saved, but email notification failed")
        return "failed"
    return "not_configured"


@app.route("/contact", methods=["POST"])
def contact():
    values = {key: request.form.get(key, "").strip() for key in ("name", "email", "company", "service", "message")}
    if request.form.get("website", "").strip():
        return redirect(url_for("success"), code=303)
    if (not values["name"] or len(values["name"]) > 100 or len(values["email"]) > 254 or
            not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", values["email"]) or
            len(values["company"]) > 120 or len(values["service"]) > 100 or
            not values["message"] or len(values["message"]) > 5000):
        return "Please provide a valid name, email and message.", 400
    with db_connection() as connection:
        connection.execute("INSERT INTO leads (name,email,company,service,message,created_at) VALUES (?,?,?,?,?,?)",
                           (values["name"], values["email"], values["company"], values["service"], values["message"], datetime.now(timezone.utc).isoformat()))
    session["contact_email_status"] = send_enquiry_email(values)
    return redirect(url_for("success"), code=303)


@app.route("/success")
def success():
    return render_template("success.html", email_status=session.pop("contact_email_status", None))


@app.route("/login", methods=["GET", "POST"])
def login():
    configured_username = os.getenv("ADMIN_USERNAME")
    password_hash = os.getenv("ADMIN_PASSWORD_HASH")
    if not configured_username or not password_hash:
        abort(404)
    if request.method == "POST":
        username = request.form.get("username", "")
        password = request.form.get("password", "")
        if secrets.compare_digest(username, configured_username) and check_password_hash(password_hash, password):
            session.clear()
            session["logged_in"] = True
            return redirect(url_for("admin"))
        return "Invalid login", 401
    return render_template("login.html")


@app.route("/admin")
def admin():
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    with db_connection() as connection:
        leads = connection.execute("SELECT id,name,email,company,service,message FROM leads ORDER BY id DESC").fetchall()
    session.setdefault("csrf_token", secrets.token_urlsafe(32))
    return render_template("admin.html", leads=leads, csrf_token=session["csrf_token"])


@app.route("/delete/<int:id>", methods=["POST"])
def delete_lead(id):
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    if not secrets.compare_digest(request.form.get("csrf_token", ""), session.get("csrf_token", "invalid")):
        abort(403)
    with db_connection() as connection:
        connection.execute("DELETE FROM leads WHERE id=?", (id,))
    return redirect(url_for("admin"))


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG") == "1")
