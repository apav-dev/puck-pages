import { Template, TemplateRenderProps } from "@yext/pages";
import "../index.css";
import { Locations as LocationsType } from "../types/autogen";
import LocationLayout from "../layouts/location/template";
import test from "../../stream.json";

export { getPath } from "../layouts/location/getPath";
export { transformProps } from "../layouts/location/transformProps";
export { getHeadConfig } from "../layouts/location/getHeadConfig";

export const config = test;

// Initialize the configuration asynchronously
const Location: Template<TemplateRenderProps<LocationsType>> = (data) => {
  return <LocationLayout {...data} />;
};

export default Location;
