import "@measured/puck/dist/index.css";
import "../index.css";
import {
  Template,
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import { Editor } from "../puck/Editor";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEntityDocument } from "../utils/api";
import { getEntityIdFromUrl } from "../utils/getEntityIdFromUrl";
import { Toaster } from "../components/Toaster";
import { PageContextProvider } from "../utils/usePageContext";

export const getPath: GetPath<TemplateProps> = () => {
  return "puck";
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Puck Editor",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const Puck: Template<TemplateRenderProps> = () => {
  const [entityId, setEntityId] = useState<string | undefined>();
  const [templateData, setTemplateData] = useState<any>();
  const [entitySlug, setEntitySlug] = useState<string | undefined>();

  useEffect(() => {
    setEntityId(getEntityIdFromUrl());
  }, []);

  const { data, isSuccess } = useQuery({
    queryKey: ["entityId", entityId],
    retry: false,
    // Just fetching the locations document for now
    queryFn: () => fetchEntityDocument("locations", entityId),
    enabled: entityId !== "",
  });

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (data) {
        const response = await fetch(data.response.c_template.url);
        const json = await response.json();
        setTemplateData(json);
        setEntitySlug(data.response.slug);
      }
    };
    fetchTemplateData();
  }, [data]);

  // TODO: Render a different component if no entityId
  if (templateData && entityId) {
    return (
      <>
        <PageContextProvider
          value={{
            entityId,
            setEntityId,
          }}
        >
          <Editor
            initialData={templateData}
            entityId={entityId}
            entitySlug={entitySlug}
          />
          <Toaster />
        </PageContextProvider>
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default Puck;
