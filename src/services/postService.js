import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/posts'; // Post API의 기본 URL

// 게시글 작성 (파일 첨부 가능)
export const createPost = async (title, content, files = []) => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await axios.post(`${API_BASE_URL}/write`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // 성공 응답 반환
  } catch (error) {
    console.error('게시글 작성 실패', error);
    throw error;
  }
};

// 게시글 상세 조회
export const getPost = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${postId}`);
    return response.data; // 게시글 상세 정보 반환
  } catch (error) {
    console.error('게시글 조회 실패', error);
    throw error;
  }
};

// 게시글 수정
export const updatePost = async (postId, title, content) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${postId}`, {
      title,
      content,
    });

    return response.data; // 수정된 게시글 반환
  } catch (error) {
    console.error('게시글 수정 실패', error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (postId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/delete/${postId}`);
    return response.data; // 삭제 성공 응답 반환
  } catch (error) {
    console.error('게시글 삭제 실패', error);
    throw error;
  }
};

// 게시글 좋아요
export const likePost = async (postId, username) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/like`, {
      postId,
      username,
    });

    return response.data; // 좋아요 처리 성공 응답 반환
  } catch (error) {
    console.error('게시글 좋아요 실패', error);
    throw error;
  }
};

// 페이지네이션된 게시글 목록 조회
export const getPosts = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list/page`, {
      params: {
        page,
        size,
      },
    });

    return response.data; // 페이지네이션된 게시글 목록 반환
  } catch (error) {
    console.error('게시글 목록 조회 실패', error);
    throw error;
  }
};

// 제목으로 게시글 검색
export const searchPostsByTitle = async (keyword, page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/title`, {
      params: {
        keyword,
        page,
        size,
      },
    });

    return response.data; // 제목으로 검색된 게시글 목록 반환
  } catch (error) {
    console.error('제목으로 게시글 검색 실패', error);
    throw error;
  }
};

// 내용으로 게시글 검색
export const searchPostsByContent = async (keyword, page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/content`, {
      params: {
        keyword,
        page,
        size,
      },
    });

    return response.data; // 내용으로 검색된 게시글 목록 반환
  } catch (error) {
    console.error('내용으로 게시글 검색 실패', error);
    throw error;
  }
};

// 작성자(username)로 게시글 검색
export const searchPostsByUsername = async (username, page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/username`, {
      params: {
        username,
        page,
        size,
      },
    });

    return response.data; // 작성자(username)으로 검색된 게시글 목록 반환
  } catch (error) {
    console.error('작성자(username)로 게시글 검색 실패', error);
    throw error;
  }
};

// 제목 또는 내용으로 게시글 검색
export const searchPosts = async (keyword, page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        keyword,
        page,
        size,
      },
    });

    return response.data; // 제목 또는 내용으로 검색된 게시글 목록 반환
  } catch (error) {
    console.error('게시글 검색 실패', error);
    throw error;
  }
};
