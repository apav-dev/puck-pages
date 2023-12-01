import {
  GetPath,
  Template,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import "../index.css";
import { Locations as LocationsType } from "../types/autogen";
import LocationLayout from "../layouts/location/template";
import streamConfig from "../../stream.json";

export { transformProps } from "../layouts/location/transformProps";
export { getHeadConfig } from "../layouts/location/getHeadConfig";

export const config = streamConfig;

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
  return `location/${randomNumber}`;
};

// Initialize the configuration asynchronously
const Location: Template<TemplateRenderProps<LocationsType>> = (data) => {
  return <LocationLayout {...data} />;
};

export default Location;
