"use client";

import * as React from "react";
import { Input, InputProps } from "@/components/ui/Input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";

interface FormFieldProps extends Omit<InputProps, "error"> {
  label: string;
  errorMessage?: string;
  required?: boolean;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, errorMessage, id, type = "text", required, ...props }, ref) => {
    const { dir } = useApp();
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";
    const inputType = isPasswordType && showPassword ? "text" : type;

    return (
      <div className="space-y-1.5 w-full">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-neutral-500 dark:text-neutral-400"
        >
          {label}
          {required && <span className="text-red-500 ms-1">*</span>}
        </label>
        <div className="relative w-full">
          <Input
            ref={ref}
            id={inputId}
            type={inputType}
            error={!!errorMessage}
            aria-describedby={errorMessage ? errorId : undefined}
            className={
              isPasswordType
                ? dir === "rtl"
                  ? "pl-10 pr-3"
                  : "pr-10 pl-3"
                : undefined
            }
            {...props}
          />
          {isPasswordType && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
                dir === "rtl" ? "left-2" : "right-2"
              }`}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-neutral-400" />
              ) : (
                <Eye className="h-4 w-4 text-neutral-400" />
              )}
            </Button>
          )}
        </div>
        {errorMessage && (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-red-500 font-medium"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";
