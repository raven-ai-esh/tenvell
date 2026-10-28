import { Menu as Primitive } from "@base-ui/react/menu";
import { Check } from "lucide-react";
import {ScopedPortal} from './scope.jsx';

export const DropdownMenu = Primitive.Root;
export const DropdownMenuTrigger = Primitive.Trigger;
export const DropdownMenuGroup = Primitive.Group;
export const DropdownMenuRadioGroup = Primitive.RadioGroup;
export function DropdownMenuContent({ children, className = "", align = "start", ...props }) {
  return <ScopedPortal component={Primitive.Portal}><Primitive.Positioner sideOffset={8} align={align} className="dropdown-positioner"><Primitive.Popup className={`dropdown-content ${className}`} {...props}>{children}</Primitive.Popup></Primitive.Positioner></ScopedPortal>;
}
export function DropdownMenuItem({ className = "", ...props }) {
  return <Primitive.Item className={`dropdown-item ${className}`} {...props} />;
}
export function DropdownMenuLabel({className='',...props}) { return <Primitive.GroupLabel className={'dropdown-label '+className} {...props} />; }
export function DropdownMenuSeparator({className='',...props}) { return <Primitive.Separator className={'dropdown-separator '+className} {...props} />; }
export function DropdownMenuCheckboxItem({ children, className='', ...props }) {
  return <Primitive.CheckboxItem className={'dropdown-item dropdown-check-item '+className} {...props}><span>{children}</span><Primitive.CheckboxItemIndicator><Check size={15} aria-hidden="true" /></Primitive.CheckboxItemIndicator></Primitive.CheckboxItem>;
}
export function DropdownMenuRadioItem({ children, className='', ...props }) {
  return <Primitive.RadioItem className={'dropdown-item dropdown-check-item '+className} {...props}><span>{children}</span><Primitive.RadioItemIndicator><Check size={15} aria-hidden="true" /></Primitive.RadioItemIndicator></Primitive.RadioItem>;
}
