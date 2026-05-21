import Link from 'next/link';

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
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb?: string;
  actions?: Action[];
}) {
  return (
    <header className="atlas-page-intent space-y-5">
      {breadcrumb ? <p className="atlas-meta">{breadcrumb}</p> : null}
      <div className="space-y-4">
        <p className="atlas-kicker">{eyebrow}</p>
        <h1 className="atlas-title break-words">{title}</h1>
        <p className="atlas-lead max-w-3xl break-words">{description}</p>
      </div>
      {actions?.length ? (
        <div className="atlas-action-strip">
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
