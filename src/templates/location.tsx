import { Template, TemplateRenderProps } from "@yext/pages";
import "../index.css";
import { Locations as LocationsType } from "../types/autogen";
import { configBuilder } from "../layouts/location/configBuilder";
import LocationLayout from "../layouts/location/template";

export { getPath } from "../layouts/location/getPath";
export { transformProps } from "../layouts/location/transformProps";
export { getHeadConfig } from "../layouts/location/getHeadConfig";

export const config = await configBuilder();

const Location: Template<TemplateRenderProps<LocationsType>> = (data) => (
  <LocationLayout {...data} />
);

export default Location;
