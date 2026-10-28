import { Checkbox as Primitive } from "@base-ui/react/checkbox";
import { Check, Minus } from "lucide-react";
import "./checkbox.css";

export function Checkbox({ className = "", ...props }) {
  return <Primitive.Root data-slot="checkbox" className={`checkbox ${className}`} {...props}><Primitive.Indicator><Check className="checkbox-checkmark" size={14} strokeWidth={2} aria-hidden="true" /><Minus className="checkbox-mixedmark" size={14} strokeWidth={2} aria-hidden="true" /></Primitive.Indicator></Primitive.Root>;
}
