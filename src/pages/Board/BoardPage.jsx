import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BoardPage.css';

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/posts?search=${searchQuery}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const handleWritePost = () => {
    navigate('/board/new');
  };

  const handlePostClick = (postId) => {
    navigate(`/board/${postId}`);
  };

  return (
    <div className="board-page-container">
      <h1>자유 게시판</h1>
      <div className="board-header">
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
        <button onClick={handleWritePost}>글쓰기</button>
      </div>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} onClick={() => handlePostClick(post.id)}>
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 50)}...</p>
            <span>조회수: {post.views}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardPage;
