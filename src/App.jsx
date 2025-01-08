import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/Auth/AuthPage';
import HomePage from './pages/HomePage';
import MyPage from './pages/my/MyPage';
import AdminPage from './pages/AdminPage';
import BoardPage from './pages/Board/BoardPage';
import BoardDetail from './pages/Board/BoardDetail';
import ReviewPage from './pages/ReviewPage';
import ReviewDetail from './pages/ReviewDetail';
import BoardWrite from './pages/Board/BoardWrite';
import BoardModify from './pages/Board/BoardModify';

const App = () => {
  // 로그인 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* 기본 페이지 */}
        <Route path="/" element={<HomePage />} />

        {/* 회원가입/로그인 */}
        <Route path="/auth" element={<AuthPage setIsAuthenticated={setIsAuthenticated} />} />


        {/* 자유 게시판 */}
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/:postId" element={<BoardDetail />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/:postId/modify" element={<BoardModify />} />

        {/* 리뷰 페이지 */}
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/review/:movieId" element={<ReviewDetail />} />

        {/* 마이 페이지 */}
        <Route path="/mypage" element={<MyPage />} />

        {/* 어드민 페이지 */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // 로그인하지 않은 경우 로그인 페이지로 리디렉션
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default App;