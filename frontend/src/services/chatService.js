import axios from 'axios';
import { serverUrl } from '../App';

const API_BASE = `${serverUrl}/api/chats`;

const chatService = {
  // Fetch all active chats
  getActiveChats: async () => {
    try {
      const res = await axios.get(`${API_BASE}/active`, {
        withCredentials: true
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching active chats:', error);
      throw error;
    }
  },

  // Fetch messages for a specific chat
  getMessages: async (chatId) => {
    try {
      const res = await axios.get(`${API_BASE}/${chatId}/messages`, {
        withCredentials: true
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a message
  sendMessage: async (chatId, messageData) => {
    try {
      const res = await axios.post(
        `${API_BASE}/${chatId}/messages`,
        messageData,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Mark messages as read
  markAsRead: async (chatId) => {
    try {
      const res = await axios.put(
        `${API_BASE}/${chatId}/read`,
        {},
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  },

  // Delete a chat
  deleteChat: async (chatId) => {
    try {
      await axios.delete(`${API_BASE}/${chatId}`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }
};

export default chatService;
