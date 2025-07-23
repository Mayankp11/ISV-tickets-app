// components/ThemeToggle.tsx
import React from 'react';
import type { Theme } from '../types/ticket';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  theme: Theme;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  isDarkMode, 
  onToggle, 
  theme 
}) => {
  return (
    <button
      onClick={onToggle}
      style={{
        backgroundColor: 'transparent',
        border: `2px solid ${theme.border}`,
        borderRadius: '8px',
        padding: '0.5rem',
        cursor: 'pointer',
        color: theme.text,
        fontSize: '1.2rem',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s'
      }}
      title="Toggle theme"
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = theme.button;
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = theme.border;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};