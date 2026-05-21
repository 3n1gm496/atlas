'use client';

import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/components/i18n-provider';

type Country = { id: string; name: string };
type TaxonomyTerm = { id: string; labelIt: string; groupId: string };
type TaxonomyGroup = { id: string; slug: string; labelIt: string; terms: TaxonomyTerm[] };

type Props = {
  countries: Country[];
  groups: TaxonomyGroup[];
  initialDraft?: {
    id: string;
    status: string;
    updatedAt: string;
    form: FormState;
  } | null;
};

type TrendMetadata = {
  trendSummary?: string;
} & Record<string, string[] | string | undefined>;

type FormState = {
  slug: string;
  title: string;
  abstract: string;
  description: string;
  canonicalLanguage: string;
  countryId: string;
  placeName: string;
  timePeriodLabel: string;
  sourceContext: string;
  keywords: string;
  trendSummary: string;
  taxonomyTermIds: string[];
};

const initialState: FormState = {
  slug: '',
  title: '',
  abstract: '',
  description: '',
  canonicalLanguage: 'en',
  countryId: '',
  placeName: '',
  timePeriodLabel: '',
  sourceContext: '',
  keywords: '',
  trendSummary: '',
  taxonomyTermIds: []
};

const LOCAL_DRAFT_KEY = 'atlas-submit-draft-v2';

function isBlank(value: string) {
  return value.trim().length === 0;
}

function resolveStepFromForm(form: FormState) {
  if (isBlank(form.slug) || isBlank(form.title) || isBlank(form.abstract) || isBlank(form.description)) return 0;
  if (isBlank(form.countryId) || isBlank(form.timePeriodLabel)) return 1;
  if (form.taxonomyTermIds.length === 0) return 3;
  if (isBlank(form.sourceContext) || isBlank(form.trendSummary)) return 4;
  return 4;
}

function readStoredDraft() {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(LOCAL_DRAFT_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as {
      form?: Partial<FormState>;
      step?: number;
      savedAt?: string;
    };

    return parsed;
  } catch {
    window.localStorage.removeItem(LOCAL_DRAFT_KEY);
    return null;
  }
}

function buildInitialDraftState(
  initialDraft: Props['initialDraft'],
  locale: string,
  t: ReturnType<typeof useI18n>['t'],
  stepCount: number
) {
  if (initialDraft?.form) {
    return {
      form: initialDraft.form,
      step: resolveStepFromForm(initialDraft.form),
      status: t('submitForm.status.resumedServer', { date: new Date(initialDraft.updatedAt).toLocaleString(locale) }),
      lastSavedAt: null,
      serverDraftId: initialDraft.id,
      serverSavedAt: initialDraft.updatedAt
    };
  }

  const stored = readStoredDraft();
  if (stored?.form) {
    const form = {
      ...initialState,
      ...stored.form,
      taxonomyTermIds: Array.isArray(stored.form.taxonomyTermIds) ? stored.form.taxonomyTermIds : []
    };

    return {
      form,
      step: typeof stored.step === 'number' && stored.step >= 0 && stored.step < stepCount ? stored.step : resolveStepFromForm(form),
      status: stored.savedAt
        ? t('submitForm.status.resumedLocal', { date: new Date(stored.savedAt).toLocaleString(locale) })
        : '',
      lastSavedAt: stored.savedAt ?? null,
      serverDraftId: initialDraft?.id ?? null,
      serverSavedAt: initialDraft?.updatedAt ?? null
    };
  }

  return {
    form: initialState,
    step: 0,
    status: '',
    lastSavedAt: null,
    serverDraftId: initialDraft?.id ?? null,
    serverSavedAt: initialDraft?.updatedAt ?? null
  };
}

