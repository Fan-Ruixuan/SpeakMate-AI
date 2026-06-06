import { useEffect, useState } from 'react';
import { Card, Typography, Space } from 'antd';
import { getSceneList } from '../api/scene';
// 修复标黄：正确相对路径
import Microphone from '../components/Microphone';

const { Title } = Typography;

interface SceneItem {
  sid: number;
  scene_name: string;
  prompt: string;
}

export default function HomePage() {
  const [scenes, setScenes] = useState<SceneItem[]>([]);

  useEffect(() => {
    const fetchScenes = async () => {
      const res = await getSceneList();
      if (res.code === 200) {
        setScenes(res.data);
      }
    };
    fetchScenes();
  }, []);

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
          {scenes.map((item) => (
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
          ))}
        </div>

        {/* 挂载录音组件（第三笔核心内容） */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Microphone />
        </div>
      </div>
    </div>
  );
}