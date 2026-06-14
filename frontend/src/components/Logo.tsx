import { memo } from 'react';

interface LogoProps {
  variant?: 'primary' | 'white';
  className?: string;
  size?: number; // size in pixels for height
}

const Logo = memo(function Logo({ variant = 'primary', className = '', size = 32 }: LogoProps) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/eventnic.png"
        alt="Eventnic"
        style={{
          height: size,
          width: 'auto',
          filter: variant === 'white' ? 'brightness(0) invert(1)' : 'none'
        }}
        className="flex-shrink-0"
      />
    </div>
  );
});

export default Logo;
