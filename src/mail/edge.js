import { Edge } from "edge.js";
import path, { join } from "path";
import gmailTransport from "./gmail";

const edge = new Edge({ cache: false });
const templatesPath = join(path.resolve(), "src/mail/templates");
edge.mount(templatesPath);

const send = (to, subject, html) => {
  const options = {
    to,
    subject,
    html,
    from: process.env.GMAIL_USER,
  };

  return gmailTransport.sendMail(options);
};

export const sendEmailConfirmation = async (to, hash, backLink) => {
  const html = edge.renderSync("confirm-email", {
    link: `${backLink}?hash=${hash}`,
  });
  return send(to, "Email Confirmation", html);
};
