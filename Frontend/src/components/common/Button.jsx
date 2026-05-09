import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scaled:-100 whitespace-nowrap";

  const variantStyles = {
    primary:
      "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600  hover:to-teal-600   hover:shadow-xl hover:shadow-emerald-500/30 dark:from-[#FF3CAC] dark:to-[#784BA0] dark:hover:from-[#ff57b8] dark:hover:to-[#8a57b2] dark:shadow-[#7A00FF]/30 dark:hover:shadow-[#7A00FF]/40",
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#1c1c1c] dark:text-slate-200 dark:hover:bg-[#242424]",
    outline:
      "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:bg-[#151515] dark:border-[#2f2f2f] dark:text-slate-200 dark:hover:bg-[#1b1b1b] dark:hover:border-[#3a3a3a]",
  };

  const sizeStyles = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-5 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};

export default Button;
