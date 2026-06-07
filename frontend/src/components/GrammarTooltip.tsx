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
    <div style={{ width: '320px', padding: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f0f0f0' }}>
        <EditOutlined style={{ color: '#faad14', fontSize: '16px' }} />
        <span style={{ fontWeight: 'bold', color: '#d48806', fontSize: '14px' }}>语法纠错提示</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {errors.map((error) => (
          <div
            key={error.id}
            style={{
              padding: '10px',
              background: '#fff',
              borderRadius: '6px',
              borderLeft: `4px solid ${getErrorTypeColor(error.type)}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <WarningOutlined style={{ color: getErrorTypeColor(error.type), fontSize: '12px' }} />
              <span style={{ fontSize: '12px', fontWeight: '500', color: getErrorTypeColor(error.type) }}>
                {getErrorTypeLabel(error.type)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ textDecoration: 'line-through', color: '#f5222d', fontSize: '13px' }}>
                {error.original}
              </span>
              <span style={{ color: '#52c41a', fontSize: '14px' }}>→</span>
              <span style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '13px' }}>
                {error.replacement}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {error.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Tooltip
      title={tooltipContent}
      placement="top"
      trigger="hover"
      overlayStyle={{
        maxWidth: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        border: 'none',
      }}
    >
      {children}
    </Tooltip>
  );
};

export default GrammarTooltip;