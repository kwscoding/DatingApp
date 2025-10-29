import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messagesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './ChatRoomPage.css';

const ChatRoomPage = () => {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    fetchMessages();
  }, [matchId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchMessages = async () => {
    try {
      const res = await messagesAPI.getMessages(matchId);
      setMessages(res.data.messages);
    } catch (error) {
      alert('메시지를 불러올 수 없습니다');
      navigate('/matches');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    try {
      const res = await messagesAPI.sendMessage(matchId, inputText);
      setMessages([...messages, res.data.message]);
      setInputText('');
    } catch (error) {
      alert('메시지 전송 실패');
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }
  
  return (
    <div className="chat-room">
      <div className="chat-header">
        <button onClick={() => navigate('/matches')}>← 뒤로</button>
        <h3>채팅방</h3>
        <div></div>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>아직 대화가 없습니다.</p>
            <p>첫 메시지를 보내보세요! 👋</p>
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg._id}
              className={msg.sender._id === user.id ? 'my-message' : 'other-message'}
            >
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="timestamp">
                  {new Date(msg.createdAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

export default ChatRoomPage;
