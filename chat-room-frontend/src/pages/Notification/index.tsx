import { Button, Form, Input, Popconfirm, Table, Tabs, TabsProps, message } from "antd";
import { useForm } from "antd/es/form/Form";
import './index.css';
import { useEffect, useState } from "react";
import { FriendRequest } from "./types";
import { friendRequestList, agreeFriendRequest, rejectFriendRequest } from "@/api";
import { getToMeColumns, getFromMeColumns } from "./model";

export function Notification() {

    const [form] = useForm();
    const toMeColumns = getToMeColumns({
        agree,
        reject
    });
    const fromMeColumns = getFromMeColumns();
    const [fromMe, setFromMe] = useState<Array<FriendRequest>>([]);
    const [toMe, setToMe] = useState<Array<FriendRequest>>([]);

    async function queryFriendRequestList() {
        try {
            const res = await friendRequestList();

            if (res.status === 201 || res.status === 200) {
                const fromMeList = res.data.fromMe.map((item: FriendRequest) => {
                    return {
                        ...item,
                        key: item.id
                    }
                })
                const toMeList = res.data.toMe.map((item: FriendRequest) => {
                    return {
                        ...item,
                        key: item.id
                    }
                });
                setFromMe(fromMeList);
                setToMe(toMeList);
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }


    useEffect(() => {
        queryFriendRequestList();
    }, []);

    const onChange = (key: string) => {
        console.log(key);
    };
    async function agree(id: number) {
        try{
            console.log('agree id', id);
            const res = await agreeFriendRequest(id);
            
            if(res.status === 201 || res.status === 200) {
                message.success('操作成功');
                queryFriendRequestList();
            }
        } catch(e: any){
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }
    
    async function reject(id: number) {
        try{
            const res = await rejectFriendRequest(id);
    
            if(res.status === 201 || res.status === 200) {
                message.success('操作成功');
                queryFriendRequestList();
            }
        } catch(e: any){
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }
    

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '发给我的',
            children: <div style={{ width: 1000 }}>
                <Table columns={toMeColumns} dataSource={toMe} style={{ width: '1000px' }} />
            </div>
        },
        {
            key: '2',
            label: '我发出的',
            children: <div style={{ width: 1000 }}>
                <Table columns={fromMeColumns} dataSource={fromMe} style={{ width: '1000px' }} />
            </div>
        }
    ];


    return <div id="notification-container">
        <div className="notification-list">
            <Tabs defaultActiveKey="fromMe" items={items} onChange={onChange} />
        </div>
    </div>
}
