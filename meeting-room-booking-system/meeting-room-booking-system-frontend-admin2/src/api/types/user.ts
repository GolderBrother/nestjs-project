export interface UserInfo {
    username: string;
    headPic: string;
    nickName: string;
    email: string;
    captcha: string;
}

export interface UpdatePassword {
	email: string;
	captcha: string;
	password: string;
	username: string;
	confirmPassword: string;
}