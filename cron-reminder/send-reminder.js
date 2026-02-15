/**
 * Send a single reminder email via Resend.
 * Run by Render Cron Job on a schedule (e.g. daily).
 */

const REMINDER_EMAIL = process.env.REMINDER_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const REMINDER_SUBJECT = process.env.REMINDER_SUBJECT || "Take your medication";
const REMINDER_MESSAGE = process.env.REMINDER_MESSAGE ||
  "This is a reminder to take your medication and have a sip of water.";
const FROM_EMAIL = process.env.FROM_EMAIL || "Treehacks Reminder <onboarding@resend.dev>";

async function main() {
  if (!REMINDER_EMAIL?.trim()) {
    console.error("REMINDER_EMAIL is not set. Set it in Render → Cron Job → Environment.");
    process.exit(1);
  }
  if (!RESEND_API_KEY?.trim()) {
    console.error("RESEND_API_KEY is not set. Get a key at https://resend.com/api-keys");
    process.exit(1);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [REMINDER_EMAIL.trim()],
      subject: REMINDER_SUBJECT,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <p style="font-size: 18px; line-height: 1.6; color: #333;">${REMINDER_MESSAGE.replace(/\n/g, "<br>")}</p>
          <p style="font-size: 14px; color: #888; margin-top: 24px;">Sent by Treehacks reminder.</p>
        </div>
      `,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Resend API error:", res.status, data);
    process.exit(1);
  }
  console.log("Reminder email sent to", REMINDER_EMAIL, "id:", data.id);
}

main();
