import i18next from 'i18next';
import enBilling from './features/billing/locales/en/common.json';
import koBilling from './features/billing/locales/ko/common.json';

export const i18n = i18next.init({
  fallbackLng: 'en',
  resources: { en: { billing: enBilling }, ko: { billing: koBilling } },
  ns: ['billing'],
});
