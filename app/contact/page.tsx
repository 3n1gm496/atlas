import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

export default function ContactPage() {
  const { t } = getI18n();
  const emailAddress = 'atlas@incursivefashionheritage.com';
  const mailtoBody = [
    'Hello Atlas team,',
    '',
    'Name:',
    'Email:',
    'Subject:',
    'Message:'
  ].join('\n');
  const mailtoHref = `mailto:${emailAddress}?subject=${encodeURIComponent('ANTICORES contact request')}&body=${encodeURIComponent(mailtoBody)}`;
  return (
    <section className="space-y-5">
      <PageIntentHeader
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        description={t('contact.description')}
      />
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="atlas-dark-card min-w-0 space-y-3 text-sm">
          <p className="break-words"><strong>{t('contact.info.email')}</strong><br />atlas@incursivefashionheritage.com</p>
          <p className="break-words"><strong>{t('contact.info.topics')}</strong><br />{t('contact.info.topicsBody')}</p>
          <p className="break-words"><strong>{t('contact.info.response')}</strong><br />{t('contact.info.responseBody')}</p>
          <p className="break-words"><strong>{t('contact.info.quick')}</strong><br />{t('contact.info.quickBody')}</p>
        </section>
        <section className="atlas-card grid min-w-0 gap-4">
          <div className="space-y-2">
            <p className="atlas-kicker">{t('contact.form.send')}</p>
            <h2 className="atlas-section-title text-3xl">{t('contact.description')}</h2>
            <p className="atlas-body text-base leading-7">{t('contact.info.quickBody')}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a className="atlas-link-primary w-full sm:w-fit" href={mailtoHref}>
              {t('contact.form.send')}
            </a>
            <p className="text-sm text-[color:var(--atlas-ink-3)]">
              {emailAddress}
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
