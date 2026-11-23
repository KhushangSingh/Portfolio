// Message Service Utility
// Handles direct portfolio contact inquiries, inbox storage, archive management and analytics backup.

const MESSAGES_STORAGE_KEY = 'khushang_portfolio_messages_v2';
const OLD_MESSAGES_KEY = 'khushang_portfolio_messages_v1';
const BACKUP_STORAGE_KEY = 'khushang_portfolio_responses_backup_v1';
const BACKUP_CONFIG_KEY = 'khushang_portfolio_backup_active';

// Initial state: Clean zero baseline. No dummy inquiries.
const getInitialMessages = () => [];

// Retrieve all messages from storage
export const getMessages = () => {
  if (typeof window === 'undefined') return getInitialMessages();
  try {
    // Purge old dummy messages key if present
    if (localStorage.getItem(OLD_MESSAGES_KEY)) {
      localStorage.removeItem(OLD_MESSAGES_KEY);
    }

    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialMessages();
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load messages from localStorage:', err);
    return getInitialMessages();
  }
};

// Save messages to storage and notify active listeners
const saveMessages = (messages) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    window.dispatchEvent(new CustomEvent('portfolio_messages_updated', { detail: messages }));
  } catch (err) {
    console.error('Failed to save messages to localStorage:', err);
  }
};

// Format a clean, human-readable response ID (e.g. INQ-001, INQ-002)
export const getReadableDisplayId = (msg, index = 0, total = 1) => {
  if (!msg) return 'INQ-000';
  if (msg.displayId) return msg.displayId;
  if (msg.sequenceNumber) return `INQ-${String(msg.sequenceNumber).padStart(3, '0')}`;
  
  // Dynamic fallback for legacy messages based on chronological sequence
  const computedNum = Math.max(1, total - index);
  return `INQ-${String(computedNum).padStart(3, '0')}`;
};

// Check if live analytics backup recording is active
export const isBackupActive = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(BACKUP_CONFIG_KEY) === 'true';
};

// Toggle or set live analytics backup recording state
export const setBackupActive = (active) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BACKUP_CONFIG_KEY, active ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent('portfolio_backup_config_changed', { detail: active }));
};

// Retrieve all stored backup responses for analytics
export const getBackupResponses = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BACKUP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load backup responses:', err);
    return [];
  }
};

// Record a response into permanent analytics backup storage
export const recordBackupResponse = (message) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(BACKUP_STORAGE_KEY);
    const backupList = raw ? JSON.parse(raw) : [];
    
    const wordCount = message.message ? message.message.trim().split(/\s+/).filter(Boolean).length : 0;
    const charCount = message.message ? message.message.length : 0;
    
    const backupEntry = {
      ...message,
      backupId: 'bk_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      backupRecordedAt: new Date().toISOString(),
      analyticsMetadata: {
        wordCount,
        charCount,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
        screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown'
      }
    };

    backupList.unshift(backupEntry);
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(backupList));
    window.dispatchEvent(new CustomEvent('portfolio_backup_updated', { detail: backupList }));
  } catch (err) {
    console.error('Failed to write response to backup storage:', err);
  }
};

// Clear backup storage
export const clearBackupResponses = () => {
  if (typeof window === 'undefined') return [];
  localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent('portfolio_backup_updated', { detail: [] }));
  return [];
};

