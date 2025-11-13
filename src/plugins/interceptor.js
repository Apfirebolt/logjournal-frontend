import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://kitsu.io/api/edge/'
});

export default axiosInstance;