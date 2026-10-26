import { useId } from "react";

export default function Input({
  label,
  hint,
  error,
  className = "",
  ...props
}) {
  const id = useId();
  const noteId = `${id}-note`;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? noteId : undefined}
        className={`h-12 w-full rounded-lg border bg-surface px-4 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
          error ? "border-error" : "border-border"
        }`}
        {...props}
      />
      {(error || hint) && (
        <p
          id={noteId}
          className={`text-xs ${error ? "text-error" : "text-muted"}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
