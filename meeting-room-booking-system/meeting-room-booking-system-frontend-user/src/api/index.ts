import request from '../request/index';

export interface RegisterUser {
  username: string;
  nickName: string;
  password: string;
  confirmPassword: string;
  email: string;
  captcha: string;
}

export interface UpdatePassword {
  username: string;
  email: string;
  captcha: string;
  password: string;
  confirmPassword: string;
}

export interface UserInfo {
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

export async function login(username: string, password: string) {
  return await request.post('/user/login', {
    username, password
  });
}


export async function registerCaptcha(email: string) {
  return await request.get('/user/register-captcha', {
    params: {
      address: email
    }
  });
}

export async function register(registerUser: RegisterUser) {
  return await request.post('/user/register', registerUser);
}


export async function updatePassword(data: UpdatePassword) {
  return await request.post('/user/update_password', data);
}


export async function updatePasswordCaptcha(email: string) {
  return await request.get('/user/update_password/captcha', {
    params: {
      address: email
    }
  });
}

export async function refreshToken() {
  const res = await request.get('/user/refresh', {
    params: {
      refresh_token: localStorage.getItem('refresh_token')
    }
  });
  localStorage.setItem('access_token', res.data.access_token || '');
  localStorage.setItem('refresh_token', res.data.refresh_token || '');
  return res;
}

export async function getUserInfo() {
  return await request.get('/user/info');
}

export async function updateInfo(data: UserInfo) {
  return await request.post('/user/update', data);
}

export async function updateUserInfoCaptcha() {
  return await request.get('/user/update/captcha');
}

