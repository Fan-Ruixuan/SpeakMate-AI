import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Tooltip,
  message,
} from 'antd';
import {
  PlusOutlined as Plus,
  DeleteOutlined as Trash2,
  BookOutlined as BookOpen,
  ExclamationCircleOutlined as AlertCircle,
  BarChartOutlined as BarChart3,
} from '@ant-design/icons';
import {
  getVocabularyList,
  addVocabulary,
  deleteVocabulary,
  getVocabularyStats,
  type VocabularyItem,
  type VocabularyStats,
} from '../api/vocabulary';

const VocabularyPage = () => {
  const [dataSource, setDataSource] = useState<VocabularyItem[]>([]);
  const [stats, setStats] = useState<VocabularyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchVocabularyList = async () => {
    setLoading(true);
    try {
      const response = await getVocabularyList({ page: 1, limit: 50 });
      if (response.code === 200) {
        setDataSource(response.data.list);
      }
    } catch (error) {
      console.error('Failed to fetch vocabulary:', error);
      message.error('获取生词列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getVocabularyStats();
      if (response.code === 200) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchVocabularyList();
    fetchStats();
  }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const response = await addVocabulary({
        word: values.word,
        phonetic: values.phonetic,
        wrongSent: values.wrongSent,
      });
      if (response.code === 200) {
        message.success('添加成功');
        setModalVisible(false);
        form.resetFields();
        fetchVocabularyList();
        fetchStats();
      } else {
        message.error(response.msg || '添加失败');
      }
    } catch (error) {
      console.error('Add vocabulary error:', error);
      message.error('添加失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteVocabulary(id);
      if (response.code === 200) {
        message.success('删除成功');
        fetchVocabularyList();
        fetchStats();
      } else {
        message.error(response.msg || '删除失败');
      }
    } catch (error) {
      console.error('Delete vocabulary error:', error);
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '单词',
      dataIndex: 'word',
      key: 'word',
      width: 120,
      render: (text: string) => (
        <span className="font-bold text-blue-600">{text}</span>
      ),
    },
    {
      title: '音标',
      dataIndex: 'phonetic',
      key: 'phonetic',
      width: 150,
      render: (text: string) => (
        <span className="text-gray-500 font-mono">{text || '-'}</span>
      ),
    },
    {
      title: '错误次数',
      dataIndex: 'errorCount',
      key: 'errorCount',
      width: 100,
      align: 'center',
      render: (count: number) => (
        <Tag color={count > 5 ? 'red' : count > 2 ? 'orange' : 'green'}>
          {count} 次
        </Tag>
      ),
    },
    {
      title: '错误例句',
      dataIndex: 'wrongSentence',
      key: 'wrongSentence',
      width: 250,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="truncate text-gray-600">{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '添加时间',
      dataIndex: 'addedAt',
      key: 'addedAt',
      width: 150,
      render: (text: string) => (
        <span className="text-gray-500">
          {text ? new Date(text).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_: any, record: VocabularyItem) => (
        <Button
          danger
          size="small"
          icon={<Trash2 />}
          onClick={() => handleDelete(record.id)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-blue-600" />
          生词本
        </h1>
        <p className="text-gray-500 mt-1">管理您在练习中遇到的生词</p>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card className="text-center">
            <Statistic
              title="生词总数"
              value={stats?.totalWords || 0}
              prefix={<BookOpen className="text-blue-500" />}
              className="text-3xl"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="text-center">
            <Statistic
              title="错误累计"
              value={stats?.totalErrors || 0}
              prefix={<AlertCircle className="text-orange-500" />}
              className="text-3xl"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="高频错词 TOP5">
            <div className="flex flex-wrap gap-2">
              {stats?.topErrorWords.map((item, index) => (
                <div
                  key={item.word}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full"
                >
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                  <span className="font-medium">{item.word}</span>
                  <Tag color="red">{item.errors}次</Tag>
                </div>
              ))}
              {(!stats?.topErrorWords || stats.topErrorWords.length === 0) && (
                <span className="text-gray-400">暂无数据</span>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        className="mb-4"
        extra={
          <Button
            type="primary"
            icon={<Plus />}
            onClick={() => setModalVisible(true)}
          >
            添加生词
          </Button>
        }
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="text-gray-400" />
          <span className="text-gray-600">生词列表</span>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns as any}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          locale={{
            emptyText: '暂无生词记录',
          }}
        />
      </Card>

      <Modal
        title="添加生词"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleAdd}>
            确定
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="word"
            label="单词"
            rules={[{ required: true, message: '请输入单词' }]}
          >
            <Input placeholder="请输入英文单词" />
          </Form.Item>
          <Form.Item name="phonetic" label="音标">
            <Input placeholder="可选，输入音标" />
          </Form.Item>
          <Form.Item name="wrongSent" label="错误例句">
            <Input.TextArea placeholder="可选，输入包含该单词的错误句子" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VocabularyPage;
