import { Input } from "antd";
import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface JoinRoomPayload {
    chatroomId: number
    userId: number
}

interface SendMessagePayload {
    sendUserId: number;
    chatroomId: number;
    message: Message
}

interface Message {
    type: 'text' | 'image'
    content: string
}

type Reply  = {
    type: 'sendMessage'
    userId: number
    message: Message
} | {
    type: 'joinRoom'
    userId: number
}

export function Chat() {
    const [messageList, setMessageList] = useState<Array<Message>>([]);
    const socketRef = useRef<Socket>();
    /**
     * 发送消息到服务端。
     * @param value 
     */
    function sendMessage(value: string) {
        const payload: SendMessagePayload = {
            sendUserId: 1,
            chatroomId: 1,
            message: {
                type: 'text',
                content: value
            }
        }

        socketRef.current?.emit('sendMessage', payload);
    }

    useEffect(() => {
        const socket = socketRef.current = io('http://localhost:3005');
        socket.on('connect', () => {
            const payload: JoinRoomPayload = {
                chatroomId: 1,
                userId: 1
            }
            socket.emit('joinRoom', payload);
            // 监听服务端的 message。
            socket.on('message', (reply: Reply) => {
                // 新用户加入
                // 如果传过来的是 joinRoom 的消息，就添加一条 用户 xxx 加入聊天室的消息到 messageList。
                if(reply.type === 'joinRoom') {
                    setMessageList(messageList => [...messageList, {
                        type: 'text',
                        content: '用户 ' + reply.userId + '加入聊天室'
                    }])
                } else {
                    // 否则就把传过来 message 加到 messageList。
                    setMessageList(messageList => [...messageList, reply.message])    
                }
            });
        })
    }, []);
    return <div>
        <Input onBlur={(e) => {
            sendMessage(e.target.value);
        }}/>
        <div>
            {messageList.map(item => {
                return <div>
                    {item.type === 'image' ? <img src={item.content}/> : item.content }
                </div>
            })}
        </div>
    </div>
}
