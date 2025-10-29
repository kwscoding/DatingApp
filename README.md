# JejuMatch - 제주대학교 학생 데이팅 앱

제주대학교 학생들을 위한 매칭 기반 데이팅 웹 애플리케이션입니다.

## 🎯 주요 기능

- 🔐 JWT 기반 사용자 인증 (회원가입/로그인)
- 👤 프로필 생성 및 관리 (사진 업로드)
- 👥 사용자 탐색 및 필터링
- 💕 좋아요 시스템 (양방향 매칭)
- 💬 실시간 채팅 (Socket.io)
- 🤖 AI 기반 프로필 사진 평가 (선택사항)

## 🛠️ 기술 스택

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Socket.io (실시간 통신)
- Multer (파일 업로드)
- bcrypt (비밀번호 암호화)

### Frontend
- React.js
- React Router
- Context API (상태 관리)
- Axios (HTTP 클라이언트)
- Socket.io-client

## 📋 사전 요구사항

- Node.js 18.x 이상
- MongoDB 8.0 이상
- npm 또는 yarn

## 🚀 설치 및 실행

### 1. 저장소 클론
\`\`\`bash
git clone https://github.com/kwscoding/DatingApp.git
cd DatingApp
\`\`\`

### 2. MongoDB 시작
\`\`\`bash
# Ubuntu/WSL2
sudo mongod --fork --logpath /var/log/mongodb/mongod.log --dbpath /var/lib/mongodb

# macOS (Homebrew)
brew services start mongodb-community
\`\`\`

### 3. 백엔드 설정 및 실행
\`\`\`bash
cd server
npm install
npm run dev
\`\`\`

### 4. 프론트엔드 설정 및 실행
\`\`\`bash
cd client
npm install
npm start
\`\`\`

### 5. 접속
브라우저에서 \`http://localhost:3000\` 접속

## 🔑 환경 변수

### server/.env
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jejumatch
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
\`\`\`

### client/.env
\`\`\`env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
\`\`\`

## 📝 라이선스

MIT License

## 👨‍💻 개발자

- GitHub: [@kwscoding](https://github.com/kwscoding)
