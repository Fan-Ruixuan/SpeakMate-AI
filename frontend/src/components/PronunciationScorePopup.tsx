import React from 'react';
import { Modal, Progress, Tag, Typography } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { PronunciationEvaluationResult } from '../api/pronunciation';

const { Title, Text } = Typography;

interface Props {
  visible: boolean;
  onCancel: () => void;
  evaluationResult: PronunciationEvaluationResult;
}

const PronunciationScorePopup: React.FC<Props> = ({ visible, onCancel, evaluationResult }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#f5222d';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    return '需改进';
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
          <span>发音评测结果</span>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
    >
      <div style={{ padding: 16 }}>
        {/* 总分展示 */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: getScoreColor(evaluationResult.totalScore),
            }}
          >
            {evaluationResult.totalScore}
          </div>
          <div style={{ marginTop: 8 }}>
            <Tag color={getScoreColor(evaluationResult.totalScore)}>
              {getScoreLevel(evaluationResult.totalScore)}
            </Tag>
          </div>
        </div>

        {/* 分项得分 */}
        <Title level={5} style={{ marginBottom: 16 }}>分项得分</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>流利度</Text>
              <Text strong style={{ color: '#52c41a' }}>{evaluationResult.fluency}%</Text>
            </div>
            <Progress
              percent={evaluationResult.fluency}
              strokeColor="#52c41a"
              showInfo={false}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>准确度</Text>
              <Text strong style={{ color: '#1890ff' }}>{evaluationResult.accuracy}%</Text>
            </div>
            <Progress
              percent={evaluationResult.accuracy}
              strokeColor="#1890ff"
              showInfo={false}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>完整度</Text>
              <Text strong style={{ color: '#722ed1' }}>{evaluationResult.completeness}%</Text>
            </div>
            <Progress
              percent={evaluationResult.completeness}
              strokeColor="#722ed1"
              showInfo={false}
            />
          </div>
        </div>

        {/* 发音错误点 */}
        {evaluationResult.phonemeErrors && evaluationResult.phonemeErrors.length > 0 && (
          <>
            <Title level={5} style={{ marginBottom: 16, marginTop: 24 }}>
              <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
              发音建议
            </Title>
            <div style={{ background: '#fff7e6', padding: 12, borderRadius: 8 }}>
              {evaluationResult.phonemeErrors.map((error, index) => (
                <div key={index} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag color="orange">{error.targetPhoneme}</Tag>
                    <Text strong>应读为 {error.actualPhoneme}</Text>
                  </div>
                  <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                    {error.targetPhoneme} → {error.actualPhoneme}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 改进建议 */}
        {evaluationResult.suggestion && (
          <>
            <Title level={5} style={{ marginBottom: 16, marginTop: 24 }}>改进建议</Title>
            <div style={{ background: '#e6f7ff', padding: 12, borderRadius: 8 }}>
              <Text>{evaluationResult.suggestion}</Text>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PronunciationScorePopup;