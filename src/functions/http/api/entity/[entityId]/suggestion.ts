import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";

export default async function streams(
  request: PagesHttpRequest
): Promise<PagesHttpResponse> {
  const { method, queryParams, body } = request;
  const entityId = queryParams.entityId;
  console.log("queryParams", queryParams);
  if (!entityId) {
    return { body: "Missing entityId", headers: {}, statusCode: 400 };
  }

  const responseHeaders = {
    "Cache-Control": "no-cache",
  };

  switch (method) {
    case "POST":
      if (!body) {
        return { body: "Missing entity body", headers: {}, statusCode: 400 };
      }
      const reqBody = JSON.parse(body);
      return createEntitySuggestion(entityId, reqBody);

    default:
      return {
        body: "Method not allowed",
        headers: responseHeaders,
        statusCode: 405,
      };
  }
}

const createEntitySuggestion = async (
  entityId: string,
  body: any
): Promise<PagesHttpResponse> => {
  const templateSuggestionBody = {
    entityFieldSuggestion: {
      entity: {
        id: entityId,
        language: "en",
      },
      suggestedContent: { ...body },
    },
  };

  const suggestionApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/suggestions?api_key=${YEXT_PUBLIC_API_KEY}&v=20230901`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(templateSuggestionBody),
    }
  );

  const resp = await suggestionApiResp.json();

  if (suggestionApiResp.status !== 200) {
    console.error("Error creating entity field suggestion:", resp.meta.errors);
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: suggestionApiResp.status,
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
