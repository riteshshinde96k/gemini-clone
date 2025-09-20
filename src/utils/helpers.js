import { AI_RESPONSES } from './constants';

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format timestamp
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Format time for messages
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Generate random AI response
export const generateAIResponse = () => {
  const randomIndex = Math.floor(Math.random() * AI_RESPONSES.length);
  return AI_RESPONSES[randomIndex];
};

// Validate phone number
export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\d{7,15}$/;
  return phoneRegex.test(phoneNumber);
};

// Validate OTP
export const validateOTP = (otp) => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

// Generate dummy messages for pagination
export const generateDummyMessages = (count = 20, chatroomId, startIndex = 0) => {
  const messages = [];
  const sampleTexts = [
    "Hello there! How are you doing today?",
    "I've been working on this project and would love your feedback.",
    "What do you think about the latest updates?",
    "Can you help me understand this concept better?",
    "That's a great point! I hadn't thought of it that way.",
    "Let me share some insights on this topic.",
    "I'm excited about the possibilities this opens up.",
    "Thanks for the detailed explanation!",
    "This is really helpful information.",
    "I agree with your assessment completely.",
  ];

  for (let i = 0; i < count; i++) {
    const isUser = Math.random() > 0.5;
    const timestamp = Date.now() - (count - i) * 60000 - startIndex * 60000; // Messages from past
    
    messages.push({
      id: generateId(),
      content: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
      type: isUser ? 'user' : 'ai',
      timestamp,
      chatroomId,
      status: 'sent',
    });
  }

  return messages;
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Validate image file
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Please upload images smaller than 5MB.' };
  }

  return { valid: true };
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
