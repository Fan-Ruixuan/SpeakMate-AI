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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();

  const fetchVocabularyList = async () => {
    setLoading(true);
    try {
      const response = await getVocabularyList({ page: currentPage, limit: pageSize });
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
      align: 'center' as const,
      render: (text: string) => (
        <span className="font-bold text-lg text-blue-600 hover:text-blue-700 transition-colors">
          {text}
        </span>
      ),
    },
    {
      title: '音标',
      dataIndex: 'phonetic',
      key: 'phonetic',
      width: 150,
      align: 'center' as const,
      render: (text: string) => (
        <span className="text-gray-500 font-mono text-sm">{text || '-'}</span>
      ),
    },
    {
      title: '错误次数',
      dataIndex: 'errorCount',
      key: 'errorCount',
      width: 100,
      align: 'center' as const,
      render: (count: number) => {
        const color = count > 5 ? 'red' : count > 2 ? 'orange' : 'green';
        return (
          <Tag color={color} className="font-medium">
            {count} 次
          </Tag>
        );
      },
    },
    {
      title: '错误例句',
      dataIndex: 'wrongSentence',
      key: 'wrongSentence',
      width: 250,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text || '无'} placement="top">
          <span className="text-gray-600">{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '添加时间',
      dataIndex: 'addedAt',
      key: 'addedAt',
      width: 150,
      align: 'center' as const,
      render: (text: string) => (
        <span className="text-gray-500 text-sm">
          {text ? new Date(text).toLocaleString('zh-CN') : '-'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center' as const,
      render: (_: unknown, record: VocabularyItem) => (
        <Button
          danger
          size="small"
          icon={<Trash2 />}
          onClick={() => handleDelete(record.id)}
          className="hover:bg-red-600 transition-colors"
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <BookOpen className="text-blue-600 text-3xl" />
            生词本
          </h1>
          <p className="text-gray-500 mt-2 text-sm">管理您在练习中遇到的生词，掌握每一个知识点</p>
        </div>

        {/* Stats Cards */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card
              className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              bodyStyle={{ textAlign: 'center' }}
            >
              <Statistic
                title="生词总数"
                value={stats?.totalWords || 0}
                prefix={<BookOpen className="text-blue-500" />}
                valueStyle={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              bodyStyle={{ textAlign: 'center' }}
            >
              <Statistic
                title="错误累计"
                value={stats?.totalErrors || 0}
                prefix={<AlertCircle className="text-orange-500" />}
                valueStyle={{ fontSize: '28px', fontWeight: 'bold', color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={<span className="font-semibold text-gray-600">高频错词 TOP5</span>}
              className="shadow-sm border border-gray-100"
            >
              <div className="flex flex-wrap gap-3">
                {stats?.topErrorWords.map((item, index) => (
                  <div
                    key={item.word}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-full border border-red-100"
                  >
                    <span className="text-xs text-gray-400 font-medium">#{index + 1}</span>
                    <span className="font-medium text-gray-700">{item.word}</span>
                    <Tag color="red" className="text-xs">{item.errors}次</Tag>
                  </div>
                ))}
                {(!stats?.topErrorWords || stats.topErrorWords.length === 0) && (
                  <span className="text-gray-400 text-sm">暂无数据</span>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Vocabulary Table */}
        <Card
          className="shadow-sm border border-gray-100"
          extra={
            <Button
              type="primary"
              icon={<Plus />}
              onClick={() => setModalVisible(true)}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              添加生词
            </Button>
          }
          title={
            <div className="flex items-center gap-2 pb-1">
              <BarChart3 className="text-gray-400" />
              <span className="text-gray-700 font-medium">生词列表</span>
            </div>
          }
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            loading={loading}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              pageSizeOptions: ['10', '20', '30', '50'],
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`,
              onChange: async (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
                await fetchVocabularyList();
              },
            }}
            locale={{
              emptyText: (
                <div className="py-12 text-center">
                  <BookOpen className="text-gray-300 text-4xl mx-auto mb-4" />
                  <p className="text-gray-400">暂无生词记录</p>
                  <p className="text-gray-400 text-sm mt-1">点击上方按钮添加生词</p>
                </div>
              ),
            }}
            className="mt-4"
            bordered
            rowClassName="hover:bg-gray-50 transition-colors"
          />
        </Card>

        {/* Add Modal */}
        <Modal
          title="添加生词"
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={[
            <Button key="back" onClick={() => setModalVisible(false)} className="text-gray-600">
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700"
            >
              确定
            </Button>,
          ]}
          centered
          width={500}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="word"
              label="单词"
              rules={[{ required: true, message: '请输入单词' }]}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Input
                placeholder="请输入英文单词"
                className="w-full"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="phonetic"
              label="音标"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Input
                placeholder="可选，输入音标（如 /wɜːrd/）"
                className="w-full"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="wrongSent"
              label="错误例句"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Input.TextArea
                placeholder="可选，输入包含该单词的错误句子"
                className="w-full"
                size="large"
                rows={3}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default VocabularyPage;
