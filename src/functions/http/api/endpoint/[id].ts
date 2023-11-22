import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch } from "@yext/pages/util";
import * as z from "zod";

const contentEndpointPatchReq = {
  stream: {
    source: "content",
    fields: [],
  },
};

export default async function endpoint(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams, body } = request;
  const entityId = pathParams.id;
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  switch (method) {
    case "GET":
      return getEndpoint(pathParams.id);
    // TODO: update to patch endpoint based on the fieldId that is passed in
    case "PATCH":
      if (!body) {
        return { body: "Missing entity body", headers: {}, statusCode: 400 };
      }
      const bodyObj = JSON.parse(body);
      if (validRequestBody(bodyObj) === false) {
        console.error("Invalid request body:", bodyObj);
        return { body: "Invalid request body", headers: {}, statusCode: 400 };
      }

      const checkedFields = (
        bodyObj.fields as { fieldId: string; checked: boolean }[]
      ).reduce((acc: string[], field) => {
        if (field.checked) {
          acc.push(field.fieldId);
        }
        return acc;
      }, []);

      // always include id field or the CaC API will throw an error
      if (!checkedFields.includes("id")) {
        checkedFields.push("id");
      }

      const patchReq = {
        ...contentEndpointPatchReq,
        stream: {
          ...contentEndpointPatchReq.stream,
          fields: checkedFields,
        },
      };

      return updateEndpoint(pathParams.id, patchReq);
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

const getEndpoint = async (endpointId?: string): Promise<SitesHttpResponse> => {
  if (!endpointId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  const cacApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/config/resources/streams/streams-endpoint/${endpointId}?api_key=${YEXT_PUBLIC_API_KEY}&v=20230901`
  );

  const resp = await cacApiResp.json();

  if (cacApiResp.status !== 200) {
    console.error("Error fetching endpoint:", resp);
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: cacApiResp.status,
    };
  } else {
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: 200,
    };
  }
};

const updateEndpoint = async (
  endpointId: string,
  endpointBody: Record<string, any>
): Promise<SitesHttpResponse> => {
  if (!endpointId) {
    return { body: "Missing endpoint id", headers: {}, statusCode: 400 };
  } else if (!endpointBody) {
    return { body: "Missing endpoint body", headers: {}, statusCode: 400 };
  }

  const cacApiResp = await fetch(
    `https://api.yextapis.com/v2/accounts/me/config/resources/streams/streams-endpoint/${endpointId}?api_key=${YEXT_PUBLIC_API_KEY}&v=20230901`,
    {
      method: "PATCH",
      body: JSON.stringify(endpointBody),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const resp = await cacApiResp.json();

  if (cacApiResp.status !== 200) {
    console.error("Error updating endpoint:", resp.meta.errors);
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: cacApiResp.status,
    };
  } else {
    return {
      body: JSON.stringify(resp),
      headers: {},
      statusCode: 200,
    };
  }
};

const validRequestBody = (body: any): boolean => {
  const schema = z.object({
    fields: z.array(
      z.object({
        fieldId: z.string(),
        checked: z.boolean(),
      })
    ),
  });

  try {
    schema.parse(body);
    return true;
  } catch (error) {
    console.error("Invalid request body:", error);
    return false;
  }
};
