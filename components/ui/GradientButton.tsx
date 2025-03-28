import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  className,
  icon,
  fullWidth = false,
  ...props
}) => {
  return (
    <button
      className={cn(
        'flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-5 text-white hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 font-medium cursor-pointer group relative overflow-hidden border-2 border-white/10',
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default GradientButton;
