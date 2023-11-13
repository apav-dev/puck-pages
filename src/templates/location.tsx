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
import { Render } from "@measured/puck";
import { config as puckConfig } from "../../puck.config";

export const config: TemplateConfig = {
  stream: {
    $id: "locations",
    fields: ["id", "name", "slug", "address", "c_template"],
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

  const response = await fetch(document.c_template.url);
  const templateData = await response.json();

  return {
    ...data,
    document: { ...data.document, templateData: templateData },
  };
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
