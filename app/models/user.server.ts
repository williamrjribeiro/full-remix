import arc from "@architect/functions";
import invariant from "tiny-invariant";

export type User = { id: `email#${string}`; email: string };
export type Password = { password: string };

export async function getUserById(id: User["id"]): Promise<User | null> {
  console.log("[user.server.getUserById] id:", id);
  const db = await arc.tables();
  const result = await db.user.query({
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": id },
  });

  const [record] = result.Items;
  if (record) return { id: record.pk, email: record.email };
  return null;
}

export async function getUserByEmail(email: User["email"]) {
  return getUserById(`email#${email}`);
}

export async function createUser(
  email: User["email"],
) {
  const db = await arc.tables();
  await db.user.put({
    pk: `email#${email}`,
    email,
  });

  const user = await getUserByEmail(email);
  invariant(user, `User not found after being created. This should not happen`);

  return user;
}

export async function deleteUser(email: User["email"]) {
  const db = await arc.tables();
  await db.user.delete({ pk: `email#${email}` });
}
