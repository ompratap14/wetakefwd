import sqlite3
import smtplib
from email.mime.text import MIMEText
from flask import Flask, render_template, request, redirect, session
import os
import requests

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
import database

app = Flask(__name__)
app.secret_key = "encode_ai_secret_key"

EMAIL_ADDRESS = "wetakefwd@gmail.com"
EMAIL_APP_PASSWORD = "kasg nzvj xnkw wbhg"

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