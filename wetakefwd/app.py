import os
import re
import secrets
import smtplib
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path

import requests
from flask import Flask, abort, redirect, render_template, request, send_from_directory, session, url_for
from werkzeug.security import check_password_hash

from content import AI_LOCATION_PAGES, APP_DEVELOPMENT_CITY_PAGES, CASE_STUDIES, CITY_SERVICE_DETAIL_PAGES, CITY_SERVICE_PAGES, HOME_FAQ, LOCATION_MARKETING_PAGES, SEO_PAGES, SERVICES, SITE_URL

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
SEO_PAGE_BY_SLUG = {page["slug"]: page for page in SEO_PAGES}
SEO_PAGE_BY_PATH = {page["path"]: page for page in SEO_PAGES}
CASE_STUDY_BY_SLUG = {case["slug"]: case for case in CASE_STUDIES}
RELATED_PAGE_BY_PATH = SEO_PAGE_BY_PATH | {f"/services/{service['slug']}": service for service in SERVICES}
LEGACY_SEO_REDIRECTS = {
    "ai-development": "ai-development-services-india",
    "ai-development-company-india": "ai-development-services-india",
    "ai-automation": "ai-automation-services-india",
    "best-ai-automation-company-india": "ai-automation-services-india",
    "ai-agents": "ai-agent-development",
    "chatbot-development": "ai-chatbot-development",
    "software-development": "custom-software-development",
    "business-automation": "business-automation-services",
}
LEGACY_PATH_REDIRECTS = {
    "app-development-etah": "/app-development/etah",
    "app-development-agra": "/app-development/agra",
    "app-development-aligarh": "/app-development/aligarh",
    "app-development-mathura": "/app-development/mathura",
}
FEATURED_SLUGS = ["ai-business-automation", "ai-agents-chatbots", "whatsapp-crm-automation", "lead-generation", "website-app-development", "meta-google-ads"]


@contextmanager
def db_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    try:
        # Serialize upgrades across workers and preserve pre-redesign enquiries.
        connection.execute("BEGIN IMMEDIATE")
        connection.execute("CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, company TEXT, service TEXT, message TEXT NOT NULL, created_at TEXT)")
        columns = {row[1] for row in connection.execute("PRAGMA table_info(leads)")}
        if "created_at" not in columns:
            connection.execute("ALTER TABLE leads ADD COLUMN created_at TEXT")
        connection.commit()
        with connection:
            yield connection
    finally:
        connection.close()


def breadcrumb(items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": index, "name": name, "item": url}
        for index, (name, url) in enumerate(items, 1)
    ]}


ORGANIZATION_SCHEMA = {
    "@context": "https://schema.org", "@type": "Organization", "@id": f"{SITE_URL}/#organization",
    "name": "WeTakeFWD", "alternateName": "We Take Forward", "url": SITE_URL,
    "logo": f"{SITE_URL}/static/images/official-logo.png", "description": "AI automation and digital growth services for businesses in India.",
    "email": "wetakefwd@gmail.com", "telephone": "+91-8191904121",
    "areaServed": {"@type": "Country", "name": "India"},
    "sameAs": ["https://www.linkedin.com/company/wetakefwd-369/", "https://www.instagram.com/weta_kefwd", "https://x.com/wetakefwd"],
    "knowsAbout": ["AI development", "AI automation", "AI agents", "business process automation", "custom software development", "AI chatbots"],
    "contactPoint": {"@type": "ContactPoint", "telephone": "+91-8191904121", "email": "wetakefwd@gmail.com", "contactType": "sales", "areaServed": "IN", "availableLanguage": ["English", "Hindi"]},
}

WEBSITE_SCHEMA = {
    "@context": "https://schema.org", "@type": "WebSite", "@id": f"{SITE_URL}/#website",
    "url": SITE_URL, "name": "WeTakeFWD", "alternateName": "We Take Forward",
    "description": "AI development, automation and custom software for businesses in India.",
    "publisher": {"@id": f"{SITE_URL}/#organization"}, "inLanguage": "en-IN",
}


