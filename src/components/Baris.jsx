export default function Baris({ label, untuk, children }) {
  return (
    <div className="grid gap-2 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
      <label
        htmlFor={untuk}
        className="text-sm font-semibold text-ink md:flex md:h-12 md:items-center"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
