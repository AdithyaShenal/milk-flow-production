import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({
    from: `"Admin System" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};
