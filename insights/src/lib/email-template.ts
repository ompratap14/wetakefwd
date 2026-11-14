import { absoluteUrl } from "@/lib/site";

type BrandedEmailProps = {
  eyebrow: string;
  title: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
  footer?: string;
};

export function brandedEmail({ eyebrow, title, message, actionLabel, actionUrl, footer }: BrandedEmailProps) {
  const logoUrl = absoluteUrl("/images/wetakefwd-mark.png");
  return `<!doctype html>
  <html lang="en"><body style="margin:0;background:#f4f6fa;color:#17233d;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6fa;padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #dfe4ec;border-radius:12px;overflow:hidden">
          <tr><td style="padding:28px 34px 20px;border-bottom:1px solid #e7eaf0">
            <a href="${absoluteUrl("/")}" style="display:inline-flex;align-items:center;text-decoration:none;color:#17233d">
              <img src="${logoUrl}" width="52" height="52" alt="WeTakeFwd" style="display:block;width:52px;height:52px;object-fit:contain;margin-right:14px">
              <span style="font-size:24px;font-weight:700">Insights <span style="font-size:13px;font-weight:400;color:#68748a">by WeTakeFwd</span></span>
            </a>
          </td></tr>
          <tr><td style="padding:38px 34px 42px">
            <p style="margin:0 0 13px;color:#2f5bea;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">${eyebrow}</p>
            <h1 style="margin:0 0 18px;color:#17233d;font-size:32px;line-height:1.15">${title}</h1>
            <p style="margin:0 0 28px;color:#526078;font-size:16px;line-height:1.7">${message}</p>
            <a href="${actionUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#2f5bea;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none">${actionLabel}</a>
            ${footer ? `<p style="margin:28px 0 0;color:#7b8495;font-size:12px;line-height:1.6">${footer}</p>` : ""}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}
