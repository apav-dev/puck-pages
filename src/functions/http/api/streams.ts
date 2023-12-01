import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";

import { put } from "@vercel/blob";

export default async function entity(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method } = request;

  switch (method) {
    case "GET":
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
    case "PUT":
      const streams = [
        {
          stream: {
            $id: "locations",
            fields: [
              "slug",
              "c_template",
              "id",
              "name",
              "address",
              "cityCoordinate",
              "photoGallery",
              "yextDisplayCoordinate",
              "description",
            ],
            filter: {
              entityTypes: ["location"],
            },
            localization: {
              locales: ["en"],
            },
          },
        },
      ];
      const blob = await put("streams.json", JSON.stringify(streams), {
        access: "public",
        token: BLOB_READ_WRITE_TOKEN,
      });
      return { body: JSON.stringify(blob), headers: {}, statusCode: 405 };
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}
