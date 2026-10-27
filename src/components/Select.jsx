import { useId } from "react";

export default function Select({
  label,
  options = [],
  placeholder = "Pilih",
  error,
  ...props
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <select
        id={id}
        aria-invalid={!!error}
        className={`h-12 w-full rounded-lg border bg-surface px-4 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
          error ? "border-error" : "border-border"
        }`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
