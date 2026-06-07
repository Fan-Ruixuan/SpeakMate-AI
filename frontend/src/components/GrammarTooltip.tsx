import React from 'react';
import { Tooltip } from 'antd';
import { EditOutlined, WarningOutlined } from '@ant-design/icons';
import type { GrammarError } from '../api/grammar';

interface GrammarTooltipProps {
  errors: GrammarError[];
  children: React.ReactNode;
}

const GrammarTooltip: React.FC<GrammarTooltipProps> = ({ errors, children }) => {
  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case 'grammar':
        return '#f5222d';
      case 'spelling':
        return '#fa8c16';
      case 'wording':
        return '#1890ff';
      case 'punctuation':
        return '#52c41a';
      default:
        return '#999';
    }
  };

  const getErrorTypeLabel = (type: string) => {
    switch (type) {
      case 'grammar':
        return '语法错误';
      case 'spelling':
        return '拼写错误';
      case 'wording':
        return '用词不当';
      case 'punctuation':
        return '标点错误';
      default:
        return '未知错误';
    }
  };

  const tooltipContent = (
    <div 
      style={{ 
        width: '320px', 
        padding: '8px',
        animation: 'tooltipFadeIn 0.2s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f0f0f0' }}>
        <EditOutlined style={{ color: '#faad14', fontSize: '16px' }} />
        <span style={{ fontWeight: 'bold', color: '#d48806', fontSize: '14px' }}>语法纠错提示</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
        {errors.map((error, index) => (
          <div
            key={error.id}
            style={{
              padding: '10px',
              background: '#fff',
              borderRadius: '6px',
              borderLeft: `4px solid ${getErrorTypeColor(error.type)}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              animation: `errorItemFadeIn 0.2s ease-out ${index * 0.05}s both`,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              ':hover': {
                transform: 'translateX(4px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <WarningOutlined style={{ color: getErrorTypeColor(error.type), fontSize: '12px' }} />
              <span style={{ fontSize: '12px', fontWeight: '500', color: getErrorTypeColor(error.type) }}>
                {getErrorTypeLabel(error.type)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span 
                style={{ 
                  textDecoration: 'line-through', 
                  color: '#f5222d', 
                  fontSize: '13px',
                  transition: 'color 0.2s ease'
                }}
              >
                {error.original}
              </span>
              <span style={{ color: '#52c41a', fontSize: '14px', fontWeight: 'bold' }}>→</span>
              <span 
                style={{ 
                  color: '#52c41a', 
                  fontWeight: 'bold', 
                  fontSize: '13px',
                  background: '#f6ffed',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  transition: 'background 0.2s ease'
                }}
              >
                {error.replacement}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
              {error.message}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes errorItemFadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );

  return (
    <Tooltip
      title={tooltipContent}
      placement="top"
      trigger="hover"
      overlayStyle={{
        maxWidth: 'none',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        border: 'none',
        background: '#fffbe6',
      }}
      arrowStyle={{
        display: 'none',
      }}
    >
      {children}
    </Tooltip>
  );
};

export default GrammarTooltip;