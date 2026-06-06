import { useState } from 'react';
import { Button, Input, Card, message, Typography } from 'antd';
import { loginApi } from '../api/user';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export default function LoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');

  const handleLogin = async () => {
    try {
      const res = await loginApi({ username, pwd });
      if (res.code === 200) {
        localStorage.setItem('uid', String(res.data.uid));
        message.success('登录成功');
        nav('/home');
      } else {
        message.error(res.msg || '登录失败');
      }
    } catch (err) {
      message.error('网络或服务异常');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f2f5'
    }}>
      <Card
        style={{
          width: 400,
          padding: '24px 32px',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          SpeakMate-AI 口语陪练
        </Title>

        <Input
          placeholder="请输入用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 16 }}
          size="large"
        />

        <Input.Password
          placeholder="请输入密码"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          style={{ marginBottom: 20 }}
          size="large"
        />

        <Button
          type="primary"
          block
          size="large"
          onClick={handleLogin}
          style={{ borderRadius: 6 }}
        >
          登录
        </Button>
      </Card>
    </div>
  );
}