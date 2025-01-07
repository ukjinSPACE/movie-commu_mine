import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await axios.get('/api/user/favorites');
      setFavorites(response.data);
    };
    const fetchMyPosts = async () => {
      const response = await axios.get('/api/user/posts');
      setMyPosts(response.data);
    };
    fetchFavorites();
    fetchMyPosts();
  }, []);

  return (
    <div>
      <h1>마이 페이지</h1>
      <h2>찜한 영화</h2>
      <ul>
        {favorites.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
      <h2>작성한 게시글</h2>
      <ul>
        {myPosts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyPage;
