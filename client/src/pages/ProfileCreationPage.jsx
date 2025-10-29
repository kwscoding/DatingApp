import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { profileAPI } from '../services/api';
import { MBTI_OPTIONS, REGION_OPTIONS, COLLEGE_OPTIONS } from '../utils/constants';
import './ProfileCreationPage.css';

const ProfileCreationPage = () => {
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    nickname: '',
    college: '',
    major: '',
    mbti: '',
    region: ''
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || '',
        college: user.college || '',
        major: user.major || '',
        mbti: user.mbti || '',
        region: user.region || ''
      });
      
      if (user.profileImage) {
        const API_BASE = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
        setPhotoPreview(`${API_BASE}${user.profileImage}`);
      }
    }
  }, [user]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // 프로필 정보 업데이트
      await profileAPI.updateMe(formData);
      
      // 사진 업로드
      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append('photo', photoFile);
        await profileAPI.uploadPhoto(photoFormData);
      }
      
      setMessage('프로필이 저장되었습니다!');
      await loadUser();
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setMessage('저장 실패: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-creation-page">
      <div className="profile-container">
        <h1>내 프로필 {user?.profileImage ? '수정' : '작성'}</h1>
        
        <form onSubmit={handleSubmit}>
          {message && (
            <div className={message.includes('실패') ? 'error-message' : 'success-message'}>
              {message}
            </div>
          )}
          
          <div className="photo-section">
            <label className="photo-label">
              프로필 사진
              <div className="photo-preview">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" />
                ) : (
                  <div className="photo-placeholder">+</div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{display: 'none'}}
              />
            </label>
          </div>
          
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
          
          <select
            name="college"
            value={formData.college}
            onChange={handleChange}
          >
            <option value="">단과대 선택 (선택사항)</option>
            {COLLEGE_OPTIONS.map(college => (
              <option key={college} value={college}>{college}</option>
            ))}
          </select>
          
          <input
            type="text"
            name="major"
            placeholder="학과 (선택사항)"
            value={formData.major}
            onChange={handleChange}
          />
          
          <select
            name="mbti"
            value={formData.mbti}
            onChange={handleChange}
          >
            <option value="">MBTI 선택 (선택사항)</option>
            {MBTI_OPTIONS.map(mbti => (
              <option key={mbti} value={mbti}>{mbti}</option>
            ))}
          </select>
          
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
          >
            <option value="">거주 지역 (선택사항)</option>
            {REGION_OPTIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          
          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? '저장 중...' : '저장하기'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="cancel-btn">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreationPage;
