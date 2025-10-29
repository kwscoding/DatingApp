// ===== AI 평가 서비스 =====
// 개발 초기: 랜덤 점수 생성
// 실제 배포: OpenAI Vision API 연동

// 랜덤 점수 생성 (개발용)
const generateRandomScore = () => {
  return Math.floor(Math.random() * 36) + 60; // 60~95점
};

// OpenAI Vision API 평가 (실제 구현)
const evaluateWithAI = async (imageUrl) => {
  // TODO: OpenAI API 연동
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4-vision-preview",
  //   messages: [{
  //     role: "user",
  //     content: [
  //       { type: "text", text: "이 프로필 사진의 품질을 1-100점으로 평가해주세요." },
  //       { type: "image_url", image_url: { url: imageUrl }}
  //     ]
  //   }]
  // });
  // return extractScore(response);
  
  // 개발 단계에서는 랜덤 점수 사용
  return generateRandomScore();
};

module.exports = {
  generateRandomScore,
  evaluateWithAI
};
