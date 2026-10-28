import { LoaderCircle } from "lucide-react";
import "./button.css";

export function Button({ variant = "primary", size = "default", loading = false, disabled, children, className = "", type = "button", ...props }) {
  return <button data-slot="button" data-variant={variant} data-size={size} type={type} className={`button ${className}`} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>{loading && <LoaderCircle size={17} className="button-spinner" aria-hidden="true" />}{children}</button>;
}

export function Input({ className = "", ...props }) {
  return <input data-slot="input" data-glass-response="field" className={`input ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }) {
  return <textarea data-slot="textarea" data-glass-response="field" className={`input textarea ${className}`} {...props} />;
}
