import { Check } from "lucide-react";

export default function KotakCentang({ label, className = "", ...props }) {
  return (
    <label
      className={`flex w-fit cursor-pointer items-center gap-2 has-disabled:cursor-not-allowed has-disabled:opacity-60 ${className}`}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span className="flex size-4 shrink-0 items-center justify-center rounded border border-border bg-surface text-transparent peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
        <Check className="size-3" strokeWidth={3} aria-hidden="true" />
      </span>
      <span className="text-sm leading-6 text-ink">{label}</span>
    </label>
  );
}
