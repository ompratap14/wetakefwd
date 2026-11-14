"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", body: formData });
      const data = await response.json();
      setMessage(data.message || "Please try again later.");
      if (response.ok) form.reset();
    } catch { setMessage("Please try again later."); }
    finally { setBusy(false); }
  }
  return <form className="newsletter-form" method="post" action="/api/newsletter" onSubmit={submit}><label className="visually-hidden" htmlFor="newsletter-email">Email address</label><div><input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /><button disabled={busy} type="submit">{busy ? "Please wait…" : "Subscribe →"}</button></div><input className="honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><p aria-live="polite">{message}</p></form>;
}

