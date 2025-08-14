import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { EnigmaMachineDoc } from '../types';

const mailerSend = new MailerSend({
  apiKey: process.env.MAILER_API_KEY as string,
});

async function sendNewEnigmaMail(mailTo: string, machine: EnigmaMachineDoc): Promise<boolean> {
  const sentFrom = new Sender(process.env.FROM_EMAIL as string, "New Enigma");

  const recipients = [
    new Recipient(mailTo)
  ];

  const shareLink = `${process.env.BASE_URL}/enigma/${machine.id}`;
  const qrCodeLink = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${shareLink}`;

  const html = `
<h1>Your New Enigma Machine</h1>
<p>Here's your personalized Enigma machine configuration:</p>

<hr>
<h2>Share Links</h2>
<p><a href="${shareLink}">Direct Link</a></p>
<p>Machine ID: ${machine.id}</p>
<p>Or scan the QR code:</p>
<p><img src="${qrCodeLink}" alt="QR Code"></p>

<hr>
<h2>Configuration</h2>
${machine.rotors.map((r, idx) =>
    `<p><strong>Rotor ${idx + 1}:</strong> ${r}</p>`
  ).join('')}
<p><strong>Reflector:</strong> ${machine.reflector}</p>
<p><strong>Plugboard:</strong> ${machine.plugboard}</p>

<hr>
<p>This machine was created on ${machine.createdAt.toLocaleString()}</p>
`;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Here is your new Enigma Machine")
    .setHtml(html);

  try {
    await mailerSend.email
      .send(emailParams)
      .then((response) => console.log(response))
      .catch((error) => { throw error });
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }

  return true;
}

export default sendNewEnigmaMail;