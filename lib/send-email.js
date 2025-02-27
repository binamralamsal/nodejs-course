import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail({ to, subject, text, html }) {
  const { data, error } = await resend.emails.send({
    from: "Website <website@resend.dev>", // we are using resend's domain right now.
    // when you are using resend's domain, you can only send to yourself. If you created account of resend
    // using an email address, then you can only send to that.
    // to send to others, you have to verify your domain from their domain section in dashboard.
    to: [to],
    subject: subject,
    html: html,
  });

  if (error) {
    return console.error({ error });
  } else {
    console.log(data);
  }
}
