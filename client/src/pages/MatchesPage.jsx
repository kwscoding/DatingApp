import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchesAPI } from '../services/api';
import './MatchesPage.css';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchMatches();
  }, []);
  
  const fetchMatches = async () => {
    try {
      const res = await matchesAPI.getMatches();
      setMatches(res.data.matches);
    } catch (error) {
      console.error('매칭 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }
  
  const API_BASE = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
  
  return (
    <div className="matches-page">
      <header className="matches-header">
        <button onClick={() => navigate('/')} className="back-btn">← 뒤로</button>
        <h1>매칭 목록</h1>
        <div></div>
      </header>
      
      <div className="matches-list">
        {matches.length === 0 ? (
          <div className="no-matches">
            <p>아직 매칭된 사용자가 없습니다.</p>
            <button onClick={() => navigate('/')}>사용자 탐색하기</button>
          </div>
        ) : (
          matches.map(match => (
            <div 
              key={match.matchId}
              className="match-item"
              onClick={() => navigate(`/chat/${match.matchId}`)}
            >
              <img 
                src={match.matchedUser.profileImage ? `${API_BASE}${match.matchedUser.profileImage}` : '/default-avatar.png'}
                alt={match.matchedUser.nickname}
                onError={(e) => e.target.src = '/default-avatar.png'}
              />
              <div className="match-info">
                <h3>{match.matchedUser.nickname}</h3>
                <p className="last-message">
                  {match.lastMessage 
                    ? match.lastMessage.text 
                    : '아직 대화가 없습니다.'}
                </p>
              </div>
              {match.unreadCount > 0 && (
                <span className="unread-badge">{match.unreadCount}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
