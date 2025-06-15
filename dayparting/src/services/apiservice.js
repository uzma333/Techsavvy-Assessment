import axios from 'axios';
import { getAuthHeader, getUserIdentity } from '../utils/localStorage';

const api = axios.create({
  baseURL: 'https://coreapi.hectorai.live/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': getAuthHeader(),
    'X-USER-IDENTITY': getUserIdentity(),
  },
});

export default api;

