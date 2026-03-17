import React from 'react';
import { ChevronRight, Link as LinkIcon } from 'lucide-react';

const LinkButton = ({ title, url, icon, index }) => {
  // Use lucide icon if provided, otherwise default to LinkIcon
  const IconRender = icon ? icon : LinkIcon;
  
  // Stagger animation based on index
  const style = {
    animationDelay: `${0.1 + (index * 0.1)}s`
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="link-button"
      style={style}
    >
      <div className="link-content">
        <div className="link-icon-container">
          <IconRender size={20} />
        </div>
        <span>{title}</span>
      </div>
      <ChevronRight size={20} className="link-arrow" />
    </a>
  );
};

export default LinkButton;
