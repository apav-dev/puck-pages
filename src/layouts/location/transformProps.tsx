import { TemplateRenderProps } from "@yext/pages/*";
import { Locations as LocationsType } from "../../types/autogen";
import { Data } from "@measured/puck";
import { injectDocumentValues } from "../../utils/puck-utils";

export const transformProps = async (
  data: TemplateRenderProps<LocationsType>
) => {
  const { document } = data;

  if (!document.c_template) {
    return data;
  }

  const response = await fetch(document.c_template.url);
  const templateData: Data = await response.json();

  const injectedTemplate = injectDocumentValues(document, templateData);

  console.log(
    "injectedTemplate hero props",
    JSON.stringify(injectedTemplate.content[0].props)
  );

  return {
    ...data,
    document: { ...document, templateData: injectedTemplate },
  };
};
