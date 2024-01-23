import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";

const CLOUDFLARE_WORKER_URL = "https://temp-storage.ajpavlick.workers.dev";

export default async function entity(
  request: PagesHttpRequest
): Promise<PagesHttpResponse> {
  const { method, pathParams, body } = request;
  const entityId = pathParams.id;
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  switch (method) {
    case "GET":
      return getEntity(pathParams.id);
    case "PUT":
      if (!body) {
        return { body: "Missing entity body", headers: {}, statusCode: 400 };
      }
      const bodyObj = JSON.parse(body);
      return updateEntity(pathParams.id, bodyObj);
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

const getEntity = async (entityId?: string): Promise<SitesHttpResponse> => {
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  const mgmtApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/entities/${entityId}?api_key=${YEXT_PUBLIC_API_KEY}&v=20230901`
  );

  const resp = await mgmtApiResp.json();

  if (mgmtApiResp.status !== 200) {
    console.error("Error fetching entity:", resp);
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: mgmtApiResp.status,
    };
  } else {
    const { response } = resp;
    const { c_template, slug, meta, ...rest } = response;

    // excluding c_template and slug from the response and pulling id out of meta
    const updatedResp = { id: meta.id, ...rest };
    return {
      body: JSON.stringify(updatedResp),
      headers: {},
      statusCode: 200,
    };
  }
};

const updateEntity = async (
  entityId?: string,
  entityBody?: Record<string, any>
): Promise<SitesHttpResponse> => {
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  } else if (!entityBody) {
    return { body: "Missing entity body", headers: {}, statusCode: 400 };
  }

  if (entityBody.c_template) {
    const publicFileUrl = await createCloudflareObject(
      `template-${entityId}`,
      entityBody.c_template
    );

    entityBody.c_template = { url: publicFileUrl };
  }

  const mgmtApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/entities/${entityId}?api_key=${YEXT_PUBLIC_API_KEY}&v=20230901`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entityBody),
    }
  );

  const resp = await mgmtApiResp.json();

  if (mgmtApiResp.status !== 200) {
    console.error("Error updating entity:", resp);
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: mgmtApiResp.status,
    };
  } else {
    console.log("Entity updated:", resp);
    await deleteCloudflareObject(`template-${entityId}`);
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: 200,
    };
  }
};

export const createCloudflareObject = async (
  cloudflareId: string,
  object: Record<string, any>
): Promise<string> => {
  const requestStr = `${CLOUDFLARE_WORKER_URL}/${cloudflareId}`;
  const resp = await fetch(requestStr, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });

  if (resp.status !== 200) {
    console.error("Error creating Cloudflare object:", resp);
    throw new Error("Error creating Cloudflare object");
  } else {
    console.log("Cloudflare object created successfully");
    return requestStr;
  }
};

export const deleteCloudflareObject = async (
  cloudflareId: string
): Promise<void> => {
  const requestStr = `${CLOUDFLARE_WORKER_URL}/template-${cloudflareId}`;
  const resp = await fetch(requestStr, {
    method: "DELETE",
  });

  if (resp.status !== 200) {
    console.error("Error deleting Cloudflare object:", resp);
    throw new Error("Error deleting Cloudflare object");
  } else {
    console.log("Cloudflare object deleted successfully");
  }
};
