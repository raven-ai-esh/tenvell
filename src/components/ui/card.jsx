import {useContext} from 'react';
import {TenvellSettingsContext} from './scope.jsx';

export function Card({ className = "", surface, ...props }) {
  const settings=useContext(TenvellSettingsContext),material=surface??settings?.surface;
  return <article data-slot="card" data-glass={material} className={`card ${material ? "glass-surface " : ""}${className}`} {...props} />;
}
export function CardHeader({ className = "", ...props }) {
  return <header className={`card-header ${className}`} {...props} />;
}
export function CardTitle({ className = "", ...props }) {
  return <h3 className={`card-title ${className}`} {...props} />;
}
export function CardDescription({ className = "", ...props }) {
  return <p className={`card-description ${className}`} {...props} />;
}
export function CardContent({ className = "", ...props }) {
  return <div className={`card-content ${className}`} {...props} />;
}
export function CardFooter({ className = "", ...props }) {
  return <footer className={`card-footer ${className}`} {...props} />;
}
