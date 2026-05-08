"use client";

import {
  useState,
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  trailing?: ReactNode;
  error?: string | null;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, trailing, error, className, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-charcoal text-sm font-medium">{label}</label>
      )}
      <div
        className={cn(
          "relative flex items-center rounded-md px-3 bg-canvas border transition-colors h-11",
          focused
            ? "border-primary ring-1 ring-primary/30"
            : error
              ? "border-error"
              : "border-hairline-strong",
        )}
      >
        <input
          ref={ref}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            "flex-1 bg-transparent text-ink text-sm font-normal outline-none placeholder:text-stone",
            trailing && "pr-9",
            className,
          )}
          {...rest}
        />
        {trailing && (
          <div className="absolute right-3 flex items-center">{trailing}</div>
        )}
      </div>
      {error && <p className="text-error text-xs font-normal px-1">{error}</p>}
    </div>
  );
});
