import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const { token } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    if (!token) return;
    
    // Socket 연결
    socketRef.current = io(SOCKET_URL);
    
    socketRef.current.on('connect', () => {
      console.log('✅ Socket 연결됨');
      setConnected(true);
      
      // 인증
      socketRef.current.emit('authenticate', token);
    });
    
    socketRef.current.on('disconnect', () => {
      console.log('❌ Socket 연결 해제');
      setConnected(false);
    });
    
    socketRef.current.on('error', (error) => {
      console.error('Socket 에러:', error);
    });
    
    // 클린업
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token]);
  
  const joinMatch = (matchId) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('join-match', matchId);
    }
  };
  
  const sendMessage = (matchId, text) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('send-message', { matchId, text });
    }
  };
  
  const onNewMessage = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('new-message', callback);
    }
  };
  
  return {
    connected,
    joinMatch,
    sendMessage,
    onNewMessage
  };
};
