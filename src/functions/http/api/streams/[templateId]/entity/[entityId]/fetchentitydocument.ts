import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";

export default async function entityDocument(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams } = request;

  // required params
  const templateId = pathParams.templateId;
  const entityId = pathParams.entityId;

  // optional params
  const suggestionIds = pathParams.suggestionIds;
  const locale = pathParams.locale;
  const deploymentId = pathParams.deploymentId;

  if (!templateId) {
    return { body: "Missing stream id", headers: {}, statusCode: 400 };
  }
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  switch (method) {
    case "GET":
      try {
        let requestPath = `https://api.yext.com/v2/accounts/me/sites/${YEXT_PUBLIC_SITE_ID}/fetchentitydocument?v=20231112&entityId=${entityId}&templateId=${templateId}&locale=en&api_key=${YEXT_PUBLIC_API_KEY}`;
        if (suggestionIds) {
          requestPath += `&editIds=${suggestionIds}`;
        }
        if (locale) {
          requestPath += `&locale=${locale}`;
        }
        if (deploymentId) {
          requestPath += `&deploymentId=${deploymentId}`;
        }
        const response = await fetch(requestPath);
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
