import { Locations as LocationsType } from "./autogen";

export interface YextResponse<T = any> {
  meta: {
    uuid: string;
    errors?: any[];
  };
  response: T;
}

export type EntityContent = {
  document: LocationsType;
};

export type SuggestionResponse = {
  id: string;
};

export type LocationContent = {
  docs: {
    $key: {
      locale: string;
      primary_key: string;
    };
    c_template: {
      mimeType: string;
      name: string;
      size: string;
      url: string;
    };
    name: string;
    address: {
      line1: string;
      city: string;
      region: string;
      postalCode: string;
      countryCode: string;
    };
    id: string;
  }[];
};

export interface UnsplashSearchParams {
  query: string;
  page?: number;
  perPage?: number;
  orientation?: "landscape" | "portrait" | "squarish";
  color?: string;
  collections?: string[];
}

export interface UnsplashResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description?: string;
  description?: string;
  user: {
    name: string;
    username: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

export interface ImageAsset {
  id: string;
  type: string;
  name: string;
  description: string;
  value: {
    image: {
      url: string;
      width: number;
      height: number;
      sourceUrl: string;
      thumbnails: {
        url: string;
        width: number;
        height: number;
      }[];
    };
  };
  forEntities: {
    mappingType: string;
  };
  usage: {
    type: string;
  }[];
  owner: number;
}

// would need to be updated to account for other asset types
export interface ImageAssetResponse {
  count: number;
  assets: ImageAsset[];
}

export interface ContentApiCac {
  $id: string;
  $schema: string;
  name: string;
  stream: {
    source: string;
    fields: string[];
    filter: {
      entityTypes: string[];
    };
  };
  fieldIndexes: {
    field: string;
  }[];
}
