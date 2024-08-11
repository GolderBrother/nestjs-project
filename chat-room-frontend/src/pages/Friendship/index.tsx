import { Badge, Button, Form, Input, Table, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import './index.css';
import { ColumnsType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import { friendshipList, findChatroom, createOneToOne } from "@/api";
import { AddFriendModal } from './AddFriendModal';
import { getUserInfo } from "@/pages/Chat/utils"
import { useNavigate } from "react-router-dom";
interface SearchFriend {
    name: string;
}

interface FriendshipSearchResult {
    id: number;
    username: string;
    nickName: string;
    headPic: string;
    email: string;
}

export function Friendship() {
    const navigate = useNavigate();
    const [friendshipResult, setFriendshipResult] = useState<Array<FriendshipSearchResult>>([]);
    const [addFriendModalIsOpen, setAddFriendModalIsOpen] = useState<boolean>(false)
    const openAddFriendModal= () => {
        setAddFriendModalIsOpen(true)
    }
    const closeAddFriendModal= () => {
        setAddFriendModalIsOpen(false)
    }
    /**
     * 在好友列表点击聊天，会查询 userId 和 friendId 所在的一对一聊天室的 id（如果没查到，会创建一个），然后跳转到聊天页面，选中对应的聊天室。
     * @param friendId 
     */
    const goToChat = async (friendId: number) => {
        // 需要拿到两个用户的 id，就能查到对应的聊天室
        const userId = getUserInfo().id;
        try{
            const res = await findChatroom(userId, friendId);
    
            // 如果有聊天室，则跳转到聊天页面
            if(res.data) {
                navigate('/chat', {
                    state: {
                        chatroomId: res.data
                    }
                });
            } else {
                // 否则创建一个新的聊天室，然后跳转到聊天页面
                const res2 = await createOneToOne(friendId);
                navigate('/chat', {
                    state: {
                        chatroomId: res2.data
                    }
                });
            }
        } catch(e: unknown){
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }
    const columns: ColumnsType<FriendshipSearchResult> = useMemo(() => [
        {
            title: '昵称',
            dataIndex: 'nickName'
        },
        {
            title: '头像',
            dataIndex: 'headPic',
            render: (_, record) => (
                <div>
                    <img src={record.headPic} />
                </div>
            )
        },
        {
            title: '邮箱',
            dataIndex: 'email'
        },
        {
            title: '操作',
            render: (_, record) => (
                <div>
                    <a href="#" onClick={() => goToChat(record.id)}>聊天</a>
                </div>
            )
        }
    ], []);

    const searchFriend = async (values: SearchFriend) => {
        try {
            const res = await friendshipList(values.name || '');

            if (res.status === 201 || res.status === 200) {
                setFriendshipResult(res.data.map((item: FriendshipSearchResult) => {
                    return {
                        ...item,
                        key: item.id
                    }
                }));
            }
        } catch (e: unknown) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    };


    const [form] = useForm();

    useEffect(() => {
        searchFriend({
            name: form.getFieldValue('name')
        });
    }, []);


    return <div id="friendship-container">
        <div className="friendship-form">
            <Form
                form={form}
                onFinish={searchFriend}
                name="search"
                layout='inline'
                colon={false}
            >
                <Form.Item label="名称" name="name">
                    <Input />
                </Form.Item>

                <Form.Item label=" ">
                    <Button type="primary" htmlType="submit">
                        搜索
                    </Button>
                </Form.Item>
                <Form.Item label=" ">
                    <Button type="primary" style={{ background: 'green' }} onClick={openAddFriendModal}>
                        添加好友
                    </Button>
                </Form.Item>

            </Form>
        </div>
        <div className="friendship-table">
            <Table columns={columns} dataSource={friendshipResult} style={{ width: '1000px' }} />
        </div>
        <AddFriendModal isOpen={addFriendModalIsOpen} handleClose={closeAddFriendModal} />
    </div>
}
