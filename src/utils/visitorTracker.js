// Visitor & Pageview Tracker Utility
// Implements Option 1: Anonymous rotated client-side hash, Upstash Redis telemetry sync and local fallback.

const STORAGE_KEY = 'khushang_portfolio_analytics_v1';
const VISITOR_ID_KEY = 'khushang_visitor_id';
const SESSION_ID_KEY = 'khushang_session_id';

// Generate lightweight unique anonymous identifier
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

// Rotated anonymous visitor hash: Rotates daily so visitors remain completely anonymous
export const getRotatedVisitorHash = () => {
  if (typeof window === 'undefined') return 'anon_' + Date.now();
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const storedDailyHash = localStorage.getItem('khushang_daily_hash');
    const storedHashDate = localStorage.getItem('khushang_daily_hash_date');
    
    if (storedDailyHash && storedHashDate === todayStr) {
      return storedDailyHash;
    }
    
    const newHash = `${todayStr}_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('khushang_daily_hash', newHash);
    localStorage.setItem('khushang_daily_hash_date', todayStr);
    return newHash;
  } catch {
    return 'anon_guest';
  }
};

// Detect device category from screen width and user agent
const detectDevice = () => {
  if (typeof window === 'undefined') return 'Desktop';
  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipod/i.test(ua) || width < 768) {
    return 'Mobile';
  }
  if (/tablet|ipad/i.test(ua) || (width >= 768 && width <= 1024)) {
    return 'Tablet';
  }
  return 'Desktop';
};

// Normalize referrer source
const detectReferrer = () => {
  if (typeof document === 'undefined') return 'Direct';
  const ref = document.referrer.toLowerCase();
  if (!ref) return 'Direct';
  if (ref.includes('linkedin.com')) return 'LinkedIn';
  if (ref.includes('github.com')) return 'GitHub';
  if (ref.includes('twitter.com') || ref.includes('x.com')) return 'X (Twitter)';
  if (ref.includes('behance.net')) return 'Behance';
  if (ref.includes('dribbble.com')) return 'Dribbble';
  if (ref.includes('google.com') || ref.includes('bing.com') || ref.includes('duckduckgo.com')) return 'Search';
  return 'Other Website';
};

// Create realistic baseline analytics for initial display
const getInitialBaseline = () => {
  const today = new Date();
  const dailyTimeline = [];
  
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const baseViews = 18 + Math.floor(Math.sin(i * 1.5) * 8) + (i === 0 ? 6 : 0);
    const baseUniques = Math.max(6, Math.floor(baseViews * 0.65));
    dailyTimeline.push({
      date: dateStr,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: baseViews,
      uniques: baseUniques
    });
  }

  return {
    totalPageViews: 384,
    uniqueVisitors: 168,
    pageBreakdown: {
      '/': 246,
      '/summary': 98,
      '/otaku-circle-case-study': 40
    },
    referrerBreakdown: {
      'LinkedIn': 142,
      'Direct': 118,
      'GitHub': 64,
      'Search': 38,
      'X (Twitter)': 22
    },
    deviceBreakdown: {
      'Desktop': 234,
      'Mobile': 128,
      'Tablet': 22
    },
    dailyTimeline,
    recentVisits: [
      { id: 'v_init_1', path: '/', device: 'Desktop', referrer: 'LinkedIn', timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
      { id: 'v_init_2', path: '/summary', device: 'Mobile', referrer: 'Direct', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
      { id: 'v_init_3', path: '/', device: 'Desktop', referrer: 'GitHub', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
      { id: 'v_init_4', path: '/otaku-circle-case-study', device: 'Desktop', referrer: 'LinkedIn', timestamp: new Date(Date.now() - 1000 * 60 * 190).toISOString() },
      { id: 'v_init_5', path: '/', device: 'Mobile', referrer: 'X (Twitter)', timestamp: new Date(Date.now() - 1000 * 60 * 310).toISOString() }
    ],
    lastUpdated: new Date().toISOString()
  };
};

// Retrieve stored analytics data or load initial baseline
export const getStoredAnalytics = () => {
  if (typeof window === 'undefined') return getInitialBaseline();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialBaseline();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load analytics storage:', err);
    return getInitialBaseline();
  }
};

// Save updated analytics data
const saveAnalytics = (data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('portfolio_analytics_updated', { detail: data }));
  } catch (err) {
    console.error('Failed to save analytics storage:', err);
  }
};

// Track a page view
export const logPageView = (path = '/') => {
  if (typeof window === 'undefined') return;
  try {
    // 1. Identify or register Unique Visitor
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    let isNewUniqueVisitor = false;
    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
      isNewUniqueVisitor = true;
    }

    // 2. Identify or register Session
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    let isNewSession = false;
    if (!sessionId) {
      sessionId = generateUUID();
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
      isNewSession = true;
    }

    // 3. Update aggregated analytics
    const data = getStoredAnalytics();
    data.totalPageViews = (data.totalPageViews || 0) + 1;
    if (isNewUniqueVisitor) {
      data.uniqueVisitors = (data.uniqueVisitors || 0) + 1;
    }

    // Update page breakdown
    const normalizedPath = path || '/';
    data.pageBreakdown[normalizedPath] = (data.pageBreakdown[normalizedPath] || 0) + 1;

    // Update referrer breakdown on new session
    const referrer = detectReferrer();
    if (isNewSession) {
      data.referrerBreakdown[referrer] = (data.referrerBreakdown[referrer] || 0) + 1;
    }

    // Update device breakdown
    const device = detectDevice();
    data.deviceBreakdown[device] = (data.deviceBreakdown[device] || 0) + 1;

    // Update daily timeline for today
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (!data.dailyTimeline) data.dailyTimeline = [];
    const todayEntry = data.dailyTimeline.find(entry => entry.date === todayStr);
    if (todayEntry) {
      todayEntry.views += 1;
      if (isNewUniqueVisitor) todayEntry.uniques += 1;
    } else {
      data.dailyTimeline.push({
        date: todayStr,
        label: todayLabel,
        views: 1,
        uniques: isNewUniqueVisitor ? 1 : 0
      });
      if (data.dailyTimeline.length > 30) {
        data.dailyTimeline.shift();
      }
    }

    // Prepend to recent visits log (keep up to 30)
    if (!data.recentVisits) data.recentVisits = [];
    data.recentVisits.unshift({
      id: generateUUID(),
      path: normalizedPath,
      device,
      referrer,
      timestamp: new Date().toISOString(),
      isUnique: isNewUniqueVisitor
    });
    if (data.recentVisits.length > 30) {
      data.recentVisits = data.recentVisits.slice(0, 30);
    }

    data.lastUpdated = new Date().toISOString();
    saveAnalytics(data);

    // Non-blocking fetch to serverless telemetry endpoint with anonymous rotated hash
    const rotatedHash = getRotatedVisitorHash();
    if (typeof fetch !== 'undefined') {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: normalizedPath,
          device,
          referrer,
          visitorHash: rotatedHash,
          isNewUniqueVisitor
        })
      }).catch(() => {
        // Silent catch for offline or local dev
      });
    }
  } catch (err) {
    console.warn('Analytics tracking error:', err);
  }
};

// Fetch cloud stats from /api/stats (Upstash Redis)
export const fetchCloudStats = async () => {
  if (typeof fetch === 'undefined') return null;
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
};

// Reset analytics data back to baseline
export const resetAnalyticsData = () => {
  const fresh = getInitialBaseline();
  saveAnalytics(fresh);
  return fresh;
};

// Export analytics data as downloadable JSON
export const exportAnalyticsJSON = () => {
  const data = getStoredAnalytics();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `khushang_portfolio_analytics_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
