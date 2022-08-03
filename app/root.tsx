import type {
  LinksFunction,
  LoaderFunction
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  LiveReload, Outlet, Scripts,
  ScrollRestoration
} from "@remix-run/react";
import Document from "./components/mui/document";

import { getUser } from "./session.server";

export const links: LinksFunction = () => {
  return [
    // NOTE: Architect deploys the public directory to /_static/
    { rel: "icon", href: "/_static/favicon.ico" },
  ];
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  return (
    <Document title="Remix Notes">
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </Document>
  );
}
