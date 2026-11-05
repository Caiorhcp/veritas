import type { InputHTMLAttributes, Ref } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-900 aria-invalid:border-red-500 ${className}`}
      {...props}
    />
  );
}
