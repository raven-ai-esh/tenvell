import { Switch as Primitive } from "@base-ui/react/switch";

export function Switch({ className = "", ...props }) {
  return <Primitive.Root data-slot="switch" className={`switch ${className}`} {...props}><Primitive.Thumb className="switch-thumb" /></Primitive.Root>;
}
