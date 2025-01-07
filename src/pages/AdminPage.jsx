import React, { useState, useEffect } from 'react';
import { getUserManageInfo, createAdminAccount } from '../services/adminService';
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('userManage'); // 초기 탭 설정
  const [users, setUsers] = useState([]);
  const [userCnt, setUserCnt] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10); // 한 페이지에 보여줄 사용자 수

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    if (activeTab === 'userManage') {
      fetchUsers();
    }
  }, [activeTab, page]);

  // 사용자 관리 정보 가져오기
  const fetchUsers = async () => {
    try {
      const response = await getUserManageInfo(size, page);
      setUsers(response.users);
      setUserCnt(response.userCnt);
    } catch (error) {
      console.error('사용자 관리 정보를 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  // 관리자 계정 생성
  const handleCreateAdminAccount = async () => {
    if (!adminUsername || !adminPassword) {
      alert('관리자 계정 정보(아이디와 비밀번호)를 입력하세요.');
      return;
    }

    try {
      const response = await createAdminAccount(adminUsername, adminPassword);
      alert('관리자 계정이 성공적으로 생성되었습니다.');
      setAdminUsername('');
      setAdminPassword('');
    } catch (error) {
      console.error('관리자 계정 생성 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-tabs">
        <button onClick={() => setActiveTab('userManage')} className={activeTab === 'userManage' ? 'active' : ''}>
          사용자 관리
        </button>
        <button onClick={() => setActiveTab('createAdmin')} className={activeTab === 'createAdmin' ? 'active' : ''}>
          관리자 계정 생성
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'userManage' && (
          <div>
            <h2>사용자 관리</h2>
            <p>총 사용자 수: {userCnt}</p>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>닉네임</th>
                  <th>이메일</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nickname}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                이전
              </button>
              <span>페이지 {page}</span>
              <button onClick={() => setPage(page + 1)} disabled={page * size >= userCnt}>
                다음
              </button>
            </div>
          </div>
        )}

        {activeTab === 'createAdmin' && (
          <div>
            <h2>관리자 계정 생성</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                관리자 아이디:
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
              </label>
              <label>
                관리자 비밀번호:
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </label>
              <button onClick={handleCreateAdminAccount}>생성</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
