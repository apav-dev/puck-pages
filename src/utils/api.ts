import {
  ContentApiCac,
  EntityContent,
  ImageAssetResponse,
  UnsplashResponse,
  UnsplashSearchParams,
  YextResponse,
} from "../types/api";

export const fetchEntityDocument = async (
  templateId: string,
  entityId: string
): Promise<YextResponse<EntityContent>> => {
  try {
    const response = await fetch(
      `/api/streams/${templateId}/entity/${entityId}/fetchentitydocument`
    );
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchPhotos = async (
  params: UnsplashSearchParams
): Promise<UnsplashResponse> => {
  const {
    query,
    page = 1,
    perPage = 10,
    orientation,
    color,
    collections,
  } = params;
  const queryParamsObj: Record<string, string> = {
    query,
    page: page.toString(),
    per_page: perPage.toString(),
  };

  if (orientation) queryParamsObj.orientation = orientation;
  if (color) queryParamsObj.color = color;
  if (collections) queryParamsObj.collections = collections.join(",");

  const queryParams = new URLSearchParams(queryParamsObj);

  const response = await fetch(
    `https://api.unsplash.com/search/photos?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Client-ID ${YEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
    }
  );

  const body = await response.json();
  return body;
};

export const fetchAssets = async (): Promise<
  YextResponse<ImageAssetResponse>
> => {
  const response = await fetch(`/api/assets`);
  const body = await response.json();
  return body;
};

export const fetchEndpoint = async (
  endpointId: string
): Promise<YextResponse<ContentApiCac>> => {
  const response = await fetch(`/api/endpoint/${endpointId}`);
  const body = await response.json();
  return body;
};

export const fetchEntity = async (entityId: string): Promise<any> => {
  const response = await fetch(`/api/entity/${entityId}`);
  const body = await response.json();
  return body;
};

export const updateStream = async (
  endpointId: string,
  endpointBody: { fields: { fieldId: string; checked: boolean }[] }
): Promise<YextResponse> => {
  const response = await fetch(`/api/streams/${endpointId}`, {
    method: "PATCH",
    body: JSON.stringify(endpointBody),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 201) {
    throw new Error(response.statusText);
  }

  const body = await response.json();
  return body;
};
