import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="block mb-2 font-roboto text-[16px] font-semibold leading-[100%] tracking-[0%] text-black"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={`
            w-full
            h-24
            p-2
            font-roboto
            text-base
            text-gray-900
            placeholder:text-gray-400
            bg-white
            border border-gray-300
            rounded-lg
            resize-y
            focus:outline-none
            focus:border-[#b3acac]
            focus:ring-1
            focus:ring-[#b3acac]
            transition-all
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}
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

Textarea.displayName = "Textarea";

export { Textarea };