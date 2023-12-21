import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";

export default async function streams(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams } = request;
  const streamId = pathParams.id;
  const entityId = pathParams.entityId;
  if (!streamId) {
    return { body: "Missing stream id", headers: {}, statusCode: 400 };
  }
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  switch (method) {
    case "GET":
      try {
        const response = await fetch(
          `https://api.yext.com/v2/accounts/me/sites/${YEXT_PUBLIC_SITE_ID}/fetchentitydocument?v=20231112&entityId=${entityId}&streamId=${streamId}&locale=en&api_key=${YEXT_PUBLIC_API_KEY}`
        );
        const body = await response.json();
        return {
          body: JSON.stringify(body),
          headers: {},
          statusCode: 200,
        };
      } catch (error) {
        console.error(error);
        return {
          body: "Server error",
          headers: {},
          statusCode: 500,
        };
      }
    default:
      return {
        body: "Method not allowed",
        headers: {},
        statusCode: 405,
      };
  }
}
