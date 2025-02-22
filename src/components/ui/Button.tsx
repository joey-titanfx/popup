import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center font-medium transition-colors focus:ring focus-visible:outline-none focus-visible:ring disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-gray-800 hover:bg-primary-300 focus:bg-primary-300 focus:ring-primary-100 focus-visible:ring-primary-100 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-primary-600 dark:text-gray-800 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:focus:ring-primary-800 dark:focus-visible:ring-primary-800 dark:disabled:bg-gray-700 dark:disabled:text-gray-500",
        default:
          "bg-gray-800 text-white hover:bg-gray-600 focus:bg-gray-600 focus:text-white focus:ring-gray-300 focus-visible:ring-gray-300 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-300 dark:focus:bg-gray-300 dark:focus:ring-gray-600 dark:focus-visible:ring-gray-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-500",
        success:
          "bg-green-600 text-white hover:bg-green-800 focus:bg-green-800 focus:ring-green-300 focus-visible:ring-green-300 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-green-600 dark:text-gray-100 dark:hover:bg-green-800 dark:focus:bg-green-800 dark:focus:ring-green-900 dark:focus-visible:ring-green-900 dark:disabled:bg-gray-700 dark:disabled:text-gray-500",
        destructive:
          "bg-red-600 text-white hover:bg-red-800 focus:bg-red-800 focus:ring-red-300 focus-visible:ring-red-300 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-red-700 dark:text-gray-100 dark:hover:bg-red-800 dark:focus:bg-red-800 dark:focus:ring-red-900 dark:focus-visible:ring-red-900 dark:disabled:bg-gray-700 dark:disabled:text-gray-500",
        danger:
          "bg-red-600 text-white hover:bg-red-800 focus:bg-red-800 focus:ring-red-300 focus-visible:ring-red-300 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-red-700 dark:text-gray-100 dark:hover:bg-red-800 dark:focus:bg-red-800 dark:focus:ring-red-900 dark:focus-visible:ring-red-900 dark:disabled:bg-gray-700 dark:disabled:text-gray-500",
        ghost:
          "text-gray-800 hover:bg-gray-100 hover:text-gray-700 focus:bg-gray-100 focus:text-gray-700 focus:ring-gray-300 focus-visible:ring-gray-300 disabled:text-gray-400 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:focus:ring-gray-500 dark:focus-visible:ring-gray-500 dark:disabled:text-gray-500",
        "ghost-alert":
          "overflow-hidden text-gray-800 hover:text-gray-700 focus:text-gray-700 focus:ring-gray-300 focus-visible:ring-gray-300 disabled:text-gray-400 dark:text-gray-100 dark:hover:text-gray-100  dark:focus:ring-gray-500 dark:focus-visible:ring-gray-500 dark:disabled:text-gray-500",
        info: "bg-blue-600 text-white hover:bg-blue-800 focus:bg-blue-800 focus:ring-blue-300 focus-visible:ring-blue-300 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-blue-600 dark:text-gray-100 dark:hover:bg-blue-800 dark:focus:bg-blue-800 dark:focus:ring-blue-900 dark:focus-visible:ring-blue-900 dark:disabled:bg-gray-700 dark:disabled:text-gray-500",
        warning:
          "bg-yellow-300 text-gray-800 hover:bg-yellow-400 focus:bg-yellow-400 focus:ring-yellow-200 focus-visible:ring-yellow-200 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-yellow-300 dark:text-gray-800 dark:hover:bg-yellow-400 dark:focus:bg-yellow-400 dark:focus:ring-yellow-600 dark:focus-visible:ring-yellow-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-500",
      },
      formFactor: {
        text: "p-0 focus:ring-0", // New text variant with no padding and no focus ring
        xs: "px-3 py-2 text-xs leading-tight",
        sm: "px-3 py-2.5 text-sm leading-tight",
        base: "px-5 py-3 text-sm leading-tight",
        l: "px-5 py-3.5 text-base leading-tight",
        xl: "", // Only for iconOnly buttons
      },
      outline: {
        true: "shadow-[inset_0_0_0_1px_currentColor]",
        false: "",
      },
      shape: {
        rectangular: "rounded-md",
        circular: "rounded-full",
      },
      iconOnly: {
        true: "",
        false: "",
      },
      inverted: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        outline: true,
        variant: "primary",
        class:
          "bg-transparent text-gray-800 shadow-[inset_0_0_0_1px_theme(colors.primary.500)] hover:bg-primary-300 hover:text-gray-800 hover:shadow-none disabled:bg-transparent disabled:shadow-[inset_0_0_0_1px_theme(colors.gray.300)] dark:bg-transparent dark:text-gray-100 dark:shadow-[inset_0_0_0_1px_theme(colors.primary.600)] dark:hover:bg-primary-400 dark:hover:text-gray-800 dark:hover:shadow-none dark:disabled:bg-transparent dark:disabled:shadow-[inset_0_0_0_1px_theme(colors.gray.600)] dark:disabled:hover:bg-transparent",
      },
      {
        outline: true,
        variant: "default",
        class:
          "bg-transparent text-gray-800 shadow-[inset_0_0_0_1px_theme(colors.gray.800)] hover:bg-gray-600 hover:text-white hover:shadow-none disabled:bg-transparent disabled:shadow-[inset_0_0_0_1px_theme(colors.gray.300)] dark:bg-transparent dark:text-gray-100 dark:shadow-[inset_0_0_0_1px_theme(colors.gray.100)] dark:hover:bg-gray-300 dark:hover:text-gray-800 dark:hover:shadow-none dark:disabled:bg-transparent dark:disabled:shadow-[inset_0_0_0_1px_theme(colors.gray.600)] dark:disabled:hover:bg-transparent",
      },
      {
        outline: true,
        variant: "success",
        class:
          "bg-transparent text-green-600 shadow-[inset_0_0_0_1px_theme(colors.green.600)] hover:bg-green-800 hover:text-white hover:shadow-none disabled:bg-transparent disabled:shadow-[inset_0_0_0_1px_theme(colors.gray.300)] dark:bg-transparent dark:text-green-400 dark:shadow-[inset_0_0_0_1px_theme(colors.green.600)] dark:hover:bg-green-800 dark:hover:text-gray-100 dark:hover:shadow-none dark:disabled:bg-transparent dark:disabled:shadow-[inset_0_0_0_1px_theme(colors.gray.600)] dark:disabled:hover:bg-transparent",
      },
      {
        outline: true,
        variant: "destructive",
        class:
          "bg-transparent text-red-600 shadow-[inset_0_0_0_1px_theme(colors.red.600)] hover:bg-red-800 hover:text-white hover:shadow-none disabled:bg-transparent disabled:shadow-[inset_0_0_0_1px_theme(colors.gray.300)] dark:bg-transparent dark:text-red-400 dark:shadow-[inset_0_0_0_1px_theme(colors.red.700)] dark:hover:bg-red-800 dark:hover:text-gray-100 dark:hover:shadow-none dark:disabled:bg-transparent dark:disabled:shadow-[inset_0_0_0_1px_theme(colors.gray.600)] dark:disabled:hover:bg-transparent",
      },
      {
        outline: true,
        variant: "ghost",
        class:
          "bg-transparent shadow-[inset_0_0_0_1px_theme(colors.gray.300)] hover:shadow-none disabled:bg-transparent disabled:shadow-[inset_0_0_0_1px_theme(colors.gray.300)] dark:bg-transparent dark:shadow-[inset_0_0_0_1px_theme(colors.gray.500)] dark:hover:shadow-none",
      },
      {
        iconOnly: true,
        formFactor: "xs",
        class: "p-1",
      },
      {
        iconOnly: true,
        formFactor: "sm",
        class: "p-2",
      },
      {
        iconOnly: true,
        formFactor: "base",
        class: "p-2.5",
      },
      {
        iconOnly: true,
        formFactor: "l",
        class: "p-3",
      },
      {
        iconOnly: true,
        formFactor: "xl",
        class: "p-3.5",
      },
      {
        inverted: true,
        variant: "default",
        class:
          "bg-transparent text-gray-100 shadow-[inset_0_0_0_1px_theme(colors.gray.500)] dark:text-gray-800 dark:shadow-[inset_0_0_0_1px_theme(colors.gray.300)]",
      },
      {
        formFactor: "text",
        variant: "primary",
        class:
          "!bg-transparent !p-0 text-primary-500 hover:!bg-transparent hover:text-primary-600 disabled:text-gray-400 dark:text-primary-600 dark:hover:text-primary-700",
      },
      {
        formFactor: "text",
        variant: "default",
        class:
          "!bg-transparent !p-0 text-gray-800 hover:!bg-transparent hover:text-gray-900 disabled:text-gray-400 dark:text-gray-100 dark:hover:text-gray-200",
      },
      {
        formFactor: "text",
        variant: "success",
        class:
          "!bg-transparent !p-0 text-green-600 hover:!bg-transparent hover:text-green-700 disabled:text-gray-400 dark:text-green-400 dark:hover:text-green-500",
      },
      {
        formFactor: "text",
        variant: "destructive",
        class:
          "!bg-transparent !p-0 text-red-600 hover:!bg-transparent hover:text-red-700 disabled:text-gray-400 dark:text-red-400 dark:hover:text-red-500",
      },
      {
        formFactor: "text",
        variant: "ghost",
        class:
          "!bg-transparent !p-0 text-gray-800 hover:!bg-transparent hover:text-gray-900 disabled:text-gray-400 dark:text-gray-100 dark:hover:text-gray-200",
      },
    ],
    defaultVariants: {
      variant: "default",
      formFactor: "base",
      outline: false,
      shape: "rectangular",
      iconOnly: false,
      inverted: false,
    },
  }
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<ButtonVariantProps, "formFactor"> {
  icon?: React.ComponentType<{ className?: string }>;
  floatIcon?: "left" | "right";
  iconOnly?: boolean;
  formFactor?: ButtonVariantProps["formFactor"];
  inverted?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      formFactor = "base",
      outline,
      shape = "rectangular",
      icon: Icon,
      floatIcon = "left",
      iconOnly = false,
      children,
      inverted,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = "button";

    const iconSize = {
      xs: "size-3", // 12px
      sm: "size-3", // 12px
      base: "size-4", // 16px
      l: "size-5", // 20px
      xl: "size-5", // 20px
      text: "size-4", // Add this line with a default size
    };

    const safeFormFactor: keyof typeof iconSize =
      formFactor && formFactor in iconSize ? formFactor : "base";

    const iconClass = cn(iconSize[safeFormFactor], {
      "mr-2": !iconOnly && floatIcon === "left",
      "ml-2": !iconOnly && floatIcon === "right",
      "animate-spin": loading,
    });

    const renderIcon = () => {
      if (loading) {
        return <Loader2 className={iconClass} aria-hidden="true" />;
      }
      return Icon && <Icon className={iconClass} aria-hidden="true" />;
    };

    const renderContent = () => (
      <>
        {floatIcon === "left" && renderIcon()}
        {!iconOnly && (
          <>
            {children}
            {variant === "ghost-alert" && (
              <div className="absolute inset-0 bg-transparent hover:bg-gray-100 hover:mix-blend-multiply focus:bg-gray-100 dark:hover:bg-gray-700  dark:hover:mix-blend-color-dodge  dark:focus:bg-gray-700" />
            )}
          </>
        )}
        {floatIcon === "right" && renderIcon()}
      </>
    );

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            formFactor: iconOnly && formFactor === "xl" ? "xl" : formFactor,
            outline,
            shape: iconOnly && !shape ? "circular" : shape,
            iconOnly,
            className,
            inverted,
          })
        )}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {iconOnly ? renderIcon() : renderContent()}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