@app.context_processor
def site_context():
    return {"site_url": SITE_URL, "services": SERVICES, "seo_pages": SEO_PAGES,
            "core_service_pages": [page for page in SEO_PAGES if not page.get("noindex")],
            "location_marketing_pages": LOCATION_MARKETING_PAGES,
            "ai_location_pages": AI_LOCATION_PAGES,
            "city_service_pages": CITY_SERVICE_PAGES,
            "app_development_city_pages": APP_DEVELOPMENT_CITY_PAGES,
            "city_service_detail_pages": CITY_SERVICE_DETAIL_PAGES,
            "case_studies": CASE_STUDIES,
            "web3forms_access_key": os.getenv("WEB3FORMS_ACCESS_KEY", "f8858610-b7af-44d5-9073-b2eeefbca47f"),
            "current_year": datetime.now(timezone.utc).year}


@app.route("/")
def home():
    faq_schema = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": item["question"], "acceptedAnswer": {"@type": "Answer", "text": item["answer"]}}
        for item in HOME_FAQ
    ]}
    return render_template("home_v2.html", organization_schema=ORGANIZATION_SCHEMA, website_schema=WEBSITE_SCHEMA, home_faq=HOME_FAQ,
                           home_faq_schema=faq_schema, featured_services=[SERVICE_BY_SLUG[slug] for slug in FEATURED_SLUGS])


@app.route("/services")
def services_index():
    return render_template("services.html", breadcrumb_schema=breadcrumb([("Home", f"{SITE_URL}/"), ("Services", f"{SITE_URL}/services")]))


@app.route("/work")
def work_index():
    return render_template("work.html", breadcrumb_schema=breadcrumb([("Home", f"{SITE_URL}/"), ("Selected work", f"{SITE_URL}/work")]))


@app.route("/work/<slug>")
def case_study(slug):
    case = CASE_STUDY_BY_SLUG.get(slug)
    if case is None:
        abort(404)
    canonical = f"{SITE_URL}/work/{slug}"
    case_schema = {
        "@context": "https://schema.org", "@type": "CreativeWork", "name": case["title"],
        "description": case["summary"], "url": canonical,
        "creator": {"@id": f"{SITE_URL}/#organization"},
        "about": {"@type": "Organization", "name": case["client"]},
        "image": [f"{SITE_URL}/static/images/case-studies/{image['file']}" for image in case["gallery"]],
    }
    return render_template(
        "case_study.html", case=case, case_schema=case_schema,
        breadcrumb_schema=breadcrumb([("Home", f"{SITE_URL}/"), ("Selected work", f"{SITE_URL}/work"), (case["client"], canonical)]),
    )


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
                           related_services=[SERVICES[(SERVICES.index(service) + offset) % len(SERVICES)] for offset in (1, 2, 3)],
                           breadcrumb_schema=breadcrumb([("Home", f"{SITE_URL}/"), ("Services", f"{SITE_URL}/services"), (service["title"], canonical)]))


