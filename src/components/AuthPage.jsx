import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../services/userService';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = isLogin
        ? await login(credentials.username, credentials.password)
        : await signup(credentials.username, credentials.password);
      alert(response);
      if (isLogin) navigate('/mypage'); // 로그인 성공 시 마이페이지 이동
    } catch (error) {
      alert(error.response?.data || '에러가 발생했습니다.');
    }
  };

  return (
    <div>
      <button onClick={() => setIsLogin(true)}>로그인</button>
      <button onClick={() => setIsLogin(false)}>회원가입</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleInputChange}
          placeholder="아이디"
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          placeholder="비밀번호"
        />
        <button type="submit">{isLogin ? '로그인' : '회원가입'}</button>
      </form>
    </div>
  );
};

export default AuthPage;

