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
import { fetchLocation } from "../utils/api";
import { useEffect } from "react";

export const config: TemplateConfig = {
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

export const transformProps = async (
  data: TemplateRenderProps<LocationsType>
) => {
  const { document } = data;

  if (!document.c_template) {
    return data;
  }

  const locationResponse = await fetchLocation(document.id);
  const locationData = locationResponse.response.docs[0];

  const response = await fetch(document.c_template.url);
  const templateData: Data = await response.json();

  // const injectedTemplate = injectDocumentValues(document, templateData);

  // rather than inject document values, inject from content endpoint
  const injectedTemplate = injectDocumentValues(locationData, templateData);

  console.log("injectedTemplate hero props", injectedTemplate.content[0].props);

  return {
    ...data,
    document: { ...locationData, templateData: injectedTemplate },
  };
};

const Locations: Template<TemplateRenderProps<LocationsType>> = ({
  document,
}) => {
  const { templateData } = document;

  useEffect(() => {
    console.log("document", document);
  }, [templateData]);

  return <Render config={puckConfig} data={templateData} />;
};

export default Locations;
