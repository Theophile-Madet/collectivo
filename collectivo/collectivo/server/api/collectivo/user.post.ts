import { readRoles, updateUser } from "@directus/sdk";

// Update keycloak user
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  console.log("new user created called");

  if (config.public.authService !== "keycloak") {
    return;
  }

  verifyCollectivoApiToken(event);
  const body = await readBody(event);
  const directus = await useDirectusAdmin();
  const isCreate = body.event === "users.create";

  body.keys = body.keys || [body.key];

  if (!isCreate) {
    throw new Error("Only users.create events are supported");
  }

  const roleID = await getRole("collectivo_user");

  for (const key of body.keys) {
    // Set external identifier to match email
    await directus.request(
      updateUser(key, {
        role: roleID,
        provider: "keycloak",
        external_identifier: body.payload.email,
      }),
    );
  }
});

async function getRole(name: string) {
  const directus = await useDirectusAdmin();

  const membersRoles = await directus.request(
    readRoles({
      filter: {
        name: { _eq: name },
      },
    }),
  );

  if (membersRoles.length < 1) {
    throw new Error(name + " role not found");
  }

  return membersRoles[0].id;
}
