// https://api.yextapis.com/v2/accounts/me/config/resources/streams/streams-endpoint/locations?api_key={{api_key}}&v={{v}}
// {
//   "$id": "locations",
//   "$schema": "https://schema.yext.com/config/streams/streams-endpoint/v2",
//   "name": "Locations",
//   "stream": {
//       "source": "content",
//       "fields": [
//           "id",
//           "name",
//           "address",
//           "yextDisplayCoordinate",
//           "photoGallery"
//       ],
//       "filter": {
//           "entityTypes": [
//               "location"
//           ]
//       }
//   }
// }
import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { fetch } from "@yext/pages/util";

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
    case "PUT":
      if (!body) {
        return { body: "Missing entity body", headers: {}, statusCode: 400 };
      }
      const bodyObj = JSON.parse(body);
      return updateEndpoint(pathParams.id, bodyObj);
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
  endpointId?: string,
  endpointBody?: Record<string, any>
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
    }
  );

  const resp = await cacApiResp.json();

  if (cacApiResp.status !== 200) {
    console.error("Error updating endpoint:", resp);
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
