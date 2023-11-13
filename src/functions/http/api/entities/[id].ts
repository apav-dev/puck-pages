import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch } from "@yext/pages/util";

export default async function entity(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams, body } = request;

  switch (method) {
    case "PUT":
      if (!body) {
        return { body: "Missing entity body", headers: {}, statusCode: 400 };
      }
      const bodyObj = JSON.parse(body);
      return updateEntity(pathParams.entityId, bodyObj);
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
  }

  const mgmtApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/entities/${entityId}?api_key=${YEXT_API_KEY}&v=20230901`,
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
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: 200,
    };
  }
};
