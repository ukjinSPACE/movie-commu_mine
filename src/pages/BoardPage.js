import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BoardPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 게시글 목록 가져오기
    const fetchPosts = async () => {
      const response = await axios.get('/api/board/posts');
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>자유게시판</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <button>글쓰기</button>
    </div>
  );
};

export default BoardPage;
