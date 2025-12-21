export default function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
  isLoading = false,
  ...props
}) {
  const baseStyles =
    "px-6 py-3 font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2";
  const roundedClass = variant === "rounded" ? "rounded-3xl" : "rounded-2xl";

  const variants = {
    primary:
      "bg-[#53946c] text-[#F7FAFC] hover:bg-[#3a795b] shadow-md hover:shadow-lg",
    secondary:
      "border-2 border-gray-300 text-[#171923] hover:bg-gray-100 hover:border-gray-400 shadow-sm hover:shadow-md",
    rounded:
      "bg-[#53946c] text-[#F7FAFC] hover:bg-[#3a795b] shadow-md hover:shadow-lg",
  };

  const disabledStyles =
    isLoading || props.disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || props.disabled}
      className={`${baseStyles} ${roundedClass} ${variants[variant]} ${disabledStyles} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5"
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
