import type { ReactNode } from 'react';

export type SignalTone = 'neutral' | 'success' | 'warning' | 'danger';

export type SignalItem = {
  label: ReactNode;
  value: ReactNode;
  tone?: SignalTone;
};

const toneClassName: Record<SignalTone, string> = {
  neutral: 'atlas-signal-neutral',
  success: 'atlas-signal-success',
  warning: 'atlas-signal-warning',
  danger: 'atlas-signal-danger'
};

export function SignalPills({
  items,
  maxVisible = 3,
  overflowLabel = 'More'
}: {
  items: SignalItem[];
  maxVisible?: number;
  overflowLabel?: string;
}) {
  if (items.length === 0) return null;

  const visibleItems = items.slice(0, maxVisible);
  const hiddenCount = items.length - visibleItems.length;

  return (
    <div className="atlas-signal-strip">
      {visibleItems.map((item, index) => (
        <div key={index} className={`atlas-signal ${toneClassName[item.tone ?? 'neutral']}`}>
          <span className="atlas-signal-label">{item.label}</span>
          <span className="atlas-signal-value">{item.value}</span>
        </div>
      ))}
      {hiddenCount > 0 ? (
        <div className="atlas-signal atlas-signal-overflow" title={`${hiddenCount} more signals hidden`}>
          <span className="atlas-signal-label">{overflowLabel}</span>
          <span className="atlas-signal-value">+{hiddenCount}</span>
        </div>
      ) : null}
    </div>
  );
}
