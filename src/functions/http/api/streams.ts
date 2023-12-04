import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import { list, del } from "@vercel/blob";

export default async function entity(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { method } = request;

  switch (method) {
    case "GET":
      const blobs = await list({
        token: BLOB_READ_WRITE_TOKEN,
      });
      return { body: JSON.stringify(blobs), headers: {}, statusCode: 200 };
    case "DELETE":
      await del(
        "https://rj5zl0ygxkk90ul8.public.blob.vercel-storage.com/streams-UnJT3N662YEhPNHJSy02OjvtgKRNbY.json",
        {
          token: BLOB_READ_WRITE_TOKEN,
        }
      );
      return { body: "", headers: {}, statusCode: 204 };
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}
