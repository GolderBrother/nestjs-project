import { Button, Input, message } from "antd";
import { useState, useRef, useEffect, useMemo } from "react";
import { chatroomList as getChatroomListApi, chatHistoryList as chatHistoryListApi } from "@/api";
import { io, Socket } from "socket.io-client";
import './index.scss'
import { ChatHistory, Chatroom, JoinRoomPayload, Message, Reply, SendMessagePayload } from "./types";
import { getUserInfo } from "./utils";
import TextArea from "antd/es/input/TextArea";

export function Chat() {
    const socketRef = useRef<Socket>();
    const [chatroomId, setChatroomId] = useState<number>();
    const [messageList, setMessageList] = useState<Array<Message>>([]);
    const userInfo = useMemo(() => getUserInfo(), []);

    // 聊天室列表
    const [chatroomList, setChatroomList] = useState<Array<Chatroom>>([]);
    async function queryChatroomList() {
        try {
            const userInfo = getUserInfo()
            const res = await getChatroomListApi(userInfo.username || '');

            if (res.status === 201 || res.status === 200) {
                setChatroomList(res.data.map((item: Chatroom) => {
                    return {
                        ...item,
                        key: item.id
                    }
                }));
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }

    useEffect(() => {
        queryChatroomList();
    }, []);

    // 聊天记录
    const [chatHistoryList, setChatHistoryList] = useState<Array<ChatHistory>>([]);
    async function queryChatHistoryList(chatroomId: number) {
        try {
            const res = await chatHistoryListApi(chatroomId);

            if (res.status === 201 || res.status === 200) {
                setChatHistoryList(res.data.map((item: Chatroom) => {
                    return {
                        ...item,
                        key: item.id
                    }
                }));
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }

    const initSocket = () => {
        const socket = socketRef.current = io('http://localhost:3005');
        socket.on('connect', () => {
            if (!chatroomId) return;
            const payload: JoinRoomPayload = {
                chatroomId: chatroomId,
                userId: userInfo.id
            }

            socket.emit('joinRoom', payload);
            // 监听服务端的 message 消息，有新消息的时候添加到聊天记录里，并通过 scrollIntoView 滚动到底部。
            socket.on('message', (reply: Reply) => {
                // queryChatHistoryList(chatroomId)
                // 这样，全程只需要查询一次聊天记录，性能好很多。
                setChatHistoryList((chatHistory) => {
                    // 直接在后面添加新的聊天信息
                    return chatHistory ? [...chatHistory, reply.message] : [reply.message]
                });   
                setTimeout(() => {
                    document.getElementById('bottom-bar')?.scrollIntoView({block: 'end'});
                }, 300); // 等待渲染完成再滚动到底部
            });
        })
        return () => {
            socket.disconnect();
        }
    }
    useEffect(() => {
        initSocket();
        // chatroomId改变了需要重新连接socket
    }, [chatroomId]);
    

    const [inputText, setInputText] = useState('');
    /**
     * 发送消息到服务端。
     * @param value 
     */
    function sendMessage(value: string) {
        if (!value) {
            return;
        }
        if (!chatroomId) {
            return;
        }

        const userId = userInfo.id;
        const payload: SendMessagePayload = {
            sendUserId: userId,
            chatroomId: chatroomId,
            message: {
                type: 'text',
                content: value
            }
        }
        // 点击发送消息的时候，通过 socket 链接来 emit 消息
        socketRef.current?.emit('sendMessage', payload);
    }

    // 点击聊天室的时候，在右侧展示查询出的聊天记录
    function toggleChatroom(chatroomId: number) {
        queryChatHistoryList(chatroomId);
        setChatroomId(chatroomId);
    }

    return <div id="chat-container">
        {/* 聊天室列表 */}
        <div className="chat-room-list">
            {
                chatroomList?.map(item => {
                    if (!item) return null;
                    return <div className="chat-room-item" data-id={item.id} key={item.id} onClick={() => {
                        toggleChatroom(item.id);
                    }}>{item.name}</div>
                })
            }
        </div>
        {/* <img src="http://localhost:9001/api/v1/buckets/chat-room/objects/download?preview=true&prefix=james1.jpg&version_id=null" /> */}
        {/* 聊天记录 */}
        {
            chatHistoryList.length ? <div className="message-list">
                {chatHistoryList?.map(item => {
                    if (!item) return null;
                    return <div className={`message-item ${item?.senderId === userInfo?.id ? 'from-me' : ''}`}
                        data-id={item.id} key={item.id} >
                        <div className="message-sender">
                            <img src={item.sender.headPic} />
                            <span className="sender-nickname">{item.sender.nickName}</span>
                        </div>
                        <div className="message-content">
                            {item.content}
                        </div>
                    </div>
                })}
                <div id="bottom-bar" key='bottom-bar'></div>
            </div> : null
        }
        {/* 发送消息 */}
        <div className="message-input">
            <div className="message-type">
                <div className="message-type-item" key={1}>表情</div>
                <div className="message-type-item" key={2}>图片</div>
                <div className="message-type-item" key={3}>文件</div>
            </div>
            <div className="message-input-area">
                <TextArea className="message-input-box" value={inputText} onChange={(e) => {
                    setInputText(e.target.value)
                }} />
                <Button className="message-send-btn" type="primary" onClick={() => {
                    sendMessage(inputText)
                    setInputText('');
                }}>发送</Button>
            </div>
        </div>
    </div>

}
