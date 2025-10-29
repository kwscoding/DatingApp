const Match = require('../models/Match');
const User = require('../models/User');

// 매칭 생성 (중복 방지)
const createMatch = async (user1Id, user2Id) => {
  // 정렬하여 중복 방지
  const [userId1, userId2] = [user1Id, user2Id].sort();
  
  // 이미 매칭 존재 확인
  const existingMatch = await Match.findOne({
    $or: [
      { user1: userId1, user2: userId2 },
      { user1: userId2, user2: userId1 }
    ]
  });
  
  if (existingMatch) {
    return existingMatch;
  }
  
  // 새 매칭 생성
  const match = await Match.create({
    user1: userId1,
    user2: userId2
  });
  
  return match;
};

// 상호 좋아요 체크
const checkMutualLike = async (currentUserId, targetUserId) => {
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);
  
  // 현재 사용자가 상대방을 좋아요
  const currentLikesTarget = currentUser.likedUsers.includes(targetUserId);
  
  // 상대방도 나를 좋아요
  const targetLikesCurrent = targetUser.likedUsers.includes(currentUserId);
  
  return currentLikesTarget && targetLikesCurrent;
};

module.exports = {
  createMatch,
  checkMutualLike
};
