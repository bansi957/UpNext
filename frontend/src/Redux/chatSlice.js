import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    pendingChats: [],
    activeChat: null,
    completedChats:[],
    messages: [],
    loading: false,
    error: null
  },
  reducers: {
    setPendingChats(state, action) {
      state.pendingChats = action.payload;
    },
    setCompletedChats(state, action) {
      state.completedChats = action.payload;
    },
    setActiveChat(state, action) {
      state.activeChat = action.payload;
    },

    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
    markMessagesAsRead(state, action) {
      // Mark all unread messages as read in the pendingChats for a specific chat
      const chatId = action.payload;
      const chat = state.pendingChats.find(c => c._id === chatId);
      if (chat && chat.messages && Array.isArray(chat.messages)) {
        chat.messages.forEach(msg => {
          msg.isRead = true;
        });
      }
    }
  }
});

export const {
  setChats,
  setActiveChat,
  setMessages,
  addMessage,
  setLoading,
  setError,
  clearMessages,
  setPendingChats,
  setCompletedChats,
  markMessagesAsRead
} = chatSlice.actions;

export default chatSlice.reducer;
