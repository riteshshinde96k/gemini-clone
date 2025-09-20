// Local storage utilities
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_USER: 'gemini_auth_user',
  CHATROOMS: 'gemini_chatrooms',
  MESSAGES: 'gemini_messages',
  DARK_MODE: 'gemini_dark_mode',
  SIDEBAR_OPEN: 'gemini_sidebar_open',
};