@app.route("/<slug>")
def seo_service_page(slug):
    if slug in LEGACY_PATH_REDIRECTS and request.path == f"/{slug}":
        return redirect(LEGACY_PATH_REDIRECTS[slug], code=301)
    if slug in LEGACY_SEO_REDIRECTS:
        return redirect(url_for("seo_service_page", slug=LEGACY_SEO_REDIRECTS[slug]), code=301)
    service = SEO_PAGE_BY_SLUG.get(slug)
    if service is None:
        abort(404)
    canonical = f"{SITE_URL}{service['path']}"
    if not service.get("location"):
        area_served = {"@type": "Country", "name": "India"}
    elif service["location"] == "Delhi NCR":
        area_served = {"@type": "AdministrativeArea", "name": "Delhi NCR"}
    else:
        area_served = {"@type": "City", "name": service["location"]}
    service_schema = {"@context": "https://schema.org", "@type": "Service", "name": service["title"],
                      "description": service["summary"], "url": canonical,
                      "provider": {"@id": f"{SITE_URL}/#organization"},
                      "areaServed": area_served}
    if service.get("offer"):
        service_schema["offers"] = {"@type": "Offer", "name": service["offer"], "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock", "url": canonical}
    faq_schema = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": question, "acceptedAnswer": {"@type": "Answer", "text": answer}}
        for question, answer in service["faq"]
    ]}
    if service in CITY_SERVICE_PAGES:
        related = [SEO_PAGE_BY_SLUG[slug] for slug in ("custom-software-development", "business-automation-services", "ai-agent-development")]
    elif service in CITY_SERVICE_DETAIL_PAGES:
        related = [RELATED_PAGE_BY_PATH[path] for path in service["related_paths"]]
    elif service in APP_DEVELOPMENT_CITY_PAGES:
        related = [SEO_PAGE_BY_SLUG[slug] for slug in ("mobile-app-development", "custom-software-development", "ai-agent-development")]
    elif service.get("noindex"):
        related = [SEO_PAGE_BY_SLUG[slug] for slug in ("web-development", "custom-software-development", "ai-automation-services-india")]
    else:
        indexable_pages = [page for page in SEO_PAGES if not page.get("noindex")]
        index = indexable_pages.index(service)
        related = [indexable_pages[(index + offset) % len(indexable_pages)] for offset in (1, 2, 3)]
    return render_template("service.html", service=service, service_schema=service_schema,
                           service_faq_schema=faq_schema, related_services=related,
                           breadcrumb_schema=breadcrumb([("Home", f"{SITE_URL}/"), (service["title"], canonical)]))


@app.route("/<service_slug>/<city_slug>")
def nested_city_service_page(service_slug, city_slug):
    service = SEO_PAGE_BY_PATH.get(f"/{service_slug}/{city_slug}")
    if service is None:
        abort(404)
    return seo_service_page(service["slug"])


@app.route("/robots.txt")
def robots():
    return send_from_directory(APP_DIR / "static", "robots.txt", mimetype="text/plain")


@app.route("/llms.txt")
def llms():
    return send_from_directory(APP_DIR / "static", "llms.txt", mimetype="text/plain")


@app.route("/thank-you/")
def thank_you():
    return render_template("thank_you.html")


@app.route("/privacy")
def privacy():
    return render_template("legal.html", page="privacy")


@app.route("/terms")
def terms():
    return render_template("legal.html", page="terms")


@app.route("/sitemap.xml")
def sitemap():
    urls = ([f"{SITE_URL}/", f"{SITE_URL}/services"] +
            [f"{SITE_URL}/services/{s['slug']}" for s in SERVICES] +
            [f"{SITE_URL}{page['path']}" for page in SEO_PAGES if not page.get('noindex')] +
            [f"{SITE_URL}/work", *[f"{SITE_URL}/work/{case['slug']}" for case in CASE_STUDIES]] +
            [f"{SITE_URL}/privacy", f"{SITE_URL}/terms"])
    updated = "2026-11-27"
    entries = []
    for url in urls:
        if url == f"{SITE_URL}/":
            priority, frequency = "1.0", "weekly"
        elif url == f"{SITE_URL}/services":
            priority, frequency = "0.9", "monthly"
        else:
            priority, frequency = "0.8", "monthly"
        entries.append(f"<url><loc>{url}</loc><lastmod>{updated}</lastmod><changefreq>{frequency}</changefreq><priority>{priority}</priority></url>\n")
    body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(entries) + "</urlset>"
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
    if not configured_username or not password_hash or not os.getenv("SECRET_KEY"):
        return render_template("login.html", unavailable=True), 503
    if request.method == "POST":
        username = request.form.get("username", "")
        password = request.form.get("password", "")
        try:
            password_matches = check_password_hash(password_hash, password)
        except (ValueError, TypeError):
            app.logger.error("Admin password hash configuration is invalid")
            return render_template("login.html", unavailable=True), 503
        if secrets.compare_digest(username.encode(), configured_username.encode()) and password_matches:
            session.clear()
            session["logged_in"] = True
            return redirect(url_for("admin"))
        return render_template("login.html", error="Incorrect username or password."), 401
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
