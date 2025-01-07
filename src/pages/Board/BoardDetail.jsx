import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BoardDetail.css';

const BoardDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}`);
        setPost(response.data);
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content: newComment,
      });
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/api/posts/${postId}/like`);
      setPost((prevPost) => ({
        ...prevPost,
        likes: prevPost.likes + 1,
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.post(`/api/posts/${postId}/dislike`);
      setPost((prevPost) => ({
        ...prevPost,
        dislikes: prevPost.dislikes + 1,
      }));
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="board-detail-container">
      <button onClick={() => navigate(-1)}>뒤로가기</button>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <div className="post-actions">
        <button onClick={handleLike}>추천 {post.likes}</button>
        <button onClick={handleDislike}>비추천 {post.dislikes}</button>
      </div>
      <h2>댓글</h2>
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.content}</p>
          </li>
        ))}
      </ul>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="댓글을 입력하세요..."
      />
      <button onClick={handleCommentSubmit}>댓글 작성</button>
    </div>
  );
};

export default BoardDetail;
