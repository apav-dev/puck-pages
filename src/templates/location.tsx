import {
  GetHeadConfig,
  GetPath,
  HeadConfig,
  Template,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import "../index.css";
import { Locations as LocationsType } from "../types/autogen";
import { Data, Render } from "@measured/puck";
import puckConfig from "../config";
import { injectDocumentValues } from "../utils/puck-utils";

export const config: TemplateConfig = {
  stream: {
    $id: "locations",
    fields: [
      "id",
      "name",
      "slug",
      "address",
      "c_template",
      "yextDisplayCoordinate",
      "photoGallery",
    ],
    filter: {
      entityTypes: ["location"],
    },
    localization: {
      locales: ["en"],
    },
  },
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return document.slug ?? document.name;
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

// TODO: add deserilization to replace entity references with strings
export const transformProps = async (
  data: TemplateRenderProps<LocationsType>
) => {
  const { document } = data;

  if (document) {
    const response = await fetch(document.c_template.url);
    const templateData: Data = await response.json();
    const injectedTemplate = injectDocumentValues(document, templateData);

    return {
      ...data,
      document: { ...data.document, templateData: injectedTemplate },
    };
  } else {
    return data;
  }
};

const Locations: Template<TemplateRenderProps<LocationsType>> = ({
  document,
}) => {
  const { name, templateData } = document;

  return (
    <>
      <Render config={puckConfig} data={templateData} />
    </>
  );
};

export default Locations;
