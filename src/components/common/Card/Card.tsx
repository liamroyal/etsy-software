import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  variant?: 'default' | 'outlined' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className,
  noPadding = false,
  variant = 'default'
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    noPadding ? styles.noPadding : '',
    className || ''
  ].filter(Boolean).join(' ');

  const hasHeader = title || subtitle || headerAction;

  return (
    <div className={cardClasses}>
      {hasHeader && (
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {headerAction && (
            <div className={styles.headerAction}>
              {headerAction}
            </div>
          )}
        </div>
      )}
      
      <div className={styles.content}>
        {children}
      </div>

      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  );
}; 