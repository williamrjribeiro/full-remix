import * as React from "react";
import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

import MuiRoot from "./components/mui/index.client";
import { initI18n } from "./i18n";
import I18nProvider from "./i18n/I18nProvider";
import type i18next from 'i18next'

const hydrate = (i18n: typeof i18next) => () => {
  React.startTransition(() => {
    hydrateRoot(
      document,
      <React.StrictMode>
        <MuiRoot>
          <I18nProvider i18n={i18n}>
            <RemixBrowser />
          </I18nProvider>
        </MuiRoot>
      </React.StrictMode>
    );
  });
}

initI18n().then((i18n) => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(hydrate(i18n));
  } else {
    window.setTimeout(hydrate(i18n), 1);
  }
})
