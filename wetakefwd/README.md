# WeTakeFWD website

Flask website for WeTakeFWD, redesigned around its AI Automation & Digital Growth Agency positioning.

## Run locally

The pages in `templates/` are Flask templates. Do not double-click `home.html` or `base.html`: the stylesheet URL `/static/css/redesign.css` works only when the Flask server renders the page.

1. Install Python dependencies: `python -m pip install -r requirements.txt`.
2. On Windows, double-click `start-site.bat` (or run `python app.py` in this folder).
3. Open `http://127.0.0.1:5000/` in your browser. Keep the terminal window open while previewing.

For production, set `SECRET_KEY` to a long random value. The app reads a local `.env` file if present; host environment variables take precedence. Never upload `.env` or put credentials in source code.

The contact form saves enquiries to SQLite at `DATABASE_PATH`, or `database.db` in this folder when the variable is not set. For production, use persistent storage and regular backups.

## Send enquiries to wetakefwd@gmail.com

The destination is set in `app.py`. To send directly from the Gmail account:

1. Turn on [2-Step Verification](https://support.google.com/accounts/answer/185839) for `wetakefwd@gmail.com`.
2. Create a [Google App Password](https://support.google.com/accounts/answer/185833) for this website. Use an app password, **not** the account's regular password. Google's account settings may not offer app passwords for every account.
3. Copy `.env.example` to `.env` in this folder. Set `GMAIL_APP_PASSWORD=` to the 16-character app password. Keep `.env` private.
4. Restart the site. Submit one test enquiry and confirm it appears in `wetakefwd@gmail.com` (check Spam too).

If your hosting provider blocks SMTP, use a verified sending domain with Resend instead: set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. The recipient remains `wetakefwd@gmail.com`. If neither mail method is configured, or delivery fails, the enquiry is saved but the confirmation page clearly warns that no email was sent.

The admin area is disabled until `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` are set. Create a password hash with Werkzeug's `generate_password_hash` in a trusted local environment. Set `SECRET_KEY` consistently across restarts so sessions remain valid.

## Publish checklist

- Deploy behind HTTPS with a production WSGI server. Do not use Flask's development server for public traffic.
- Confirm that `https://www.wetakefwd.online` is the chosen canonical domain; change `SITE_URL` in `content.py` if necessary.
- Configure persistent database storage, Gmail or Resend delivery, environment secrets and backups.
- Test a real contact submission and admin login on the deployed site.
- Submit `/sitemap.xml` in Google Search Console and inspect indexing.
- Complete an eligible Google Business Profile with accurate business details.
- Add client-approved case studies, screenshots, quotes and outcomes after verifying them.
- Earn relevant mentions and links from real partners, directories and publications.

The site does not promise search rankings or AI answer engine placement. Visibility depends on site quality, indexation, competition and third-party signals over time.

## Verification

Run `python -m unittest discover -s wetakefwd -p test_app.py -v` from the repository root. Tests use temporary databases and mocked email requests; they never email real enquiries. Coverage includes all service pages, old database upgrades, email failures, validation and protected admin access.

## Render Free deployment

Keep the current Free instance plan. It sleeps after 15 idle minutes, so the first visitor can see a startup screen. Application code cannot remove this hosting delay.

Use `RESEND_API_KEY` for HTTPS email delivery. Render Free blocks SMTP ports, so `GMAIL_APP_PASSWORD` alone will not work there. Set a stable random `SECRET_KEY`, `FLASK_ENV=production`, and optionally `ADMIN_USERNAME` plus `ADMIN_PASSWORD_HASH` in the Render environment settings. The example file contains no working credentials.

Render Free local files are ephemeral: SQLite enquiries can disappear on restart, redeploy or spin-down. Back up existing enquiries before deploying. Persistent enquiry storage requires an external database or a paid instance with a persistent disk; this patch does not provision either. Email API acceptance is not proof of inbox delivery: verify a controlled enquiry reaches the intended inbox after deployment.

The application automatically adds the missing `created_at` column to older lead databases without deleting existing rows. Existing rows retain an unknown (NULL) creation date.

Hosting reference: https://render.com/docs/free

## Restore admin access

A missing admin username, password hash, or stable session secret now shows a 503 unavailable page instead of a misleading 404. No login is permitted until configuration is complete.

1. Run `python admin_setup.py` from the `wetakefwd` folder in a private terminal. Choose your own username and password; input is hidden for the password.
2. In the existing Render service's Environment settings, set `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` to the generated values. Set `SECRET_KEY` only if missing; preserve an existing secret. Set `FLASK_ENV=production` for HTTPS session cookies.
3. Save the environment and deploy the updated application, after backing up any enquiries stored on ephemeral storage.
4. Visit `/login`, sign in and confirm your labelled test enquiry appears in `/admin`. Logging out must prevent further dashboard access.

Never use the old source-code password. The helper does not modify the server or store your password in a file.
