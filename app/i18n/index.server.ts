import type i18next from 'i18next'
import type { EntryContext } from "@remix-run/server-runtime";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import { initReactI18next } from "react-i18next";
import i18nextServer, { serverConfig } from "./i18next.server";

export default async function localizeRequest(
  request: Request,
  context: EntryContext
): Promise<typeof i18next> {
  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  const instance = createInstance();

  // Then we could detect locale from the request
  const lng = await i18nextServer.getLocale(request);

  // And here we detect what namespaces the routes about to render want to use
  const ns = i18nextServer.getRouteNamespaces(context);

  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...serverConfig,
      lng,
      ns,
    });

  return instance;
}