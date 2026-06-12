import sqlite3
from flask import Flask, render_template, request, redirect, session
app = Flask(__name__)
app.secret_key="encode_ai_secret_key"

@app.route("/")
def home():
    return render_template("index.html")

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
        "INSERT INTO leads (name,email,company,service,message) VALUES (?,?,?,?,?)",
        (name, email, company, service, message)
    )

    conn.commit()
    conn.close()

    return render_template("success.html")
@app.route("/admin")
def admin():

    if not session.get("logged_in"):
        return redirect("/login")

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, email, company, service, message
        FROM leads
        ORDER BY id DESC
    """)

    leads = cursor.fetchall()

    conn.close()

    return render_template("admin.html", leads=leads)
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
@app.route("/logout")
def logout():

    session.clear()

    return redirect("/login")
@app.route("/delete/<int:id>")
def delete_lead(id):

    if not session.get("logged_in"):
        return redirect("/login")

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM leads WHERE id=?", (id,))

    conn.commit()
    conn.close()

    return redirect("/admin")
if __name__ == "__main__":
    app.run(debug=True)