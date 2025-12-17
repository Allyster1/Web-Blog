export default function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
  ...props
}) {
  const baseStyles = "px-6 py-3 font-semibold transition-colors cursor-pointer";
  const roundedClass = variant === "rounded" ? "rounded-3xl" : "rounded-2xl";

  const variants = {
    primary: "bg-[#53946c] text-[#F7FAFC] hover:bg-[#3a795b]",
    secondary: "border border-gray-300 text-[#171923] hover:bg-gray-50",
    rounded: "bg-[#53946c] text-[#F7FAFC] hover:bg-[#3a795b]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${roundedClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
