import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BoardModify.css';
import '../../styles/dark-theme.css'; // 공통 스타일

const BoardModify = () => {
  const { postId } = useParams(); // URL에서 게시글 ID를 가져옵니다.
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error('게시글을 가져오는 데 실패했습니다:', error);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title || !content) {
      setErrorMessage('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      await axios.put(`/api/posts/${postId}`, { title, content });
      alert('게시글이 수정되었습니다.');
      navigate(`/review/board/${postId}`);
    } catch (error) {
      setErrorMessage('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="board-modify-container">
      <h1>게시글 수정</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력하세요"
          />
        </div>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <button type="submit">게시글 수정</button>
      </form>
    </div>
  );
};

export default BoardModify;
