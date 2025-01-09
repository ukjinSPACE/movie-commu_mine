import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserPageInfo,
  getFollowingList,
  getFollowerList,
  followUser,
  unfollowUser,
  deleteUser,
  getBookedMovies,
  cancelBooking,
  getFavoriteMovies,
} from '../../services/userService';
import './MyPage.css';
import '../../styles/dark-theme.css'; // 공통 스타일

// JWT 디코딩 함수
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};

const MyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info'); // 활성화된 탭
  const [userInfo, setUserInfo] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [bookedMovies, setBookedMovies] = useState({ upcoming: [], past: [] });

  // 로그인한 사용자 정보 가져오기
  const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기
  const username = token ? parseJwt(token)?.username : null;

  useEffect(() => {
    if (!username) {
      alert('로그인 정보가 없습니다. 로그인 페이지로 이동합니다.');
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        const userPageInfo = await getUserPageInfo(username);
        setUserInfo(userPageInfo);

        const followingData = await getFollowingList(username, 10, 1);
        setFollowingList(followingData);

        const followerData = await getFollowerList(username, 10, 1);
        setFollowerList(followerData);

        const favoriteMoviesData = await getFavoriteMovies(username);
        setFavoriteMovies(favoriteMoviesData);

        const bookedMoviesData = await getBookedMovies(username);
        setBookedMovies(bookedMoviesData);
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
        navigate('/');
      } catch (error) {
        alert('계정 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCancelBooking = async (movieId) => {
    if (window.confirm('정말 예매를 취소하시겠습니까?')) {
      try {
        await cancelBooking(movieId);
        alert('예매가 취소되었습니다.');
        setBookedMovies((prev) => ({
          ...prev,
          upcoming: prev.upcoming.filter((movie) => movie.id !== movieId),
        }));
      } catch (error) {
        alert('예매 취소 중 오류가 발생했습니다.');
      }
    }
  };

  if (!username) return null;

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
          <button onClick={() => setActiveTab('favoriteMovies')} className={activeTab === 'favoriteMovies' ? 'active' : ''}>
            찜한 영화리스트
          </button>
          <button onClick={() => setActiveTab('bookedMovies')} className={activeTab === 'bookedMovies' ? 'active' : ''}>
            예매한 영화 리스트
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
              <h3>상영 전 영화</h3>
              <ul>
                {bookedMovies.upcoming.map((movie) => (
                  <li key={movie.id}>
                    {movie.title} ({movie.date})
                    <button onClick={() => handleCancelBooking(movie.id)}>예매 취소</button>
                  </li>
                ))}
              </ul>
              <h3>상영 후 영화</h3>
              <ul>
                {bookedMovies.past.map((movie) => (
                  <li key={movie.id}>{movie.title} ({movie.date})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 홈 버튼 */}
      <div className="home-button-container">
        <button className="home-button" onClick={() => (window.location.href = '/')}>홈으로</button>
      </div>
    </div>
  );
};

export default MyPage;
