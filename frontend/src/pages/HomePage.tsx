import { useEffect, useState } from 'react';
import { Card, Typography, Space, Progress, Tag, Divider } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { getSceneList } from '../api/scene';
import type { PronunciationEvaluationResult } from '../api/pronunciation';
import Microphone from '../components/Microphone';
import ChatPanel, { type ChatMessage } from '../components/ChatPanel';
import PronunciationScorePopup from '../components/PronunciationScorePopup';

const { Title } = Typography;

interface SceneItem {
  sid: number;
  scene_name: string;
  prompt: string;
}

export default function HomePage() {
  const [scenes, setScenes] = useState<SceneItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<PronunciationEvaluationResult | null>(null);
  const [selectedScene, setSelectedScene] = useState<SceneItem | null>(null);
  const [showPopup, setShowPopup] = useState(false);

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

  const handleEvaluationComplete = (result: PronunciationEvaluationResult) => {
    setEvaluationResult(result);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
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
              <Card 
                hoverable 
                style={{ borderRadius: 12, cursor: 'pointer' }}
                onClick={() => setSelectedScene({ sid: 1, scene_name: '面试场景', prompt: 'Can you introduce yourself?' } as SceneItem)}
              >
                <Space direction="vertical">
                  <Title level={5}>面试场景</Title>
                  <p style={{ color: '#666' }}>Job Interview</p>
                </Space>
              </Card>
              <Card 
                hoverable 
                style={{ borderRadius: 12, cursor: 'pointer' }}
                onClick={() => setSelectedScene({ sid: 2, scene_name: '点餐场景', prompt: 'I would like to order a steak.' } as SceneItem)}
              >
                <Space direction="vertical">
                  <Title level={5}>点餐场景</Title>
                  <p style={{ color: '#666' }}>Ordering Food</p>
                </Space>
              </Card>
              <Card 
                hoverable 
                style={{ borderRadius: 12, cursor: 'pointer' }}
                onClick={() => setSelectedScene({ sid: 3, scene_name: '会议场景', prompt: 'Let us discuss the project progress.' } as SceneItem)}
              >
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
                style={{ borderRadius: 12, cursor: 'pointer' }}
                bodyStyle={{ padding: '20px 24px' }}
                onClick={() => setSelectedScene(item)}
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

        {selectedScene && (
          <Card style={{ marginTop: 24, borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StarOutlined style={{ color: '#1890ff' }} />
                <strong>当前场景：</strong>
                <Tag color="blue">{selectedScene.scene_name}</Tag>
              </div>
              <p style={{ color: '#666', margin: 0 }}>参考文本：{selectedScene.prompt}</p>
            </Space>
          </Card>
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Microphone 
            onTranscribeSuccess={handleTranscribeSuccess}
            onEvaluationComplete={handleEvaluationComplete}
            referenceText={selectedScene?.prompt}
          />
        </div>

        {evaluationResult && (
          <Card style={{ marginTop: 24, borderRadius: 12 }}>
            <Title level={5}>发音评测结果</Title>
            <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
              <div style={{ flex: 1 }}>
                <p style={{ marginBottom: 8 }}>总分</p>
                <Progress percent={evaluationResult.totalScore} size="small" strokeColor="#1890ff" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ marginBottom: 8 }}>流利度</p>
                <Progress percent={evaluationResult.fluency} size="small" strokeColor="#52c41a" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ marginBottom: 8 }}>准确度</p>
                <Progress percent={evaluationResult.accuracy} size="small" strokeColor="#faad14" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ marginBottom: 8 }}>完整度</p>
                <Progress percent={evaluationResult.completeness} size="small" strokeColor="#722ed1" />
              </div>
            </div>
            {evaluationResult.phonemeErrors.length > 0 && (
              <>
                <Divider style={{ margin: '16px 0' }} />
                <p style={{ fontWeight: 500 }}>发音问题：</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {evaluationResult.phonemeErrors.map((error, index) => (
                    <Tag key={index} color="red">
                      {error.word}: /{error.actualPhoneme}/ → /{error.targetPhoneme}/
                    </Tag>
                  ))}
                </div>
              </>
            )}
            <Divider style={{ margin: '16px 0' }} />
            <p style={{ color: '#52c41a' }}>{evaluationResult.suggestion}</p>
          </Card>
        )}

        <div style={{ marginTop: 30 }}>
          <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
        </div>

        {evaluationResult && (
          <PronunciationScorePopup
            visible={showPopup}
            onCancel={handleClosePopup}
            evaluationResult={evaluationResult}
          />
        )}
      </div>
    </div>
  );
}