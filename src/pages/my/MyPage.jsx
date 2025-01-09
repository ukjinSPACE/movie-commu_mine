import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserPageInfo,
  getFollowingList,
  getFollowerList,
  followUser,
  deleteUser,
  getMyReserve,
  getPreviousReserve,
  getLikedPosts,
  getFavoriteMovies
} from '../../services/userService';

import './MyPage.css';
import '../../styles/dark-theme.css'; // 공통 스타일

const MyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info'); // 활성화된 탭
  const [userInfo, setUserInfo] = useState({});
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [bookedMovies, setBookedMovies] = useState({ upcoming: [], past: [] });
  const [likedPosts, setLikedPosts] = useState([]); // 내가 좋아한 게시글
  const [myComments, setMyComments] = useState([]); // 내가 쓴 댓글

  useEffect(() => {
    // 사용자 정보를 서버에서 가져오기
    const fetchData = async () => {
      try {
        const userPageInfo = await getUserPageInfo(); // 사용자 정보 가져오기
        setUserInfo(userPageInfo);

        const followingData = await getFollowingList(userPageInfo.username, 10, 1);
        setFollowingList(followingData.users);

        const followerData = await getFollowerList(userPageInfo.username, 10, 1);
        setFollowerList(followerData.users);

        const favoriteMoviesData = await getFavoriteMovies(userPageInfo.username);
        setFavoriteMovies(favoriteMoviesData);

        const myReserve = await getMyReserve();
        const previousReserve = await getPreviousReserve();
        setBookedMovies({ upcoming: myReserve, past: previousReserve });

        const likedPostsData = await getLikedPosts(userPageInfo.username, 1, 16);
        setLikedPosts(likedPostsData.content);

        const commentsData = await getLikedPosts(userPageInfo.username, 1, 16);
        setMyComments(commentsData.content);
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다:', error);
        alert('로그인 정보가 없거나 유효하지 않습니다. 로그인 페이지로 이동합니다.');
        navigate('/auth');
      }
    };

    fetchData();
  }, [navigate]);

  const handleFollow = async (username) => {
    try {
      await followUser(username);
      alert(`${username}님을 팔로우했습니다.`);
    } catch (error) {
      console.error('팔로우에 실패했습니다:', error);
      alert('팔로우에 실패했습니다.');
    }
  };

  if (!userInfo.username) return null;

  return (
    <div className="my-page-container">
      {/* 사용자 정보 섹션 */}
      <div className="user-info-section">
        <div className="profile-image"></div>
        <h2>{userInfo.nickname}</h2>
        <p>
          팔로워: {followerList.length} | 팔로잉: {followingList.length}
        </p>
        <button onClick={() => deleteUser(userInfo.username)}>계정 삭제</button>
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
          <button onClick={() => setActiveTab('favoriteMovies')} className={activeTab === 'favoriteMovies' ? 'active' : ''}>
            찜한 영화리스트
          </button>
          <button onClick={() => setActiveTab('bookedMovies')} className={activeTab === 'bookedMovies' ? 'active' : ''}>
            예매한 영화 리스트
          </button>
          <button onClick={() => setActiveTab('likedPosts')} className={activeTab === 'likedPosts' ? 'active' : ''}>
            내가 좋아한 글
          </button>
          <button onClick={() => setActiveTab('myComments')} className={activeTab === 'myComments' ? 'active' : ''}>
            내가 쓴 댓글
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="content">
          {activeTab === 'info' && (
            <div>
              <h2>회원정보</h2>
              <p>닉네임: {userInfo.nickname}</p>
              <p>이메일: {userInfo.email}</p>
              <p>휴대폰번호: {userInfo.phone}</p>
              <p>생년월일: {userInfo.birth}</p>
            </div>
          )}
          {activeTab === 'followers' && (
            <div>
              <h2>팔로워리스트</h2>
              <ul>
                {followerList.map((follower) => (
                  <li key={follower.id}>
                    {follower.nickname}
                    <button onClick={() => handleFollow(follower.username)}>팔로우하기</button>
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
                  <li key={followee.id}>{followee.nickname}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'favoriteMovies' && (
            <div>
              <h2>찜한 영화리스트</h2>
              <ul>
                {favoriteMovies.map((movie) => (
                  <li key={movie.id}>{movie.title}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'bookedMovies' && (
            <div>
              <h2>예매한 영화 리스트</h2>
              <h3>다가오는 예약</h3>
              <ul>
                {bookedMovies.upcoming.map((movie) => (
                  <li key={movie.id}>{movie.title}</li>
                ))}
              </ul>
              <h3>지난 예약</h3>
              <ul>
                {bookedMovies.past.map((movie) => (
                  <li key={movie.id}>{movie.title}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'likedPosts' && (
            <div>
              <h2>내가 좋아한 글</h2>
              <ul>
                {likedPosts.map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'myComments' && (
            <div>
              <h2>내가 쓴 댓글</h2>
              <ul>
                {myComments.map((comment) => (
                  <li key={comment.id}>{comment.content}</li>
                ))}
              </ul>
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

export default MyPage;
