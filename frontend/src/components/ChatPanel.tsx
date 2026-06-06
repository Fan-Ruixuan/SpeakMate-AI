import React, { useRef, useEffect, useCallback } from 'react';
import { MessageOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { Input } from 'antd';

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp?: Date;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    if (inputRef.current?.value.trim()) {
      onSendMessage(inputRef.current.value.trim());
      inputRef.current.value = '';
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
            ))}
          </div>
        )}
      </div>
      
      <div style={{ padding: '16px', background: '#fff', borderTop: '1px solid #e8e8e8' }}>
        <Input
          ref={(ref) => {
            // 将 Ant Design 的 InputRef 转换为 HTMLInputElement
            if (ref) {
              (inputRef as any).current = ref.input || ref.nativeElement || ref;
            }
          }}
          placeholder="输入消息或点击录音..."
          suffix={<SendOutlined style={{ color: '#1890ff' }} />}
          onPressEnter={handleKeyDown}
          style={{ borderRadius: '24px' }}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
