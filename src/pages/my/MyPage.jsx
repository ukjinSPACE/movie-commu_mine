import React, { useState, useEffect } from 'react';
import {
  getUserPageInfo,
  getFollowingList,
  getFollowerList,
  followUser,
  unfollowUser,
  deleteUser,
} from '../../services/userService';
import './MyPage.css';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('info'); // 활성화된 탭
  const [userInfo, setUserInfo] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [username, setUsername] = useState('currentUser'); // 초기 사용자 이름 설정
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPageInfo = await getUserPageInfo(username);
        setUserInfo(userPageInfo);

        const followingData = await getFollowingList(username, 10, 1);
        setFollowingList(followingData);

        const followerData = await getFollowerList(username, 10, 1);
        setFollowerList(followerData);
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다:', error);
      }
    };
    fetchData();
  }, [username]);

  const handleFollow = async (followee) => {
    try {
      await followUser(followee);
      alert(`${followee}님을 팔로우 했습니다.`);
      setFollowingList((prevList) => [...prevList, followee]);
    } catch (error) {
      alert('팔로우 중 오류가 발생했습니다.');
    }
  };

  const handleUnfollow = async (followee) => {
    try {
      await unfollowUser(followee);
      alert(`${followee}님을 언팔로우 했습니다.`);
      setFollowingList((prevList) => prevList.filter((follow) => follow !== followee));
    } catch (error) {
      alert('언팔로우 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('정말 계정을 삭제하시겠습니까?')) {
      try {
        await deleteUser(username);
        alert('계정이 삭제되었습니다.');
        // 로그아웃 또는 홈으로 이동 처리 필요
      } catch (error) {
        alert('계정 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="my-page-container">
      {/* 사용자 정보 섹션 */}
      <div className="user-info-section">
        <div className="profile-image"></div>
        <h2>{userInfo.nickname}</h2>
        <p>
          팔로워: {followers.length} | 팔로잉: {following.length}
        </p>
        <button onClick={handleDeleteAccount}>계정 삭제</button>
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
          <button onClick={() => setActiveTab('posts')} className={activeTab === 'posts' ? 'active' : ''}>
            내가 쓴 글
          </button>
          <button onClick={() => setActiveTab('comments')} className={activeTab === 'comments' ? 'active' : ''}>
            내가 쓴 댓글
          </button>
          <button onClick={() => setActiveTab('scraps')} className={activeTab === 'scraps' ? 'active' : ''}>
            스크랩
          </button>

        </div>

        {/* 콘텐츠 */}
        <div className="content">
          {activeTab === 'info' && (
            <div>
              <h2>회원정보</h2>
              <p>닉네임: {userInfo.nickname}</p>
              <p>이메일: {userInfo.email}</p>
            </div>
          )}
          {activeTab === 'followers' && (
            <div>
              <h2>팔로워리스트</h2>
              <ul>
                {followerList.map((follower) => (
                  <li key={follower.id}>
                    {follower.nickname}
                    <button onClick={() => handleFollow(follower.nickname)}>팔로우</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'following' && (
            <div>
              <h2>팔로잉리스트</h2>
              <ul>
                {followingList.map((followee) => (
                  <li key={followee.id}>
                    {followee.nickname}
                    <button onClick={() => handleUnfollow(followee.nickname)}>언팔로우</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'posts' && (
            <div>
              <h2>내가 쓴 글</h2>
              <ul>
                {userInfo.posts?.map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'comments' && (
            <div>
              <h2>내가 쓴 댓글</h2>
              <ul>
                {userInfo.comments?.map((comment) => (
                  <li key={comment.id}>{comment.content}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'scraps' && (
            <div>
              <h2>스크랩</h2>
              <ul>
                {userInfo.scraps?.map((scrap) => (
                  <li key={scrap.id}>{scrap.title}</li>
                ))}
              </ul>
            </div>
          )}
          
        </div>
      </div>

      {/* 홈 버튼 */}
      <div className="home-button-container">
        <button className="home-button" onClick={() => (window.location.href = '/')}>
          홈으로
        </button>
      </div>
    </div>
  );
};

export default MyPage;
