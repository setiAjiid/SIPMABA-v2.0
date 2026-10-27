import { useId } from "react";

export default function Input({
  label,
  hint,
  error,
  aksiLabel,
  akhir,
  className = "",
  ...props
}) {
  const id = useId();
  const noteId = `${id}-note`;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-semibold text-ink">
            {label}
          </label>
          {aksiLabel}
        </div>
      )}
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? noteId : undefined}
          className={`h-12 w-full rounded-lg border bg-surface px-4 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
            akhir ? "pr-12" : ""
          } ${error ? "border-error" : "border-border"}`}
          {...props}
        />
        {akhir && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            {akhir}
          </div>
        )}
      </div>
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
