import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Auth } from "aws-amplify";

import { logout } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  // revoke tokens immediatelly
  await Auth.signOut();
  return logout(request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
