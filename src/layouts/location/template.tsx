import { Template, TemplateRenderProps } from "@yext/pages/*";
import { Locations as LocationsType } from "../../types/autogen";
import { Render } from "@measured/puck";
import puckConfig from "../../config";

const Location: Template<TemplateRenderProps<LocationsType>> = ({
  document,
}) => {
  const { templateData } = document;

  return <Render config={puckConfig} data={templateData} />;
};

export default Location;
