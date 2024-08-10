export interface User {
    id: number;
    headPic: string;
    nickName: string;
    email: string;
    captcha: string;
}

export interface FriendRequest {
    id: number
    fromUserId: number
    toUserId: number
    reason: string
    createTime: Date
    fromUser: User
    toUser: User
    status: number
}