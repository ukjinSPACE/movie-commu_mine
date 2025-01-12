import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserinfo,
  getFollowingList,
  getFollowerList,
} from '../../services/userService';
import { searchPostsByUsername } from '../../services/postService';

import './UserPage.css';
import '../../styles/dark-theme.css'; // 공통 스타일

const UserPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info'); // 활성화된 탭
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [userPosts, setUserPosts] = useState([]); // 내가 쓴 글 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfoResponse = await getUserinfo();
        if (userInfoResponse) {
          const { password, ...userData } = userInfoResponse;
          setUserInfo(userData);
        } else {
          throw new Error('사용자 정보를 가져오지 못했습니다.');
        }
    
        const userId = userInfoResponse.data?.id || '';  // 사용자 ID
        
        // 초기 데이터 가져오기
        const [followerData, followingData, postsData] =
          await Promise.all([
            getFollowerList(userId, 10, 0),
            getFollowingList(userId, 10, 0),
            searchPostsByUsername(userId, 0, 10),
          ]);

          setFollowerList(followerData.users || []);
          setFollowingList(followingData.users || []);
          setUserPosts(postsData.content || []);
        } catch (error) {
          console.error('데이터를 가져오는 데 실패했습니다:', error);
          alert('로그인 정보가 없거나 유효하지 않습니다. 로그인 페이지로 이동합니다.');
          //navigate('/auth');
        }
      };
  
      fetchData();
    }, [navigate]);

  // 탭별로 데이터를 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo) return; // userInfo가 없으면 API 호출 중단
  
      try {
        switch (activeTab) {
          case 'followers':
            if (followerList.length === 0) {
              const data = await getFollowerList(userInfo?.id, 10, 0);
              setFollowerList(data.users || []);
            }
            break;
          case 'following':
            if (followingList.length === 0) {
              const data = await getFollowingList(userInfo?.id, 10, 0);
              setFollowingList(data.users || []);
            }
            break;
          case 'userPosts':
            if (userPosts.length === 0) {
              const data = await searchPostsByUsername(userInfo?.id, 0, 10);
              setUserPosts(data.content || []);
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error fetching data for ${activeTab}:`, error);
      }
    };
  
    fetchData();
  }, [activeTab, userInfo]); // 의존성을 최소화
  

  if (!userInfo) return <div>로딩 중...</div>; // 사용자 정보가 없으면 로딩 표시

  return (
    <div className="my-page-container">
      {/* 사용자 정보 섹션 */}
      <div className="user-info-section">
        <div className="profile-image"></div>
        <h2>{userInfo.nickname}</h2>
        <p>
          팔로워: {followerList.length} | 팔로잉: {followingList.length}
        </p>
      </div>

      {/* 탭과 콘텐츠 */}
      <div className="content-container">
        {/* 탭 메뉴 */}
        <div className="sidebar">
          <button onClick={() => setActiveTab('info')} className={activeTab === 'info' ? 'active' : ''}>
            회원정보
          </button>
          <button onClick={() => setActiveTab('followers')} className={activeTab === 'followers' ? 'active' : ''}>
            팔로워리스트
          </button>
          <button onClick={() => setActiveTab('following')} className={activeTab === 'following' ? 'active' : ''}>
            팔로잉리스트
          </button>
          <button onClick={() => setActiveTab('userPosts')} className={activeTab === 'userPosts' ? 'active' : ''}>
            내가 쓴 글
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="content">
          {activeTab === 'info' && (
            <div>
              <h2>회원정보</h2>
              <p>닉네임: {userInfo.nickname}</p>
              <p>이메일: {userInfo.id + ' @ connan.com' }</p>
              <p>휴대폰번호: {userInfo.phone}</p>
              <p>생년월일: {userInfo.birth}</p>
            </div>
          )}
          {activeTab === 'followers' && (
            <div>
            <h2>팔로워리스트</h2>
            <ul>
              {followerList.length === 0 ? (
                <p>팔로워가 없습니다.</p>
              ) : (
                followerList.map((follower) => (
                  <li key={follower.id}>         
                    {follower.nickname || follower.id}
                  </li>
                ))
              )}
            </ul>
          </div>
          )}
          {activeTab === 'following' && (
            <div>
              <h2>팔로잉리스트</h2>
              {followingList.length === 0 ? (
                <p>아직 팔로우중인 사람이 없습니다.</p>
              ) : (
                <ul>
                  {followingList.map((followee) => (
                    <li key={followee.id}>
                      {followee.nickname || followee.id} {/* nickname이 없으면 id 표시 */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {activeTab === 'userPosts' && (
            <div>
              <h2>내가 쓴 글</h2>
              {Array.isArray(userPosts) && userPosts.length > 0 ? (
                <ul>
                  {userPosts.map((post) => (
                    <li key={post.postId}>
                      <h3>{post.title}</h3>
                      <p>작성일: {new Date(post.created).toLocaleDateString()}</p>
                      <p>조회수: {post.cnt} | 좋아요: {post.heart}</p>
                      {post.fileAttached > 0 ? (
                        <p>첨부 파일 수: {post.fileAttached}</p>
                      ) : (
                        <p>첨부 파일 없음</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>게시글이 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 홈 버튼 */}
      <div className="home-button-container">
        <button className="home-button" onClick={() => navigate('/')}>홈으로</button>
      </div>
    </div>
  );
};

export default UserPage;
