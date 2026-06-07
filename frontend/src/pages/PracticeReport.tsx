import { useEffect, useState } from 'react';
import { Card, Typography, Spin, message } from 'antd';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface PracticeReportData {
  summary: {
    totalPracticeDays: number;
    totalSessions: number;
    totalDialogues: number;
    totalErrors: number;
    totalNewWords: number;
  };
  averages: {
    pronunciationScore: number;
    fluencyScore: number;
    accuracyRate: string;
    wpm: number;
  };
  recentPerformance: Array<{
    date: string;
    score: number;
    dialogues: number;
  }>;
  errorDistribution: Array<{
    type: string;
    label: string;
    count: number;
    percentage: string;
  }>;
  wordFrequency: Array<{
    word: string;
    count: number;
    level: string;
  }>;
  weeklyTrend: Array<{
    week: string;
    startDate: string;
    sessions: number;
    avgScore: number;
    totalErrors: number;
  }>;
}

export default function PracticeReport() {
  const [report, setReport] = useState<PracticeReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/report');
      const data = await res.json();
      if (data.code === 200) {
        setReport(data.data);
      } else {
        message.error('获取练习报告失败');
      }
    } catch (err) {
      console.error('Fetch report error:', err);
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="加载练习报告中..." />
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Title level={4}>暂无练习数据</Title>
        <p>开始练习后，这里将展示您的练习报告。</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '24px', textAlign: 'center' }}>
        <BarChartOutlined /> 练习报告
      </Title>

      {/* 汇总数据 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>{report.summary.totalPracticeDays}</div>
            <div style={{ color: '#666' }}>练习天数</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>{report.summary.totalSessions}</div>
            <div style={{ color: '#666' }}>练习次数</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#722ed1' }}>{report.summary.totalDialogues}</div>
            <div style={{ color: '#666' }}>对话数</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f5222d' }}>{report.summary.totalErrors}</div>
            <div style={{ color: '#666' }}>错误数</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fa8c16' }}>{report.summary.totalNewWords}</div>
            <div style={{ color: '#666' }}>生词数</div>
          </div>
        </Card>
      </div>

      {/* 平均分 */}
      <Card title={<><LineChartOutlined /> 平均分</>} style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>{report.averages.pronunciationScore}</div>
            <div style={{ color: '#666' }}>发音分</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a' }}>{report.averages.fluencyScore}</div>
            <div style={{ color: '#666' }}>流利度</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#722ed1' }}>{report.averages.accuracyRate}%</div>
            <div style={{ color: '#666' }}>准确率</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f5222d' }}>{report.averages.wpm}</div>
            <div style={{ color: '#666' }}>WPM</div>
          </div>
        </div>
      </Card>

      {/* 错误分布 */}
      <Card title={<><PieChartOutlined /> 错误分布</>} style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {report.errorDistribution.map((item) => (
            <div key={item.type} style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ color: '#666' }}>次数: {item.count}</div>
              <div style={{ color: '#999' }}>占比: {item.percentage}%</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 高频词汇 */}
      <Card title="高频词汇" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {report.wordFrequency.map((item) => (
            <span key={item.word} style={{ padding: '4px 12px', background: '#e6f7ff', borderRadius: '12px', fontSize: '14px' }}>
              {item.word} ({item.count}次)
            </span>
          ))}
        </div>
      </Card>

      {/* 周趋势 */}
      <Card title="周趋势">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {report.weeklyTrend.map((item) => (
            <div key={item.week} style={{ padding: '12px', background: '#f6ffed', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.week}</div>
              <div style={{ color: '#666' }}>会话: {item.sessions}</div>
              <div style={{ color: '#666' }}>均分: {item.avgScore}</div>
              <div style={{ color: '#666' }}>错误: {item.totalErrors}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}