import { getAvatarGradient } from '../theme';
import { getInitials } from '../utils';

interface PlayerAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ring?: boolean;
}

const sizeClasses = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-[12px]',
  lg: 'h-12 w-12 text-[15px]',
};

export default function PlayerAvatar({
  name,
  size = 'md',
  className = '',
  ring = false,
}: PlayerAvatarProps) {
  const [from, to] = getAvatarGradient(name);

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center rounded-full font-display font-bold text-void shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] ${
        ring ? 'ring-2 ring-steel-blue/50 ring-offset-1 ring-offset-surface' : ''
      } ${sizeClasses[size]} ${className}`}
      style={{
        background: `linear-gradient(145deg, ${from}, ${to})`,
      }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
