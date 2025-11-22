# useTransitionState

> A React hook for managing element transitions with smooth CSS animations - a drop-in replacement for `useState` with built-in animation support.

[![npm version](https://img.shields.io/npm/v/use-transition-state.svg)](https://www.npmjs.com/package/use-transition-state)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🎮 Live Demo

**[Try it on CodeSandbox →](https://codesandbox.io/p/sandbox/5j7dgl)**

See all features in action: presets, modals, toasts, dropdowns, custom animations, and lifecycle callbacks.

## 🌟 Purpose

`useTransitionState` is an extended version of React's built-in `useState` hook, specifically designed to handle the mounting and unmounting of elements with smooth CSS transitions.

In standard React, an element is instantly removed from the DOM when its state changes from `true` to `false`, preventing any exit animation from running. This hook manages the element's lifecycle for you, keeping it in the DOM just long enough for the exit animation to complete before unmounting it.

**Perfect for:** Modals, tooltips, dropdowns, alerts, side panels, and any UI element that needs smooth enter/exit animations.

## 🚀 Installation

```bash
npm install use-transition-state
```

## 💡 Quick Start

The hook returns three values, similar to `useState`, but with the addition of a ref:

```typescript
const [isMounted, setIsVisible, ref] = useTransitionState<HTMLDivElement>(initialValue, options);
```

### Return Values

| Return Value | Type | Description |
|-------------|------|-------------|
| `isMounted` | `boolean` | Determines if the element should be rendered (for conditional JSX) |
| `setIsVisible` | `Dispatch<SetStateAction<boolean>>` | Function to toggle the element's visibility (triggers animation) |
| `ref` | `RefObject<T>` | **MANDATORY**: Must be attached to the element you want to animate |

## 📖 Usage Examples

### 1. Simple Drop-in Usage (Default Animation)

If you omit the options object entirely, the hook uses the default `'fade'` animation with a duration of 300ms.

```tsx
import { useTransitionState } from 'use-transition-state';

function SlideOutMenu() {
  // Same as useState, but returns a ref as the 3rd argument
  const [isOpen, setIsOpen, menuRef] = useTransitionState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(p => !p)}>Toggle Menu</button>

      {/* 1. Use 'isOpen' for conditional rendering */}
      {isOpen && (
        {/* 2. Attach the mandatory 'ref' here */}
        <div ref={menuRef} className="menu-styles">
          Menu Content
        </div>
      )}
    </div>
  );
}
```


### 2. Using Built-in Presets

Pass the `effect` property inside the options object to quickly choose a preset animation.

```tsx
// FADE: Simple opacity transition
const [isAlertVisible, setAlertVisible, alertRef] = useTransitionState(true, {
  effect: 'fade', // 'fade' | 'slide' | 'zoom'
  duration: 500   // Optional: change speed (in milliseconds)
});

// SLIDE: Slide down with opacity
const [isDropdownOpen, setDropdownOpen, dropdownRef] = useTransitionState(false, {
  effect: 'slide',
  duration: 300
});

// ZOOM: Scale and opacity transition
const [isModalOpen, setModalOpen, modalRef] = useTransitionState(false, {
  effect: 'zoom',
  duration: 350
});
```


### 3. Advanced Usage (Custom Keyframes & Callbacks)

For animations not covered by the presets, or to trigger logic when the element is fully removed from the DOM, use the full options API.

```tsx
import { useTransitionState } from 'use-transition-state';

function CustomBouncingComponent() {
  const [isVisible, setVisible, myRef] = useTransitionState(false, {
    duration: 600,
    timingFunction: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Bouncy easing

    // Define the start ('from') and end ('to') CSS states
    effect: {
      from: { transform: 'translateX(50px) scale(0.1)', opacity: '0' },
      to:   { transform: 'translateX(0) scale(1)', opacity: '1' }
    },

    // Callbacks are ideal for clean-up or logging
    onExited: () => console.log('Component is completely unmounted from the DOM!'),
    onEntered: () => console.log('Animation finished, element is fully visible.')
  });

  return (
    <div>
      <button onClick={() => setVisible(p => !p)}>Toggle Custom</button>
      {isVisible && <div ref={myRef}>Hello!</div>}
    </div>
  );
}
```

## 🎨 Built-in Animation Presets

| Preset | Description | Animation Effect |
|--------|-------------|------------------|
| `fade` | Simple opacity transition | Fades in/out |
| `slide` | Vertical slide with opacity | Slides down on enter, up on exit |
| `zoom` | Scale with opacity | Zooms in/out with fade |

## ⚙️ API Reference

### `useTransitionState<T>(initialValue, options)`

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialValue` | `boolean` | `false` | Initial visibility state |
| `options` | `TransitionOptions` | `{}` | Configuration object (see below) |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | `number` | `300` | Animation duration in milliseconds |
| `effect` | `TransitionEffect` | `'fade'` | Preset name (`'fade'` \| `'slide'` \| `'zoom'`) or custom keyframes object |
| `timingFunction` | `string` | `'ease-in-out'` | CSS timing function (e.g., `'linear'`, `'ease'`, `'cubic-bezier(...)'`) |
| `onEnter` | `() => void` | `undefined` | Callback fired when element starts entering |
| `onEntered` | `() => void` | `undefined` | Callback fired when enter animation completes |
| `onExit` | `() => void` | `undefined` | Callback fired when element starts exiting |
| `onExited` | `() => void` | `undefined` | Callback fired when element is fully unmounted |

#### Custom Effect Object

```typescript
interface AnimationKeyframes {
  from: CSSProperties; // Starting CSS state
  to: CSSProperties;   // Ending CSS state
}
```

## 🔥 Real-World Examples

### Modal Dialog

```tsx
import { useTransitionState } from 'use-transition-state';

function Modal({ children }) {
  const [isOpen, setIsOpen, modalRef] = useTransitionState(false, {
    effect: 'zoom',
    duration: 250,
    timingFunction: 'ease-out'
  });

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div ref={modalRef} className="modal-content" onClick={e => e.stopPropagation()}>
            {children}
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
```

### Toast Notification

```tsx
function Toast({ message, onClose }) {
  const [isVisible, setIsVisible, toastRef] = useTransitionState(true, {
    effect: 'slide',
    duration: 300,
    onExited: onClose // Clean up after animation
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return isVisible ? (
    <div ref={toastRef} className="toast">
      {message}
    </div>
  ) : null;
}
```

### Dropdown Menu

```tsx
function Dropdown({ items }) {
  const [isOpen, setIsOpen, menuRef] = useTransitionState(false, {
    effect: {
      from: { transform: 'translateY(-10px)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' }
    },
    duration: 200
  });

  return (
    <div className="dropdown">
      <button onClick={() => setIsOpen(p => !p)}>
        Menu {isOpen ? '▲' : '▼'}
      </button>

      {isOpen && (
        <ul ref={menuRef} className="dropdown-menu">
          {items.map(item => (
            <li key={item.id} onClick={() => setIsOpen(false)}>
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## 🎯 Key Features

- ✅ **Drop-in replacement** for `useState` with animation support
- ✅ **Zero dependencies** (except React peer dependency)
- ✅ **TypeScript support** with full type definitions
- ✅ **SSR compatible** with isomorphic layout effects
- ✅ **Tiny bundle size** - minimal overhead
- ✅ **Flexible API** - presets or custom animations
- ✅ **Lifecycle callbacks** for advanced control
- ✅ **Works with any CSS properties** - transform, opacity, color, etc.

## 🤔 Why useTransitionState?

### The Problem

```tsx
// ❌ This won't animate on exit!
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
    {isOpen && <div className="menu">Menu</div>}
  </>
);
// When isOpen becomes false, the div is immediately removed from DOM
```

### The Solution

```tsx
// ✅ This animates both enter AND exit!
const [isOpen, setIsOpen, menuRef] = useTransitionState(false, {
  effect: 'slide',
  duration: 300
});

return (
  <>
    <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
    {isOpen && <div ref={menuRef} className="menu">Menu</div>}
  </>
);
// The hook keeps the element in DOM during exit animation
```

## 📝 TypeScript

The hook is written in TypeScript and provides full type safety:

```typescript
import { useTransitionState, TransitionOptions, TransitionEffectType } from 'use-transition-state';

// Generic type for element ref
const [isOpen, setIsOpen, ref] = useTransitionState<HTMLDivElement>(false);

// Type-safe options
const options: TransitionOptions = {
  effect: 'fade',
  duration: 300,
  onEntered: () => console.log('Entered!')
};
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Eshan Rajapakshe](https://github.com/eshanrajapakshe)

## 🔗 Links

- [GitHub Repository](https://github.com/eshanrajapakshe/useTransitionState)
- [npm Package](https://www.npmjs.com/package/use-transition-state)
- [Report Issues](https://github.com/eshanrajapakshe/useTransitionState/issues)

---

Made with ❤️ by [Eshan Rajapakshe](https://www.npmjs.com/~eshan.rajapakshe)
