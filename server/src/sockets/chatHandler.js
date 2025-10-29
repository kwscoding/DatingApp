const Message = require('../models/Message');
const Match = require('../models/Match');
const { verifyToken } = require('../config/jwt');

// Socket.io 채팅 핸들러
const chatHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ 사용자 연결:', socket.id);
    
    // 인증
    socket.on('authenticate', async (token) => {
      try {
        const decoded = verifyToken(token);
        socket.userId = decoded.userId;
        console.log(`✅ 사용자 인증: ${socket.userId}`);
      } catch (error) {
        socket.emit('error', '인증 실패');
        socket.disconnect();
      }
    });
    
    // 채팅방 참가
    socket.on('join-match', async (matchId) => {
      try {
        // 매칭 검증
        const match = await Match.findOne({
          _id: matchId,
          $or: [{ user1: socket.userId }, { user2: socket.userId }]
        });
        
        if (!match) {
          return socket.emit('error', '접근 권한 없음');
        }
        
        socket.join(matchId);
        console.log(`✅ ${socket.userId}가 ${matchId} 방에 입장`);
      } catch (error) {
        socket.emit('error', '채팅방 참가 실패');
      }
    });
    
    // 메시지 전송
    socket.on('send-message', async (data) => {
      try {
        const { matchId, text } = data;
        
        // 매칭 검증
        const match = await Match.findOne({
          _id: matchId,
          $or: [{ user1: socket.userId }, { user2: socket.userId }]
        });
        
        if (!match) {
          return socket.emit('error', '접근 권한 없음');
        }
        
        // 수신자 확인
        const receiverId = match.user1.equals(socket.userId) 
          ? match.user2 
          : match.user1;
        
        // 메시지 저장
        const message = await Message.create({
          matchId,
          sender: socket.userId,
          receiver: receiverId,
          text
        });
        
        await message.populate('sender', 'nickname profileImage');
        
        // 같은 채팅방의 모든 클라이언트에게 전송
        io.to(matchId).emit('new-message', message);
        
      } catch (error) {
        socket.emit('error', '메시지 전송 실패');
      }
    });
    
    // 연결 해제
    socket.on('disconnect', () => {
      console.log('❌ 사용자 연결 해제:', socket.id);
    });
  });
};

module.exports = chatHandler;
