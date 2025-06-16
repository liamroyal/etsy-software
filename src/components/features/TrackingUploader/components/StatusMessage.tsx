import React from 'react';
import styles from './StatusMessage.module.css';

interface Props {
  type: 'success' | 'error';
  message?: string | null;
}

export const StatusMessage: React.FC<Props> = ({ type, message }) => {
  if (!message) return null;

  const config = {
    success: {
      containerClass: styles.success,
      titleClass: styles.titleSuccess,
      messageClass: styles.messageSuccess,
      icon: '✅',
      title: 'Success'
    },
    error: {
      containerClass: styles.error,
      titleClass: styles.titleError,
      messageClass: styles.messageError,
      icon: '❌',
      title: 'Error'
    }
  };

  const currentConfig = config[type];

  return (
    <div className={currentConfig.containerClass}>
      <span className={styles.icon}>{currentConfig.icon}</span>
      <div className={styles.content}>
        <h3 className={currentConfig.titleClass}>
          {currentConfig.title}
        </h3>
        <p className={currentConfig.messageClass}>
          {message}
        </p>
      </div>
    </div>
  );
}; 