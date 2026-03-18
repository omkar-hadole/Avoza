import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center rounded-sm font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
            {
              'bg-black text-white hover:bg-gray-800': variant === 'primary',
              'bg-transparent text-black border border-black hover:bg-gray-100':
                variant === 'outline',
              'bg-transparent text-black hover:underline': variant === 'ghost',
              'bg-gold text-white hover:bg-gold-dark': variant === 'gold',
              'h-9 px-4 text-sm': size === 'sm',
              'h-11 px-8 text-base': size === 'md',
              'h-14 px-10 text-lg': size === 'lg',
              'h-11 w-11 p-0': size === 'icon',
            },
            className
          )
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
