const express = require('express');
const Match = require('../models/Match');
const Message = require('../models/Message');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

// 특정 매칭의 메시지 목록 조회
router.get('/:matchId', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const matchId = req.params.matchId;
    
    // 매칭 검증 (내가 속한 매칭인지)
    const match = await Match.findOne({
      _id: matchId,
      $or: [{ user1: userId }, { user2: userId }]
    });
    
    if (!match) {
      return res.status(403).json({ error: '접근 권한이 없습니다' });
    }
    
    // 메시지 조회
    const messages = await Message.find({ matchId })
      .populate('sender', 'nickname profileImage')
      .sort({ createdAt: 1 });
    
    // 내가 받은 메시지를 읽음 처리
    await Message.updateMany(
      {
        matchId,
        receiver: userId,
        isRead: false
      },
      { isRead: true }
    );
    
    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
});

// 메시지 전송 (REST API - Socket.io 대안)
router.post('/:matchId', authMiddleware, async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const matchId = req.params.matchId;
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: '메시지 내용을 입력해주세요' });
    }
    
    // 매칭 검증
    const match = await Match.findOne({
      _id: matchId,
      $or: [{ user1: senderId }, { user2: senderId }]
    });
    
    if (!match) {
      return res.status(403).json({ error: '접근 권한이 없습니다' });
    }
    
    // 수신자 확인
    const receiverId = match.user1.equals(senderId) 
      ? match.user2 
      : match.user1;
    
    // 메시지 생성
    const message = await Message.create({
      matchId,
      sender: senderId,
      receiver: receiverId,
      text: text.trim()
    });
    
    await message.populate('sender', 'nickname profileImage');
    
    res.json({ success: true, message });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
