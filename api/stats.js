// Vercel Serverless Function: api/stats.js
// Retrieves live aggregated stats from Upstash Redis (Option 1)
// Queries total pageviews, HyperLogLog unique visitor count, top pages, referrers and devices.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!redisUrl || !redisToken) {
    return res.status(200).json({
      configured: false,
      message: 'Upstash Redis environment variables not yet populated. Using client-side telemetry store.'
    });
  }

  try {
    const pipelineCommands = [
      ['GET', 'portfolio:total_pageviews'],
      ['PFCOUNT', 'portfolio:unique_visitors'],
      ['ZREVRANGE', 'portfolio:pages', 0, -1, 'WITHSCORES'],
      ['HGETALL', 'portfolio:referrers'],
      ['HGETALL', 'portfolio:devices']
    ];

    const response = await fetch(`${redisUrl}/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${redisToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pipelineCommands)
    });

    if (!response.ok) {
      return res.status(502).json({ configured: true, error: 'Redis pipeline query failed' });
    }

    const results = await response.json();
    
    // Parse results
    const totalPageviews = parseInt(results[0]?.result || '0', 10);
    const uniqueVisitors = parseInt(results[1]?.result || '0', 10);

    // Parse ZREVRANGE pages withscores array [page, score, page, score]
    const rawPages = results[2]?.result || [];
    const pages = {};
    for (let i = 0; i < rawPages.length; i += 2) {
      pages[rawPages[i]] = parseInt(rawPages[i + 1] || '0', 10);
    }

    // Parse HGETALL referrers & devices
    const referrers = results[3]?.result || {};
    const devices = results[4]?.result || {};

    return res.status(200).json({
      configured: true,
      totalPageviews,
      uniqueVisitors,
      pages,
      referrers,
      devices,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Stats query error:', err);
    return res.status(500).json({ configured: true, error: 'Internal error querying statistics.' });
  }
}
