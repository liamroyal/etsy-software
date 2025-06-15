# React Best Practices Guide

## 🏗️ Component Architecture

### Component Structure
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Card/
│   │   ├── Badge/
│   │   └── Typography/
│   ├── layout/               # Layout components
│   ├── forms/               # Form-specific components
│   └── features/            # Feature-specific components
├── pages/                   # Page components
├── hooks/                   # Custom hooks
├── utils/                   # Utility functions
├── types/                   # TypeScript types
└── styles/                  # Global styles and themes
```

### Component Naming Conventions
- **PascalCase** for component names: `UserCard`, `ProductList`
- **camelCase** for props and variables: `isLoading`, `userName`
- **SCREAMING_SNAKE_CASE** for constants: `API_ENDPOINTS`

## 🧩 Component Design Principles

### 1. Single Responsibility Principle
Each component should have one clear purpose:
```tsx
// ❌ Bad - Component doing too much
const UserDashboard = () => {
  // User data fetching
  // Navigation logic  
  // Stats calculations
  // UI rendering
}

// ✅ Good - Separated concerns
const UserDashboard = () => {
  return (
    <DashboardLayout>
      <UserStats />
      <UserActions />
      <UserActivity />
    </DashboardLayout>
  )
}
```

### 2. Composition Over Inheritance
Use component composition for flexibility:
```tsx
// ✅ Good - Composable Card component
const Card = ({ children, variant = 'default', ...props }) => (
  <div className={`card card--${variant}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ children }) => (
  <div className="card__header">{children}</div>
)

const CardContent = ({ children }) => (
  <div className="card__content">{children}</div>
)

// Usage
<Card variant="elevated">
  <CardHeader>
    <h3>User Profile</h3>
  </CardHeader>
  <CardContent>
    <UserInfo />
  </CardContent>
</Card>
```

### 3. Props Interface Design
Always define clear TypeScript interfaces:
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  onClick,
  ...rest
}) => {
  // Component implementation
}
```

## 🎨 Styling Best Practices

### 1. CSS Modules (Preferred)
```tsx
// Button.module.css
.button {
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-family: var(--font-family-sans);
  transition: var(--transition-fast);
}

.button--primary {
  background-color: var(--color-primary-600);
  color: var(--color-white);
}

.button--secondary {
  background-color: var(--color-neutral-100);
  color: var(--color-text-primary);
}

// Button.tsx
import styles from './Button.module.css'

const Button = ({ variant, children }) => (
  <button className={`${styles.button} ${styles[`button--${variant}`]}`}>
    {children}
  </button>
)
```

### 2. Design System Integration
Always use design tokens from the theme:
```tsx
// ❌ Bad - Magic numbers and hardcoded values
const cardStyle = {
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}

// ✅ Good - Using design tokens
const cardStyle = {
  padding: theme.spacing.lg,
  backgroundColor: theme.colors.background.primary,
  borderRadius: theme.borderRadius.md,
  boxShadow: theme.shadows.sm
}
```

### 3. Avoid Inline Styles
Only use inline styles for dynamic values:
```tsx
// ❌ Bad - Static inline styles
<div style={{ padding: '16px', backgroundColor: 'white' }}>

// ✅ Good - CSS classes for static styles
<div className={styles.card}>

// ✅ Acceptable - Dynamic inline styles
<div 
  className={styles.progressBar}
  style={{ width: `${progress}%` }}
>
```

## 🔧 Component Patterns

### 1. Custom Hooks for Logic
Extract complex logic into custom hooks:
```tsx
// hooks/useUserData.ts
export const useUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  return { user, loading, error }
}

// Component using the hook
const UserProfile = ({ userId }) => {
  const { user, loading, error } = useUserData(userId)
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!user) return <EmptyState />
  
  return <UserCard user={user} />
}
```

### 2. Compound Components
For complex UI patterns:
```tsx
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

const ModalHeader = ({ children }) => (
  <div className={styles.modalHeader}>{children}</div>
)

const ModalBody = ({ children }) => (
  <div className={styles.modalBody}>{children}</div>
)

