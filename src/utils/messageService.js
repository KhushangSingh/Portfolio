// Message Service Utility
// Handles direct portfolio contact inquiries, inbox storage and email reply delivery.

const MESSAGES_STORAGE_KEY = 'khushang_portfolio_messages_v2';
const OLD_MESSAGES_KEY = 'khushang_portfolio_messages_v1';

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

// Add a newly submitted inquiry
export const addMessage = async ({ name, email, socialUrl = '', inquiryType = 'General Inquiry', subject = '', message }) => {
  const messages = getMessages();
  const id = 'inq_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
  
  const newMessage = {
    id,
    name: name.trim(),
    email: email.trim(),
    socialUrl: socialUrl.trim(),
    inquiryType: inquiryType.trim() || 'General Inquiry',
    subject: subject.trim() || `Inquiry from ${name.trim()}`,
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'unread',
    starred: false,
    reply: null
  };

  messages.unshift(newMessage);
  saveMessages(messages);

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
