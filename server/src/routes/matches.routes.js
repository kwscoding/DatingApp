const express = require('express');
const Match = require('../models/Match');
const Message = require('../models/Message');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

// 매칭 목록 조회
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 내가 포함된 모든 매칭 조회
    const matches = await Match.find({
      $or: [{ user1: userId }, { user2: userId }]
    }).sort({ createdAt: -1 });
    
    // 각 매칭의 상대방 정보 및 메시지 정보 가져오기
    const result = await Promise.all(matches.map(async (match) => {
      // 상대방 ID 찾기
      const matchedUserId = match.user1.equals(userId) 
        ? match.user2 
        : match.user1;
      
      // 상대방 정보 조회
      const matchedUser = await User.findById(matchedUserId)
        .select('nickname profileImage age college aiScore');
      
      // 마지막 메시지 조회
      const lastMessage = await Message.findOne({ matchId: match._id })
        .sort({ createdAt: -1 });
      
      // 안읽은 메시지 수
      const unreadCount = await Message.countDocuments({
        matchId: match._id,
        receiver: userId,
        isRead: false
      });
      
      return {
        matchId: match._id,
        matchedUser,
        lastMessage: lastMessage ? {
          text: lastMessage.text,
          timestamp: lastMessage.createdAt
        } : null,
        unreadCount,
        createdAt: match.createdAt
      };
    }));
    
    res.json({ success: true, matches: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
