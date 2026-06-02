// Contact form backend for ab-psych.com.au.
//
// Receives JSON POST from /contact/, validates, sends an email via Resend
// to abpsychology4@gmail.com (formatted) from no-reply@updates.korovin.ai.
//
// Required Netlify env vars:
//   RESEND_API_KEY   — from https://resend.com/api-keys
//
// Optional env vars (with defaults):
//   CONTACT_TO_EMAIL   default: abpsychology4@gmail.com
//   CONTACT_FROM_EMAIL default: no-reply@updates.korovin.ai

import { Resend } from 'resend';

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'abpsychology4@gmail.com';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'no-reply@updates.korovin.ai';

function escapeHtml(s) {
  if (typeof s !== 'string') return '';
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set');
    return jsonResponse(500, { error: 'Server not configured' });
  }

  // Parse JSON body
  let payload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON' });
  }

  // Honeypot — silently accept but ignore bots
  if (payload['bot-field']) {
    return jsonResponse(200, { ok: true });
  }

  // Validate required fields
  const name = (payload.name || '').toString().trim();
  const email = (payload.email || '').toString().trim();
  const message = (payload.message || '').toString().trim();
  const phone = (payload.phone || '').toString().trim();
  const preferredTime = (payload.preferred_time || '').toString().trim();

  if (!name || !email || !message) {
    return jsonResponse(400, { error: 'Name, email, and message are required.' });
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(400, { error: 'Please enter a valid email address.' });
  }

  // Length caps to avoid abuse
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return jsonResponse(400, { error: 'Field too long.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject = `New enquiry from ${name} — ab-psych.com.au`;

  const text = [
    `New enquiry via the website contact form:`,
    ``,
    `Name:           ${name}`,
    `Email:          ${email}`,
    `Phone:          ${phone || '(not provided)'}`,
    `Preferred time: ${preferredTime || '(not provided)'}`,
    ``,
    `Message:`,
    message,
    ``,
    `---`,
    `Reply directly to this email to reach the sender.`,
  ].join('\n');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px;">
      <h2 style="color: #AB8133;">New enquiry from the website</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600;">Phone</td><td>${escapeHtml(phone) || '<em>not provided</em>'}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600;">Preferred time</td><td>${escapeHtml(preferredTime) || '<em>not provided</em>'}</td></tr>
      </table>
      <h3 style="margin-top: 24px;">Message</h3>
      <p style="white-space: pre-wrap; padding: 16px; background: #f5f5f5; border-left: 3px solid #AB8133;">${escapeHtml(message)}</p>
      <p style="font-size: 12px; color: #666; margin-top: 24px;">Reply directly to this email to reach the sender — Reply-To is set to ${escapeHtml(email)}.</p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `Arianna Buratti Website <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return jsonResponse(502, { error: 'Failed to send. Please email directly.' });
    }

    return jsonResponse(200, { ok: true, id: data?.id });
  } catch (err) {
    console.error('Exception sending email:', err);
    return jsonResponse(500, { error: 'Failed to send. Please email directly.' });
  }
};

export const config = {
  path: '/api/contact',
};
