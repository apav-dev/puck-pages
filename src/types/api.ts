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
