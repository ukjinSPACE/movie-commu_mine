import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../../services/userService';
import './AuthPage.css';
import '../../styles/dark-theme.css'; // 공통 스타일

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' 또는 'signup'
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    phone: '',
    birth: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [passwordMatch, setPasswordMatch] = useState(true); // 비밀번호 일치 여부
  const [passwordConfirmEmpty, setPasswordConfirmEmpty] = useState(false); // 비밀번호 확인 비어있는지 체크
  const navigate = useNavigate();

  useEffect(() => {
    // 탭 변경 시 formData 초기화
    setFormData({
      id: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      phone: '',
      birth: '',
    });

    // 로그인 상태 체크 (예시: 로컬 스토리지에서 로그인 여부 확인)
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true); // 토큰이 있다면 로그인 상태로 설정
    }

    if (activeTab === 'login') {
      setPasswordMatch(true);  // 로그인 탭일 때는 비밀번호 확인 체크를 하지 않음
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // 비밀번호와 비밀번호 확인이 일치하는지 실시간으로 체크
    if (e.target.name === 'password' || e.target.name === 'passwordConfirm') {
      setPasswordMatch(formData.password === formData.passwordConfirm);
      setPasswordConfirmEmpty(formData.passwordConfirm === '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (activeTab === 'login') {
      // 로그인 로직
      if (!formData.id.trim() || !formData.password.trim()) {
        setErrorMessage('아이디와 비밀번호를 입력해 주세요.');
        return;
      }

      setLoading(true);
      try {
        await login(formData.id, formData.password);
        localStorage.setItem('authToken', 'your-token-here'); // 로그인 성공 후 토큰 저장
        setIsLoggedIn(true); // 로그인 상태로 변경
        alert('로그인 성공!');
        navigate('/');
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || '로그인 중 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    } else {
      // 회원가입 로직
      if (
        !formData.id.trim() ||
        !formData.password.trim() ||
        !formData.nickname.trim() ||
        !formData.phone.trim() ||
        !formData.birth.trim()
      ) {
        setErrorMessage('모든 필드를 입력해 주세요.');
        return;
      }

      if (!passwordMatch || passwordConfirmEmpty) {
        setErrorMessage('비밀번호가 일치하지 않거나, 비밀번호 재확인이 필요합니다.');
        return;
      }

      setLoading(true);
      try {
        const userDto = {
          id: formData.id,
          password: formData.password,
          role: 'ROLE_USER',
          nickname: formData.nickname,
          phone: formData.phone,
          birth: formData.birth,
        };

        await signup(userDto);
        alert('회원가입 성공!');
        //navigate('/');
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page-container">
      {/* 탭 헤더 */}
      <div className="auth-tabs">
        <button
          className={activeTab === 'login' ? 'active' : ''}
          onClick={() => setActiveTab('login')}
        >
          로그인
        </button>
        <button
          className={activeTab === 'signup' ? 'active' : ''}
          onClick={() => setActiveTab('signup')}
        >
          회원가입
        </button>
      </div>

      {/* 로그인 상태 표시 */}
      {isLoggedIn ? (
        <div>
          <h2>이미 로그인됨</h2>
          <button
            onClick={() => {
              localStorage.removeItem('authToken'); // 로그인 상태 로그아웃 처리
              setIsLoggedIn(false); // 로그아웃 후 상태 변경
            }}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {activeTab === 'login' ? (
            <>
              <h2>로그인</h2>
              <div>
                <label htmlFor="id">아이디</label>
                <input
                  type="text"
                  name="id"
                  id="id"
                  placeholder="아이디"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <>
              <h2>회원가입</h2>
              <div>
                <label htmlFor="id">아이디</label>
                <input
                  type="text"
                  name="id"
                  id="id"
                  placeholder="아이디"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="passwordConfirm">비밀번호 확인</label>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  placeholder="비밀번호 확인"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {/* 비밀번호 확인란이 비어있을 때 메시지 표시 */}
                {passwordConfirmEmpty && (
                  <p style={{ color: 'orange' }}>비밀번호 재확인이 필요합니다</p>
                )}
                {/* 비밀번호 일치 여부 표시, 비밀번호 확인란이 비어있지 않으면 표시 */}
                {!passwordConfirmEmpty && (
                  <p
                    style={{
                      color: passwordMatch ? 'green' : 'red',
                    }}
                  >
                    {passwordMatch ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="nickname">닉네임</label>
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  placeholder="닉네임"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="phone">휴대폰번호</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="휴대폰번호"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="birth">생년월일</label>
                <input
                  type="date"
                  name="birth"
                  id="birth"
                  value={formData.birth}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </>
          )}

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button
            type="submit"
            disabled={loading || !formData.id.trim() || !formData.password.trim()}
          >
            {loading ? '처리 중...' : activeTab === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>
      )}

      <div className="home-button-container">
        <button
          className="home-button"
          onClick={() => navigate('/')}
          disabled={loading}
        >
          홈으로
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
