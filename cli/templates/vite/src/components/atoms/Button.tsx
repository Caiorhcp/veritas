import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-400',
  ghost: 'bg-transparent text-slate-900 hover:bg-slate-100',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
