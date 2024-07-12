import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeadPicUpload } from './HeadPicUpload';

import { UserInfo, getUserInfo as getUserInfoApi, updateUserInfoCaptcha, updateInfo as updateInfoApi } from '../../api';
import './update-info.css';

const layout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

function _UpdateInfo() {
  const [form] = useForm();
  const navigate = useNavigate();

  const getUserInfo = async () => {
    const res = await getUserInfoApi();
    const { data } = res.data;

    if (res.status === 201 || res.status === 200) {
      console.log(data);
      form.setFieldValue('headPic', data.headPic);
      form.setFieldValue('nickName', data.nickName);
      form.setFieldValue('email', data.email);
    }
  };
  // 获取用户信息
  useEffect(() => {
    getUserInfo();
  }, []);

  const updateInfo = useCallback(async (values: UserInfo) => {
    console.log('values', values);
    const res = await updateInfoApi(values);
    if (res.status === 201 || res.status === 200) {
      const { code, data, message } = res.data;
      if (code === 0) {
        message.success('用户信息更新成功')
        const userInfo = localStorage.getItem('user_info')
        if (userInfo) {
          const _userInfo = JSON.parse(userInfo);
          _userInfo.headPic = values.headPic;
          _userInfo.nickName = values.nickName;
          localStorage.setItem('user_info', JSON.stringify(_userInfo))
        }
      }
      message.success(res.data.data);
    } else {
      message.error(res.data.data || '系统繁忙，请稍后再试');
    }
  }, []);

  const sendCaptcha = useCallback(async function () {
    const res = await updateUserInfoCaptcha();
    if (res.status === 201 || res.status === 200) {
      message.success(res.data.data);
    } else {
      message.error(res.data.data ?? '系统繁忙，请稍后再试');
    }
  }, []);

  return <div id="updateInfo-container">
    <Form
      form={form}
      {...layout1}
      onFinish={updateInfo}
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
        <Input disabled />
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
          修改信息
        </Button>
      </Form.Item>
    </Form>
  </div>
}

export const UpdateInfo = memo(_UpdateInfo);
