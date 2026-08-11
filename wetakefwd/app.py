import sqlite3
import smtplib
from email.mime.text import MIMEText
from flask import Flask, render_template, request, redirect, session, jsonify
import os
import time
from flask import send_from_directory



RESEND_API_KEY = os.getenv("RESEND_API_KEY")

import database

app = Flask(__name__)
@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory('static', 'sitemap.xml')

@app.route('/robots.txt')
def robots():
    return send_from_directory('static', 'robots.txt')
app.secret_key = os.getenv("SECRET_KEY", "local-development-only-change-me")

CHAT_RATE_LIMIT = {}

def local_support_reply(message):
    """A no-cost, keyword-based support assistant for common visitor questions."""
    question = message.lower()
    answers = [
        (("service", "offer", "do you do", "what do you", "help with"),
         "We Take Forward builds AI agents, business automation, AI chatbots, data analytics, custom AI solutions, AI-powered web apps, and school ERP systems."),
        (("price", "pricing", "cost", "budget", "charge", "quote"),
         "Our pricing depends on the project scope. We offer project-based pricing, monthly retainers, and milestone-based billing. Share your requirements through the contact form or WhatsApp for a tailored quote."),
        (("time", "timeline", "long", "duration", "deliver"),
         "Simple chatbots and automation flows usually take 1–2 weeks. Complex AI agents or full-stack apps generally take 4–8 weeks. We confirm a precise timeline after a scoping discussion."),
        (("support", "maintenance", "after launch", "post launch"),
         "Every project includes 30 days of post-launch support at no extra cost. We also offer flexible monthly retainers for monitoring, fine-tuning, and new features."),
        (("secure", "security", "data", "privacy", "nda"),
         "Client data is encrypted in transit and at rest. We can sign an NDA before work begins and do not use client data to train models without explicit written consent."),
        (("integrate", "integration", "existing", "crm", "erp", "software"),
         "Yes. We can integrate AI into your existing CRM, ERP, or web application through APIs and connectors that fit your current setup."),
        (("contact", "email", "phone", "whatsapp", "talk", "reach"),
         "You can reach us at wetakefwd@gmail.com, call +91 8191904121, or chat on WhatsApp: https://wa.me/918191904121"),
        (("hello", "hi", "hey"),
         "Hi! I can help with our services, timelines, pricing, support, data security, integrations, and contact details."),
    ]
    for keywords, answer in answers:
        if any(keyword in question for keyword in keywords):
            return answer
    return "I can help with services, pricing, project timelines, support, security, integrations, and contact details. For a specific project question, please message us on WhatsApp: https://wa.me/918191904121"


@app.route("/api/support-chat", methods=["POST"])
def support_chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()

    if not message or len(message) > 1000:
        return jsonify(error="Please enter a question of up to 1,000 characters."), 400

    # A small per-IP limit protects the public endpoint from accidental or abusive use.
    client_ip = request.headers.get("X-Forwarded-For", request.remote_addr).split(",")[0].strip()
    now = time.time()
    recent = [stamp for stamp in CHAT_RATE_LIMIT.get(client_ip, []) if now - stamp < 60]
    if len(recent) >= 10:
        return jsonify(error="Please wait a minute before sending more questions."), 429
    recent.append(now)
    CHAT_RATE_LIMIT[client_ip] = recent

    return jsonify(answer=local_support_reply(message))

# ==========================
# EMAIL FUNCTION
# ==========================
def send_email(name, email, company, service, message):

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "from": "onboarding@resend.dev",
            "to": ["wetakefwd@gmail.com"],
            "subject": "New Lead - We Take Forward (WTF) Solutions",
            "html": f"""
            <h2>New Lead Received</h2>

            <p><b>Name:</b> {name}</p>
            <p><b>Email:</b> {email}</p>
            <p><b>Company:</b> {company}</p>
            <p><b>Service:</b> {service}</p>

            <p><b>Message:</b></p>
            <p>{message}</p>
            """
        }
    )

    print("Status:", response.status_code)
    print(response.text)

# HOME PAGE
# ==========================
@app.route("/")
def home():
    return render_template("index.html")


# ==========================
# CONTACT FORM
# ==========================
@app.route("/contact", methods=["POST"])
def contact():

    name = request.form["name"]
    email = request.form["email"]
    company = request.form["company"]
    service = request.form["service"]
    message = request.form["message"]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO leads
        (name,email,company,service,message)
        VALUES (?,?,?,?,?)
        """,
        (name, email, company, service, message)
    )

    conn.commit()
    conn.close()

    try:
        send_email(
            name,
            email,
            company,
            service,
            message
        )

       

    except Exception as e:
        print("EMAIL ERROR:", e)

    return redirect("/success")


@app.route("/success")
def success():
    return render_template("success.html")


# ==========================
# LOGIN
# ==========================
@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form["username"]
        password = request.form["password"]

        if username == "ompratap" and password == "encode123":
            session["logged_in"] = True
            return redirect("/admin")

        return "Invalid Login"

    return render_template("login.html")


# ==========================
# ADMIN PANEL
# ==========================
@app.route("/admin")
def admin():

    if not session.get("logged_in"):
        return redirect("/login")

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id,
               name,
               email,
               company,
               service,
               message
        FROM leads
        ORDER BY id DESC
    """)

    leads = cursor.fetchall()

    conn.close()

    return render_template(
        "admin.html",
        leads=leads
    )


# ==========================
# DELETE LEAD
# ==========================
@app.route("/delete/<int:id>",methods=["POST"])
def delete_lead(id):

    if not session.get("logged_in"):
        return redirect("/login")

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM leads WHERE id=?",
        (id,)
    )

    conn.commit()
    conn.close()

    return redirect("/admin")


# ==========================
# LOGOUT
# ==========================
@app.route("/logout")
def logout():

    session.clear()

    return redirect("/login")



# ==========================
# RUN APP
# ==========================
if __name__ == "__main__":
    app.run(debug=True)
