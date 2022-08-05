import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
export * from "aws-appsync";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
const USER_SESSION_KEY = "userId";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const sessionInfo = session.get(USER_SESSION_KEY);
  // console.log("[getUserId] sessionInfo:", sessionInfo);
  console.log("[getUserId] sessionInfo.userId:", sessionInfo?.userId);
  return sessionInfo ? sessionInfo.userId : undefined;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  console.log("[getUser] userId:", userId);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  console.log("[getUser] user:", user);
  if (user) return user;

  console.warn('[getUser] Unregistered user! userId:', userId)
  // TODO: Fix this infinite loop!
  // throw await join();
  throw await logout(request);
}

export async function join() {
  return redirect("/");
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  accessToken,
  idToken,
  redirectTo,
}: {
  request: Request;
  userId: string;
  accessToken: string;
  idToken: string;
  redirectTo: string;
}) {
  console.log("[createUserSession] userId:", userId);
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, { userId, accessToken, idToken });
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: SEVEN_DAYS // 7 days
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
