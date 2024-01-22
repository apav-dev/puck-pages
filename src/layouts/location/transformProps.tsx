import { TemplateRenderProps } from "@yext/pages/*";
import { Locations as LocationsType } from "../../types/autogen";
import { Data } from "@measured/puck";
import { injectDocumentValues } from "../../utils/puck-utils";

export const transformProps = async (
  data: TemplateRenderProps<LocationsType>
) => {
  const { document } = data;

  if (!document.c_linkedTemplate?.[0].c_template?.url) {
    return data;
  }

  const jsonUrl = document.c_linkedTemplate?.[0].c_template?.url;
  const response = await fetch(jsonUrl);
  const templateData: Data = await response.json();

  // const injectedTemplate = injectDocumentValues(document, templateData);

  console.log("templateData", templateData);

  const test = {
    ...data,
    document: {
      ...document,
      templateData,
    },
  };

  console.log("data", test);

  return {
    ...data,
    document: {
      ...document,
      templateData: { content: [], root: { props: { title: "" } }, zones: {} },
    },
  };
};