// Export permanent backup responses as downloadable JSON
export const exportBackupJSON = () => {
  const backups = getBackupResponses();
  const blob = new Blob([JSON.stringify(backups, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `khushang_portfolio_analytics_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Add a newly submitted inquiry
export const addMessage = async ({ name, email, socialUrl = '', inquiryType = 'General Inquiry', subject = '', message }) => {
  const messages = getMessages();
  const id = 'inq_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
  
  // Calculate clean sequential response ID (e.g. INQ-001, INQ-002)
  const existingNums = messages
    .map(m => m.sequenceNumber || parseInt((m.displayId || '').replace(/\D/g, '') || '0', 10))
    .filter(n => !isNaN(n) && n > 0);
  const sequenceNumber = existingNums.length > 0 ? Math.max(...existingNums) + 1 : messages.length + 1;
  const displayId = `INQ-${String(sequenceNumber).padStart(3, '0')}`;

  const newMessage = {
    id,
    sequenceNumber,
    displayId,
    name: name.trim(),
    email: email.trim(),
    socialUrl: socialUrl.trim(),
    inquiryType: inquiryType.trim() || 'General Inquiry',
    subject: subject.trim() || `Inquiry from ${name.trim()}`,
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'unread',
    starred: false,
    archived: false,
    reply: null
  };

  messages.unshift(newMessage);
  saveMessages(messages);

  // Backup storage: only records when live recording is active (skips test form filling)
  if (isBackupActive()) {
    recordBackupResponse(newMessage);
  }

  // Send to serverless endpoint if available
  if (typeof fetch !== 'undefined') {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
    } catch (err) {
      console.warn('Remote contact API notice:', err);
    }
  }

  return newMessage;
};

// Mark message status as read
export const markAsRead = (id) => {
  const messages = getMessages();
  const target = messages.find(m => m.id === id);
  if (target && target.status === 'unread') {
    target.status = 'read';
    saveMessages(messages);
  }
  return messages;
};

// Mark message status as unread
export const markAsUnread = (id) => {
  const messages = getMessages();
  const target = messages.find(m => m.id === id);
  if (target) {
    target.status = 'unread';
    saveMessages(messages);
  }
  return messages;
};

// Toggle message starred flag
export const toggleStar = (id) => {
  const messages = getMessages();
  const target = messages.find(m => m.id === id);
  if (target) {
    target.starred = !target.starred;
    saveMessages(messages);
  }
  return messages;
};

// Archive an inquiry (moves to done / archived section)
export const archiveMessage = (id) => {
  const messages = getMessages();
  const target = messages.find(m => m.id === id);
  if (target) {
    target.archived = true;
    saveMessages(messages);
  }
  return messages;
};

// Restore an inquiry back to active inbox
export const unarchiveMessage = (id) => {
  const messages = getMessages();
  const target = messages.find(m => m.id === id);
  if (target) {
    target.archived = false;
    saveMessages(messages);
  }
  return messages;
};

// Delete a message by ID
export const deleteMessage = (id) => {
  const messages = getMessages().filter(m => m.id !== id);
  saveMessages(messages);
  return messages;
};

// Send direct email reply
export const sendReply = async (id, replyText, customSubject) => {
  const messages = getMessages();
  const target = messages.find(m => m.id === id);
  if (!target) throw new Error('Message not found');

  const subject = customSubject || `Re: ${target.subject} - Khushang Singh`;

  // Attempt serverless email dispatch via /api/reply
  let remoteDelivered = false;
  if (typeof fetch !== 'undefined') {
    try {
      const res = await fetch('/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: target.email,
          recipientName: target.name,
          subject,
          replyText,
          originalMessage: target.message,
          inquiryId: target.id
        })
      });
      if (res.ok) {
        remoteDelivered = true;
      }
    } catch (err) {
      console.warn('Direct reply endpoint notice:', err);
    }
  }

  // Record reply in local history
  target.status = 'replied';
  target.reply = {
    text: replyText.trim(),
    sentAt: new Date().toISOString(),
    subject,
    method: remoteDelivered ? 'serverless_email' : 'client_dispatch'
  };

  saveMessages(messages);
  return { success: true, remoteDelivered, message: target };
};

// Construct prefilled mailto link for native desktop/mobile email client fallback
export const generateMailtoLink = (message, replyText = '', customSubject = '') => {
  if (!message) return '#';
  const subject = customSubject || `Re: ${message.subject} - Khushang Singh`;
  const bodyText = replyText 
    ? `${replyText}\n\n---\nOn ${new Date(message.createdAt).toLocaleDateString()}, ${message.name} wrote:\n${message.message}`
    : `Hi ${message.name},\n\nThank you for reaching out through my portfolio website.\n\nBest regards,\nKhushang Singh`;

  return `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
};

// Reset messages back to clean zero state
export const resetMessages = () => {
  const initial = getInitialMessages();
  saveMessages(initial);
  return initial;
};

// Export inquiries as downloadable JSON
export const exportMessagesJSON = () => {
  const messages = getMessages();
  const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `khushang_portfolio_messages_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
