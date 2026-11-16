import { Link } from "react-router-dom";

const variants = {
  primary:
    "border border-brand-fill bg-brand-fill text-on-brand hover:border-brand-fill-hover hover:bg-brand-fill-hover",
  secondary: "border border-border bg-surface text-brand hover:bg-brand-soft",
};

// Dengan prop `to` tombol dirender sebagai tautan router, dan dengan `href`
// sebagai tautan biasa (misalnya mailto: atau situs luar).
export default function Button({
  variant = "primary",
  className = "",
  to,
  href,
  children,
  ...props
}) {
  const Komponen = to ? Link : href ? "a" : "button";
  return (
    <Komponen
      to={to}
      href={href}
      className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-bold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Komponen>
  );
}
