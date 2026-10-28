import { Dialog as Primitive } from "@base-ui/react/dialog";
import {ScopedPortal} from './scope.jsx';

export const Dialog = Primitive.Root;
export const DialogTrigger = Primitive.Trigger;
export const DialogClose = Primitive.Close;

export function DialogTitle({ className = "", ...props }) {
  return <Primitive.Title data-slot="dialog-title" className={`panel-title ${className}`} {...props} />;
}

export function DialogDescription({ className = "", ...props }) {
  return <Primitive.Description data-slot="dialog-description" className={`panel-description ${className}`} {...props} />;
}

export function DialogContent({ className = "", children, ...props }) {
  return (
    <ScopedPortal component={Primitive.Portal}>
      <Primitive.Backdrop className="dialog-backdrop" />
      <Primitive.Popup data-slot="dialog-content" className={`glass-panel ${className}`} {...props}>{children}</Primitive.Popup>
    </ScopedPortal>
  );
}
