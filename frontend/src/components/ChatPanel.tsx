import React, { useRef, useEffect, useCallback, useState } from 'react';
import { MessageOutlined, RobotOutlined, SendOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Avatar, Tag, Divider } from 'antd';
import { Input } from 'antd';
import type { GrammarCorrectionResult } from '../api/grammar';

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai' | 'system';
  timestamp?: Date;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '500px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          background: '#fafafa',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <MessageOutlined style={{ fontSize: '56px', marginBottom: '16px', color: '#d9d9d9' }} />
            <p style={{ fontSize: '14px' }}>开始你的英语口语练习之旅吧！</p>
            <p style={{ fontSize: '12px', marginTop: '8px', color: '#bbb' }}>点击录音或输入消息开始对话</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map((msg) => (
              <>
                {msg.type === 'system' ? (
                  // 系统消息：语法纠错结果
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      animation: 'fadeIn 0.3s ease-out',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '90%',
                        padding: '16px',
                        background: '#fffbe6',
                        borderRadius: '12px',
                        border: '1px solid #ffe58f',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <EditOutlined style={{ color: '#faad14', fontSize: '18px' }} />
                        <span style={{ fontWeight: 'bold', color: '#d48806' }}>语法与用词纠错</span>
                      </div>
                      {(() => {
                        try {
                          const data = JSON.parse(msg.content) as GrammarCorrectionResult;
                          return (
                            <>
                              {data.errors.map((error) => (
                                <div 
                                  key={error.id} 
                                  style={{ 
                                    marginBottom: '12px', 
                                    padding: '10px',
                                    background: '#fff',
                                    borderRadius: '6px',
                                    borderLeft: `4px solid ${
                                      error.type === 'grammar' ? '#f5222d' :
                                      error.type === 'spelling' ? '#fa8c16' :
                                      error.type === 'wording' ? '#1890ff' : '#52c41a'
                                    }`
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                    <Tag color={
                                      error.type === 'grammar' ? 'red' :
                                      error.type === 'spelling' ? 'orange' :
                                      error.type === 'wording' ? 'blue' : 'green'
                                    }>
                                      {error.type.toUpperCase()}
                                    </Tag>
                                    <span style={{ textDecoration: 'line-through', color: '#f5222d' }}>
                                      {error.original}
                                    </span>
                                    <span style={{ color: '#52c41a' }}>→</span>
                                    <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                                      {error.replacement}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    {error.message}
                                  </div>
                                </div>
                              ))}
                              {data.overallSuggestion && (
                                <div style={{ 
                                  marginTop: '12px', 
                                  padding: '10px',
                                  background: '#f6ffed',
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}>
                                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                  <span style={{ fontSize: '13px', color: '#389e0d' }}>
                                    {data.overallSuggestion}
                                  </span>
                                </div>
                              )}
                            </>
                          );
                        } catch (e) {
                          return <div>{msg.content}</div>;
                        }
                      })()}
                    </div>
                  </div>
                ) : (
                  // 用户消息和 AI 消息
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                      animation: 'fadeIn 0.3s ease-out',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '75%',
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '10px',
                      }}
                    >
                      {msg.type === 'ai' && (
                        <Avatar
                          icon={<RobotOutlined />}
                          style={{ backgroundColor: '#52c41a', marginBottom: '4px' }}
                          size="small"
                        />
                      )}
                      <div
                        style={{
                          padding: '12px 18px',
                          borderRadius: msg.type === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          backgroundColor: msg.type === 'user' ? '#1890ff' : '#fff',
                          color: msg.type === 'user' ? '#fff' : '#333',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                          wordBreak: 'break-word',
                          lineHeight: '1.6',
                        }}
                      >
                        {msg.content}
                      </div>
                      {msg.type === 'user' && (
                        <Avatar
                          icon={<MessageOutlined />}
                          style={{ backgroundColor: '#1890ff', marginBottom: '4px' }}
                          size="small"
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ padding: '16px', background: '#fff', borderTop: '1px solid #e8e8e8' }}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入消息或点击录音..."
          suffix={<SendOutlined style={{ color: '#1890ff', cursor: 'pointer' }} onClick={handleSend} />}
          onPressEnter={handleKeyDown}
          style={{ borderRadius: '24px' }}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
