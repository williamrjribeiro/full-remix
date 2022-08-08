import Backend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { RemixI18Next } from 'remix-i18next';
import config from './config';

export const serverConfig = {
  ...config,
  backend: {
    loadPath: resolve('../public/locales/{{lng}}/{{ns}}.json')
  }
}

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: serverConfig.supportedLngs,
    fallbackLanguage: serverConfig.fallbackLng,
  },
  i18next: { ...serverConfig },
  backend: Backend,
});

export default i18next;