import {
  GetPath,
  Template,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import "../index.css";
import { Locations as LocationsType } from "../types/autogen";
import LocationLayout from "../layouts/location/template";
import streamConfig from "../../stream.json";

export { transformProps } from "../layouts/location/transformProps";
export { getHeadConfig } from "../layouts/location/getHeadConfig";

export const config: TemplateConfig = {
  stream: {
    $id: "locations",
    fields: [
      "id",
      "additionalHoursText",
      "address",
      "description",
      "hours",
      "name",
      "cityCoordinate",
      "photoGallery",
      "geocodedCoordinate",
      "mainPhone",
      "emails",
      "slug",
      "c_coverPhoto",
      "c_linkedTemplate.id",
      "c_linkedTemplate.name",
      "c_linkedTemplate.c_template",
      "c_linkedTemplate.c_linkedEntities.id",
    ],
    filter: { entityTypes: ["location"] },
    localization: { locales: ["en"] },
  },
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return document.slug ?? document.name;
};

// Initialize the configuration asynchronously
const Location: Template<TemplateRenderProps<LocationsType>> = (data) => {
  return <LocationLayout {...data} />;
};

export default Location;
