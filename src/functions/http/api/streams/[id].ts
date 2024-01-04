import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import * as z from "zod";

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
      console.log("Setting stream:", streamId, stream);
      const resp = await redis.set(streamId, JSON.stringify(stream));
      if (resp.error) {
        console.error("Error setting stream:", resp.error);
        return {
          body: JSON.stringify(resp.error),
          headers: responseHeaders,
          statusCode: 400,
        };
      }

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

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export type KVMethod = "hget" | "hset" | "hgetall" | "del" | "set";
export type KVResponse = {
  result?: string | string[];
  error?: string;
};

export class Request {
  method: string;
  headers?: any;
  body?: any;

  constructor(method: string, headers?: any, body?: any) {
    this.method = method;
    if (headers) {
      this.headers = headers;
    }
    if (body) {
      this.body = JSON.stringify(body);
    }
  }
}

const kvRequest = async (
  httpMethod: HttpMethod,
  kvMethod: KVMethod,
  key: string,
  value?: string
): Promise<KVResponse> => {
  const url = `${KV_REST_API_URL}/${kvMethod}/${key}`;

  const request: Request = {
    method: httpMethod,
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
    },
  };

  if (value) {
    request.body = value;
  }

  try {
    const response = await fetch(url, request);
    return await response.json();
  } catch (err) {
    console.error(`Error with request to KV ${url}: ${err}`, err);
    throw err;
  }
};

export const redis = {
  set: async (key: string, value: string): Promise<KVResponse> => {
    return await kvRequest("PUT", "set", key, value);
  },
  hget: async (key: string): Promise<KVResponse> => {
    return await kvRequest("GET", "hget", key);
  },
  hset: async (key: string, value: string): Promise<KVResponse> => {
    return await kvRequest("PUT", "hset", key, value);
  },
  hgetall: async (key: string): Promise<KVResponse> => {
    return await kvRequest("GET", "hgetall", key);
  },
  del: async (key: string): Promise<KVResponse> => {
    return await kvRequest("GET", "del", key);
  },
};
