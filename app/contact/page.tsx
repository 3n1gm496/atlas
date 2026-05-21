import { PageIntentHeader } from '@/components/page-intent-header';
import { getI18n } from '@/lib/i18n/server';

export default function ContactPage() {
  const { t } = getI18n();
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
        <form className="atlas-card grid min-w-0 gap-3 lg:grid-cols-2" action="mailto:atlas@incursivefashionheritage.com" method="post" encType="text/plain">
          <label className="grid min-w-0 gap-1 text-sm">
            <span>{t('contact.form.name')}</span>
            <input name="name" autoComplete="name" required placeholder={t('contact.form.namePlaceholder')} className="atlas-input" />
          </label>
          <label className="grid min-w-0 gap-1 text-sm">
            <span>{t('contact.form.email')}</span>
            <input name="email" type="email" autoComplete="email" required placeholder={t('contact.form.emailPlaceholder')} className="atlas-input" />
          </label>
          <label className="grid min-w-0 gap-1 text-sm lg:col-span-2">
            <span>{t('contact.form.subject')}</span>
            <input name="subject" placeholder={t('contact.form.subjectPlaceholder')} className="atlas-input" />
          </label>
          <label className="grid min-w-0 gap-1 text-sm lg:col-span-2">
            <span>{t('contact.form.message')}</span>
            <textarea name="message" required placeholder={t('contact.form.messagePlaceholder')} rows={6} className="atlas-textarea" />
          </label>
          <button className="atlas-link-primary w-full lg:w-fit">{t('contact.form.send')}</button>
        </form>
      </div>
    </section>
  );
}
