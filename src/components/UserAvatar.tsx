import { useUserProfile } from '../contexts/UserProfileContext';

interface UserAvatarProps {
  size?: number;
  fontSize?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function UserAvatar({ size = 40, fontSize = 16, style = {}, className = '' }: UserAvatarProps) {
  const { profile } = useUserProfile();

  const avatarStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    objectFit: 'cover',
    ...style
  };

  const placeholderStyle: React.CSSProperties = {
    width: size,
    height: size,
    fontSize: fontSize,
    ...style
  };

  if (profile.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.full_name}
        style={avatarStyle}
        className={className}
      />
    );
  }

  return (
    <div className={`avatar ${className}`} style={placeholderStyle}>
      {profile.full_name.charAt(0)}
    </div>
  );
}
