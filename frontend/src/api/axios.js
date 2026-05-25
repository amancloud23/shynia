import axios from 'axios';

const api = axios.create({
	baseURL: 'http://52.15.195.89:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('shynia_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('shynia_token');
      localStorage.removeItem('shynia_user');
    }
    return Promise.reject(err);
  }
);

export default api;
