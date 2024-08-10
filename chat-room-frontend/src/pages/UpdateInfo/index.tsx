import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect } from 'react';
import './index.css';
import { HeadPicUpload } from './HeadPicUpload';
import { getUserInfo, updateInfo, updateUserInfoCaptcha } from '../../api';

export interface UserInfo {
    headPic: string;
    nickName: string;
    email: string;
    captcha: string;
}

const layout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

export function UpdateInfo() {
    const [form] = useForm();


    async function queryUserInfo() {
        const res = await getUserInfo();

        if (res.status === 201 || res.status === 200) {
            console.log(res.data);
            const { headPic, nickName, email, username } = res.data;
            form.setFieldValue('headPic', headPic);
            form.setFieldValue('nickName', nickName);
            form.setFieldValue('email', email);
            form.setFieldValue('username', username);
        }
    }
    const onFinish = async (values: UserInfo) => {
        try {
            const res = await updateInfo(values);
            if (res.status === 201 || res.status === 200) {
                message.success('用户信息更新成功');
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    const info = JSON.parse(userInfo);
                    info.headPic = values.headPic;
                    info.nickName = values.nickName;

                    localStorage.setItem('userInfo', JSON.stringify(info));
                }
                queryUserInfo();
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    };

    const sendCaptcha = async function () {
        try {
            const res = await updateUserInfoCaptcha();
            if (res.status === 201 || res.status === 200) {
                message.success('发送成功');
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    };
    useEffect(() => {
        queryUserInfo();
    }, []);

    return <div id="updateInfo-container">
        <Form
            form={form}
            {...layout1}
            onFinish={onFinish}
            colon={false}
            autoComplete="off"
        >
            <Form.Item
                label="头像"
                name="headPic"
                rules={[
                    { required: true, message: '请输入头像!' },
                ]}
            >
                <HeadPicUpload />
            </Form.Item>

            <Form.Item
                label="昵称"
                name="nickName"
                rules={[
                    { required: true, message: '请输入昵称!' },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="邮箱"
                name="email"
                rules={[
                    { required: true, message: '请输入邮箱!' },
                    { type: "email", message: '请输入合法邮箱地址!' }
                ]}
            >
                <Input />
            </Form.Item>

            <div className='captcha-wrapper'>
                <Form.Item
                    label="验证码"
                    name="captcha"
                    rules={[{ required: true, message: '请输入验证码!' }]}
                >
                    <Input />
                </Form.Item>
                <Button type="primary" onClick={sendCaptcha}>发送验证码</Button>
            </div>

            <Form.Item
                {...layout1}
                label=" "
            >
                <Button className='btn' type="primary" htmlType="submit">
                    修改密码
                </Button>
            </Form.Item>
        </Form>
    </div>
}
