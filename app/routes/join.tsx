import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getUserId } from "~/session.server";
import SignupForm from "~/components/join/SignupForm";
import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/login");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser(email);
  invariant(user, "User should have been created. This should not have happened.");

  return redirect(redirectTo)
};

export const links: LinksFunction = () => ([{
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/icon?family=Material+Icons"
}])

export const meta: MetaFunction = () => ({ title: "Sign Up" })

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;

  return (
    <SignupForm
      search={searchParams.toString()}
      emailError={actionData?.errors?.email}
      redirectTo={redirectTo} />
  );
}
