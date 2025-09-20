// API endpoints
export const API_ENDPOINTS = {
  COUNTRIES: 'https://restcountries.com/v3.1/all?fields=name,idd,flag',
};

// Message types
export const MESSAGE_TYPES = {
  USER: 'user',
  AI: 'ai',
  SYSTEM: 'system',
};

// Message status
export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  FAILED: 'failed',
};

// Pagination
export const MESSAGES_PER_PAGE = 20;

// Typing delay
export const TYPING_DELAY = 1000;
export const AI_RESPONSE_DELAY = 2000;

// Throttle delays
export const SEARCH_DEBOUNCE_DELAY = 300;
export const AI_THROTTLE_DELAY = 3000;

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Sample AI responses
export const AI_RESPONSES = [
  "That's an interesting question! Let me think about that...",
  "I understand what you're asking. Here's my perspective on that topic...",
  "Great point! I'd be happy to help you with that.",
  "That's a thoughtful question. Let me provide you with some insights...",
  "I see what you mean. Here's how I would approach this...",
  "Thanks for sharing that with me. I think we can explore this further...",
  "That's a fascinating topic! There are several ways to look at this...",
  "I appreciate you bringing this up. Let me share some thoughts...",
  "Good question! This is something I've been thinking about too...",
  "I'm glad you asked about this. Here's what I think...",
];

// Sample chatroom names
export const SAMPLE_CHATROOM_NAMES = [
  "General Discussion",
  "Project Planning",
  "Creative Ideas",
  "Tech Talk",
  "Random Thoughts",
  "Daily Standup",
  "Brainstorming",
  "Quick Questions",
  "Deep Dive",
  "Casual Chat",
];
