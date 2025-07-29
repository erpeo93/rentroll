import nodemailer from 'nodemailer';

export default async function sendAdminEmail(subject: string, htmlBody: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true if 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"RentRoll" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL, // set in your .env
    subject,
    html: htmlBody,
  });
}