import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../components/ui';
import { t } from '../i18n/translate.js';

export function Command({ children, label }) {
  const [state, setState] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(children); setState('Скопировано'); }
    catch { setState('Не удалось скопировать. Выделите команду вручную.'); }
  }
  return <div className="release-command"><pre><code>{children}</code></pre><Button size="icon" variant="ghost" onClick={copy} aria-label={t('Скопировать: ' + label)}>{state === 'Скопировано' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}</Button><span className="release-copy-status" role="status">{t(state)}</span></div>;
}
