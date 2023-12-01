import type { Stream, TemplateConfig } from "@yext/pages";

export const configBuilder: (
  id?: string,
  filter?: Stream["filter"]
) => TemplateConfig = (id?: string, filter?: Stream["filter"]) => {
  return {
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
  };
};
