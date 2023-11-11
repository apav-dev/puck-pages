import {
  GetHeadConfig,
  GetPath,
  HeadConfig,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
  Template,
  GetRedirects,
} from "@yext/pages";
import "../index.css";
import { FinPro } from "../types/autogen";

export const config: TemplateConfig = {
  stream: {
    $id: "fin-pro",
    localization: { locales: ["en"] },
    fields: ["id", "name", "slug"],
    filter: { entityIds: ["FP-0132"] },
  },
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return document.slug ?? `financial-professionals/${document.entityId}`;
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = (
  data
): HeadConfig => {
  return {
    title: "Blog Home",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

export const getRedirects: GetRedirects<TemplateProps<FinPro>> = ({
  document,
}) => {
  return [`old-fins-path/${document.id.toLowerCase()}`];
};

const EntityPage: Template<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}) => {
  const { name } = document;

  return (
    <>
      <h1>Entity Powered Page for Fin Pro entities</h1>
      <div>Entity Name: {name}</div>
    </>
  );
};

export default EntityPage;
