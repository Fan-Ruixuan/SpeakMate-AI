import { useEffect, useState, useRef } from 'react';
import { Card, Typography, Spin, message, Row, Col } from 'antd';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

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
  const lineChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReport();
  }, []);

  useEffect(() => {
    if (report && lineChartRef.current && barChartRef.current && pieChartRef.current) {
      initCharts();
    }
  }, [report]);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/report');
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

  const initCharts = () => {
    if (!report) return;

    // 折线图 - 最近表现趋势
    const lineChart = echarts.init(lineChartRef.current!);
    lineChart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: '#eee',
        borderWidth: 1,
        textStyle: { color: '#333' },
        formatter: (params: any) => {
          let result = `<div style="font-weight:bold;margin-bottom:8px">${params[0].axisValue}</div>`;
          params.forEach((item: any) => {
            result += `<div style="display:flex;justify-content:space-between;margin:4px 0">
              <span>${item.marker} ${item.seriesName}</span>
              <span style="font-weight:bold">${item.value}</span>
            </div>`;
          });
          return result;
        },
      },
      grid: { left: '3%', right: '15%', bottom: '18%', top: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        data: report.recentPerformance.map(item => item.date),
        axisLine: { lineStyle: { color: '#ddd' } },
        axisLabel: {
          color: '#666',
          interval: 0,
          rotate: 30,
          fontSize: 11,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '得分',
          min: 0,
          max: 100,
          position: 'left',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#eee', type: 'dashed' } },
          axisLabel: { color: '#1890ff' },
        },
        {
          type: 'value',
          name: '对话数',
          min: 0,
          max: 20,
          position: 'right',
          offset: 0,
          axisLine: { show: true, lineStyle: { color: '#52c41a' } },
          axisTick: { show: true, lineStyle: { color: '#52c41a' } },
          axisLabel: { color: '#52c41a' },
        },
      ],
      series: [
        {
          name: '得分',
          type: 'line',
          yAxisIndex: 0,
          data: report.recentPerformance.map(item => item.score),
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: { color: '#1890ff' },
          lineStyle: { width: 3 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24,144,255,0.4)' },
              { offset: 1, color: 'rgba(24,144,255,0.05)' },
            ]),
          },
          emphasis: {
            focus: 'series',
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(24,144,255,0.5)' },
          },
        },
        {
          name: '对话数',
          type: 'line',
          yAxisIndex: 1,
          data: report.recentPerformance.map(item => item.dialogues),
          smooth: true,
          symbol: 'diamond',
          symbolSize: 8,
          itemStyle: { color: '#52c41a' },
          lineStyle: { width: 3 },
          emphasis: {
            focus: 'series',
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(82,196,26,0.5)' },
          },
        },
      ],
      legend: {
        data: ['得分', '对话数'],
        bottom: 0,
        icon: 'roundRect',
        itemWidth: 12,
        itemHeight: 4,
      },
    });

    // 柱状图 - 周趋势
    const barChart = echarts.init(barChartRef.current!);
    barChart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: '#eee',
        borderWidth: 1,
        textStyle: { color: '#333' },
        axisPointer: { type: 'shadow' },
      },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: report.weeklyTrend.map(item => item.week),
        axisLine: { lineStyle: { color: '#ddd' } },
        axisLabel: { color: '#666' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#eee', type: 'dashed' } },
        axisLabel: { color: '#666' },
      },
      series: [
        {
          name: '会话数',
          type: 'bar',
          data: report.weeklyTrend.map(item => item.sessions),
          barWidth: '35%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#9254de' },
              { offset: 1, color: '#722ed1' },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#b37feb' },
                { offset: 1, color: '#9254de' },
              ]),
            },
          },
        },
        {
          name: '平均得分',
          type: 'bar',
          data: report.weeklyTrend.map(item => item.avgScore),
          barWidth: '35%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#40a9ff' },
              { offset: 1, color: '#1890ff' },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#69c0ff' },
                { offset: 1, color: '#40a9ff' },
              ]),
            },
          },
        },
      ],
      legend: {
        data: ['会话数', '平均得分'],
        bottom: 0,
        icon: 'roundRect',
        itemWidth: 12,
        itemHeight: 4,
      },
    });

    // 饼图 - 错误分布
    const pieChart = echarts.init(pieChartRef.current!);
    pieChart.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: '#eee',
        borderWidth: 1,
        textStyle: { color: '#333' },
        formatter: '{b}: {c}次 ({d}%)',
      },
      series: [
        {
          name: '错误类型',
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            fontSize: 12,
            color: '#666',
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10,
            smooth: true,
          },
          emphasis: {
            label: { show: true, fontSize: 14, fontWeight: 'bold' },
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
          data: report.errorDistribution.map(item => ({
            value: item.count,
            name: item.label,
          })),
        },
      ],
      color: ['#ff4d4f', '#fa8c16', '#1890ff', '#52c41a', '#722ed1'],
    });

    // 响应式
    const handleResize = () => {
      lineChart.resize();
      barChart.resize();
      pieChart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      lineChart.dispose();
      barChart.dispose();
      pieChart.dispose();
    };
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
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>{report.summary.totalPracticeDays}</div>
              <div style={{ color: '#666' }}>练习天数</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>{report.summary.totalSessions}</div>
              <div style={{ color: '#666' }}>练习次数</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#722ed1' }}>{report.summary.totalDialogues}</div>
              <div style={{ color: '#666' }}>对话数</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f5222d' }}>{report.summary.totalErrors}</div>
              <div style={{ color: '#666' }}>错误数</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fa8c16' }}>{report.summary.totalNewWords}</div>
              <div style={{ color: '#666' }}>生词数</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#13c2c2' }}>{report.averages.pronunciationScore}</div>
              <div style={{ color: '#666' }}>发音分</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title={<><LineChartOutlined /> 最近7天表现趋势</>}>
            <div ref={lineChartRef} style={{ width: '100%', height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><BarChartOutlined /> 周趋势统计</>}>
            <div ref={barChartRef} style={{ width: '100%', height: '300px' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title={<><PieChartOutlined /> 错误类型分布</>}>
            <div ref={pieChartRef} style={{ width: '100%', height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="高频词汇">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '20px' }}>
              {report.wordFrequency.map((item) => (
                <span key={item.word} style={{
                  padding: '6px 16px',
                  background: '#e6f7ff',
                  borderRadius: '16px',
                  fontSize: '14px',
                  border: '1px solid #91d5ff',
                }}>
                  {item.word} <span style={{ color: '#1890ff', fontWeight: 'bold' }}>({item.count})</span>
                </span>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 周趋势表格 */}
      <Card title="周趋势详情">
        <Row gutter={[16, 16]}>
          {report.weeklyTrend.map((item) => (
            <Col xs={12} sm={6} key={item.week}>
              <div style={{
                padding: '16px',
                background: '#f6ffed',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #b7eb8f',
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>{item.week}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>会话: {item.sessions}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>均分: {item.avgScore}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>错误: {item.totalErrors}</div>
                <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>{item.startDate}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}