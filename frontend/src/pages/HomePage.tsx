import { useEffect, useState } from 'react';
import { Card, Typography, Space } from 'antd';
import { getSceneList } from '../api/scene';
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
          <Microphone />
        </div>
      </div>
    </div>
  );
}