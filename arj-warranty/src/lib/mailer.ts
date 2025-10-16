import nodemailer, { Transporter } from "nodemailer";

type MailInput = {
  to: string;
  subject: string;
  html: string;
};

let cachedTransporter: Transporter | null = null;

function getFromAddress(): string {
  return process.env.SMTP_FROM || "ARJ MOTORS <no-reply@arjmotors.co.uk>";
}

async function createTransporter(): Promise<Transporter> {
  if (cachedTransporter) return cachedTransporter;

  if (process.env.USE_ETHEREAL === "true") {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration missing. Set USE_ETHEREAL=true for dev or provide SMTP_HOST/SMTP_USER/SMTP_PASS.");
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransporter;
}

export async function sendMail({ to, subject, html }: MailInput): Promise<{ messageId: string; previewUrl?: string }> {
  const transporter = await createTransporter();
  const info = await transporter.sendMail({ from: getFromAddress(), to, subject, html });
  const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
  return { messageId: info.messageId, previewUrl };
}
