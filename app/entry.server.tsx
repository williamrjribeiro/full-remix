import type { EntryContext, Headers } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

import createEmotionCache from "./components/mui/createEmotionCache";
import MuiRemixServer, { extractCriticalMUIStyles } from "./components/mui/index.server";
import I18nProvider from "./i18n/I18nProvider";
import localizeRequest from "./i18n/index.server";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const emotionCache = createEmotionCache();
  const localized = await localizeRequest(request, remixContext);
  // console.log("[entry.server.handleRequest] localized:", localized);

  const html = renderToString(
    <MuiRemixServer cache={emotionCache}>
      <I18nProvider i18n={localized}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nProvider>
    </MuiRemixServer>
  );

  const markup = extractCriticalMUIStyles(emotionCache, html);

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
