import {
  GetHeadConfig,
  HeadConfig,
  Template,
  TemplateConfig,
  TemplateRenderProps,
} from "@yext/pages";
import "../index.css";
import { Locations as LocationsType } from "../types/autogen";
import { Data, Render } from "@measured/puck";
import { locationConfig } from "../config";
import { DocumentProvider } from "../hooks/useDocument";

export const config: TemplateConfig = {
  stream: {
    $id: "locations",
    fields: [
      "id",
      "additionalHoursText",
      "address",
      "description",
      "hours",
      "name",
      "cityCoordinate",
      "photoGallery",
      "geocodedCoordinate",
      "mainPhone",
      "emails",
      "slug",
      "c_coverPhoto",
      "c_linkedTemplate.id",
      "c_linkedTemplate.name",
      "c_linkedTemplate.c_linkedEntities.id",
      "c_linkedTemplate.c_template",

      // component fields
      "c_hero",
    ],
    filter: { entityIds: ["aarons-store", "lucs-store"] },
    localization: { locales: ["en"] },
  },
};

export const transformProps = async (
  data: TemplateRenderProps<LocationsType>
) => {
  const { document } = data;

  const linkedTemplateEntity = document.c_linkedTemplate?.[0];

  if (!linkedTemplateEntity || !linkedTemplateEntity.c_template) {
    return data;
  }

  try {
    const visualTemplate: Data = JSON.parse(linkedTemplateEntity.c_template);
    console.log("Successfully parsed visualTemplate");
    return {
      ...data,
      document: {
        ...document,
        visualTemplate,
      },
    };
  } catch (e) {
    console.error("Failed to parse visualTemplate" + e);
    return data;
  }
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "link",
        attributes: {
          rel: "icon",
          type: "image/x-icon",
          href: "/yext-favicon.ico",
        },
      },
    ],
  };
};

export const getPath = (data: TemplateRenderProps<LocationsType>) => {
  const { document } = data;
  return document.slug ? document.slug : document.id;
};

const Location: Template<TemplateRenderProps<LocationsType>> = (data) => {
  const { document } = data;
  const { visualTemplate } = document;

  return (
    <DocumentProvider value={document}>
      <Render config={locationConfig} data={visualTemplate} />
    </DocumentProvider>
  );
};

export default Location;
