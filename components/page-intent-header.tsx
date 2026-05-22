import Link from 'next/link';
import { SignalPills, type SignalItem } from '@/components/signal-pills';

type Action = {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary';
};

export function PageIntentHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
  actions,
  signals,
  signalOverflowLabel = 'More'
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb?: string;
  actions?: Action[];
  signals?: SignalItem[];
  signalOverflowLabel?: string;
}) {
  return (
    <header className="atlas-page-intent space-y-4">
      {breadcrumb ? <p className="atlas-meta">{breadcrumb}</p> : null}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <div className="space-y-4">
          <p className="atlas-kicker">{eyebrow}</p>
          <h1 className="atlas-title break-words">{title}</h1>
          <p className="atlas-lead max-w-3xl break-words">{description}</p>
        </div>
        <div className="min-w-0">
          <SignalPills items={signals ?? []} overflowLabel={signalOverflowLabel} />
        </div>
      </div>
      {actions?.length ? (
        <div className="atlas-action-strip border-t border-[rgba(112,83,61,0.12)] pt-4">
          {actions.map((action) => (
            <Link
              key={`${action.href}-${action.label}`}
              href={action.href}
              prefetch={false}
              className={action.variant === 'secondary' ? 'atlas-link-secondary' : 'atlas-link-primary'}
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