export function SubmitTrendForm({ countries, groups, initialDraft }: Props) {
  const { t, locale } = useI18n();
  const steps = useMemo(
    () => [
      {
        label: t('submitForm.steps.0.label'),
        description: t('submitForm.steps.0.description')
      },
      {
        label: t('submitForm.steps.1.label'),
        description: t('submitForm.steps.1.description')
      },
      {
        label: t('submitForm.steps.2.label'),
        description: t('submitForm.steps.2.description')
      },
      {
        label: t('submitForm.steps.3.label'),
        description: t('submitForm.steps.3.description')
      },
      {
        label: t('submitForm.steps.4.label'),
        description: t('submitForm.steps.4.description')
      }
    ],
    [t]
  );
  const initialDraftState = useMemo(() => buildInitialDraftState(initialDraft, locale, t, steps.length), [initialDraft, locale, t, steps.length]);
  const [form, setForm] = useState<FormState>(() => initialDraftState.form);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string>(() => initialDraftState.status);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(() => initialDraftState.step);
  const [attemptedStep, setAttemptedStep] = useState<number | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => initialDraftState.lastSavedAt);
  const [serverDraftId, setServerDraftId] = useState<string | null>(() => initialDraftState.serverDraftId);
  const [serverSavedAt, setServerSavedAt] = useState<string | null>(() => initialDraftState.serverSavedAt);

  const selectedCountry = countries.find((country) => country.id === form.countryId)?.name ?? t('submitForm.summary.unknownCountry');
  const taxonomyCount = form.taxonomyTermIds.length;
  const summaryKeywords = form.keywords
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const completion = useMemo(
    () => [
      !isBlank(form.slug) && !isBlank(form.title) && !isBlank(form.abstract) && !isBlank(form.description),
      !isBlank(form.countryId) && !isBlank(form.timePeriodLabel),
      true,
      form.taxonomyTermIds.length > 0,
      !isBlank(form.sourceContext) && !isBlank(form.trendSummary)
    ],
    [form]
  );

  const canCreateServerDraft = useMemo(
    () => !isBlank(form.slug) && !isBlank(form.title) && !isBlank(form.abstract) && !isBlank(form.description) && !isBlank(form.countryId),
    [form]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const savedAt = new Date().toISOString();
      window.localStorage.setItem(
        LOCAL_DRAFT_KEY,
        JSON.stringify({
          form,
          step,
          savedAt
        })
      );
      setLastSavedAt(savedAt);
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [form, step]);

  function getStepErrors(index: number) {
    switch (index) {
      case 0:
        return {
          slug: isBlank(form.slug) ? t('submitForm.errors.slug') : '',
          title: isBlank(form.title) ? t('submitForm.errors.title') : '',
          abstract: isBlank(form.abstract) ? t('submitForm.errors.abstract') : '',
          description: isBlank(form.description) ? t('submitForm.errors.description') : ''
        };
      case 1:
        return {
          countryId: isBlank(form.countryId) ? t('submitForm.errors.country') : '',
          timePeriodLabel: isBlank(form.timePeriodLabel) ? t('submitForm.errors.period') : ''
        };
      case 2:
        return {};
      case 3:
        return {
          taxonomyTermIds: form.taxonomyTermIds.length === 0 ? t('submitForm.errors.taxonomy') : ''
        };
      case 4:
        return {
          sourceContext: isBlank(form.sourceContext) ? t('submitForm.errors.source') : '',
          trendSummary: isBlank(form.trendSummary) ? t('submitForm.errors.summary') : ''
        };
      default:
        return {};
    }
  }

  function canAdvance(index: number) {
    const errors = Object.values(getStepErrors(index));
    return errors.every((error) => !error);
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleTerm(termId: string) {
    setForm((current) => ({
      ...current,
      taxonomyTermIds: current.taxonomyTermIds.includes(termId)
        ? current.taxonomyTermIds.filter((value) => value !== termId)
        : [...current.taxonomyTermIds, termId]
    }));
  }

  const payload = useMemo(() => {
    const trendMetadata: TrendMetadata = {
      trendSummary: form.trendSummary
    };

    groups.forEach((group) => {
      const selectedInGroup = group.terms
        .filter((term) => form.taxonomyTermIds.includes(term.id))
        .map((term) => term.labelIt);
      trendMetadata[group.slug] = selectedInGroup;
    });

    return {
      slug: form.slug,
      title: form.title,
      abstract: form.abstract,
      description: form.description,
      canonicalLanguage: form.canonicalLanguage,
      countryId: form.countryId,
      placeName: form.placeName,
      timePeriodLabel: form.timePeriodLabel,
      sourceContext: form.sourceContext,
      taxonomyTermIds: form.taxonomyTermIds,
      keywords: form.keywords
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      trendMetadata
    };
  }, [form, groups]);

  async function createServerDraft() {
    const response = await fetch('/api/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body.error?.message ?? t('submitForm.errors.createDraft'));
    }

    const savedAt = new Date().toISOString();
    setServerDraftId(body.data.id);
    setServerSavedAt(savedAt);
    setLastSavedAt(savedAt);
    return body.data.id as string;
  }

  async function updateServerDraft(id: string, mode: 'autosave' | 'manual' = 'manual') {
    const response = await fetch(`/api/entries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (mode !== 'autosave') {
        throw new Error(body.error?.message ?? t('submitForm.errors.updateDraft'));
      }
      setStatus(
        t('submitForm.status.autosaveFailed', { reason: body.error?.message ?? t('submitForm.status.retry') })
      );
      return;
    }

    const savedAt = new Date().toISOString();
    setServerSavedAt(savedAt);
    setLastSavedAt(savedAt);

    if (mode !== 'autosave') {
      setStatus(t('submitForm.status.savedServer'));
    }
  }

  useEffect(() => {
    if (!serverDraftId) return;

    const timeout = window.setTimeout(() => {
      void (async () => {
        const response = await fetch(`/api/entries/${serverDraftId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          setStatus(
            t('submitForm.status.autosaveFailed', { reason: body.error?.message ?? t('submitForm.status.retry') })
          );
          return;
        }

        const savedAt = new Date().toISOString();
        setServerSavedAt(savedAt);
        setLastSavedAt(savedAt);
      })();
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [payload, serverDraftId, t]);

  async function onSubmit() {
    const lastStep = steps.length - 1;
    if (!canAdvance(lastStep)) {
      setAttemptedStep(lastStep);
      setStatus(t('submitForm.status.missingBeforeSave'));
      return;
    }

    setLoading(true);
    setStatus(t('submitForm.status.savingDraft'));

    try {
      if (serverDraftId) {
        await updateServerDraft(serverDraftId);
      } else {
        const draftId = await createServerDraft();
        setStatus(t('submitForm.status.savedServer'));
        setServerDraftId(draftId);
      }
      window.localStorage.removeItem(LOCAL_DRAFT_KEY);
    } catch (error) {
      setStatus(t('submitForm.status.error', { reason: error instanceof Error ? error.message : t('submitForm.status.saveFailed') }));
    } finally {
      setLoading(false);
    }
  }

  const currentErrors = attemptedStep === step ? getStepErrors(step) : {};

  function discardLocalDraft() {
    window.localStorage.removeItem(LOCAL_DRAFT_KEY);
    setLastSavedAt(null);
    if (serverDraftId) {
      setStatus(t('submitForm.status.localRemovedServer'));
      return;
    }
    setForm(initialState);
    setMediaFiles([]);
    setStep(0);
    setAttemptedStep(null);
    setStatus(t('submitForm.status.localCleared'));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.42fr]">
      <div className="space-y-5">
        <div className="atlas-card">
          <div className="grid gap-3 md:grid-cols-4">
            {steps.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setStep(index)}
                className={`rounded-[1.6rem] border px-4 py-4 text-left ${
                  step === index
                    ? 'border-[color:var(--atlas-accent)] bg-white shadow-sm'
                    : 'border-[rgba(191,169,150,0.72)] bg-[rgba(255,253,249,0.82)]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="atlas-meta">{t('submitForm.stepLabel', { step: index + 1 })}</span>
                  <span className={`atlas-chip ${completion[index] ? 'atlas-chip-success' : 'atlas-chip'}`}>
                    {completion[index] ? t('submitForm.stepReady') : t('submitForm.stepTodo')}
                  </span>
                </div>
                <p className="mt-3 font-semibold text-[color:var(--atlas-ink-1)]">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--atlas-ink-2)]">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="atlas-card space-y-5">
          <div>
            <p className="atlas-kicker">{steps[step].label}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{steps[step].description}</h2>
          </div>

          {step === 0 ? (
            <section className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span>{t('submitForm.fields.slug.label')}</span>
                <input value={form.slug} onChange={(event) => updateField('slug', event.target.value)} className="atlas-input" data-invalid={Boolean(currentErrors.slug)} />
                <p className="atlas-field-hint">{t('submitForm.fields.slug.hint')}</p>
                {currentErrors.slug ? <p className="atlas-field-error">{currentErrors.slug}</p> : null}
              </label>
              <label className="space-y-1 text-sm">
                <span>{t('submitForm.fields.title.label')}</span>
                <input value={form.title} onChange={(event) => updateField('title', event.target.value)} className="atlas-input" data-invalid={Boolean(currentErrors.title)} />
                <p className="atlas-field-hint">{t('submitForm.fields.title.hint')}</p>
                {currentErrors.title ? <p className="atlas-field-error">{currentErrors.title}</p> : null}
              </label>
              <label className="space-y-1 text-sm md:col-span-2">
                <span>{t('submitForm.fields.abstract.label')}</span>
                <textarea value={form.abstract} onChange={(event) => updateField('abstract', event.target.value)} rows={4} className="atlas-textarea" data-invalid={Boolean(currentErrors.abstract)} />
                <p className="atlas-field-hint">{t('submitForm.fields.abstract.hint')}</p>
                {currentErrors.abstract ? <p className="atlas-field-error">{currentErrors.abstract}</p> : null}
              </label>
              <label className="space-y-1 text-sm md:col-span-2">
                <span>{t('submitForm.fields.description.label')}</span>
                <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows={7} className="atlas-textarea" data-invalid={Boolean(currentErrors.description)} />
                <p className="atlas-field-hint">{t('submitForm.fields.description.hint')}</p>
                {currentErrors.description ? <p className="atlas-field-error">{currentErrors.description}</p> : null}
              </label>
            </section>
          ) : null}

          {step === 1 ? (
            <section className="grid gap-4 md:grid-cols-3">
              <label className="space-y-1 text-sm">
                <span>{t('submitForm.fields.language.label')}</span>
                <select value={form.canonicalLanguage} onChange={(event) => updateField('canonicalLanguage', event.target.value)} className="atlas-select">
                  <option value="it">{t('language.it')}</option>
                  <option value="en">{t('language.en')}</option>
                  <option value="fr">{t('language.fr')}</option>
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span>{t('submitForm.fields.country.label')}</span>
                <select value={form.countryId} onChange={(event) => updateField('countryId', event.target.value)} className="atlas-select" data-invalid={Boolean(currentErrors.countryId)}>
                  <option value="">{t('submitForm.fields.country.placeholder')}</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {currentErrors.countryId ? <p className="atlas-field-error">{currentErrors.countryId}</p> : null}
              </label>
              <label className="space-y-1 text-sm">
                <span>{t('submitForm.fields.place.label')}</span>
                <input value={form.placeName} onChange={(event) => updateField('placeName', event.target.value)} className="atlas-input" />
                <p className="atlas-field-hint">{t('submitForm.fields.place.hint')}</p>
              </label>
              <label className="space-y-1 text-sm">
                <span>{t('submitForm.fields.period.label')}</span>
                <input
                  value={form.timePeriodLabel}
                  onChange={(event) => updateField('timePeriodLabel', event.target.value)}
                  className="atlas-input"
                  data-invalid={Boolean(currentErrors.timePeriodLabel)}
                  placeholder={t('submitForm.fields.period.placeholder')}
                />
                <p className="atlas-field-hint">{t('submitForm.fields.period.hint')}</p>
                {currentErrors.timePeriodLabel ? <p className="atlas-field-error">{currentErrors.timePeriodLabel}</p> : null}
              </label>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="space-y-4">
              <p className="atlas-body">
                {t('submitForm.media.lead')}
              </p>
              <label className="space-y-1 text-sm">
                <span>{t('submitForm.media.label')}</span>
                <input type="file" accept="image/*,video/*" multiple onChange={(event) => setMediaFiles(Array.from(event.target.files ?? []))} className="atlas-input" />
                <p className="atlas-field-hint">{t('submitForm.media.hint')}</p>
              </label>
              <div className="atlas-panel space-y-2">
                <p className="atlas-kicker">{t('submitForm.media.queue')}</p>
                {mediaFiles.length ? (
                  <ul className="space-y-2">
                    {mediaFiles.map((file) => (
                      <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 text-sm text-[color:var(--atlas-ink-2)]">
                        <span>{file.name}</span>
                        <span className="atlas-meta">{Math.round(file.size / 1024)} KB</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[color:var(--atlas-ink-2)]">{t('submitForm.media.empty')}</p>
                )}
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="space-y-4">
              <p className="atlas-body">
                {t('submitForm.taxonomy.lead')}
              </p>
              {currentErrors.taxonomyTermIds ? <p className="atlas-field-error">{currentErrors.taxonomyTermIds}</p> : null}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {groups.map((group) => (
                  <fieldset key={group.id} className="atlas-panel">
                    <legend className="px-1 text-sm font-semibold text-[color:var(--atlas-ink-1)]">
                      {group.labelIt}
                      <span className="ml-2 atlas-meta">({group.terms.length})</span>
                    </legend>
                    <div className="mt-3 max-h-52 space-y-2 overflow-auto pr-2 text-sm">
                      {group.terms.map((term) => {
                        const checked = form.taxonomyTermIds.includes(term.id);
                        return (
                          <label key={term.id} className={`flex items-start gap-3 rounded-2xl px-3 py-2 ${checked ? 'bg-white' : ''}`}>
                            <input type="checkbox" checked={checked} onChange={() => toggleTerm(term.id)} />
                            <span className="text-[color:var(--atlas-ink-2)]">{term.labelIt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </section>
          ) : null}

          {step === 4 ? (
            <section className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span>{t('submitForm.fields.keywords.label')}</span>
                  <input
                    value={form.keywords}
                    onChange={(event) => updateField('keywords', event.target.value)}
                    className="atlas-input"
                    placeholder={t('submitForm.fields.keywords.placeholder')}
                  />
                  <p className="atlas-field-hint">{t('submitForm.fields.keywords.hint')}</p>
                </label>
                <label className="space-y-1 text-sm md:col-span-2">
                  <span>{t('submitForm.fields.source.label')}</span>
                  <input
                    value={form.sourceContext}
                    onChange={(event) => updateField('sourceContext', event.target.value)}
                    className="atlas-input"
                    data-invalid={Boolean(currentErrors.sourceContext)}
                    placeholder={t('submitForm.fields.source.placeholder')}
                  />
                  {currentErrors.sourceContext ? <p className="atlas-field-error">{currentErrors.sourceContext}</p> : null}
                </label>
                <label className="space-y-1 text-sm md:col-span-2">
                  <span>{t('submitForm.fields.summary.label')}</span>
                  <textarea value={form.trendSummary} onChange={(event) => updateField('trendSummary', event.target.value)} rows={4} className="atlas-textarea" data-invalid={Boolean(currentErrors.trendSummary)} />
                  <p className="atlas-field-hint">{t('submitForm.fields.summary.hint')}</p>
                  {currentErrors.trendSummary ? <p className="atlas-field-error">{currentErrors.trendSummary}</p> : null}
                </label>
              </div>

              <div className="atlas-panel space-y-3">
                <p className="atlas-kicker">{t('submitForm.summary.kicker')}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="atlas-meta">{t('submitForm.summary.title')}</p>
                    <p className="mt-1 font-semibold text-[color:var(--atlas-ink-1)]">{form.title || t('submitForm.summary.missingTitle')}</p>
                  </div>
                  <div>
                    <p className="atlas-meta">{t('submitForm.summary.territory')}</p>
                    <p className="mt-1 font-semibold text-[color:var(--atlas-ink-1)]">
                      {selectedCountry} · {form.placeName || t('submitForm.summary.unknownPlace')}
                    </p>
                  </div>
                  <div>
                    <p className="atlas-meta">{t('submitForm.summary.period')}</p>
                    <p className="mt-1 font-semibold text-[color:var(--atlas-ink-1)]">{form.timePeriodLabel || t('submitForm.summary.unknownPeriod')}</p>
                  </div>
                  <div>
                    <p className="atlas-meta">{t('submitForm.summary.taxonomy')}</p>
                    <p className="mt-1 font-semibold text-[color:var(--atlas-ink-1)]">{taxonomyCount}</p>
                  </div>
                  <div>
                    <p className="atlas-meta">{t('submitForm.summary.media')}</p>
                    <p className="mt-1 font-semibold text-[color:var(--atlas-ink-1)]">{mediaFiles.length}</p>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <div className="atlas-action-strip justify-between">
            <div className="atlas-action-strip">
              {step > 0 ? (
                <button type="button" onClick={() => setStep((current) => current - 1)} className="atlas-link-secondary">
                  {t('submitForm.actions.back')}
                </button>
              ) : null}
              <button
                type="button"
                disabled={loading || (!serverDraftId && !canCreateServerDraft)}
                onClick={async () => {
                  try {
                    setLoading(true);
                    setStatus(serverDraftId ? t('submitForm.status.updatingServer') : t('submitForm.status.openingServer'));
                    if (serverDraftId) {
                      await updateServerDraft(serverDraftId);
                    } else {
                      await createServerDraft();
                      setStatus(t('submitForm.status.openedServer'));
                    }
                    window.localStorage.removeItem(LOCAL_DRAFT_KEY);
                  } catch (error) {
                    setStatus(t('submitForm.status.error', { reason: error instanceof Error ? error.message : t('submitForm.status.saveFailed') }));
                  } finally {
                    setLoading(false);
                  }
                }}
                className="atlas-link-secondary disabled:opacity-50"
              >
                {serverDraftId ? t('submitForm.actions.saveLater') : t('submitForm.actions.openServer')}
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={async () => {
                    let openedServerDraft = false;
                    if (!canAdvance(step)) {
                      setAttemptedStep(step);
                      setStatus(t('submitForm.status.completeRequired'));
                      return;
                    }

                    if (step === 1 && !serverDraftId && canCreateServerDraft) {
                      try {
                        setLoading(true);
                        setStatus(t('submitForm.status.openingServer'));
                        await createServerDraft();
                        openedServerDraft = true;
                        setStatus(t('submitForm.status.openedServerContinue'));
                      } catch (error) {
                        setStatus(t('submitForm.status.error', { reason: error instanceof Error ? error.message : t('submitForm.errors.openDraft') }));
                        setLoading(false);
                        return;
                      } finally {
                        setLoading(false);
                      }
                    }

                    setAttemptedStep(null);
                    if (!serverDraftId && !openedServerDraft) setStatus('');
                    setStep((current) => current + 1);
                  }}
                  disabled={loading}
                  className="atlas-link-primary disabled:opacity-60"
                >
                  {t('submitForm.actions.next')}
                </button>
              ) : (
                <button type="button" disabled={loading} onClick={onSubmit} className="atlas-link-primary disabled:opacity-60">
                  {loading ? t('submitForm.actions.saving') : t('submitForm.actions.save')}
                </button>
              )}
            </div>
            <span className="atlas-meta">
              {t('submitForm.progress', { completed: completion.filter(Boolean).length, total: steps.length })}
            </span>
          </div>
          {status ? <p className="text-sm text-[color:var(--atlas-ink-2)]">{status}</p> : null}
          {!status && serverDraftId && serverSavedAt ? (
            <p className="text-sm text-[color:var(--atlas-ink-2)]">
              {t('submitForm.status.updatedServerTime', { time: new Date(serverSavedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) })}
            </p>
          ) : null}
          {!status && !serverDraftId && lastSavedAt ? (
            <p className="text-sm text-[color:var(--atlas-ink-2)]">
              {t('submitForm.status.updatedLocalTime', { time: new Date(lastSavedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) })}
            </p>
          ) : null}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="atlas-card sticky top-24 space-y-4">
          <div>
            <p className="atlas-kicker">{t('submitForm.aside.kicker')}</p>
            <h2 className="text-2xl font-semibold text-[color:var(--atlas-ink-1)]">{t('submitForm.aside.title')}</h2>
          </div>
          <div className="grid gap-3">
            <div className="atlas-panel">
              <p className="atlas-meta">{t('submitForm.aside.titleLabel')}</p>
              <p className="mt-2 font-semibold text-[color:var(--atlas-ink-1)]">{form.title || t('submitForm.aside.missingTitle')}</p>
            </div>
            <div className="atlas-panel">
              <p className="atlas-meta">{t('submitForm.aside.slugLabel')}</p>
              <p className="mt-2 font-semibold text-[color:var(--atlas-ink-1)]">{form.slug || t('submitForm.aside.missingSlug')}</p>
            </div>
            <div className="atlas-panel">
              <p className="atlas-meta">{t('submitForm.aside.territoryLabel')}</p>
              <p className="mt-2 font-semibold text-[color:var(--atlas-ink-1)]">
                {selectedCountry}
                {form.placeName ? ` · ${form.placeName}` : ''}
              </p>
            </div>
            <div className="atlas-panel">
              <p className="atlas-meta">{t('submitForm.aside.periodLabel')}</p>
              <p className="mt-2 font-semibold text-[color:var(--atlas-ink-1)]">{form.timePeriodLabel || t('submitForm.aside.missingPeriod')}</p>
            </div>
            <div className="atlas-panel">
              <p className="atlas-meta">{t('submitForm.aside.taxonomyLabel')}</p>
              <p className="mt-2 font-semibold text-[color:var(--atlas-ink-1)]">
                {t('submitForm.aside.taxonomyCount', { count: taxonomyCount })}
              </p>
            </div>
            <div className="atlas-panel">
              <p className="atlas-meta">{t('submitForm.aside.mediaLabel')}</p>
              <p className="mt-2 font-semibold text-[color:var(--atlas-ink-1)]">
                {mediaFiles.length ? t('submitForm.aside.mediaCount', { count: mediaFiles.length }) : t('submitForm.aside.mediaEmpty')}
              </p>
            </div>
            <div className="atlas-panel">
              <p className="atlas-meta">{t('submitForm.aside.keywordsLabel')}</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--atlas-ink-2)]">
                {summaryKeywords.length > 0 ? summaryKeywords.join(', ') : t('submitForm.aside.keywordsEmpty')}
              </p>
            </div>
          </div>
          <div className="atlas-panel space-y-3">
            <p className="atlas-meta">{t('submitForm.aside.draftStatus')}</p>
            <p className="text-sm leading-6 text-[color:var(--atlas-ink-2)]">
              {serverDraftId
                ? t('submitForm.aside.serverStatus', {
                    date: new Date(serverSavedAt ?? lastSavedAt ?? new Date().toISOString()).toLocaleString(locale)
                  })
                : lastSavedAt
                  ? t('submitForm.aside.localStatus', { date: new Date(lastSavedAt).toLocaleString(locale) })
                  : t('submitForm.aside.localOnly')}
            </p>
            <button type="button" onClick={discardLocalDraft} className="atlas-link-secondary w-full justify-center">
              {t('submitForm.aside.clearLocal')}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
