import axios from "axios";
import { message } from "antd";
import { refreshToken } from "../api/user";

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:3005/',
    // baseURL: 'http://localhost/api',
    baseURL: 'http://47.115.36.179/api',
    timeout: 3000
});
axiosInstance.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem('access_token');

    if(accessToken) {
        config.headers.authorization = 'Bearer ' + accessToken;
    }
    return config;
})

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        let { data, config } = error.response;

        if (data.code === 401 && !config.url.includes('/user/admin/refresh')) {
            
            const res = await refreshToken();

            if(res.status === 200) {
                return axios(config);
            } else {
                message.error(res.data);

                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            }
            
        } else {
            return error.response;
        }
    }
)

export default axiosInstance;