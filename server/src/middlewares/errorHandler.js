const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Mongoose 유효성 검사 에러
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  // Mongoose 중복 키 에러
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ error: `${field}이(가) 이미 존재합니다` });
  }
  
  // JWT 에러
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다' });
  }
  
  // Multer 에러
  if (err.message && err.message.includes('이미지')) {
    return res.status(400).json({ error: err.message });
  }
  
  // 기타 에러
  res.status(500).json({ error: '서버 오류가 발생했습니다' });
};

module.exports = errorHandler;
