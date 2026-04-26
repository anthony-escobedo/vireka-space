/**
 * Product confirmation (access) email via Resend HTTP API.
 * Does not replace Stripe billing/receipt emails.
 */
const RESEND_API_URL = "https://api.resend.com/emails";

const SUBJECT = "Pro access is active";

const TEXT_BODY = `Your Pro access is active.

You can now continue in VIREKA Space with expanded daily access and full history.

Open VIREKA Space:
https://vireka.space/clarify`;

const HTML_BODY = `<h2>Pro access is active</h2>
<p>Your Pro access is active.</p>
<p>You can now continue in VIREKA Space with expanded daily access and full history.</p>
<p><a href="https://vireka.space/clarify">Open VIREKA Space</a></p>`;

const DEFAULT_FROM = "VIREKA Space <hello@vireka.space>";

export function getEmailDomainForLog(address: string): string {
  const t = address.trim();
  const at = t.lastIndexOf("@");
  if (at < 1 || at === t.length - 1) return "(invalid-or-missing)";
  return t.slice(at + 1).toLowerCase();
}

/**
 * @param idempotencyKey – use Stripe Checkout Session id (e.g. `cs_...`) so Resend
 *   deduplicates within 24h if the webhook is retried.
 */
export async function sendProSubscriptionConfirmationEmail(params: {
  to: string;
  idempotencyKey: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY is not set; skip Pro access confirmation"
    );
    return;
  }

  const from =
    process.env.EMAIL_FROM?.trim() || process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;

  const to = params.to.trim();
  if (!to) {
    console.warn("[email] no recipient, skip Pro access confirmation");
    return;
  }

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": params.idempotencyKey,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: SUBJECT,
      text: TEXT_BODY,
      html: HTML_BODY,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    const preview = errText.length > 200 ? `${errText.slice(0, 200)}…` : errText;
    throw new Error(`Resend status ${res.status}: ${preview}`);
  }
}
