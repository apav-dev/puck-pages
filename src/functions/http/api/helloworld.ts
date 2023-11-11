import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";
import _ from "lodash"; // Import the lodash library

export default async function helloWorld(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { queryParams } = request;

  let responseBody = "hello world";

  // Retrieve a 'name' query parameter and capitalize it using lodash
  const name = queryParams.name ? _.capitalize(queryParams.name) : "World";

  // Use the capitalized name in the response body
  responseBody = `Hello ${name} from the serverless function!`;

  return {
    body: responseBody,
    headers: {
      "Content-Type": "text/plain", // Adding Content-Type header for plain text response
    },
    statusCode: 200,
  };
}
