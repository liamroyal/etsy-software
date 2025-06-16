import React from 'react';
import styles from './FormInput.module.css';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false
}) => (
  <div className={styles.container}>
    <label className={styles.label}>
      {label}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
        required={required}
        disabled={disabled}
      />
    </label>
  </div>
); 