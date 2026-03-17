import React from 'react';

// Only convert Google Drive links, normal URLs pass through unchanged
function fixDriveUrl(url) {
  if (!url) return null;
  const isDrive = url.includes('drive.google.com') || url.includes('docs.google.com');
  if (isDrive) {
    const patterns = [/\/d\/([a-zA-Z0-9_-]+)/, /id=([a-zA-Z0-9_-]+)/, /open\?id=([a-zA-Z0-9_-]+)/];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    }
  }
  return url;
}

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=c7a4f6&color=fff&bold=true&size=200';

const Profile = ({ name, bio, avatarUrl }) => {
  const resolvedUrl = fixDriveUrl(avatarUrl) || `${DEFAULT_AVATAR}&name=${encodeURIComponent(name || 'U')}`;

  return (
    <div className="profile-container">
      <div className="profile-avatar-outer">
        <img 
          src={resolvedUrl} 
          alt={name || 'Avatar'} 
          className="profile-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${DEFAULT_AVATAR}&name=${encodeURIComponent(name || 'U')}`;
          }}
        />
      </div>
      <h1 className="profile-name">{name || 'Your Name'}</h1>
      <p className="profile-bio">{bio || 'Chào mừng đến trang cá nhân!'}</p>
    </div>
  );
};

export default Profile;
