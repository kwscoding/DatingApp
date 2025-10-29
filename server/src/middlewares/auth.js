const { verifyToken } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '인증 토큰이 필요합니다' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 토큰 검증
    const decoded = verifyToken(token);
    
    // req.user에 사용자 정보 저장
    req.user = { id: decoded.userId };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다' });
  }
};

module.exports = authMiddleware;
