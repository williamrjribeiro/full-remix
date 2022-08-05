import { useCallback, useEffect } from "react";
import {
  Authenticator,
  useAuthenticator,
} from "@aws-amplify/ui-react";
import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json, } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import styles from "@aws-amplify/ui-react/styles.css";

import { createUserSession, getUserId } from "../session.server";

export const links: LinksFunction = () => ([{ rel: "stylesheet", href: styles }]);

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors?: {
    accessToken?: string;
    idToken?: string;
    email?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  // for (const pair of formData.entries()) {
  //   console.log(`[login.action] formData: ${pair[0]}, ${pair[1]}`);
  // }
  const accessToken = formData.get("accessToken");
  const idToken = formData.get("idToken");
  const email = formData.get("email");

  if (typeof accessToken !== "string" || accessToken.length === 0) {
    return json<ActionData>(
      { errors: { accessToken: "Could not obtain accessToken" } },
      { status: 400 }
    );
  }

  if (typeof idToken !== "string" || idToken.length === 0) {
    return json<ActionData>(
      { errors: { idToken: "Could not obtain idToken" } },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || email.length === 0) {
    return json<ActionData>(
      { errors: { email: "Could not obtain email" } },
      { status: 400 }
    );
  }


  return await createUserSession({
    request,
    userId: `email#${email}`,
    accessToken,
    idToken,
    redirectTo: "/notes",
  });
};

function Login() {
  const fetcher = useFetcher();
  const { user } = useAuthenticator((context) => [context.user]);

  const setUserSessionInfo = useCallback((user: any) => {
    if (user && fetcher.type === "init") {
      // console.log("[login.setUserSessionInfo] user:", user);
      const { accessToken, idToken } = user.signInUserSession;
      fetcher.submit(
        {
          accessToken: accessToken.jwtToken,
          idToken: idToken.jwtToken,
          email: user.attributes.email
        },
        { method: "post" }
      );
    }
  }, [fetcher]);

  useEffect(() => {
    // console.log("[login.useEffect] user:", user);
    setUserSessionInfo(user);
  }, [user, setUserSessionInfo]);


  return (
    <Authenticator.Provider>
      <Authenticator>
        {() => (<h1>Signing in...</h1>)}
      </Authenticator>
    </Authenticator.Provider>
  );
}

const LoginContainer = () => (
  <Authenticator.Provider><Login ></Login></Authenticator.Provider>
)

export default LoginContainer;
