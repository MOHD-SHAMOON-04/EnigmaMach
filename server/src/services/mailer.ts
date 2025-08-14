import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { EnigmaMachineDoc } from '../types';
dotenv.config({ quiet: true });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendEnigmaMail = async (mailTo: string, machine: EnigmaMachineDoc): Promise<boolean> => {

  const shareLink = `${process.env.BASE_URL}/enigma/${machine.id}`;
  const qrCodeLink = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${shareLink}`;

  try {
    const info = await transporter.sendMail({
      from: `"New Enigma Machine" <${process.env.GMAIL_USER}>`,
      to: mailTo,
      subject: 'Your New Enigma Machine',
      text: 'Here is your new Enigma machine configuration!',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Your Enigma Machine Configuration</title>
<style>
  body {
    font-family: Arial, sans-serif;
    color: #333;
    line-height: 1.6;
  }
  h1, h2 {
    color: #1a4e8a;
  }
  .section {
    margin-bottom: 20px;
  }
  .qr-code {
    display: block;
    margin: 10px 0;
  }
</style>
</head>
<body>

<h1>Your New Enigma Machine</h1>

<p>Hello,</p>
<p>We've prepared your personalized Enigma machine configuration below. This is for your personal use and can be shared securely.</p>

<div class="section">
  <h2>Share Links</h2>
  <p>You can view your configuration directly here:</p>
  <p><a href="${shareLink}">View on ${new URL(shareLink).hostname}</a></p>
  <p><strong>Machine ID:</strong> ${machine.id}</p>
  <p>Or scan this QR code to open the configuration in your browser:</p>
  <img src="${qrCodeLink}" alt="QR code to open your Enigma machine configuration" class="qr-code" width="150" height="150">
</div>

<div class="section">
  <h2>Configuration Details</h2>
  ${machine.rotors.map((r, idx) =>
    `<p><strong>Rotor ${idx + 1}:</strong> ${r}</p>`
  ).join('')}
  <p><strong>Reflector:</strong> ${machine.reflector}</p>
  <p><strong>Plugboard:</strong> ${machine.plugboard}</p>
</div>

<div class="section">
  <p><em>This machine was created on ${machine.createdAt.toLocaleString()}.</em></p>
</div>

<hr>
<p style="font-size: 0.9em; color: #666;">
You are receiving this message because you (or someone with your email address) created an Enigma machine configuration on ${new URL(shareLink).hostname}.
If you have any questions, please contact our support team.
</p>

</body>
</html>
`,
    });

    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
