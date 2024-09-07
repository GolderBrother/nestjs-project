import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ExamAdd, ExamSaveParams, RegisterUser, UpdatePassword } from "./types";
import { message } from "antd";

const userServiceInstance = axios.create({
    baseURL: 'http://localhost:3001/',
    timeout: 3000
});

const examServiceInstance = axios.create({
    baseURL: 'http://localhost:3002/',
    timeout: 3000
});

// 调用答案微服务的接口需要单独创建一个 axios 的实例
const answerServiceInstance = axios.create({
    baseURL: 'http://localhost:3003/',
    timeout: 3000
});

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    // 在每次请求之前，带上token，加上authorization
    const accessToken = localStorage.getItem('token')
    if (accessToken) {
        config.headers.authorization = `Bearer ${accessToken}`;
    }
    return config;
}
examServiceInstance.interceptors.request.use(requestInterceptor)
answerServiceInstance.interceptors.request.use(requestInterceptor)


const responseInterceptor = (response: AxiosResponse) => {
    // 登录之后，拿到新的token，更新到本地存储中
    const newToken = response.headers['token'];
    if (newToken) {
        localStorage.setItem('token', newToken)
    }
    return response
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const responseErrorInterceptor  = (error: any) => {
    if (!error.response) {
        return Promise.reject(error)
    }

    const { data } = error.response
    if (data.statusCode === 401) {
        message.error(data.message || '用户未登录', () => {
            window.location.href = '/login';
        })
    } else {
        return Promise.reject(error)
    }

}

examServiceInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
answerServiceInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

export async function login(username: string, password: string) {
    return await userServiceInstance.post('/user/login', {
        username, password
    });
}

export async function registerCaptcha(email: string) {
    return await userServiceInstance.get('/user/register-captcha', {
        params: {
            address: email
        }
    });
}

export async function register(registerUser: RegisterUser) {
    return await userServiceInstance.post('/user/register', registerUser);
}

export async function updatePasswordCaptcha(email: string) {
    return await userServiceInstance.get('/user/update_password/captcha', {
        params: {
            address: email
        }
    });
}

export async function updatePassword(data: UpdatePassword) {
    return await userServiceInstance.post('/user/update_password', data);
}

export async function getExamList() {
    return await examServiceInstance.get('/exam/list');
}

export async function examAdd(values: ExamAdd) {
    return await examServiceInstance.post('/exam/add', values);
}

export async function examPublish(id: number) {
    return await examServiceInstance.post('/exam/publish/', {
        id
    });
}

export async function examUnPublish(id: number) {
    return await examServiceInstance.post('/exam/unpublish/', {
        id
    });
}

export async function examDelete(id: number) {
    return await examServiceInstance.delete('/exam/delete/' + id );
}

export async function examFind(id: number) {
    return await examServiceInstance.get('/exam/find/' + id );
}

export async function examSave(data: ExamSaveParams) {
    return await examServiceInstance.post('/exam/save', data);
}

/**
 * 查找答卷
 * @param id 
 * @returns 
 */
export async function answerFind(id: number) {
    return await answerServiceInstance.get('/answer/find/' + id);
}
