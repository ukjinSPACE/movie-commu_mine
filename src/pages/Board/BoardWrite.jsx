import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BoardWrite.css';

const BoardWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

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
      const response = await axios.post('/api/posts', { title, content });
      alert('게시글이 작성되었습니다.');
      navigate(`/review/board/${response.data.id}`);
    } catch (error) {
      setErrorMessage('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="board-write-container">
      <h1>게시글 작성</h1>
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

        <button type="submit">게시글 작성</button>
      </form>
    </div>
  );
};

export default BoardWrite;
