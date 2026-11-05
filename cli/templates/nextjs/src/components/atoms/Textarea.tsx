import type { Ref, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn('min-h-24 w-full rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-slate-900 aria-invalid:border-red-500', className)}
      {...props}
    />
  );
}
