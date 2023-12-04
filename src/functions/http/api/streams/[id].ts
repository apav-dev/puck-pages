import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import * as z from "zod";

import { createClient } from "@vercel/kv";

const kv = createClient({
  url: "https://superb-lion-48217.kv.vercel-storage.com",
  token:
    "AbxZASQgNTY3NWM2M2YtNzNhMy00YTlkLWFjYTQtMmU1Mzg1OGRmMWZjNTJjZGUzMTUwOGIyNDgyMTk5ODRkMzJkNDNhN2M4MTg=",
});

const contentEndpointPatchReq = {
  stream: {
    source: "content",
    fields: [],
  },
};

export default async function streams(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method, pathParams, body } = request;
  const streamId = pathParams.id;
  if (!streamId) {
    return { body: "Missing stream id", headers: {}, statusCode: 400 };
  }

  const responseHeaders = {
    "Cache-Control": "no-cache",
  };

  switch (method) {
    case "PATCH":
      if (!body) {
        return {
          body: "Missing entity body",
          headers: responseHeaders,
          statusCode: 400,
        };
      }
      const bodyObj = JSON.parse(body);

      // Update the Content Endpoint
      if (validRequestBody(bodyObj) === false) {
        console.error("Invalid request body:", bodyObj);
        return {
          body: "Invalid request body",
          headers: responseHeaders,
          statusCode: 400,
        };
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

      try {
        const resp = await updateEndpoint(pathParams.id, patchReq);
        if (resp.status !== 200) {
          console.error("Error updating endpoint:", resp.body);
          return {
            body: JSON.stringify(resp.body),
            headers: responseHeaders,
            statusCode: resp.status,
          };
        }
      } catch (error) {
        console.error("Error updating endpoint:", error);
        return {
          body: JSON.stringify(error),
          headers: responseHeaders,
          statusCode: 400,
        };
      }

      // update the the stream in the KV store
      const stream = {
        $id: streamId,
        // the template needs to include the visual metadata and the slug while the endpoint does not
        fields: [...checkedFields, "c_template", "slug"],
        // could extend this to allow for custom stream filters
        filter: {
          entityTypes: ["location"],
        },
        // could extend this to allow for custom localizations
        localization: {
          locales: ["en"],
          primary: true,
        },
        // could extend this to allow for custom transforms
        // transform: {
        //   expandOptionFields: [],
        //   replaceOptionValuesWithDisplayNames: [],
        // },
      };

      // This could be updated to handle multiple streams
      await kv.set(streamId, stream);

      // TODO: figure out what I should return (if anything) here
      return { body: "{}", headers: responseHeaders, statusCode: 201 };

    default:
      return {
        body: "Method not allowed",
        headers: responseHeaders,
        statusCode: 405,
      };
  }
}

const updateEndpoint = async (
  endpointId: string,
  endpointBody: Record<string, any>
): Promise<Response> => {
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

  return cacApiResp;
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
