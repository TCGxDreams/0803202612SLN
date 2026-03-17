import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
