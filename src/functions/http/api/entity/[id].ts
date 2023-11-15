import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch } from "@yext/pages/util";

const CLOUDFLARE_WORKER_URL = "https://temp-storage.ajpavlick.workers.dev";

export default async function entity(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams, body } = request;
  const entityId = pathParams.id;
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  switch (method) {
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
      entityId,
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
    await deleteCloudflareObject(entityId);
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: 200,
    };
  }
};

const createCloudflareObject = async (
  entityId: string,
  object: Record<string, any>
): Promise<string> => {
  const requestStr = `${CLOUDFLARE_WORKER_URL}/template-${entityId}`;
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

const deleteCloudflareObject = async (entityId: string): Promise<void> => {
  const requestStr = `${CLOUDFLARE_WORKER_URL}/template-${entityId}`;
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
