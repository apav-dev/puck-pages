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
import { fetchEntityTemplateData } from "../utils/api";
import { getEntityIdFromUrl } from "../utils/getEntityIdFromUrl";
import { Toaster } from "../components/Toaster";

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
    queryFn: () => fetchEntityTemplateData(entityId),
    enabled: entityId !== "",
  });

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (data) {
        const response = await fetch(data.response.docs[0].c_template.url);
        const json = await response.json();
        setTemplateData(json);
        setEntitySlug(data.response.docs[0].slug);
      }
    };
    fetchTemplateData();
  }, [data]);

  if (templateData && entityId) {
    return (
      <>
        <Editor
          initialData={templateData}
          entityId={entityId}
          entitySlug={entitySlug}
        />
        <Toaster />
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default Puck;
