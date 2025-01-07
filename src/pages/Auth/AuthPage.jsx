import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../../services/userService'; // userService에서 로그인, 회원가입 함수 가져오기
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // 입력 값 검증
    if (!formData.id || !formData.password) {
      setErrorMessage('아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    setLoading(true); // 요청 시작

    try {
      let response;
      if (isLogin) {
        // 로그인 API 호출
        response = await login(formData.id, formData.password);
      } else {
        // 회원가입 API 호출
        response = await signup(formData.id, formData.password);
      }

      alert(response.message); // 성공 메시지 출력
      if (isLogin) {
        // 로그인 성공 시 홈페이지로 이동
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || '에러가 발생했습니다.');
    } finally {
      setLoading(false); // 요청 종료
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-toggle">
        <button onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>
          로그인
        </button>
        <button onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>
          회원가입
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? '로그인' : '회원가입'}</h2>

        <div>
          <label htmlFor="id">아이디</label>
          <input
            type="text"
            name="id"
            id="id"
            placeholder="아이디"
            value={formData.id}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
