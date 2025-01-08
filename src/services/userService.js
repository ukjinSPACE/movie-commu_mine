import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// 현재 사용자 역할 가져오기
export const getCurrentUserRole = async () => {
  try {
    const formData = new URLSearchParams();
    const response = await axios.post(`${API_BASE_URL}/do`, formData);
    return response.data; // 사용자 역할 반환 (e.g., 'ROLE_USER', 'ROLE_ADMIN')
  } catch (error) {
    console.error('사용자 역할 가져오기 중 오류 발생:', error);
    throw error;
  }
};

// 사용자가 관리자 역할인지 확인
export const isAdminUser = async () => {
  try {
    const role = await getCurrentUserRole();
    return role === 'ROLE_ADMIN'; // 역할이 'ADMIN'이면 true 반환
  } catch (error) {
    console.error('사용자 역할 확인 중 오류 발생:', error);
    return false; // 오류 발생 시 false 반환
  }
};

// 로그인 API
export const login = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post(`${API_BASE_URL}/login`, formData);
    return response.data; // 로그인 결과 반환
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    throw error;
  }
};

// 회원가입 API (DTO 기반)
export const signup = async (userDto) => {
  try {
    const formData = new URLSearchParams();

    // DTO의 필드들을 Form 데이터로 변환
    formData.append('id', userDto.id);
    formData.append('password', userDto.password);
    formData.append('nickname', userDto.nickname);
    formData.append('phone', userDto.phone);
    formData.append('birth', userDto.birth);

    const response = await axios.post(`${API_BASE_URL}/join`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // 서버가 기대하는 형식
      },
    });

    return response.data; // 서버 응답 반환
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error);
    //throw error.response?.data || new Error('회원가입 요청 중 에러 발생');
  }
};

// 사용자 삭제 API
export const deleteUser = async (username) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);

    const response = await axios.post(`${API_BASE_URL}/user/delete`, formData);
    return response.data; // 삭제 결과 반환
  } catch (error) {
    console.error('사용자 삭제 중 오류 발생:', error);
    throw error;
  }
};

// 팔로우 API
export const followUser = async (username) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);

    const response = await axios.post(`${API_BASE_URL}/follow`, formData);
    return response.data; // 팔로우 결과 반환
  } catch (error) {
    console.error('팔로우 중 오류 발생:', error);
    throw error;
  }
};

// 언팔로우 API
export const unfollowUser = async (username) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);

    const response = await axios.post(`${API_BASE_URL}/flwDelete`, formData);
    return response.data; // 언팔로우 결과 반환
  } catch (error) {
    console.error('언팔로우 중 오류 발생:', error);
    throw error;
  }
};

// 팔로잉 목록 가져오기 API
export const getFollowingList = async (username, size, page) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('size', size);
    formData.append('page', page);

    const response = await axios.post(`${API_BASE_URL}/followingList`, formData);
    return response.data; // 팔로잉 목록 반환
  } catch (error) {
    console.error('팔로잉 목록 가져오기 중 오류 발생:', error);
    throw error;
  }
};

// 팔로워 목록 가져오기 API
export const getFollowerList = async (username, size, page) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('size', size);
    formData.append('page', page);

    const response = await axios.post(`${API_BASE_URL}/followerList`, formData);
    return response.data; // 팔로워 목록 반환
  } catch (error) {
    console.error('팔로워 목록 가져오기 중 오류 발생:', error);
    throw error;
  }
};

// 사용자 페이지 정보 가져오기 API
export const getUserPageInfo = async (username) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);

    const response = await axios.post(`${API_BASE_URL}/userPage`, formData);
    return response.data; // 사용자 페이지 정보 반환
  } catch (error) {
    console.error('사용자 페이지 정보 가져오기 중 오류 발생:', error);
    throw error;
  }
};

// 예약된 영화 조회
export const getBookedMovies = async (userId) => {
  try {
    const formData = new URLSearchParams();
    formData.append('userId', userId);

    const response = await axios.post(`${API_BASE_URL}/users/${userId}/booked-movies`, formData);
    return response.data;
  } catch (error) {
    console.error('예약된 영화 조회 중 오류 발생:', error);
    throw error;
  }
};

// 예약 취소
export const cancelBooking = async (userId, bookingId) => {
  try {
    const formData = new URLSearchParams();
    formData.append('userId', userId);
    formData.append('bookingId', bookingId);

    const response = await axios.post(`${API_BASE_URL}/users/${userId}/bookings/${bookingId}`, formData);
    return response.data;
  } catch (error) {
    console.error('예약 취소 중 오류 발생:', error);
    throw error;
  }
};

// 즐겨찾기 영화 조회
export const getFavoriteMovies = async (userId) => {
  try {
    const formData = new URLSearchParams();
    formData.append('userId', userId);

    const response = await axios.post(`${API_BASE_URL}/users/${userId}/favorite-movies`, formData);
    return response.data;
  } catch (error) {
    console.error('즐겨찾기 영화 조회 중 오류 발생:', error);
    throw error;
  }
};
