import { UserInfo } from "pages/UpdateInfo"

export interface ChatHistory {
    id: number
    content: string
    type: number
    chatroomId: number
    senderId: number
    createTime: Date,
    sender: UserInfo
}

export interface Chatroom {
    id: number;
    name: string;
    createTime: Date;
}

export interface User {
    id: number;
    email: string;
    headPic: string;
    nickName: string;
    username: string;
    createTime: Date;
}

export interface Message {
    type: 'text' | 'image'
    content: string
}

export interface JoinRoomPayload {
    chatroomId: number
    userId: number
}

export interface SendMessagePayload {
    sendUserId: number;
    chatroomId: number;
    message: Message
}

export type Reply = {
    type: 'sendMessage'
    userId: number
    message: ChatHistory
} | {
    type: 'joinRoom'
    userId: number
    message: undefined
}