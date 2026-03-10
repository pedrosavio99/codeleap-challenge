import { forwardRef, type InputHTMLAttributes } from "react";

interface UsernameInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, UsernameInputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full max-w-md">
                {label && (
                    <label
                        htmlFor="username"
                        className="block mb-2 font-roboto text-[16px] font-semibold leading-[100%] tracking-[0%] text-black"
                    >
                        {label}
                    </label>
                )}

                <input
                    id="username"
                    ref={ref}
                    type="text"
                    placeholder="Enter your username"
                    className={`
            w-full
            h-10
            px-4
            py-2
            font-roboto
            text-base
            text-gray-900
            placeholder:text-gray-400
            bg-white
            border border-gray-300
            rounded-lg
            focus:outline-none
            focus:border-[#b3acac]
            focus:ring-1
            focus:ring-[#b3acac]
            transition-all
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}
            ${className}
          `}
                    {...props}
                />

                {error && (
                    <p className="mt-1 text-sm text-red-600 font-roboto">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };