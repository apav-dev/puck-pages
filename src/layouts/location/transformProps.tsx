import { TemplateRenderProps } from "@yext/pages/*";
import { Locations as LocationsType } from "../../types/autogen";
import { Config, Data, resolveAllData } from "@measured/puck";
import { injectDocumentValues } from "../../utils/puck-utils";
import conf, { Props, initialData } from "../../config";
import { RootProps } from "../../config/root";

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
