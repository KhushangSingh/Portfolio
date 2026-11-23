// Vercel Serverless Function: api/reply.js
// Dispatches direct email replies from Khushang's dashboard straight to the recipient's mailbox.

export default async function handler(req, res) {
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
    const { recipientEmail, recipientName, subject, replyText, originalMessage, inquiryId } = req.body;

    if (!recipientEmail || !replyText) {
      return res.status(400).json({ error: 'Recipient email and reply text are required.' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'Khushang Singh <onboarding@resend.dev>';
    const khushangEmail = process.env.NOTIFICATION_EMAIL || 'khushang8508@gmail.com';

    if (resendApiKey) {
      const emailPayload = {
        from: senderEmail,
        to: [recipientEmail],
        reply_to: khushangEmail,
        subject: subject || 'Response to your inquiry - Khushang Singh',
        text: `${replyText}\n\n---\nBest regards,\nKhushang Singh\nProduct Designer & UX Engineer\nPortfolio: https://khushangsingh.vercel.app\nEmail: ${khushangEmail}\n\nOriginal Inquiry (Ref: ${inquiryId || 'N/A'}):\n${originalMessage || ''}`
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
        console.warn('Resend reply delivery notice:', errorData);
        return res.status(502).json({ 
          error: 'Email provider returned an error', 
          details: errorData 
        });
      }

      const data = await response.json();
      return res.status(200).json({
        success: true,
        message: 'Reply email successfully dispatched.',
        deliveryId: data.id
      });
    }

    // Graceful acknowledgement when no third-party API key is configured yet
    return res.status(200).json({
      success: true,
      message: 'Reply logged successfully in dashboard history. Connect RESEND_API_KEY for live delivery.',
      note: 'Use mailto link for direct desktop client dispatch.'
    });
  } catch (error) {
    console.error('Reply handler error:', error);
    return res.status(500).json({ error: 'Internal server error processing reply.' });
  }
}