const ModalFooter = ({ children }) => (
  <div className={styles.modalFooter}>{children}</div>
)

Modal.Header = ModalHeader
Modal.Body = ModalBody  
Modal.Footer = ModalFooter

// Usage
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>
    <h2>Confirm Action</h2>
  </Modal.Header>
  <Modal.Body>
    <p>Are you sure you want to delete this item?</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button variant="danger" onClick={handleConfirm}>Delete</Button>
  </Modal.Footer>
</Modal>
```

### 3. Render Props / Children as Functions
For flexible component APIs:
```tsx
const DataFetcher = ({ url, children }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])

  return children({ data, loading, error })
}

// Usage
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage error={error} />
    return <UserList users={data} />
  }}
</DataFetcher>
```

## 📁 File Organization

### Component File Structure
```
Button/
├── Button.tsx           # Main component
├── Button.module.css    # Styles
├── Button.test.tsx      # Tests
├── Button.stories.tsx   # Storybook stories (if using)
├── types.ts            # Component-specific types
└── index.ts            # Barrel export
```

### Barrel Exports
Use index.ts files for clean imports:
```tsx
// components/ui/index.ts
export { Button } from './Button'
export { Card } from './Card'
export { Badge } from './Badge'

// Usage
import { Button, Card, Badge } from '@/components/ui'
```

## 🔄 State Management

### 1. Local State First
Use local state for component-specific data:
```tsx
const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### 2. Context for Shared State
Use Context for state that needs to be shared across components:
```tsx
const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  
  const value = {
    user,
    setUser,
    isLoggedIn: !!user
  }
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
```

## 🧪 Testing Considerations

### Component Testing Structure
```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## 🚫 Common Anti-Patterns to Avoid

### 1. Prop Drilling
```tsx
// ❌ Bad - Prop drilling
const App = () => {
  const [user, setUser] = useState(null)
  return <Dashboard user={user} setUser={setUser} />
}

const Dashboard = ({ user, setUser }) => {
  return <UserProfile user={user} setUser={setUser} />
}

// ✅ Good - Use Context or state management
const App = () => (
  <UserProvider>
    <Dashboard />
  </UserProvider>
)
```

### 2. Massive Components
```tsx
// ❌ Bad - Component doing too much
const UserDashboard = () => {
  // 200+ lines of JSX and logic
}

// ✅ Good - Break into smaller components
const UserDashboard = () => (
  <DashboardLayout>
    <UserHeader />
    <UserStats />
    <UserActions />
    <UserActivity />
  </DashboardLayout>
)
```

### 3. Inline Event Handlers
```tsx
// ❌ Bad - Creates new function on every render
<button onClick={() => handleClick(item.id)}>

// ✅ Good - Stable reference
const handleItemClick = useCallback((id) => {
  handleClick(id)
}, [handleClick])

<button onClick={() => handleItemClick(item.id)}>
```

## 📋 Code Review Checklist

- [ ] Component has single responsibility
- [ ] Props are properly typed with TypeScript
- [ ] No inline styles for static styling
- [ ] Custom hooks used for complex logic
- [ ] Components are composable and reusable
- [ ] Proper error boundaries where needed
- [ ] Accessibility considerations (ARIA labels, keyboard navigation)
- [ ] Performance optimizations (memo, useMemo, useCallback) where appropriate
- [ ] Consistent naming conventions
- [ ] Proper file organization

## 🎯 Performance Best Practices

### 1. Memoization
```tsx
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Memoize callback functions
const handleClick = useCallback(() => {
  onItemClick(item.id)
}, [onItemClick, item.id])

// Memoize components
const UserCard = memo(({ user }) => {
  return <div>{user.name}</div>
})
```

### 2. Code Splitting
```tsx
// Lazy load components
const UserManagement = lazy(() => import('./pages/UserManagement'))

// Use Suspense
<Suspense fallback={<LoadingSpinner />}>
  <UserManagement />
</Suspense>
```

This document should be referenced for all future React development to ensure consistent, maintainable, and scalable code. 