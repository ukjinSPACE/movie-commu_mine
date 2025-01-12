import React, { useState, useEffect } from 'react';
import { getUserManageInfo } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';
import { isAdminUser } from '../../services/userService';
import './AdminPage.css';
import '../../styles/dark-theme.css'; // 공통 스타일

const AdminPage = () => {

  const [tab, setTab] = useState('user'); // 현재 탭
  const [users, setUsers] = useState([]);
  const [userCnt, setUserCnt] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10); // 한 페이지에 보여줄 사용자 수

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminUser()) {
      alert('접근 권한이 없습니다. 관리자 계정으로 로그인하세요.');
      navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    if (tab === 'user') {
      fetchUsers();
    }
  }, [tab, page]);

  const fetchUsers = async () => {
    try {
      const response = await getUserManageInfo(size, page);
      setUsers(response.users);
      setUserCnt(response.userCnt);
    } catch (error) {
      console.error('사용자 관리 정보를 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  const deleteUser = (id) => {
    const userToDelete = users.find(user => user.id === id); // 삭제할 사용자 정보 찾기
    const confirmation = window.confirm(`${userToDelete.nickname} 님을 정말로 삭제하시겠습니까?`);

    if (confirmation) {
      const updatedUsers = users.filter((user) => user.id !== id); // ID로 사용자 삭제
      setUsers(updatedUsers); // 사용자 목록 갱신
      setUserCnt(updatedUsers.length); // 사용자 수 갱신
      alert(`${userToDelete.nickname} 님이 삭제되었습니다.`);
    }
  };

  return (
    <div className="admin-page-container">
      <h2>관리자 페이지</h2>
      <div className="tab-buttons">
        <button onClick={() => setTab('user')}>사용자 관리</button>
      </div>

      {tab === 'user' && (
        <div className="user-management">
          <p>총 사용자 수: {userCnt}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>닉네임</th>
                <th>이메일</th>
                <th>휴대전화번호</th>
                <th>생년월일</th>
                <th> </th> {/* 삭제 버튼 열 추가 */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nickname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.birth}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => deleteUser(user.id)}
                    >
                      삭제
                    </button>
                  </td>
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
    </div>
  );
};

export default AdminPage;
