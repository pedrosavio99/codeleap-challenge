import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = 'default' | 'outlined' | 'warning' | 'success';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg'; 
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'default',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    let classes = 
      'inline-flex items-center justify-center font-roboto font-semibold text-base leading-none tracking-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer';
    if (variant === 'default' || size === 'md') {
      classes += ' h-[32px] px-8';
    } else if (size === 'sm') {
      classes += ' h-8 px-4';
    } else if (size === 'lg') {
      classes += ' h-12 px-8';
    }

    if (variant === 'outlined') {
      classes += ' border border-gray-300 bg-transparent text-black hover:bg-gray-100 hover:text-black focus-visible:ring-gray-400 active:bg-gray-200';
    } else if (variant === 'warning') {
      classes += ' bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 active:bg-red-800';
    } else if (variant === 'success') {
      classes += ' bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 active:bg-green-800';
    } else {
      classes += ' bg-[#7695EC] text-white hover:bg-[#5d7be0] focus-visible:ring-[#7695EC]/50 active:bg-[#4c66c2]';
    }

    classes += ' rounded-lg'; 

    if (fullWidth) {
      classes += ' w-full';
    }

    const isDisabled = disabled || loading;
    if (isDisabled) {
      classes += ' opacity-60 cursor-not-allowed bg-gray-400 hover:bg-gray-400 text-gray-200';
    }

    if (className) {
      classes += ` ${className}`;
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Carregando...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };