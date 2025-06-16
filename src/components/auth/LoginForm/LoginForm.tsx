import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../common/Button/Button';
import { theme } from '../../../styles/theme';

const loginStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.lg
  },
  card: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing['2xl'],
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.lg,
    width: '100%',
    maxWidth: '400px',
    border: `1px solid ${theme.colors.neutral[200]}`
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: theme.spacing['2xl']
  },
  title: {
    margin: 0,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.sans,
    lineHeight: theme.typography.lineHeight.tight
  },
  subtitle: {
    margin: `${theme.spacing.sm} 0 0 0`,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.sans
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing.lg
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing.sm
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.sans
  },
  input: {
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    border: `1px solid ${theme.colors.neutral[300]}`,
    borderRadius: theme.borderRadius.md,
    fontFamily: theme.typography.fontFamily.sans,
    transition: theme.transitions.fast,
    outline: 'none',
    backgroundColor: theme.colors.background.primary
  },
  inputFocus: {
    borderColor: theme.colors.primary[500],
    boxShadow: `0 0 0 3px ${theme.colors.primary[100]}`
  },
  error: {
    backgroundColor: theme.colors.error[50],
    color: theme.colors.error[700],
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.sans,
    border: `1px solid ${theme.colors.error[200]}`
  },
  buttonContainer: {
    marginTop: theme.spacing.md
  }
};

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (inputName: string) => ({
    ...loginStyles.input,
    ...(focusedInput === inputName ? loginStyles.inputFocus : {})
  });

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.card}>
        <div style={loginStyles.header}>
          <h1 style={loginStyles.title}>🏪 Royal Commerce Etsy Management Software</h1>
          <p style={loginStyles.subtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={loginStyles.form}>
          {error && (
            <div style={loginStyles.error}>
              {error}
            </div>
          )}

          <div style={loginStyles.inputGroup}>
            <label htmlFor="email" style={loginStyles.label}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              style={getInputStyle('email')}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          <div style={loginStyles.inputGroup}>
            <label htmlFor="password" style={loginStyles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              style={getInputStyle('password')}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          <div style={loginStyles.buttonContainer}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 