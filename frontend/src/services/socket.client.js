import { io } from 'socket.io-client';
import { API_URL } from './api'; // Use the same base URL as standard API requests

// Determine socket URL based on API_URL
// API_URL is usually '/api', so the socket server is simply '/'
const socketUrl = API_URL.replace('/api', '') || window.location.origin;

export const socket = io(socketUrl, {
  autoConnect: false, // We'll connect manually when the user logs in
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
