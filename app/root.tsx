import type {
  LinksFunction,
} from "@remix-run/node";
import {
  LiveReload, Outlet, Scripts,
  ScrollRestoration
} from "@remix-run/react";
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getUser } from '~/session.server';
// AMPLIFY
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import Document from "./components/mui/document";

Amplify.configure({
  Auth: {
    userPoolId: "us-east-1_HGsxcS4C7",
    userPoolWebClientId: "22ca2vu2ajvotiqchfms8sbutu"
  }
});

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
  console.log("[routes.index.loader] LOADING...");
  const user = await getUser(request);
  console.log("[routes.index.loader] user:", user);
  return json<LoaderData>({ user });
};

export default function App() {
  return (
    <Document title="Remix Notes">
      <Authenticator.Provider>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </Authenticator.Provider>
    </Document>
  );
}
