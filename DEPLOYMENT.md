# 🚀 JejuMatch 배포 가이드

간단하게 무료로 배포하는 방법을 안내합니다.

## 📋 필요한 것
- GitHub 계정
- 이메일 주소 (각 서비스 가입용)

## 🗄️ 1단계: MongoDB Atlas 설정 (무료 데이터베이스)

### 1.1 회원가입 및 클러스터 생성
1. https://www.mongodb.com/cloud/atlas/register 접속
2. 무료 계정 생성
3. "Build a Database" 클릭
4. **FREE (M0)** 선택
5. Provider: **AWS**, Region: **Seoul (ap-northeast-2)** 선택
6. Cluster Name: `jejumatch` (또는 원하는 이름)
7. "Create" 클릭

### 1.2 데이터베이스 사용자 생성
1. Security → Database Access
2. "Add New Database User" 클릭
3. Authentication Method: **Password**
4. Username: `jejumatch-user` (또는 원하는 이름)
5. Password: 자동 생성 또는 직접 입력 (복사 필수!)
6. Database User Privileges: **Read and write to any database**
7. "Add User" 클릭

### 1.3 네트워크 접근 허용
1. Security → Network Access
2. "Add IP Address" 클릭
3. "Allow Access from Anywhere" 클릭 (0.0.0.0/0)
4. "Confirm" 클릭

### 1.4 연결 문자열 복사
1. Database → Connect 클릭
2. "Connect your application" 선택
3. Driver: **Node.js**, Version: **4.1 or later**
4. 연결 문자열 복사:
```
mongodb+srv://jejumatch-user:<password>@jejumatch.xxxxx.mongodb.net/jejumatch?retryWrites=true&w=majority
```
5. `<password>`를 실제 비밀번호로 변경
6. 어딘가에 저장해두기 (나중에 필요)

---

## 🔧 2단계: Render에 백엔드 배포

### 2.1 Render 가입
1. https://render.com 접속
2. "Get Started for Free" 클릭
3. GitHub 계정으로 가입

### 2.2 Web Service 생성
1. Dashboard → "New +" → "Web Service"
2. "Connect a repository" → GitHub 저장소 연결
3. Repository: **DatingApp** 선택
4. 설정:
   - **Name**: `jejumatch-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

### 2.3 환경 변수 설정
"Environment" 탭에서 다음 변수들 추가:

```
NODE_ENV = production
PORT = 10000
MONGODB_URI = mongodb+srv://jejumatch-user:비밀번호@jejumatch.xxxxx.mongodb.net/jejumatch?retryWrites=true&w=majority
JWT_SECRET = your-super-secret-key-change-this-12345
CLIENT_URL = https://your-app.vercel.app
```

**중요:** 
- `MONGODB_URI`는 1.4단계에서 복사한 것
- `CLIENT_URL`은 3단계 완료 후 업데이트

4. "Save Changes" 클릭
5. 자동으로 배포 시작 (약 5분 소요)
6. 배포 완료 후 URL 복사 (예: `https://jejumatch-api.onrender.com`)

---

## 🎨 3단계: Vercel에 프론트엔드 배포

### 3.1 Vercel 가입
1. https://vercel.com/signup 접속
2. GitHub 계정으로 가입

### 3.2 프로젝트 임포트
1. "Add New..." → "Project"
2. GitHub 저장소 **DatingApp** 선택
3. "Import" 클릭

### 3.3 프로젝트 설정
- **Framework Preset**: `Create React App`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 3.4 환경 변수 설정
"Environment Variables" 섹션에 추가:

```
REACT_APP_API_URL = https://jejumatch-api.onrender.com/api
REACT_APP_SOCKET_URL = https://jejumatch-api.onrender.com
```

**중요:** 2.3단계에서 복사한 Render URL 사용

4. "Deploy" 클릭
5. 배포 완료 (약 2분)
6. 배포된 URL 복사 (예: `https://jejumatch.vercel.app`)

### 3.5 Render 환경 변수 업데이트
1. Render Dashboard → jejumatch-api → Environment
2. `CLIENT_URL` 값을 Vercel URL로 변경:
```
CLIENT_URL = https://jejumatch.vercel.app
```
3. "Save Changes" → 자동 재배포

---

## ✅ 4단계: 배포 확인

### 4.1 백엔드 테스트
브라우저에서 접속:
```
https://jejumatch-api.onrender.com/health
```

응답:
```json
{"status":"OK","message":"Server is running"}
```

### 4.2 프론트엔드 테스트
브라우저에서 접속:
```
https://jejumatch.vercel.app
```

회원가입 페이지가 보이면 성공!

### 4.3 회원가입 테스트
1. 회원가입 페이지에서 정보 입력
2. 회원가입 버튼 클릭
3. 로그인 성공하면 완료!

---

## 🎯 배포 완료!

이제 다른 사람들과 URL을 공유하면 됩니다:
```
https://jejumatch.vercel.app
```

---

## 🔄 코드 업데이트하기

로컬에서 코드를 수정한 후:

```bash
git add .
git commit -m "수정 내용"
git push
```

- **Vercel**: 자동으로 재배포 (약 2분)
- **Render**: 자동으로 재배포 (약 5분)

---

## ⚠️ 주의사항

### 무료 티어 제한
- **Render**: 15분 동안 요청이 없으면 슬립 모드 (첫 요청 시 30초 소요)
- **MongoDB Atlas**: 512MB 저장 공간
- **Vercel**: 무제한 배포, 대역폭 제한 있음

### 성능 개선
무료 티어가 느리다면:
- Render 유료 플랜: $7/월 (항상 켜져있음)
- MongoDB Atlas M10: $10/월 (더 빠름)

---

## 🆘 문제 해결

### 백엔드가 500 에러
1. Render Dashboard → Logs 확인
2. MongoDB URI가 정확한지 확인
3. 환경 변수가 모두 설정되었는지 확인

### 프론트엔드에서 API 연결 안 됨
1. CORS 오류: Render의 CLIENT_URL 확인
2. API URL이 올바른지 확인
3. 백엔드가 정상 작동하는지 확인

### MongoDB 연결 실패
1. IP 주소가 0.0.0.0/0으로 설정되었는지 확인
2. 데이터베이스 사용자 비밀번호 확인
3. 연결 문자열의 비밀번호가 URL 인코딩되었는지 확인

---

## 📞 도움이 필요하면

- Render 문서: https://render.com/docs
- Vercel 문서: https://vercel.com/docs
- MongoDB Atlas 문서: https://docs.atlas.mongodb.com
