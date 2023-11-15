export interface YextResponse<T> {
  meta: {
    uuid: string;
    errors?: any[];
  };
  response: T;
}

export type EntityContent = {
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
    id: string;
  }[];
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
