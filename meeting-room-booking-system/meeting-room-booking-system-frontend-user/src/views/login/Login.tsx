import { Button, Form, Input, message } from 'antd';
import './login.css';
import { login } from '../../api';
import { useNavigate } from 'react-router';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

interface LoginUser {
  username: string;
  password: string;
}

const layout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

const layout2 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 }
}
export function Login() {
  const navigate = useNavigate();
  const onFinish = useCallback(async (values: LoginUser) => {
    try {
      const res = await login(values.username, values.password);
      console.log('res.data', res.data);
      const { code, message: msg, data } = res.data;
      if (res.status === 201 || res.status === 200) {
        message.success('登录成功');

        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('user_info', JSON.stringify(data.userInfo));
        // 登录成功后导航到首页
        setTimeout(() => {
          navigate('/');
        }, 1000);

      } else {
        message.error(data || '系统繁忙，请稍后再试');
      }
    } catch (error: any) {
      console.log('error', error);
      message.error(error.message || '系统繁忙，请稍后再试');
    }
  }, []);

  // 点击 Google 登录按钮的时候修改 location.href 为 /user/google 触发 Google 账号登录授权。
  // 授权后会回调 /user/callback/google，我们在接口查询了用户信息，通过 cookie 返回 userInfo 和 jwt 的 token，然后重定向到首页。
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3005/user/google";
  }

  return (
    <div id="login-container">
      <h1>会议室预订系统</h1>
      <Form
        {...layout1}
        onFinish={onFinish}
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          {...layout2}
        >
          <div className='links'>
            <Link to="/register">创建账号</Link>
            <Link to="/update_password">忘记密码</Link>
          </div>
        </Form.Item>


        <Form.Item
          {...layout2}
        >
          <div>
            <a href="#" onClick={handleGoogleLogin}>Google 账号登录</a>
          </div>
        </Form.Item>


        <Form.Item
          {...layout2}
        >
          <Button className='btn' type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
