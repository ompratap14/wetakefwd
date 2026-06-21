import sqlite3
import smtplib
from email.mime.text import MIMEText
from flask import Flask, render_template, request, redirect, session

import database

app = Flask(__name__)
app.secret_key = "encode_ai_secret_key"

EMAIL_ADDRESS = "encodeai2808@gmail.com"
EMAIL_APP_PASSWORD = "sdfl bpvj aqvo btm"

# ==========================
# EMAIL FUNCTION
# ==========================
def send_email(name, email, company, service, message):

    sender_email = EMAIL_ADDRESS
    receiver_email = EMAIL_ADDRESS

    # Google App Password
    app_password = EMAIL_APP_PASSWORD

    body = f"""
New Lead Received - Encode AI Solutions

Name: {name}
Email: {email}
Company: {company}
Service: {service}

Message:
{message}
"""

    msg = MIMEText(body)

    msg["Subject"] = "New Lead - Encode AI Solutions"
    msg["From"] = sender_email
    msg["To"] = receiver_email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587,timeout=10) as server:
            server.starttls()
            server.login(sender_email, app_password)
            print("LOGIN SUCCESS")
            server.send_message(msg)
            print("EMAIL SENT")

        print("Email Sent Successfully")

    except Exception as e:
        print("Email Error:", e)
def send_confirmation_email(name, client_email,service, message):

    sender_email = EMAIL_ADDRESS
    app_password = EMAIL_APP_PASSWORD

    body = f"""
Dear {name},

Thank you for contacting Encode AI Solutions.

We have successfully received your inquiry.

━━━━━━━━━━━━━━━━━━━━━━
YOUR SUBMITTED DETAILS
━━━━━━━━━━━━━━━━━━━━━━

Name: {name}
Email: {client_email}
Service: {service}

Message:
{message}

━━━━━━━━━━━━━━━━━━━━━━

Our team is currently reviewing your request and will get back to you as soon as possible.

You can also contact us directly:

Email: encodeai2808@gmail.com
WhatsApp: +91 8191904121

Best Regards,

Encode AI Solutions
Transforming Data • Into Intelligence
"""
    msg = MIMEText(body)

    msg["Subject"] = "We Received Your Inquiry - Encode AI Solutions"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = client_email
    print("Client Email:", client_email)

    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
            server.starttls()
            server.login(sender_email, app_password)

            print("Sending to:", client_email)

            server.send_message(msg)

            print("Confirmation Email Sent Successfully")
            print("=================================")
            print("Name:", name)
            print("Client Email:", client_email)
            print("Service:", service)
            print("=================================")


    except Exception as e:
        print("=================================")
        print("CONFIRMATION EMAIL ERROR")
        print(type(e))
        print(e)
        print("=================================")
# ==========================
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

        send_confirmation_email(
            name,
            email,
            service,
            message
        )

    except Exception as e:
        print("EMAIL ERROR:", e)

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
@app.route("/delete/<int:id>")
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