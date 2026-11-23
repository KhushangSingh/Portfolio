// Vercel Serverless Function: api/track.js
// Lightweight anonymous edge telemetry endpoint for tracking portfolio visits.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'telemetry_online' });
  }

  try {
    const { path, device, referrer, isNewUniqueVisitor } = req.body || {};

    // In a multi-tenant or global store setup (e.g. Upstash Redis or Supabase),
    // you can increment global keys here:
    // await redis.incr('global_page_views');
    // if (isNewUniqueVisitor) await redis.incr('global_unique_visitors');

    return res.status(200).json({
      tracked: true,
      path: path || '/',
      device: device || 'Unknown',
      referrer: referrer || 'Direct',
      isNewUniqueVisitor: Boolean(isNewUniqueVisitor),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Track handler notice:', error);
    return res.status(200).json({ tracked: false });
  }
}
