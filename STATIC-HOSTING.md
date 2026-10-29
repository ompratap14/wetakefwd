# Static website with enquiries sent by email

Publish the repository's `dist` directory. It contains ready-to-host HTML, CSS,
JavaScript and images. No Flask server, database, admin panel, email password or
API key is needed on the static host. Use the existing root domain
https://www.wetakefwd.online (not a GitHub project subdirectory).

## Hosting settings

- Repository: the existing wetakefwd GitHub repository; branch: main.
- Root directory: the repository root. The committed `vercel.json` sets Vercel
  to the Other framework and serves `dist` without a Python build.
- Publish directory: `dist` (relative to repository root).
- Build command: leave blank when publishing the committed `dist` files.
- On hosts that require a build command, use `echo Static files are ready`.
- Do not configure an SPA catch-all rewrite; service pages have their own index.html.

## Email delivery

The public form posts to https://api.web3forms.com/submit with the Web3Forms
access key for wetakefwd@gmail.com. Web3Forms forwards the enquiry by email and
uses the visitor's email as the reply-to address. The access key is public by
design; it is not an email password. To rotate it, change the default value in
wetakefwd/app.py, rebuild, and redeploy.

After deployment, submit a controlled test enquiry from the live website and
verify it arrives in wetakefwd@gmail.com (check Promotions and Spam too). The
thank-you page at https://www.wetakefwd.online/thank-you/ is shown only after
the form service accepts the submission. Delivery has not been verified by the
local build. Viewing a file directly is not a delivery test.

If the domain changes, update SITE_URL in wetakefwd/content.py and rebuild.

Web3Forms processes submissions externally; no website admin login is required.
Documentation: https://docs.web3forms.com/getting-started/installation

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
