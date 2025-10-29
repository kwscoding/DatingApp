const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const router = express.Router();

// 회원가입
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, nickname, age, gender, studentId } = req.body;
    
    // 필수 필드 검증
    if (!email || !password || !nickname || !age || !gender || !studentId) {
      return res.status(400).json({ error: '모든 필수 정보를 입력해주세요' });
    }
    
    // 사용자 생성
    const user = await User.create({
      email,
      password,
      nickname,
      age,
      gender,
      studentId
    });
    
    // JWT 토큰 생성
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: '회원가입 성공',
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

// 로그인
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // 사용자 조회
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다' });
    }
    
    // 비밀번호 검증
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다' });
    }
    
    // JWT 토큰 생성
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
