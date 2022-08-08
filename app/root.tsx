import type {
  LinksFunction, LoaderFunction
} from "@remix-run/node";
import { json } from '@remix-run/node';
import {
  Links, LiveReload, Meta, Outlet, Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next";
import i18nextServer from "~/i18n/i18next.server";
import { getUser } from '~/session.server';
import AmplifyInit from "./auth";
import Document from "./components/mui/document";
import type { EnvVars } from "./utils";
import { getEnvVars } from "./utils";

export const links: LinksFunction = () => {
  return [
    // NOTE: Architect deploys the public directory to /_static/
    { rel: "icon", href: "/_static/favicon.ico" },
  ];
};

export type RootLoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  locale: string;
  ENV: EnvVars;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const locale = await i18nextServer.getLocale(request);
  const data = { user, locale, ENV: getEnvVars() };
  console.log("[routes.index.loader] data:", data);
  return json<RootLoaderData>(data);
};

export const handle = {
  i18n: "common",
};

export default function App() {
  // Get the locale from the loader
  const { locale } = useLoaderData<RootLoaderData>();
  const { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);
  return (
    <Document title="Remix Notes" ExtraLinks={Links} ExtraMeta={Meta} lang={locale} dir={i18n.dir()}>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <AmplifyInit />
      <LiveReload />
    </Document>
  );
}
