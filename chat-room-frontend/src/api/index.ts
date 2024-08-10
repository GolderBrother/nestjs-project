import axios from "axios";
import { RegisterUser } from "../pages/Register";
import { UpdatePassword } from "../pages/UpdatePassword";
import { message } from "antd";
import { UserInfo } from "../pages/UpdateInfo";
import { AddFriend } from "@/pages/Friendship/AddFriendModal.tsx";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3005/',
    timeout: 3000
});
axiosInstance.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem('token');

    // 每次发请求之前，在 header 里加上 authorization，带上 token
    if (accessToken) {
        config.headers.authorization = 'Bearer ' + accessToken;
    }
    return config;
})
axiosInstance.interceptors.response.use(
    (response) => {
        const newToken = response.headers['token'];
        // 当响应的 header 带有 token，就更新本地 token。
        if(newToken) {
            localStorage.setItem('token', newToken);
        }
        return response;
    }, async (error) => {
        if(!error.response) {
            return Promise.reject(error);
        }
        const { data } = error.response;
        // 如果返回的是 401 的状态码，就提示错误，跳转登录页
        if (data.statusCode === 401) {
            message.error(data.message);

            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } else {
            return Promise.reject(error);
        }
    }
)
export async function login(username: string, password: string) {
    return await axiosInstance.post('/user/login', {
        username, password
    });
}


export async function registerCaptcha(email: string) {
    return await axiosInstance.get('/user/register-captcha', {
        params: {
            address: email
        }
    });
}

export async function register(registerUser: RegisterUser) {
    return await axiosInstance.post('/user/register', registerUser);
}


export async function updatePasswordCaptcha(email: string) {
    return await axiosInstance.post('/user/update_password/captcha', {
        params: {
            address: email
        }
    });
}

export async function updatePassword(data: UpdatePassword) {
    return await axiosInstance.post('/user/update_password', data);
}

export async function getUserInfo() {
    return await axiosInstance.get('/user/info');
}

export async function updateInfo(data: UserInfo) {
    return await axiosInstance.post('/user/update', data);
}

export async function updateUserInfoCaptcha() {
    return await axiosInstance.post('/user/update/captcha');
}

export async function presignedUrl(fileName: string) {
    return axiosInstance.get(`/minio/presignedUrl?name=${ fileName}`);
}

export async function friendshipList(name?: string) {
    return axiosInstance.get(`/friendship/list?name=${name || ''}`);
}

export async function friendAdd(data: AddFriend) {
    return axiosInstance.post('/friendship/add', data);
}

export async function chatroomList(name: string) {
    return axiosInstance.get(`/chatroom/list?name=${name}`);
}

export async function friendRequestList() {
    return axiosInstance.get('/friendship/request_list');
}

export async function agreeFriendRequest(id: number) {
    return axiosInstance.get(`/friendship/agree/${id}`);
}

export async function rejectFriendRequest(id: number) {
    return axiosInstance.get(`/friendship/reject/${id}`);
}
