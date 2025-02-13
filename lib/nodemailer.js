import nodemailer from "nodemailer";

const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

export async function sendEmail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: `"URL Shortener" <${testAccount.user}>`,
    to,
    subject,
    text,
    html,
  });

  // This will log the ethereal email url, you can see the email sent by us.
  // This is only for testing as we are using ethereal mail made only for testing.
  const testEmailURL = nodemailer.getTestMessageUrl(info);
  console.log(testEmailURL);
}
