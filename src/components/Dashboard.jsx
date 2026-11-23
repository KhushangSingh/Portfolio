import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  getMessages, 
  markAsRead, 
  markAsUnread, 
  toggleStar, 
  deleteMessage, 
  sendReply, 
  generateMailtoLink,
  exportMessagesJSON,
  resetMessages 
} from '../utils/messageService';
import { 
  getStoredAnalytics, 
  exportAnalyticsJSON, 
  resetAnalyticsData 
} from '../utils/visitorTracker';
import { playSoundEffect } from '../utils/soundEffects';

export default function Dashboard() {
  const { isDark, toggleTheme } = useTheme();

  // Active Main Tab: 'messages' | 'analytics' | 'architecture'
  const [activeTab, setActiveTab] = useState('messages');

  // Messages state
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [messageFilter, setMessageFilter] = useState('all'); // 'all' | 'unread' | 'starred' | 'replied'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reply composer state
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState(null);

  // Analytics state
  const [analytics, setAnalytics] = useState(getStoredAnalytics());

  // Copy notification state
  const [copiedKey, setCopiedKey] = useState(null);

  // Load messages & setup listeners
  useEffect(() => {
    const refreshData = () => {
      const list = getMessages();
      setMessages(list);
      if (list.length > 0 && !selectedMessageId) {
        setSelectedMessageId(list[0].id);
      }
      setAnalytics(getStoredAnalytics());
    };

    refreshData();

    const handleMessagesUpdate = (e) => {
      if (e.detail) setMessages(e.detail);
      else refreshData();
    };

    const handleAnalyticsUpdate = (e) => {
      if (e.detail) setAnalytics(e.detail);
      else setAnalytics(getStoredAnalytics());
    };

    window.addEventListener('portfolio_messages_updated', handleMessagesUpdate);
    window.addEventListener('portfolio_analytics_updated', handleAnalyticsUpdate);

    return () => {
      window.removeEventListener('portfolio_messages_updated', handleMessagesUpdate);
      window.removeEventListener('portfolio_analytics_updated', handleAnalyticsUpdate);
    };
  }, [selectedMessageId]);

  // Selected message object
  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || messages[0] || null;

  // Initialize reply subject when selected message changes
  useEffect(() => {
    if (selectedMessage) {
      setReplySubject(`Re: ${selectedMessage.subject} - Khushang Singh`);
      setReplyText('');
      setReplyStatus(null);
      // Automatically mark as read when opened
      if (selectedMessage.status === 'unread') {
        markAsRead(selectedMessage.id);
      }
    }
  }, [selectedMessageId]);

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    // Filter by status
    if (messageFilter === 'unread' && msg.status !== 'unread') return false;
    if (messageFilter === 'starred' && !msg.starred) return false;
    if (messageFilter === 'replied' && msg.status !== 'replied') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = msg.name?.toLowerCase().includes(q);
      const matchEmail = msg.email?.toLowerCase().includes(q);
      const matchSubject = msg.subject?.toLowerCase().includes(q);
      const matchMessage = msg.message?.toLowerCase().includes(q);
      const matchType = msg.inquiryType?.toLowerCase().includes(q);
      return matchName || matchEmail || matchSubject || matchMessage || matchType;
    }

    return true;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  // Handlers for message actions
  const handleToggleStar = (id) => {
    try { playSoundEffect('click'); } catch { /* ignore */ }
    toggleStar(id);
  };

  const handleToggleReadStatus = (id, currentStatus) => {
    try { playSoundEffect('switch'); } catch { /* ignore */ }
    if (currentStatus === 'unread') {
      markAsRead(id);
    } else {
      markAsUnread(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try { playSoundEffect('switch'); } catch { /* ignore */ }
      const remaining = deleteMessage(id);
      if (selectedMessageId === id) {
        setSelectedMessageId(remaining[0]?.id || null);
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    setIsSendingReply(true);
    setReplyStatus(null);
    try {
      playSoundEffect('click');
    } catch { /* ignore */ }

    try {
      const result = await sendReply(selectedMessage.id, replyText, replySubject);
      setReplyStatus({
        type: 'success',
        text: `Reply dispatched to ${selectedMessage.email}. Status recorded in inbox.`
      });
      // Update local message list view
      setMessages(getMessages());
    } catch (err) {
      setReplyStatus({
        type: 'error',
        text: 'Could not send through serverless API. Please use the Open in Mail App button.'
      });
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleResetAnalytics = () => {
    if (window.confirm('Reset analytics tracking data back to baseline?')) {
      const fresh = resetAnalyticsData();
      setAnalytics(fresh);
    }
  };

  const handleResetMessages = () => {
    if (window.confirm('Reset message inbox back to initial sample state?')) {
      const fresh = resetMessages();
      setMessages(fresh);
      setSelectedMessageId(fresh[0]?.id || null);
    }
  };

  // Format relative timestamp
  const formatTimeAgo = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-12 ${
      isDark ? 'bg-[#060608] text-white' : 'bg-[#F9F9F6] text-neutral-900'
    }`}>
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* 1. MAIN PAGE HEADING & TOP METADATA */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#ff5e1a] bg-[#ff5e1a]/10 px-2.5 py-1 rounded-md border border-[#ff5e1a]/25">
                Studio Management System
              </span>
              <span className="text-xs font-mono text-neutral-500">
                khushang.design // private hub
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Studio Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl">
              Track live anonymous visitors, manage incoming inquiries and dispatch direct email replies without third-party portal sign-ins.
            </p>
          </div>

          {/* Quick utility controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                isDark 
                  ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-[#ff5e1a] hover:text-[#ff5e1a]' 
                  : 'border-black/15 bg-black/5 text-neutral-800 hover:border-[#ff5e1a] hover:text-[#ff5e1a]'
              }`}
            >
              Portfolio Home
            </Link>

            <Link
              to="/summary"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                isDark 
                  ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-[#ff5e1a] hover:text-[#ff5e1a]' 
                  : 'border-black/15 bg-black/5 text-neutral-800 hover:border-[#ff5e1a] hover:text-[#ff5e1a]'
              }`}
            >
              Summary Brief
            </Link>

            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                isDark 
                  ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-[#ff5e1a]' 
                  : 'border-black/15 bg-black/5 text-neutral-800 hover:border-[#ff5e1a]'
              }`}
            >
              {isDark ? 'Light Theme' : 'Dark Theme'}
            </button>
          </div>
        </header>

        {/* 2. PRIMARY NAVIGATION TABS */}
        <nav aria-label="Dashboard views" className="flex flex-wrap items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-[#ff5e1a] text-white shadow-md'
                : isDark
                  ? 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  : 'bg-black/5 text-neutral-600 hover:text-neutral-900 hover:bg-black/10'
            }`}
          >
            <span>Messages & Inquiries</span>
            {unreadCount > 0 && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                activeTab === 'messages' ? 'bg-black text-white' : 'bg-[#ff5e1a] text-white'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#ff5e1a] text-white shadow-md'
                : isDark
                  ? 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  : 'bg-black/5 text-neutral-600 hover:text-neutral-900 hover:bg-black/10'
            }`}
          >
            <span>Visitor Analytics</span>
            <span className="text-[10px] opacity-75 font-normal">
              ({analytics.uniqueVisitors} unique)
            </span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-[#ff5e1a] text-white shadow-md'
                : isDark
                  ? 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  : 'bg-black/5 text-neutral-600 hover:text-neutral-900 hover:bg-black/10'
            }`}
          >
            <span>Setup & Architecture</span>
          </button>
        </nav>

        {/* 3. TAB CONTENT: MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <section aria-labelledby="inbox-heading" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 id="inbox-heading" className="text-xl sm:text-2xl font-black tracking-tight">
                  Inquiries & Messages
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  {messages.length} total inquiries logged across portfolio touchpoints
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={exportMessagesJSON}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                    isDark ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-[#ff5e1a]' : 'border-black/15 bg-black/5 text-neutral-800 hover:border-[#ff5e1a]'
                  }`}
                >
                  Export Inquiries JSON
                </button>
                <button
                  onClick={handleResetMessages}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono text-neutral-500 hover:text-red-400 transition-colors ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'
                  }`}
                >
                  Reset Sample Inquiries
                </button>
              </div>
            </div>

            {/* Master-Detail Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: Message List & Filters (5 cols) */}
              <div className={`lg:col-span-5 rounded-2xl border flex flex-col overflow-hidden ${
                isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                
                {/* Search Bar */}
                <div className="p-4 border-b border-black/10 dark:border-white/10">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sender, inquiry or message..."
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none font-mono ${
                      isDark 
                        ? 'border-white/15 bg-black/40 text-white placeholder-neutral-500 focus:border-[#ff5e1a]' 
                        : 'border-black/15 bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:border-[#ff5e1a]'
                    }`}
                  />

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs font-mono font-bold">
                    {[
                      { key: 'all', label: `All (${messages.length})` },
                      { key: 'unread', label: `Unread (${unreadCount})` },
                      { key: 'starred', label: `Starred (${messages.filter(m => m.starred).length})` },
                      { key: 'replied', label: `Replied (${messages.filter(m => m.status === 'replied').length})` }
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setMessageFilter(f.key)}
                        className={`px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider transition-all shrink-0 ${
                          messageFilter === f.key
                            ? 'bg-[#ff5e1a] text-white'
                            : isDark 
                              ? 'bg-white/5 text-neutral-400 hover:text-white' 
                              : 'bg-black/5 text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List Items Container */}
                <div className="divide-y divide-black/5 dark:divide-white/5 max-h-[640px] overflow-y-auto">
                  {filteredMessages.length === 0 ? (
                    <div className="p-8 text-center text-xs font-mono text-neutral-500">
                      No inquiries match your current filter.
                    </div>
                  ) : (
                    filteredMessages.map((msg) => {
                      const isSelected = msg.id === selectedMessageId;
                      return (
                        <div
                          key={msg.id}
                          onClick={() => {
                            setSelectedMessageId(msg.id);
                            try { playSoundEffect('click'); } catch { /* ignore */ }
                          }}
                          className={`p-4 transition-all cursor-pointer relative ${
                            isSelected
                              ? isDark ? 'bg-white/10' : 'bg-neutral-100'
                              : isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'
                          }`}
                        >
                          {/* Unread dot bar */}
                          {msg.status === 'unread' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff5e1a]" />
                          )}

                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className={`text-xs font-bold truncate ${
                              msg.status === 'unread' ? 'text-[#ff5e1a]' : ''
                            }`}>
                              {msg.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                              {formatTimeAgo(msg.createdAt)}
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-neutral-500 truncate mb-1.5">
                            {msg.subject || msg.inquiryType}
                          </div>

                          <p className={`text-xs line-clamp-2 leading-relaxed ${
                            isDark ? 'text-neutral-400' : 'text-neutral-600'
                          }`}>
                            {msg.message}
                          </p>

                          <div className="flex items-center gap-2 mt-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ff5e1a]/10 text-[#ff5e1a] border border-[#ff5e1a]/20">
                              {msg.inquiryType}
                            </span>

                            {msg.status === 'replied' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                Replied
                              </span>
                            )}

                            {msg.starred && (
                              <span className="text-[10px] font-mono font-bold text-amber-500">
                                Starred
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: Message Details & Reply Studio (7 cols) */}
              <div className={`lg:col-span-7 rounded-2xl border p-6 sm:p-8 flex flex-col gap-6 ${
                isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                {selectedMessage ? (
                  <>
                    {/* Message Header & Metadata */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#ff5e1a] bg-[#ff5e1a]/10 border border-[#ff5e1a]/25">
                            {selectedMessage.inquiryType}
                          </span>
                          <span className="text-xs font-mono text-neutral-500">
                            Ref: #{selectedMessage.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight">
                          {selectedMessage.subject || 'Direct Website Inquiry'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                          <span className="font-bold">{selectedMessage.name}</span>
                          <span className="text-neutral-500">•</span>
                          <button
                            onClick={() => handleCopy(selectedMessage.email, 'email')}
                            className="font-mono text-[#ff5e1a] hover:underline"
                            title="Click to copy email"
                          >
                            {selectedMessage.email} {copiedKey === 'email' ? '(Copied!)' : ''}
                          </button>
                          <span className="text-neutral-500">•</span>
                          <span className="font-mono text-neutral-400">
                            {new Date(selectedMessage.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {/* Social Profile URL */}
                        {selectedMessage.socialUrl && (
                          <div className="mt-3 flex items-center gap-2 text-xs font-mono">
                            <span className="text-neutral-500">Sender Social Profile:</span>
                            <a
                              href={selectedMessage.socialUrl.startsWith('http') ? selectedMessage.socialUrl : `https://${selectedMessage.socialUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#ff5e1a] font-bold hover:underline"
                            >
                              {selectedMessage.socialUrl}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Top Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleToggleStar(selectedMessage.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                            selectedMessage.starred 
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                              : isDark ? 'border-white/10 hover:border-white/25' : 'border-black/10 hover:border-black/25'
                          }`}
                        >
                          {selectedMessage.starred ? 'Starred' : 'Star'}
                        </button>

                        <button
                          onClick={() => handleToggleReadStatus(selectedMessage.id, selectedMessage.status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                            isDark ? 'border-white/10 hover:border-white/25' : 'border-black/10 hover:border-black/25'
                          }`}
                        >
                          {selectedMessage.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                        </button>

                        <button
                          onClick={() => handleDelete(selectedMessage.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Inquiry Message Body */}
                    <div className={`p-5 rounded-xl border text-sm sm:text-base leading-relaxed ${
                      isDark ? 'bg-black/30 border-white/10 text-neutral-200' : 'bg-neutral-50 border-black/10 text-neutral-800'
                    }`}>
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>

                    {/* Previous Reply Thread (if already replied) */}
                    {selectedMessage.reply && (
                      <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-green-500">
                            Reply Delivered on {new Date(selectedMessage.reply.sentAt).toLocaleString()}
                          </span>
                          <span className="text-neutral-400">
                            Method: {selectedMessage.reply.method}
                          </span>
                        </div>
                        <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          isDark ? 'text-neutral-300' : 'text-neutral-700'
                        }`}>
                          {selectedMessage.reply.text}
                        </p>
                      </div>
                    )}

                    {/* DIRECT EMAIL REPLY STUDIO */}
                    <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-4">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold tracking-tight">
                          Dispatch Direct Email Reply
                        </h4>
                        <p className="text-xs text-neutral-500">
                          Replies go directly to {selectedMessage.email} with your official portfolio sender attribution.
                        </p>
                      </div>

                      {replyStatus && (
                        <div className={`p-3 rounded-lg text-xs font-medium border ${
                          replyStatus.type === 'success' 
                            ? 'bg-green-500/10 border-green-500/25 text-green-400' 
                            : 'bg-red-500/10 border-red-500/25 text-red-400'
                        }`}>
                          {replyStatus.text}
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-mono border outline-none ${
                            isDark 
                              ? 'border-white/15 bg-black/40 text-white focus:border-[#ff5e1a]' 
                              : 'border-black/15 bg-neutral-50 text-neutral-900 focus:border-[#ff5e1a]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                          Your Reply Message
                        </label>
                        <textarea
                          rows={4}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Write a thoughtful response to ${selectedMessage.name}...`}
                          className={`px-3.5 py-2.5 rounded-xl text-sm border outline-none resize-y min-h-[110px] ${
                            isDark 
                              ? 'border-white/15 bg-black/40 text-white focus:border-[#ff5e1a]' 
                              : 'border-black/15 bg-neutral-50 text-neutral-900 focus:border-[#ff5e1a]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSendReply}
                            disabled={isSendingReply || !replyText.trim()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#ff5e1a] text-white hover:bg-[#e0480a] transition-all disabled:opacity-50 shadow-md cursor-pointer"
                          >
                            <span>{isSendingReply ? 'Sending to Mailbox...' : 'Send Email Reply'}</span>
                          </button>

                          <a
                            href={generateMailtoLink(selectedMessage, replyText, replySubject)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                              isDark 
                                ? 'border-white/15 bg-white/5 text-neutral-200 hover:border-[#ff5e1a] hover:text-[#ff5e1a]' 
                                : 'border-black/15 bg-black/5 text-neutral-800 hover:border-[#ff5e1a] hover:text-[#ff5e1a]'
                            }`}
                            title="Open native desktop or mobile email application with prefilled response"
                          >
                            <span>Open in Mail App</span>
                          </a>
                        </div>

                        <span className="text-[11px] font-mono text-neutral-500">
                          Direct recipient: {selectedMessage.email}
                        </span>
                      </div>

                    </div>
                  </>
                ) : (
                  <div className="p-16 text-center text-xs font-mono text-neutral-500">
                    Select an inquiry from the list to view complete details and compose your reply.
                  </div>
                )}
              </div>

            </div>
          </section>
        )}

        {/* 4. TAB CONTENT: VISITOR ANALYTICS */}
        {activeTab === 'analytics' && (
          <section aria-labelledby="analytics-heading" className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 id="analytics-heading" className="text-xl sm:text-2xl font-black tracking-tight">
                  Visitor Traffic & Engagement
                </h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Privacy-first anonymous telemetry recorded directly without cookies or third-party user log-ins
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={exportAnalyticsJSON}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                    isDark ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-[#ff5e1a]' : 'border-black/15 bg-black/5 text-neutral-800 hover:border-[#ff5e1a]'
                  }`}
                >
                  Export Metrics JSON
                </button>
                <button
                  onClick={handleResetAnalytics}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono text-neutral-500 hover:text-red-400 transition-colors ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'
                  }`}
                >
                  Reset Analytics Data
                </button>
              </div>
            </div>

            {/* Top KPI Cards (4 metrics) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Total Pageviews
                </span>
                <div className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
                  {analytics.totalPageViews}
                </div>
                <span className="text-[11px] font-mono text-[#ff5e1a] mt-1 block">
                  Across all sessions
                </span>
              </div>

              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Unique Visitors
                </span>
                <div className="text-3xl sm:text-4xl font-black mt-2 tracking-tight text-[#ff5e1a]">
                  {analytics.uniqueVisitors}
                </div>
                <span className="text-[11px] font-mono text-neutral-500 mt-1 block">
                  Individual devices
                </span>
              </div>

              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Top Referral Channel
                </span>
                <div className="text-2xl sm:text-3xl font-black mt-2 tracking-tight truncate">
                  LinkedIn
                </div>
                <span className="text-[11px] font-mono text-green-500 mt-1 block">
                  37% of external traffic
                </span>
              </div>

              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Primary Route
                </span>
                <div className="text-2xl sm:text-3xl font-black mt-2 tracking-tight truncate font-mono">
                  /
                </div>
                <span className="text-[11px] font-mono text-neutral-500 mt-1 block">
                  64% of total views
                </span>
              </div>
            </div>

            {/* Daily Traffic Timeline Bar Chart */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight">
                    Daily Traffic Velocity (Last 14 Days)
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    Pageviews and unique visits mapped by day
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-xs bg-[#ff5e1a]" />
                    <span className="text-neutral-400">Pageviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-xs bg-neutral-400 dark:bg-neutral-600" />
                    <span className="text-neutral-400">Unique Visitors</span>
                  </div>
                </div>
              </div>

              {/* Bar Visualizer */}
              <div className="pt-6 pb-2 overflow-x-auto">
                <div className="min-w-[600px] h-48 flex items-end justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-2">
                  {analytics.dailyTimeline?.map((item) => {
                    const maxDaily = Math.max(...analytics.dailyTimeline.map((d) => d.views), 30);
                    const viewHeightPct = Math.min(100, Math.max(12, Math.round((item.views / maxDaily) * 100)));
                    const uniqueHeightPct = Math.min(100, Math.max(8, Math.round((item.uniques / maxDaily) * 100)));

                    return (
                      <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <div className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.views}v / {item.uniques}u
                        </div>
                        <div className="w-full flex items-end justify-center gap-1.5 h-36">
                          <div
                            style={{ height: `${viewHeightPct}%` }}
                            className="w-1/2 max-w-[14px] rounded-t-sm bg-[#ff5e1a] transition-all group-hover:brightness-110"
                            title={`${item.label}: ${item.views} pageviews`}
                          />
                          <div
                            style={{ height: `${uniqueHeightPct}%` }}
                            className="w-1/2 max-w-[14px] rounded-t-sm bg-neutral-300 dark:bg-neutral-700 transition-all group-hover:brightness-110"
                            title={`${item.label}: ${item.uniques} unique visitors`}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500 whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3-Column Breakdown: Pages, Referrers, Devices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pages Breakdown */}
              <div className={`p-6 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-400">
                  Page Distribution
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  {Object.entries(analytics.pageBreakdown || {}).map(([path, count]) => {
                    const total = analytics.totalPageViews || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={path} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-bold text-neutral-200 dark:text-neutral-200 truncate">{path}</span>
                          <span className="text-neutral-400">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-full bg-[#ff5e1a]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Referrers Breakdown */}
              <div className={`p-6 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-400">
                  Referral Channels
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  {Object.entries(analytics.referrerBreakdown || {}).map(([channel, count]) => {
                    const total = Object.values(analytics.referrerBreakdown || {}).reduce((a, b) => a + b, 0) || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={channel} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-bold text-neutral-200 dark:text-neutral-200">{channel}</span>
                          <span className="text-neutral-400">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-full bg-[#ff5e1a]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Devices Breakdown */}
              <div className={`p-6 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-400">
                  Device Hardware
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  {Object.entries(analytics.deviceBreakdown || {}).map(([dev, count]) => {
                    const total = Object.values(analytics.deviceBreakdown || {}).reduce((a, b) => a + b, 0) || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={dev} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-bold text-neutral-200 dark:text-neutral-200">{dev}</span>
                          <span className="text-neutral-400">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-full bg-[#ff5e1a]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Live Activity Stream Table */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
              <div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  Recent Anonymous Visitor Feed
                </h3>
                <p className="text-xs text-neutral-500 font-mono">
                  Real-time session trail without personal identifiers or privacy intrusion
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 text-neutral-400">
                      <th className="py-2.5 px-3">Session Time</th>
                      <th className="py-2.5 px-3">Destination Route</th>
                      <th className="py-2.5 px-3">Device</th>
                      <th className="py-2.5 px-3">Referral Source</th>
                      <th className="py-2.5 px-3 text-right">Visitor Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {analytics.recentVisits?.slice(0, 10).map((v) => (
                      <tr key={v.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-3 text-neutral-400">
                          {formatTimeAgo(v.timestamp)}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-[#ff5e1a]">
                          {v.path}
                        </td>
                        <td className="py-2.5 px-3">
                          {v.device}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-400">
                          {v.referrer}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            v.isUnique 
                              ? 'bg-[#ff5e1a]/15 text-[#ff5e1a]' 
                              : 'bg-neutral-500/15 text-neutral-400'
                          }`}>
                            {v.isUnique ? 'New Visitor' : 'Returning'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </section>
        )}

        {/* 5. TAB CONTENT: SETUP & ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <section aria-labelledby="architecture-heading" className="space-y-6">
            <div>
              <h2 id="architecture-heading" className="text-xl sm:text-2xl font-black tracking-tight">
                Architecture & Production Setup
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                Technical guide for visitor analytics and serverless email delivery
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Zero-Login Visitor Tracking */}
              <div className={`p-6 sm:p-8 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#ff5e1a] bg-[#ff5e1a]/10 border border-[#ff5e1a]/25">
                  Client-Side & Edge Telemetry
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  How Zero-Login Tracking Works
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Your portfolio uses a lightweight cryptographic UUID assigned upon the first visit to browser storage. Every session is tracked without requesting personal data or cookies.
                </p>
                <div className="space-y-2 text-xs font-mono text-neutral-500">
                  <div className="p-3 rounded-lg border border-black/10 dark:border-white/10">
                    <span className="font-bold text-neutral-200 dark:text-neutral-200 block mb-1">1. Unique Visitor ID:</span>
                    Stored in localStorage. Survives tab closes to distinguish repeat visits from new visitors.
                  </div>
                  <div className="p-3 rounded-lg border border-black/10 dark:border-white/10">
                    <span className="font-bold text-neutral-200 dark:text-neutral-200 block mb-1">2. Session Tracking:</span>
                    Stored in sessionStorage. Increments total visits and page transitions per browsing session.
                  </div>
                  <div className="p-3 rounded-lg border border-black/10 dark:border-white/10">
                    <span className="font-bold text-neutral-200 dark:text-neutral-200 block mb-1">3. Vercel Web Analytics (1-Click Upgrade):</span>
                    For global multi-device sync, enable Vercel Web Analytics in your Vercel Project settings. It requires zero login code and aggregates visits across all devices globally.
                  </div>
                </div>
              </div>

              {/* Card 2: Direct Email Replies */}
              <div className={`p-6 sm:p-8 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#0e0f12] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#ff5e1a] bg-[#ff5e1a]/10 border border-[#ff5e1a]/25">
                  Serverless Email Dispatch
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  How Inquiries & Replies Deliver
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  When a visitor submits the contact form, it is saved locally to your studio inbox and dispatched via serverless functions in <code className="text-[#ff5e1a]">/api/contact</code> and <code className="text-[#ff5e1a]">/api/reply</code>.
                </p>
                <div className="space-y-2 text-xs font-mono text-neutral-500">
                  <div className="p-3 rounded-lg border border-black/10 dark:border-white/10">
                    <span className="font-bold text-neutral-200 dark:text-neutral-200 block mb-1">1. Live Serverless Dispatch:</span>
                    Using Resend or SendGrid on Vercel, set <code className="text-[#ff5e1a]">RESEND_API_KEY</code> in environment variables. Replies typed in this dashboard are dispatched straight to the recipient's mailbox.
                  </div>
                  <div className="p-3 rounded-lg border border-black/10 dark:border-white/10">
                    <span className="font-bold text-neutral-200 dark:text-neutral-200 block mb-1">2. Native Mail Client Fallback:</span>
                    Clicking "Open in Mail App" opens your desktop mail client (Gmail, Apple Mail or Outlook) with the recipient, subject and pre-composed reply loaded instantly.
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

      </div>
    </div>
  );
}
