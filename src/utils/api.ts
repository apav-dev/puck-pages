import { EntityContent, YextResponse } from "../types/api";

export const fetchEntity = async (
  entityId?: string
): Promise<YextResponse<EntityContent>> => {
  const response = await fetch(
    `https://cdn.yextapis.com/v2/accounts/me/content/entities?api_key=${YEXT_PUBLIC_CONTENT_API_KEY}&v=20231112&id=${entityId}`
  );
  const body = await response.json();
  return body;
};
