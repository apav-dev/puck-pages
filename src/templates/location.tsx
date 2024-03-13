import {
  GetHeadConfig,
  HeadConfig,
  Template,
  TemplateConfig,
  TemplateRenderProps,
} from "@yext/pages";
import "../index.css";
import { Locations as LocationsType } from "../types/autogen";
import { Render } from "@measured/puck";
import { Config, Data, resolveAllData } from "@measured/puck";
import puckConfig, { Props } from "../config";
import { RootProps } from "../config/root";

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
      "c_linkedTemplate.c_template",
      "c_linkedTemplate.c_linkedEntities.id",
    ],
    filter: { entityIds: ["aarons-store", "lucs-store"] },
    localization: { locales: ["en"] },
  },
};

function addDocumentPropsToTemplateData<T>(
  config: Config<Props, RootProps>,
  templateData: Data,
  document: T
) {
  templateData.content.forEach((component) => {
    const componentConfig = config.components[component.type];
    if (componentConfig && componentConfig.fields["document"]) {
      // If the document field is defined in the config, add it to the component props
      component.props["document"] = document;
    }
  });
}

export const transformProps = async (
  data: TemplateRenderProps<LocationsType>
) => {
  const { document } = data;

  if (!document.c_linkedTemplate?.[0].c_template?.url) {
    return data;
  }

  const jsonUrl = document.c_linkedTemplate?.[0].c_template?.url;
  const response = await fetch(jsonUrl);
  let templateData: Data = await response.json();

  addDocumentPropsToTemplateData<LocationsType>(conf, templateData, document);

  templateData = await resolveAllData(templateData, conf);

  // console.log("templateData", JSON.stringify(templateData, null, 2));

  return {
    ...data,
    document: {
      ...document,
      templateData,
    },
  };
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
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

const Location: Template<TemplateRenderProps<LocationsType>> = (data) => {
  const { templateData } = data.document;
  return <Render config={puckConfig} data={templateData} />;
};

export default Location;
