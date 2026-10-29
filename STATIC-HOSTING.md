# Static website with enquiries sent by email

Publish the repository's `dist` directory. It contains ready-to-host HTML, CSS,
JavaScript and images. No Flask server, database, admin panel, email password or
API key is needed on the static host. Use the existing root domain
https://www.wetakefwd.online (not a GitHub project subdirectory).

## Hosting settings

- Repository: the existing wetakefwd GitHub repository; branch: main.
- Publish directory: `dist` (relative to repository root).
- Build command: leave blank when publishing the committed `dist` files.
- On hosts that require a build command, use `echo Static files are ready`.
- Do not configure an SPA catch-all rewrite; service pages have their own index.html.

## Activate email delivery once

The public form posts to https://formsubmit.co/wetakefwd@gmail.com. FormSubmit is
the external service that receives the form and forwards it by email. It uses
the visitor's email as the reply-to address and keeps its spam check enabled.

After deployment, submit a controlled test enquiry from the live website.
Open the activation email in wetakefwd@gmail.com (check Spam) and confirm the
form. Then submit another enquiry and verify it reaches the inbox. Delivery has
not been verified by the local build. Viewing a file directly is not a delivery test.

The return URL is https://www.wetakefwd.online/thank-you/. If the domain changes,
update SITE_URL in wetakefwd/content.py and rebuild.

FormSubmit processes submissions externally; no website admin login is required.
Documentation: https://formsubmit.co/documentation and https://formsubmit.co/help

## Future source edits

From the repository root, run:

```powershell
python -m pip install -r wetakefwd/requirements.txt
python wetakefwd/build_static.py
git add wetakefwd dist
git commit -m "Update static website"
git push origin main
```

Python is used only to render the source templates during a build. The older
Flask application remains in source for compatibility, but it and its admin
routes are not included in dist and are not used by the hosted enquiry form.
