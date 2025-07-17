// ModalStyles.tsx
import React from 'react';

export function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '600px',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        fontSize: '1.5rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#333',
        lineHeight: 1,
      }}
    >
      &times;
    </button>
  );
}