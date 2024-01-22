import { Template, TemplateRenderProps } from "@yext/pages/*";
import { Locations as LocationsType } from "../../types/autogen";
import { Render } from "@measured/puck";
import puckConfig from "../../config";
import { Main } from "../main";
import { useEffect } from "react";

const Location: Template<TemplateRenderProps<LocationsType>> = (data) => {
  const { templateData } = data.document;

  useEffect(() => {
    console.log("templateData from line 13", templateData);
  }, [templateData]);

  return (
    <Main data={data}>
      <Render config={puckConfig} data={templateData} />
    </Main>
  );
};

export default Location;
