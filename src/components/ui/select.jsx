import { Select as Primitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import {ScopedPortal} from './scope.jsx';

export function Select({ id, items, name, value, onValueChange, disabled=false, className='', ...props }) {
  return (
    <Primitive.Root items={items} name={name} value={value} onValueChange={onValueChange} disabled={disabled}>
      <Primitive.Trigger id={id} data-slot="select-trigger" data-glass-response="field" className={'select-trigger '+className} {...props}>
        <Primitive.Value />
        <Primitive.Icon className="select-icon"><ChevronDown aria-hidden="true" strokeWidth={1.7} /></Primitive.Icon>
      </Primitive.Trigger>
      <ScopedPortal component={Primitive.Portal}>
        <Primitive.Positioner className="select-positioner" sideOffset={8} align="start" alignItemWithTrigger={false}>
          <Primitive.Popup className="select-popup">
            <Primitive.List>
              {items.map(({ value: itemValue, label }) => (
                <Primitive.Item className="select-item" key={itemValue} value={itemValue}>
                  <Primitive.ItemText>{label}</Primitive.ItemText>
                  <Primitive.ItemIndicator className="select-indicator"><Check size={18} aria-hidden="true" strokeWidth={1.8} /></Primitive.ItemIndicator>
                </Primitive.Item>
              ))}
            </Primitive.List>
          </Primitive.Popup>
        </Primitive.Positioner>
      </ScopedPortal>
    </Primitive.Root>
  );
}
