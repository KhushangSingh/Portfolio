// Vercel Serverless Function: api/contact.js
// Receives contact form submissions from the portfolio website
// and forwards notifications to Khushang's inbox.

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, socialUrl, inquiryType, subject, message, id } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required fields.' });
    }

    const recipient = process.env.NOTIFICATION_EMAIL || 'khushang8508@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY;

    // If Resend API Key is configured in Vercel environment variables, forward notification email
    if (resendApiKey) {
      const emailPayload = {
        from: 'Portfolio Inquiries <onboarding@resend.dev>',
        to: [recipient],
        reply_to: email,
        subject: `[Portfolio Inquiry] ${subject || inquiryType || 'New Message'} from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSocial: ${socialUrl || 'N/A'}\nCategory: ${inquiryType || 'General'}\nReference: ${id || 'N/A'}\n\nMessage:\n${message}`
      };

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.warn('Resend API notice:', errorData);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry received successfully and logged.',
      id: id || Date.now().toString()
    });
  } catch (error) {
    console.error('Contact handler error:', error);
    return res.status(500).json({ error: 'Internal server error processing contact submission.' });
  }
}
