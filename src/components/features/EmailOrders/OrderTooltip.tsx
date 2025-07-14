import React, { useState } from 'react';
import styles from './OrderTooltip.module.css';

interface OrderTooltipProps {
  content: string;
  children: React.ReactNode;
}

export const OrderTooltip: React.FC<OrderTooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  if (!content) {
    return <>{children}</>;
  }

  return (
    <div 
      className={styles.tooltipContainer}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipContent}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTooltip; 