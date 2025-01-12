import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserinfo,
  getFollowingList,
  getFollowerList,
  followUser,
  deleteUser,
  getMyReserve,
  getPreviousReserve,
  getLikedPosts,
  getGgimMovies
} from '../../services/userService';
import { cancelReservation } from '../../services/reserveService';
import { searchPostsByUsername } from '../../services/postService';

import './MyPage.css';
import '../../styles/dark-theme.css'; // 공통 스타일

const MyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info'); // 활성화된 탭
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [bookedMovies, setBookedMovies] = useState({ upcoming: [], past: [] });
  const [likedPosts, setLikedPosts] = useState([]);
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
        const [followerData, followingData, movies, myReserve, previousReserve, likedPostData, postsData] =
          await Promise.all([
            getFollowerList(userId, 10, 0),
            getFollowingList(userId, 10, 0),
            getGgimMovies(),
            getMyReserve(),
            getPreviousReserve(),
            getLikedPosts(userId, 0, 16),
            searchPostsByUsername(userId, 0, 10),
          ]);
          setFollowerList(followerData.users || []);
          setFollowingList(followingData.users || []);
          setFavoriteMovies(Array.isArray(movies) ? movies : []);
          setBookedMovies({ upcoming: myReserve, past: previousReserve });
          setLikedPosts(likedPostData.content || []);
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
              const followerdata = await getFollowerList(userInfo?.id, 10, 0);
              console.log("팔로워 리스트 데이터:", followerdata);
              setFollowerList(followerdata.users || []);
            }
            break;
          case 'following':
            if (followingList.length === 0) {
              const followingdata = await getFollowingList(userInfo?.id, 10, 0);
              console.log("팔로잉 리스트 데이터:", followingdata);
              setFollowingList(followingdata.users || []);
            }
            break;
          case 'favoriteMovies':
            if (favoriteMovies.length === 0) {
              const movies = await getGgimMovies();
              const movieList = movies?.movie || [];
              console.log("찜한 영화 데이터:", movieList);
              setFavoriteMovies(Array.isArray(movieList) ? movieList : []);
            }
            break;
          case 'bookedMovies':
            if (bookedMovies.upcoming.length === 0 || bookedMovies.past.length === 0) {
              const [upcoming, past] = await Promise.all([getMyReserve(), getPreviousReserve()]);
              console.log("예매 데이터 - 다가오는 예약:", upcoming);
              console.log("예매 데이터 - 지난 예약:", past);
              setBookedMovies({ upcoming, past });
            }
            break;
          case 'likedPosts':
            if (likedPosts.length === 0) {
              const data = await getLikedPosts(userInfo?.id, 0, 16);
              const dataList = data?.post || [];
              console.log("좋아한 게시글 데이터:", dataList);
              setLikedPosts(dataList.content || []);
            }
            break;
          case 'userPosts':
            if (userPosts.length === 0) {
              const postsData = await searchPostsByUsername(userInfo.id, 0, 10);
              setUserPosts(postsData?.post?.content || []);
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
  

  const handleFollow = async (username) => {
    try {
      await followUser(username);
      alert(`${username}님을 팔로우했습니다.`);
      setFollowingList((prevList) => {
        if (!prevList.some((user) => user.id === username)) {
          return [...prevList, { id: username, nickname: username }];
        }
        return prevList;
      });
    } catch (error) {
      console.error('팔로우에 실패했습니다:', error);
      alert('팔로우에 실패했습니다.');
    }
  };
  

  const handleDeleteUser = async (username) => {
    if (window.confirm('정말 계정을 삭제하시겠습니까?')) {
      try {
        await deleteUser(username);
        alert('계정이 삭제되었습니다.');
        // 삭제 후 홈 페이지나 다른 페이지로 이동
        navigate('/auth');
      } catch (error) {
        console.error('계정 삭제 중 오류 발생:', error);
        alert('계정 삭제에 실패했습니다.');
      }
    }
  };

  const handleCancelReservation = async (seatId, scheduleId) => {
    try {
      await cancelReservation(seatId, scheduleId);
      alert('예약이 취소되었습니다.');
      setBookedMovies((prev) => ({
        ...prev,
        upcoming: prev.upcoming.filter(
          (movie) => movie.seatId !== seatId || movie.scheduleId !== scheduleId
        ),
      }));
    } catch (error) {
      console.error('예약 취소 중 오류가 발생했습니다:', error);
      alert('예약 취소에 실패했습니다.');
    }
  };

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
        <button onClick={() => handleDeleteUser(userInfo.id)}>계정 삭제</button>
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
            좋아하는 게시글 리스트
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
              <p>아이디: {userInfo.id}</p>
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
                    <button onClick={() => handleFollow(follower.id)}>팔로우하기</button>
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
          {activeTab === "favoriteMovies" && (
            <div>
              <h2>찜한 영화 리스트</h2>
              {favoriteMovies.length > 0 ? ( // 찜한 영화가 있을 경우
                <ul>
                  {favoriteMovies.map((movie) => ( // 영화 목록 렌더링
                    <li key={movie.movieId}>
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        style={{ width: "100px", height: "150px" }} 
                      />
                      <div>
                        <h3>{movie.title}</h3>
                        <p>감독: {movie.director}</p>
                        <p>평점: {movie.rating} ({movie.headCount}명)</p>
                        <p>개봉일: {new Date(movie.releaseDate).toLocaleDateString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>찜한 영화가 없습니다.</p> // 찜한 영화가 없을 경우
              )}
            </div>
          )}
          {activeTab === 'bookedMovies' && (
            <div>
              <h2>예매한 영화 리스트</h2>
              <h3>다가오는 예약</h3>
              <ul>
                {bookedMovies.upcoming.map((movie) => (
                  <li key={movie.id}>
                    {movie.title}
                    <button
                      onClick={() => handleCancelReservation(movie.seatId, movie.scheduleId)}
                    >
                      예약 취소
                    </button>
                  </li>
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
              {Array.isArray(likedPosts) && likedPosts.length > 0 ? (
                <ul>
                  {likedPosts.map((post) => (
                    <li key={post.postId}>
                      <h3>{post.title}</h3>
                      <p>작성자 ID: {post.userId}</p>
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
                <p>좋아한 게시글이 없습니다.</p>
              )}
            </div>
          )}
          {activeTab === 'userPosts' && (
            <div>
              <h2>내가 쓴 글</h2>
              {userPosts.length > 0 ? (
                <ul>
                  {userPosts.map((post) => (
                    <li key={post.postId}>
                      <h3>{post.title}</h3>
                      <p>작성일: {new Date(post.created).toLocaleDateString()}</p>
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

export default MyPage;