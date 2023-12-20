import { TemplateRenderProps } from "@yext/pages/*";
import { Locations as LocationsType } from "../../types/autogen";
// import { fetchLocation } from "../../utils/api";
import { Data } from "@measured/puck";
import { injectDocumentValues } from "../../utils/puck-utils";

export const transformProps = async (
  data: TemplateRenderProps<LocationsType>
) => {
  const { document } = data;

  if (!document.c_template) {
    return data;
  }

  // const locationResponse = await fetchLocation(document.id);
  // const locationData = locationResponse.response.docs[0];

  const response = await fetch(document.c_template.url);
  const templateData: Data = await response.json();

  const injectedTemplate = injectDocumentValues(document, templateData);

  // rather than inject document values, inject from content endpoint
  // const injectedTemplate = injectDocumentValues(locationData, templateData);

  console.log(
    "injectedTemplate hero props",
    JSON.stringify(injectedTemplate.content[0].props)
  );

  return {
    ...data,
    document: { ...document, templateData: injectedTemplate },
  };
};
