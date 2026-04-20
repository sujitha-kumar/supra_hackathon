# UI Polish Guide - Stripe/Notion Quality

## 🎨 Design System

### Typography
- **Font**: Inter (system-ui fallback)
- **Sizes**: Consistent scale (xs, sm, base, lg, xl, 2xl, 3xl)
- **Line Heights**: Optimized for readability
- **Font Smoothing**: Antialiased on all platforms

### Colors
- **Brand**: #2563EB (Blue)
- **Success**: #16A34A (Green)
- **Warning**: #D97706 (Orange)
- **Danger**: #DC2626 (Red)
- **Grays**: Tailwind default scale

### Spacing
- **Consistent**: 4px base unit (0.25rem)
- **Common**: 4, 8, 12, 16, 24, 32, 48px
- **Card Padding**: 16-24px (md-lg)
- **Section Gaps**: 24-32px

### Borders
- **Radius**: 12px (xl) for cards, 8px (lg) for buttons
- **Width**: 1px default
- **Color**: gray-200 (#E5E7EB)

### Shadows
- **sm**: Subtle (1-2px)
- **md**: Standard (4-6px)
- **lg**: Prominent (10-15px)
- **Usage**: Cards (sm), Modals (lg), Hover (md)

---

## 📱 Mobile Responsiveness

### Breakpoints
- **sm**: 640px (Mobile landscape)
- **md**: 768px (Tablet)
- **lg**: 1024px (Desktop)
- **xl**: 1280px (Large desktop)

### Mobile-First Patterns
```tsx
// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Hide on mobile, show on desktop
<div className="hidden lg:block">

// Full width on mobile, fixed on desktop
<div className="w-full lg:w-64">

// Smaller padding on mobile
<div className="p-4 lg:p-6">
```

### Touch Targets
- **Minimum**: 44x44px for interactive elements
- **Buttons**: Larger on mobile (py-3 vs py-2)
- **Spacing**: More generous on mobile

---

## 🔄 Loading States

### Skeleton Loaders
```tsx
import { CardSkeleton, TableSkeleton, ListSkeleton } from './components/ui';

// Use while data is loading
{isLoading ? <CardSkeleton /> : <ActualContent />}
```

### Spinners
```tsx
import { LoadingSpinner, LoadingOverlay } from './components/ui';

// Inline spinner
<LoadingSpinner size="md" />

// Full page overlay
{isProcessing && <LoadingOverlay message="Processing..." />}
```

---

## ❌ Error States

### Error Messages
```tsx
import { ErrorState, EmptyState } from './components/ui';

// Error with retry
<ErrorState
  title="Failed to load"
  message="Could not fetch data"
  onRetry={() => refetch()}
/>

// Empty state
<EmptyState
  title="No items found"
  message="Get started by creating your first item"
  action={{ label: "Create Item", onClick: handleCreate }}
/>
```

---

## 🔔 Toast Notifications

### Usage
```tsx
import { useToast } from './components/ui';

const { showToast } = useToast();

// Success
showToast('Task created successfully', 'success');

// Error
showToast('Failed to save changes', 'error');

// Warning
showToast('Please review before submitting', 'warning');

// Info
showToast('New update available', 'info');
```

### Best Practices
- **Success**: Confirm actions
- **Error**: Explain what went wrong
- **Warning**: Alert before destructive actions
- **Info**: Non-critical updates

---

## ✨ Animations

### Built-in
- **Fade In**: `animate-fade-in`
- **Slide In**: `animate-slide-in-right`
- **Pulse**: `animate-pulse`
- **Spin**: `animate-spin`

### Transitions
```tsx
// Smooth transitions
className="transition-all duration-200"

// Hover effects
className="hover:shadow-md transition-shadow"

// Color transitions
className="transition-colors duration-150"
```

---

## 🎯 Component Patterns

### Cards
```tsx
<Card padding="lg">
  <h3 className="text-lg font-semibold mb-2">Title</h3>
  <p className="text-gray-600">Content</p>
</Card>
```

### Buttons
```tsx
// Primary action
<Button variant="primary" size="lg">Save</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Danger action
<Button variant="danger">Delete</Button>
```

### Forms
```tsx
<div className="space-y-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Field Label
    </label>
    <Input placeholder="Enter value..." />
  </div>
</div>
```

---

## 📐 Layout Patterns

### Page Wrapper
```tsx
<PageWrapper title="Page Title" subtitle="Description">
  <Content />
</PageWrapper>
```

### Grid Layouts
```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Auto-fit grid
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
```

### Flex Layouts
```tsx
// Space between
<div className="flex items-center justify-between">

// Center content
<div className="flex items-center justify-center">

// Vertical stack
<div className="flex flex-col gap-4">
```

---

## 🎨 Visual Hierarchy

### Headings
- **h1**: `text-3xl font-bold` (Page titles)
- **h2**: `text-2xl font-semibold` (Section titles)
- **h3**: `text-xl font-semibold` (Card titles)
- **h4**: `text-lg font-medium` (Subsections)

### Text
- **Body**: `text-base text-gray-900`
- **Secondary**: `text-sm text-gray-600`
- **Muted**: `text-xs text-gray-500`

### Emphasis
- **Bold**: `font-semibold` or `font-bold`
- **Color**: Use brand colors sparingly
- **Size**: Larger for important info

---

## ✅ Accessibility

### Focus States
- All interactive elements have visible focus rings
- `focus:ring-2 focus:ring-brand focus:outline-none`

### Color Contrast
- Text: Minimum 4.5:1 ratio
- Interactive elements: Minimum 3:1 ratio

### Keyboard Navigation
- Tab order follows visual order
- All actions accessible via keyboard
- Escape closes modals/dropdowns

### Screen Readers
- Semantic HTML
- ARIA labels where needed
- Alt text for images

---

## 🚀 Performance

### Optimization
- Lazy load images
- Code splitting for routes
- Memoize expensive computations
- Debounce search inputs

### Best Practices
- Keep bundle size small
- Minimize re-renders
- Use React Query for caching
- Optimize images (WebP, compression)

---

## 📱 Mobile Considerations

### Navigation
- Hamburger menu on mobile
- Bottom navigation for key actions
- Swipe gestures where appropriate

### Forms
- Larger touch targets
- Appropriate input types
- Auto-focus on mobile
- Prevent zoom on input focus

### Content
- Readable font sizes (min 16px)
- Adequate line spacing
- Scrollable tables
- Collapsible sections

---

## 🎯 Quality Checklist

### Visual
- [ ] Consistent spacing throughout
- [ ] Proper visual hierarchy
- [ ] Smooth animations
- [ ] Hover states on interactive elements
- [ ] Loading states for async operations
- [ ] Error states with helpful messages
- [ ] Empty states with clear CTAs

### Responsive
- [ ] Mobile-first design
- [ ] Works on all breakpoints
- [ ] Touch-friendly on mobile
- [ ] No horizontal scroll
- [ ] Readable on small screens

### Functional
- [ ] All features work
- [ ] Forms validate properly
- [ ] Error handling in place
- [ ] Success feedback provided
- [ ] Keyboard accessible
- [ ] Screen reader friendly

### Performance
- [ ] Fast initial load
- [ ] Smooth interactions
- [ ] No layout shifts
- [ ] Optimized images
- [ ] Efficient re-renders

---

## 🎨 Stripe/Notion Quality Standards

### What Makes It Premium?

**Spacing**:
- Generous whitespace
- Consistent padding/margins
- Breathing room between elements

**Typography**:
- Clear hierarchy
- Readable sizes
- Proper line heights
- Limited font weights

**Colors**:
- Subtle, professional palette
- Consistent usage
- Good contrast
- Meaningful color coding

**Interactions**:
- Smooth transitions
- Immediate feedback
- Predictable behavior
- Delightful micro-interactions

**Details**:
- Rounded corners
- Subtle shadows
- Clean borders
- Polished icons

**Consistency**:
- Same patterns everywhere
- Predictable layouts
- Unified design language
- Cohesive experience
