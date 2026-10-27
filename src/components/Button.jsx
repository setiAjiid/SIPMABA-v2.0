const variants = {
  primary: "border border-brand bg-brand text-surface hover:bg-brand-hover",
  secondary: "border border-border bg-surface text-brand hover:bg-brand-soft",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
