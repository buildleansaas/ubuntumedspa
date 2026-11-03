import nodemailer from "nodemailer";

declare global {
  // eslint-disable-next-line no-var
  var __wmsMailTransport: nodemailer.Transporter | undefined;
}

const DEFAULT_LEADS_TO_EMAIL = "jennylingcoleman@icloud.com";

// SMTP_USER is a Google Workspace mailbox on williamsburgmedspa.com; SMTP_PASS is its app password.
// Gmail only sends as the signed-in mailbox (or its aliases), so the From address defaults to SMTP_USER.
export const getMailConfig = () => {
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const leadsTo =
    process.env.NODE_ENV === "development"
      ? process.env.DEV_LEADS_TO_EMAIL || "au.witherow@gmail.com"
      : process.env.LEADS_TO_EMAIL || DEFAULT_LEADS_TO_EMAIL;

  return {
    configured: Boolean(user && pass),
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") !== "false",
    user,
    pass,
    from: process.env.SMTP_FROM || (user ? `Williamsburg Med Spa <${user}>` : ""),
    // Customer replies go where Jenny already reads alerts unless SMTP_REPLY_TO says otherwise.
    replyTo: process.env.SMTP_REPLY_TO || leadsTo,
    leadsTo,
  };
};

// Order emails go to real buyers, so they only send from the production deployment (not previews,
// local `next start` or scripts) unless ORDER_EMAILS_ENABLED=true.
export const orderEmailsEnabled = () =>
  getMailConfig().configured &&
  (process.env.VERCEL_ENV === "production" || process.env.ORDER_EMAILS_ENABLED === "true");

const getTransport = () => {
  const config = getMailConfig();
  if (!config.configured) throw new Error("SMTP_USER and SMTP_PASS are required to send email.");

  if (!global.__wmsMailTransport) {
    global.__wmsMailTransport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
      // Sends run inside request handlers; fail fast instead of nodemailer's multi-minute defaults.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }

  return global.__wmsMailTransport;
};

export type MailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export const sendMail = async (message: MailMessage) => {
  const config = getMailConfig();

  await getTransport().sendMail({
    from: config.from,
    replyTo: message.replyTo || config.replyTo,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
};
