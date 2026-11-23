// Vercel Serverless Function: api/track.js
// Anonymous telemetry endpoint supporting Upstash Redis (Option 1)
// Tracks total page views, HyperLogLog unique visitors and page/device/referrer distributions.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'telemetry_ready' });
  }

  try {
    const { path = '/', device = 'Desktop', referrer = 'Direct', visitorHash = 'anon' } = req.body || {};

    const normalizedPath = path || '/';
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    // If Upstash Redis is configured, execute HyperLogLog and counters pipeline
    if (redisUrl && redisToken) {
      const pipelineCommands = [
        ['INCR', 'portfolio:total_pageviews'],
        ['PFADD', 'portfolio:unique_visitors', visitorHash],
        ['ZINCRBY', 'portfolio:pages', 1, normalizedPath],
        ['HINCRBY', 'portfolio:referrers', referrer, 1],
        ['HINCRBY', 'portfolio:devices', device, 1]
      ];

      try {
        await fetch(`${redisUrl}/pipeline`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${redisToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pipelineCommands)
        });
      } catch (redisErr) {
        console.warn('Upstash Redis pipeline notice:', redisErr);
      }
    }

    return res.status(200).json({
      tracked: true,
      path: normalizedPath,
      device,
      referrer,
      redisConfigured: Boolean(redisUrl && redisToken)
    });
  } catch (error) {
    console.error('Track handler error:', error);
    return res.status(200).json({ tracked: false });
  }
}
