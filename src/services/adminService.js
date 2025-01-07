import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/admin';

export const getUserManageInfo = async (size, page) => {
  const response = await axios.get(`${API_BASE_URL}/userManage`, {
    params: { size, page },
  });
  return response.data;
};

export const createAdminAccount = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/join`, { username, password });
  return response.data;
};