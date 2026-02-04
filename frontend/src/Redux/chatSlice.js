import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    activeChat: null,
    messages: [],
    loading: false,
    error: null
  },
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
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
  clearMessages
} = chatSlice.actions;

export default chatSlice.reducer;
