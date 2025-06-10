import axios from 'axios';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') ?? "{}")
  const token = user.token
  if (!token) return '';
  return `Bearer ${token}`
}

const getUserIdentity = () => {
  const user = JSON.parse(localStorage.getItem('user') ?? "{}")
  const identity = user.identity;
  if (!identity) return '';
  return identity;
}

const api = axios.create({
  baseURL: 'https://coreapi.hectorai.live/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': getAuthHeader(),
    'X-USER-IDENTITY': getUserIdentity(),
  },
});

export default api;