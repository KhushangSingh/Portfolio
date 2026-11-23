// Visitor & Pageview Tracker Utility
// Real-time zero-baseline visitor telemetry with owner/admin filtering.

const STORAGE_KEY = 'khushang_portfolio_analytics_v2';
const OLD_STORAGE_KEY = 'khushang_portfolio_analytics_v1';
const VISITOR_ID_KEY = 'khushang_visitor_id';
const SESSION_ID_KEY = 'khushang_session_id';

// Clean empty baseline: Zero dummy data. Only genuine visitor metrics.
export const getZeroBaseline = () => ({
  totalPageViews: 0,
  uniqueVisitors: 0,
  pageBreakdown: {},
  referrerBreakdown: {},
  deviceBreakdown: {},
  dailyTimeline: [],
  recentVisits: [],
  lastUpdated: new Date().toISOString()
});

// Detect whether current session belongs to portfolio owner/admin
export const isOwnerOrAdmin = () => {
  if (typeof window === 'undefined') return false;
  try {
    const host = window.location.hostname;
    // Localhost or loopback is development
    if (host === 'localhost' || host === '127.0.0.1') return true;
    // Owner authenticated via dashboard
    if (localStorage.getItem('khushang_is_admin') === 'true') return true;
    if (localStorage.getItem('khushang_studio_auth') === 'unlocked') return true;
    if (sessionStorage.getItem('khushang_studio_auth') === 'unlocked') return true;
    return false;
  } catch {
    return false;
  }
};

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

// Detect device hardware category
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

// Detect referral origin from document.referrer and URL query parameters
export const detectReferrer = () => {
  if (typeof window === 'undefined') return 'Direct';

  // Check URL parameters first (e.g. ?ref=linkedin or ?utm_source=github)
  try {
    const params = new URLSearchParams(window.location.search);
    const refParam = (params.get('ref') || params.get('utm_source') || '').toLowerCase();
    if (refParam.includes('linkedin')) return 'LinkedIn';
    if (refParam.includes('github')) return 'GitHub';
    if (refParam.includes('twitter') || refParam.includes('x')) return 'X (Twitter)';
    if (refParam.includes('instagram')) return 'Instagram';
    if (refParam.includes('behance')) return 'Behance';
    if (refParam.includes('dribbble')) return 'Dribbble';
  } catch {
    // Ignore query parsing errors
  }

  // Check HTTP document.referrer
  if (typeof document === 'undefined') return 'Direct';
  const ref = document.referrer.toLowerCase();
  if (!ref) return 'Direct';
  
  if (ref.includes('linkedin.com') || ref.includes('lnkd.in')) return 'LinkedIn';
  if (ref.includes('github.com')) return 'GitHub';
  if (ref.includes('twitter.com') || ref.includes('t.co') || ref.includes('x.com')) return 'X (Twitter)';
  if (ref.includes('instagram.com')) return 'Instagram';
  if (ref.includes('behance.net')) return 'Behance';
  if (ref.includes('dribbble.com')) return 'Dribbble';
  if (ref.includes('google.') || ref.includes('bing.') || ref.includes('duckduckgo.') || ref.includes('yahoo.')) return 'Search Engine';
  
  // If referred by own domain, treat as Direct
  if (ref.includes(window.location.hostname)) return 'Direct';
  
  return 'External Website';
};

// Retrieve stored analytics data or initialize clean zero baseline
export const getStoredAnalytics = () => {
  if (typeof window === 'undefined') return getZeroBaseline();
  try {
    // Purge legacy dummy storage key if present
    if (localStorage.getItem(OLD_STORAGE_KEY)) {
      localStorage.removeItem(OLD_STORAGE_KEY);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getZeroBaseline();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load analytics storage:', err);
    return getZeroBaseline();
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

  // 1. Exclude owner/admin visits completely
  if (isOwnerOrAdmin()) {
    return;
  }

  // 2. Exclude internal studio and admin routes
  const normalizedPath = path || '/';
  if (
    normalizedPath.startsWith('/dashboard') ||
    normalizedPath.startsWith('/analytics') ||
    normalizedPath.startsWith('/inbox')
  ) {
    return;
  }

  try {
    // 3. Identify or register Unique Visitor
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    let isNewUniqueVisitor = false;
    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
      isNewUniqueVisitor = true;
    }

    // 4. Identify or register Session
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    let isNewSession = false;
    if (!sessionId) {
      sessionId = generateUUID();
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
      isNewSession = true;
    }

    // 5. Update aggregated analytics
    const data = getStoredAnalytics();
    data.totalPageViews = (data.totalPageViews || 0) + 1;
    if (isNewUniqueVisitor) {
      data.uniqueVisitors = (data.uniqueVisitors || 0) + 1;
    }

    // Update page breakdown
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

// Reset analytics data back to real zero baseline
export const resetAnalyticsData = () => {
  const fresh = getZeroBaseline();
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
