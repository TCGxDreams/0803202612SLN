import React from 'react';
import LinkButton from './LinkButton';
import { 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Globe, 
  Mail,
  Music
} from 'lucide-react';

// Map string icon names to Lucide components
const iconMap = {
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  website: Globe,
  email: Mail,
  music: Music
};

const LinkList = ({ links }) => {
  if (!links || links.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
        No links found yet.
      </div>
    );
  }

  return (
    <div className="links-container">
      {links.map((link, index) => {
        // Resolve icon component from string mapping, or pass undefined to use default
        const IconComponent = link.icon_name ? iconMap[link.icon_name.toLowerCase()] : undefined;
        
        return (
          <LinkButton 
            key={link.id || index}
            title={link.title}
            url={link.url}
            icon={IconComponent}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default LinkList;
