export interface LoginUser {
    username: string;
    password: string;
}

export interface RegisterUser {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    captcha: string;
}


export interface UpdatePassword {
    email: string;
    captcha: string;
    password: string;
    confirmPassword: string;
}

export interface Exam {
    id: number
    name: string
    isPublish: boolean
    isDelete: boolean
    content: string
}

export interface ExamAdd {
    name: string;
}