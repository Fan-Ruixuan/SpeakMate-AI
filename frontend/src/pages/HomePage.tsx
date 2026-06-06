import { useEffect, useState } from 'react';
import { Card, Typography, Space } from 'antd';
import { getSceneList } from '../api/scene';
import Microphone from '../components/Microphone';
import ChatPanel, { type ChatMessage } from '../components/ChatPanel';

const { Title } = Typography;

interface SceneItem {
  sid: number;
  scene_name: string;
  prompt: string;
}

export default function HomePage() {
  const [scenes, setScenes] = useState<SceneItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchScenes = async () => {
      const res = await getSceneList();
      if (res.code === 200) {
        setScenes(res.data);
      }
    };
    fetchScenes();
  }, []);

  const handleTranscribeSuccess = (text: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: text,
      type: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        content: `I understand you said: "${text}". Would you like to practice more?`,
        type: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      type: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        content: `You typed: "${content}". This is a great practice!`,
        type: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 24px',
      background: '#f0f2f5'
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Title level={3} style={{ marginBottom: 28 }}>
          选择口语练习场景
        </Title>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20
        }}>
          {scenes.length === 0 ? (
            <>
              <Card hoverable style={{ borderRadius: 12 }}>
                <Space direction="vertical">
                  <Title level={5}>面试场景</Title>
                  <p style={{ color: '#666' }}>Job Interview</p>
                </Space>
              </Card>
              <Card hoverable style={{ borderRadius: 12 }}>
                <Space direction="vertical">
                  <Title level={5}>点餐场景</Title>
                  <p style={{ color: '#666' }}>Ordering Food</p>
                </Space>
              </Card>
              <Card hoverable style={{ borderRadius: 12 }}>
                <Space direction="vertical">
                  <Title level={5}>会议场景</Title>
                  <p style={{ color: '#666' }}>Meeting</p>
                </Space>
              </Card>
            </>
          ) : (
            scenes.map((item) => (
              <Card
                key={item.sid}
                hoverable
                style={{ borderRadius: 12 }}
                bodyStyle={{ padding: '20px 24px' }}
              >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Title level={5} style={{ margin: 0 }}>
                    {item.scene_name}
                  </Title>
                  <p style={{
                    color: '#666',
                    fontSize: 13,
                    margin: 0,
                    lineHeight: 1.5
                  }}>
                    {item.prompt}
                  </p>
                </Space>
              </Card>
            ))
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Microphone onTranscribeSuccess={handleTranscribeSuccess} />
        </div>

        <div style={{ marginTop: 30 }}>
          <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
