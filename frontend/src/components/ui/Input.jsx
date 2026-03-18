import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={twMerge(
        clsx(
          'flex h-11 w-full rounded-sm border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200',
          className
        )
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
