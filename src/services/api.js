import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.GRANA_CONTROLE_BACK,
});

export default api;