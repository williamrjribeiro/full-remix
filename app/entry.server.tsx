import type { EntryContext, Headers } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

import createEmotionCache from "./components/mui/createEmotionCache";
import MuiRemixServer, { extractCriticalMUIStyles } from "./components/mui/index.server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const emotionCache = createEmotionCache();

  // Render the component to a string.
  const html = renderToString(
    <MuiRemixServer cache={emotionCache}>
      <RemixServer context={remixContext} url={request.url} />
    </MuiRemixServer>
  );

  const markup = extractCriticalMUIStyles(emotionCache, html);

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
