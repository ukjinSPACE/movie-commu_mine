import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/';

export const getCurrentUserRole = async () => {
  const response = await axios.get(`${API_BASE_URL}/do`);
  return response.data; // 사용자 역할 반환
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
  return response.data;
};

export const signup = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/join`, { username, password });
  return response.data;
};

export const deleteUser = async (username) => {
  const response = await axios.post(`${API_BASE_URL}/user/delete`, { username });
  return response.data;
};

export const followUser = async (username) => {
  const response = await axios.post(`${API_BASE_URL}/follow`, { username });
  return response.data;
};

export const unfollowUser = async (username) => {
  const response = await axios.post(`${API_BASE_URL}/flwDelete`, { username });
  return response.data;
};

export const getFollowingList = async (username, size, page) => {
  const response = await axios.get(`${API_BASE_URL}/followingList`, {
    params: { username, size, page },
  });
  return response.data;
};

export const getFollowerList = async (username, size, page) => {
  const response = await axios.get(`${API_BASE_URL}/followerList`, {
    params: { username, size, page },
  });
  return response.data;
};

export const getUserPageInfo = async (username) => {
  const response = await axios.get(`${API_BASE_URL}/userPage`, { params: { username } });
  return response.data;
};
