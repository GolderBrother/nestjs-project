import axios, { AxiosRequestConfig } from "axios";
import { refreshToken } from "../api";
import { message } from "antd";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3005/',
  timeout: 3000
});

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('access_token');

  // 在每次发请求之前，在 header 里加上 authorization，带上 access_token。
  if (accessToken) {
    config.headers.authorization = 'Bearer ' + accessToken;
  }
  return config;
})

interface PendingTask {
  config: AxiosRequestConfig
  resolve: Function
}
let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let { data, config } = error.response;

    // 通过 refreshing 的标记和 task 队列实现了并发请求只刷新一次。
    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve
        });
      });
    }

    // 当响应码是 401 的时候，就刷新 token，刷新失败提示错误信息，然后跳到登录页。
    if (data.code === 401 && !config.url.includes('/user/refresh')) {

      refreshing = true;

      const res = await refreshToken();

      refreshing = false;

      if ([200, 201].includes(res.status)) {

        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config))
        })

        return axiosInstance(config);
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