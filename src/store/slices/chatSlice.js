import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatrooms: [],
  currentChatroom: null,
  messages: {},
  isTyping: false,
  searchQuery: '',
  messageLoading: false,
  hasMoreMessages: {},
  messagePages: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatrooms: (state, action) => {
      state.chatrooms = action.payload;
    },
    addChatroom: (state, action) => {
      state.chatrooms.unshift(action.payload);
      state.messages[action.payload.id] = [];
      state.hasMoreMessages[action.payload.id] = false;
      state.messagePages[action.payload.id] = 1;
    },
    deleteChatroom: (state, action) => {
      state.chatrooms = state.chatrooms.filter(room => room.id !== action.payload);
      delete state.messages[action.payload];
      delete state.hasMoreMessages[action.payload];
      delete state.messagePages[action.payload];
      if (state.currentChatroom?.id === action.payload) {
        state.currentChatroom = null;
      }
    },
    setCurrentChatroom: (state, action) => {
      state.currentChatroom = action.payload;
      if (action.payload && !state.messages[action.payload.id]) {
        state.messages[action.payload.id] = [];
        state.hasMoreMessages[action.payload.id] = true;
        state.messagePages[action.payload.id] = 1;
      }
    },
    addMessage: (state, action) => {
      const { chatroomId, message } = action.payload;
      if (!state.messages[chatroomId]) {
        state.messages[chatroomId] = [];
      }
      state.messages[chatroomId].push(message);
      
      // Update chatroom's last message and timestamp
      const chatroom = state.chatrooms.find(room => room.id === chatroomId);
      if (chatroom) {
        chatroom.lastMessage = message.content;
        chatroom.lastMessageTime = message.timestamp;
        chatroom.updatedAt = message.timestamp;
      }
    },
    loadMoreMessages: (state, action) => {
      const { chatroomId, messages, hasMore } = action.payload;
      if (state.messages[chatroomId]) {
        state.messages[chatroomId] = [...messages, ...state.messages[chatroomId]];
      } else {
        state.messages[chatroomId] = messages;
      }
      state.hasMoreMessages[chatroomId] = hasMore;
      state.messagePages[chatroomId] = (state.messagePages[chatroomId] || 1) + 1;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setMessageLoading: (state, action) => {
      state.messageLoading = action.payload;
    },
    updateMessage: (state, action) => {
      const { chatroomId, messageId, updates } = action.payload;
      if (state.messages[chatroomId]) {
        const messageIndex = state.messages[chatroomId].findIndex(msg => msg.id === messageId);
        if (messageIndex !== -1) {
          state.messages[chatroomId][messageIndex] = {
            ...state.messages[chatroomId][messageIndex],
            ...updates
          };
        }
      }
    },
    clearMessages: (state, action) => {
      const chatroomId = action.payload;
      if (state.messages[chatroomId]) {
        state.messages[chatroomId] = [];
      }
    },
  },
});

export const {
  setChatrooms,
  addChatroom,
  deleteChatroom,
  setCurrentChatroom,
  addMessage,
  loadMoreMessages,
  setTyping,
  setSearchQuery,
  setMessageLoading,
  updateMessage,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
