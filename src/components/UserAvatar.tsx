import React, { useState } from "react";

interface UserAvatarProps {
  name: string;
  photoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
}

const getColorFromInitial = (initial: string) => {
  const colors = [
    "#FFB6C1", "#FF69B4", "#FF1493", "#DB7093", "#C71585",
    "#FF6347", "#FF4500", "#FF8C00", "#FFA500", "#FFD700",
    "#ADFF2F", "#7FFF00", "#32CD32", "#00FF00", "#00FA9A",
    "#00CED1", "#1E90FF", "#4169E1", "#8A2BE2", "#9400D3",
    "#FF00FF", "#C71585", "#FF1493", "#DB7093", "#FF69B4"
  ];
  const index = initial.charCodeAt(0) % colors.length;
  return colors[index];
};

const getInitials = (name: string | undefined): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getAvatarSize = (size: UserAvatarProps['size']): string => {
  if (typeof size === 'number') {
    return `${size}px`;
  }
  
  const sizes = {
    sm: '32px',
    md: '40px',
    lg: '64px',
    xl: '128px'
  };
  
  return sizes[size || 'md'];
};

const getFontSize = (size: UserAvatarProps['size']): string => {
  if (typeof size === 'number') {
    return `${size / 2.5}px`;
  }
  
  const sizes = {
    sm: '14px',
    md: '16px',
    lg: '24px',
    xl: '48px'
  };
  
  return sizes[size || 'md'];
};

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  photoUrl, 
  size = 'md',
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const backgroundColor = initials ? getColorFromInitial(initials[0]) : "#000";
  
  const avatarSize = getAvatarSize(size);
  const fontSize = getFontSize(size);

  return (
    <div 
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{ 
        backgroundColor,
        width: avatarSize,
        height: avatarSize
      }}
    >
      {photoUrl && !imageError ? (
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span 
          className="text-white font-bold"
          style={{ fontSize }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
