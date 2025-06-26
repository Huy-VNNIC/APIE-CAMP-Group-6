import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

let socket = null;

// Initialize the socket connection
export const initializeSocket = (token, userData) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(API_URL, {
    auth: {
      token
    },
    withCredentials: true,
    transports: ['websocket', 'polling']
  });

  // Handle connection events
  socket.on('connect', () => {
    console.log('Socket connected');
    // Authenticate user
    socket.emit('authenticate', userData);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });

  return socket;
};

// Get the socket instance
export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
};

// Disconnect the socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
