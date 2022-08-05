import type {
  LinksFunction,
} from "@remix-run/node";
import {
  Links, Meta,
  LiveReload, Outlet, Scripts,
  ScrollRestoration
} from "@remix-run/react";
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getUser } from '~/session.server';
import Document from "./components/mui/document";
import type { EnvVars} from "./utils";
import { getEnvVars } from "./utils";
import AmplifyInit from "./auth";

export const links: LinksFunction = () => {
  return [
    // NOTE: Architect deploys the public directory to /_static/
    { rel: "icon", href: "/_static/favicon.ico" },
  ];
};

export type RootLoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  ENV: EnvVars;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const data = { user, ENV: getEnvVars() };
  console.log("[routes.index.loader] data:", data);
  return json<RootLoaderData>(data);
};

export default function App() {
  return (
    <Document title="Remix Notes" ExtraLinks={Links} ExtraMeta={Meta}>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <AmplifyInit />
      <LiveReload />
    </Document>
  );
}
