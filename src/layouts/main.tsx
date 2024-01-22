import type { ReactNode } from "react";
import { TemplateDataProvider } from "../utils/useTemplateData";
import { Locations } from "../types/autogen";
import { TemplateRenderProps } from "@yext/pages/*";

interface MainProps {
  data?: TemplateRenderProps<Locations> | {};
  children?: ReactNode;
}

const Main = (props: MainProps) => {
  // const { _site } = props.data.document;

  const { children } = props;

  return (
    <TemplateDataProvider value={props.data}>{children}</TemplateDataProvider>
  );
};

export { Main };
