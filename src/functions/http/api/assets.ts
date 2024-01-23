import { PagesHttpRequest, PagesHttpResponse } from "@yext/pages/*";

export default async function entity(
  request: PagesHttpRequest
): Promise<PagesHttpResponse> {
  const { method } = request;

  switch (method) {
    case "GET":
      try {
        const body = await fetchAccountAssets();
        return { body, headers: {}, statusCode: 200 };
      } catch (error) {
        console.error("Error fetching account assets:", error);
        return { body: "Internal Server Error", headers: {}, statusCode: 500 };
      }
    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}

const fetchAccountAssets = async () => {
  const url = `https://api.yextapis.com/v2/accounts/me/assets?api_key=${YEXT_PUBLIC_CONTENT_API_KEY}&v=20230901`;

  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching account assets:", error);
  }
};
