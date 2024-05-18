import axiosInstance from "../request/index";
import { UpdatePassword, UserInfo } from "./types/user";

export async function login(username: string, password: string) {
    return await axiosInstance.post('/user/admin/login', {
        username, password
    });
}


export async function refreshToken() {
    const res = await axiosInstance.get('/user/admin/refresh', {
        params: {
          refresh_token: localStorage.getItem('refresh_token')
        }
    });
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    return res;
}

export async function userSearch(username: string, nickName: string, email: string, pageNo: number, pageSize: number) {
    return await axiosInstance.get('/user/list', {
        params: {
            username,
            nickName,
            email,
            pageNo,
            pageSize
        }
    });
}

export async function getUserInfo() {
    return await axiosInstance.get('/user/info');
}

export async function updateInfo(data: UserInfo) {
    return await axiosInstance.post('/user/admin/update', data);
}

export async function updateUserInfoCaptcha() {
    return await axiosInstance.get('/user/update/captcha');
}



export async function updatePasswordCaptcha(email: string) {
    return await axiosInstance.get('/user/update_password/captcha', {
        params: {
            address: email
        }
    });
}

export async function updatePassword(data: UpdatePassword) {
    return await axiosInstance.post('/user/admin/update_password', data);
}
