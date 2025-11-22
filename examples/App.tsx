import { useState, useEffect, useRef } from 'react';
import { useTransitionState } from '../src/useTransitionState';
import './styles.css';

// ============================================
// BASIC PRESETS DEMO
// ============================================
function PresetsDemo() {
  const [showFade, setShowFade, fadeRef] = useTransitionState<HTMLDivElement>(false, {
    effect: 'fade',
    duration: 300
  });

  const [showSlide, setShowSlide, slideRef] = useTransitionState<HTMLDivElement>(false, {
    effect: 'slide',
    duration: 300
  });

  const [showZoom, setShowZoom, zoomRef] = useTransitionState<HTMLDivElement>(false, {
    effect: 'zoom',
    duration: 300
  });

  return (
    <section className="demo-section">
      <h2>Built-in Animation Presets</h2>
      <div className="demo-grid">
        <div className="demo-card">
          <h3>Fade</h3>
          <button onClick={() => setShowFade(prev => !prev)}>
            Toggle Fade
          </button>
          {showFade && (
            <div ref={fadeRef} className="animated-box fade-box">
              Fade Animation
            </div>
          )}
        </div>

        <div className="demo-card">
          <h3>Slide</h3>
          <button onClick={() => setShowSlide(prev => !prev)}>
            Toggle Slide
          </button>
          {showSlide && (
            <div ref={slideRef} className="animated-box slide-box">
              Slide Animation
            </div>
          )}
        </div>

        <div className="demo-card">
          <h3>Zoom</h3>
          <button onClick={() => setShowZoom(prev => !prev)}>
            Toggle Zoom
          </button>
          {showZoom && (
            <div ref={zoomRef} className="animated-box zoom-box">
              Zoom Animation
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================
// MODAL DIALOG DEMO
// ============================================
function ModalDemo() {
  const [isOpen, setIsOpen, modalRef] = useTransitionState<HTMLDivElement>(false, {
    effect: 'zoom',
    duration: 250,
    timingFunction: 'ease-out'
  });

  return (
    <section className="demo-section">
      <h2>Modal Dialog</h2>
      <button className="primary-btn" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <div
            ref={modalRef}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Modal Title</h3>
            <p>This is a modal with zoom animation. Click outside or the close button to dismiss.</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}

// ============================================
// CUSTOM ANIMATION DEMO
// ============================================
function CustomAnimationDemo() {
  const [isVisible, setIsVisible, ref] = useTransitionState<HTMLDivElement>(false, {
    duration: 500,
    timingFunction: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
    effect: {
      from: { transform: 'scale(0.5) rotate(-180deg)', opacity: '0' },
      to: { transform: 'scale(1) rotate(0deg)', opacity: '1' }
    }
  });

  return (
    <section className="demo-section">
      <h2>Custom Keyframes</h2>
      <button onClick={() => setIsVisible(prev => !prev)}>
        Toggle Custom Animation
      </button>
      {isVisible && (
        <div ref={ref} className="custom-animation-box">
          🚀 Spinning Rocket!
        </div>
      )}
    </section>
  );
}

// ============================================
// LIFECYCLE CALLBACKS DEMO
// ============================================
function LifecycleDemo() {
  const [log, setLog] = useState('Idle');
  const [isVisible, setIsVisible, ref] = useTransitionState<HTMLDivElement>(false, {
    effect: 'fade',
    duration: 300,
    onEnter: () => setLog('⏳ Entering...'),
    onEntered: () => setLog('✅ Entered'),
    onExit: () => setLog('⏳ Exiting...'),
    onExited: () => setLog('❌ Exited')
  });

  return (
    <section className="demo-section">
      <h2>Lifecycle Callbacks</h2>
      <button onClick={() => setIsVisible(prev => !prev)}>
        Toggle Element
      </button>
      <div className="lifecycle-log">
        Status: <strong>{log}</strong>
      </div>
      {isVisible && (
        <div ref={ref} className="animated-box lifecycle-box">
          Watch the status above!
        </div>
      )}
    </section>
  );
}

// ============================================
// TOAST NOTIFICATIONS DEMO
// ============================================
interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible, toastRef] = useTransitionState<HTMLDivElement>(true, {
    effect: 'slide',
    duration: 300,
    onExited: onClose
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, setIsVisible]);

  return isVisible ? (
    <div
      ref={toastRef}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#323232',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        maxWidth: '400px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>{message}</span>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '0',
            lineHeight: '1'
          }}
        >
          ×
        </button>
      </div>
    </div>
  ) : null;
}

function ToastDemo() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>([]);
  const [counter, setCounter] = useState(0);

  const addToast = () => {
    const id = counter;
    setCounter(prev => prev + 1);
    setToasts(prev => [...prev, { id, message: `Notification #${id + 1}` }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <section className="demo-section">
      <h2>Toast Notifications</h2>
      <button className="primary-btn" onClick={addToast}>
        Show Toast
      </button>

      <div style={{ position: 'fixed', top: 0, right: 0, padding: '20px', zIndex: 2000 }}>
        {toasts.map((toast, index) => (
          <div key={toast.id} style={{ marginBottom: index < toasts.length - 1 ? '10px' : 0 }}>
            <Toast
              message={toast.message}
              duration={3000}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// DROPDOWN MENU DEMO
// ============================================
interface DropdownItem {
  id: string;
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  buttonLabel: string;
}

function Dropdown({ items, buttonLabel }: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen, menuRef] = useTransitionState<HTMLUListElement>(false, {
    effect: {
      from: { transform: 'translateY(-10px)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' }
    },
    duration: 200,
    timingFunction: 'ease-out'
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {buttonLabel}
        <span style={{ fontSize: '12px' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <ul
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            listStyle: 'none',
            padding: '8px 0',
            margin: 0,
            minWidth: '200px',
            zIndex: 100
          }}
        >
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DropdownDemo() {
  const items: DropdownItem[] = [
    { id: '1', label: 'Profile', onClick: () => alert('Profile clicked') },
    { id: '2', label: 'Settings', onClick: () => alert('Settings clicked') },
    { id: '3', label: 'Help', onClick: () => alert('Help clicked') },
    { id: '4', label: 'Logout', onClick: () => alert('Logout clicked') }
  ];

  return (
    <section className="demo-section">
      <h2>Dropdown Menu</h2>
      <p>Click the button to open the menu. Click outside to close.</p>
      <Dropdown items={items} buttonLabel="Account Menu" />
    </section>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>useTransitionState Demo</h1>
        <p>A React hook for smooth UI transitions</p>
      </header>

      <main className="app-main">
        <PresetsDemo />
        <ModalDemo />
        <CustomAnimationDemo />
        <LifecycleDemo />
        <ToastDemo />
        <DropdownDemo />
      </main>
    </div>
  );
}

