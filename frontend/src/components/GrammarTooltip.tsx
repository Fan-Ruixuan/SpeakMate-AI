import React from 'react';
import { Tooltip } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
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
        return '语法';
      case 'spelling':
        return '拼写';
      case 'wording':
        return '用词';
      case 'punctuation':
        return '标点';
      default:
        return '其他';
    }
  };

  // 统计各类型错误数量
  const errorTypeCounts = errors.reduce((acc, error) => {
    const type = error.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tooltipContent = (
    <div style={{ padding: '8px 12px', maxWidth: '200px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#d48806',
        fontSize: '13px'
      }}>
        <WarningOutlined style={{ fontSize: '14px' }} />
        <span>发现 {errors.length} 处错误</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {Object.entries(errorTypeCounts).map(([type, count]) => (
          <span
            key={type}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              background: `${getErrorTypeColor(type)}15`,
              borderRadius: '4px',
              fontSize: '12px',
              color: getErrorTypeColor(type),
            }}
          >
            <WarningOutlined style={{ fontSize: '10px' }} />
            {getErrorTypeLabel(type)} {count}
          </span>
        ))}
      </div>
      <div style={{ 
        marginTop: '8px', 
        fontSize: '11px', 
        color: '#999',
        textAlign: 'center'
      }}>
        ↓ 查看下方详情卡片
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
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        border: 'none',
        background: '#fffbe6',
      }}
      arrow={false}
    >
      {children}
    </Tooltip>
  );
};

export default GrammarTooltip;