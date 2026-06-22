import { getInitials } from '../utils';

interface PlayerAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-[12px]',
  lg: 'h-12 w-12 text-base',
};

export default function PlayerAvatar({
  name,
  size = 'md',
  className = '',
}: PlayerAvatarProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-bold text-void ${sizeClasses[size]} ${className}`}
      style={{ background: 'linear-gradient(165deg, #F2F4F8, #8B8F99)' }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
