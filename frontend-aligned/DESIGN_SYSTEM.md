# Design System Documentation

## Overview
Premium React + TypeScript design system built with Vite and Tailwind CSS.

## Tech Stack
- **Framework**: React 19 + TypeScript 6
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 3.4
- **Module Type**: ES Modules

## Brand Colors
```css
brand:   #2563EB (Blue)
success: #16A34A (Green)
warning: #D97706 (Orange)
danger:  #DC2626 (Red)
```

## Design Principles
- **Rounded Components**: `rounded-xl` (0.75rem)
- **Soft Shadows**: `shadow-sm` for subtle depth
- **Consistent Padding**: `p-4` (1rem) and `p-6` (1.5rem)
- **Premium Feel**: Clean, modern, SaaS-ready aesthetics

## UI Components

### Button
**Location**: `src/components/ui/Button.tsx`

**Variants**: 
- `primary` - Brand blue background
- `secondary` - Gray background
- `success` - Green background
- `warning` - Orange background
- `danger` - Red background
- `ghost` - Transparent with hover effect

**Sizes**: `sm`, `md`, `lg`

**Usage**:
```tsx
<Button variant="primary" size="md">Click Me</Button>
```

### Input
**Location**: `src/components/ui/Input.tsx`

**Features**:
- Label support
- Error state with red border
- Helper text
- Full accessibility

**Usage**:
```tsx
<Input 
  label="Email" 
  type="email" 
  placeholder="Enter email"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

### Card
**Location**: `src/components/ui/Card.tsx`

**Props**:
- `padding`: `sm`, `md`, `lg`
- `hover`: Enable hover shadow effect

**Usage**:
```tsx
<Card padding="md" hover>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

### Badge
**Location**: `src/components/ui/Badge.tsx`

**Variants**: `default`, `brand`, `success`, `warning`, `danger`

**Sizes**: `sm`, `md`

**Usage**:
```tsx
<Badge variant="success" size="md">Active</Badge>
```

### Spinner
**Location**: `src/components/ui/Spinner.tsx`

**Props**:
- `size`: `sm`, `md`, `lg`
- `color`: `brand`, `white`, `gray`

**Usage**:
```tsx
<Spinner size="md" color="brand" />
```

### Modal
**Location**: `src/components/ui/Modal.tsx`

**Features**:
- Backdrop overlay
- ESC key to close
- Click outside to close
- Smooth animations
- Accessibility (ARIA labels)

**Sizes**: `sm`, `md`, `lg`, `xl`

**Usage**:
```tsx
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <p>Modal content</p>
</Modal>
```

### ToggleSwitch
**Location**: `src/components/ui/ToggleSwitch.tsx`

**Props**:
- `checked`: boolean
- `onChange`: callback
- `label`: optional label text
- `disabled`: boolean
- `size`: `sm`, `md`

**Usage**:
```tsx
<ToggleSwitch 
  checked={enabled} 
  onChange={setEnabled}
  label="Enable feature"
/>
```

## Folder Structure
```
frontend-aligned/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Spinner.tsx
│   │       ├── Modal.tsx
│   │       ├── ToggleSwitch.tsx
│   │       └── index.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Import Components
```tsx
import { Button, Input, Card, Badge, Spinner, Modal, ToggleSwitch } from './components/ui';
```

## Next Steps
- Create page layouts
- Add routing (React Router)
- Implement forms with validation
- Add data fetching logic
- Build feature-specific components
