import React, { useEffect, useState } from 'react';
import { getUserPageInfo, getFollowingList, getFollowerList } from '../services/userService';

const MyPage = () => {
  const [userPageInfo, setUserPageInfo] = useState(null);
  const [followingList, setFollowingList] = useState([]);
  const [followerList, setFollowerList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const username = 'current_user'; // 현재 사용자 이름 (백엔드에서 가져와야 함)
      const userInfo = await getUserPageInfo(username);
      setUserPageInfo(userInfo);

      const following = await getFollowingList(username, 10, 1);
      setFollowingList(following.users);

      const followers = await getFollowerList(username, 10, 1);
      setFollowerList(followers.users);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>My Page</h1>
      {userPageInfo && (
        <div>
          <p>팔로잉: {userPageInfo.following}</p>
          <p>팔로워: {userPageInfo.followers}</p>
        </div>
      )}
      <h2>팔로잉 목록</h2>
      <ul>
        {followingList.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
      <h2>팔로워 목록</h2>
      <ul>
        {followerList.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyPage;
