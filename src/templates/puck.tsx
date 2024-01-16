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
import { Toaster } from "../components/shadcn/Toaster";
import { PageContextProvider } from "../utils/usePageContext";
import { getTemplateIdFromUrl } from "../utils/getTemplateIdFromUrl";

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

// TODO: Fetch config JSON via template ID rather than entity id in path, hard code entity id for now
// TODO: eventually add the ability to toggle entity id in the editor. Used list of linked entities
const Puck: Template<TemplateRenderProps> = () => {
  const [templateId, setTemplateId] = useState<string>("");
  const [entityId, setEntityId] = useState<string>("");
  const [templateData, setTemplateData] = useState<any>();
  const [entitySlug, setEntitySlug] = useState<string | undefined>();
  const [linkedTemplateEntityId, setLinkedTemplateEntityId] =
    useState<string>("");

  useEffect(() => {
    setEntityId(getEntityIdFromUrl());
    setTemplateId(getTemplateIdFromUrl());
  }, []);

  const { data, isSuccess } = useQuery({
    queryKey: ["entityId", entityId],
    retry: false,
    queryFn: () => fetchEntityDocument(templateId, entityId),
    enabled: entityId !== "" && templateId !== "",
  });

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (data) {
        // TODO: Handle case where there is no linked template
        const linkedTemplateEntity =
          data.response.document.c_linkedTemplate?.[0];
        const jsonUrl = linkedTemplateEntity.c_template?.url;
        const linkedId = linkedTemplateEntity.id;
        setLinkedTemplateEntityId(linkedId);
        const response = await fetch(jsonUrl);
        const json = await response.json();

        setTemplateData(json);
        setEntitySlug(data.response.document.slug);
      }
    };
    fetchTemplateData();
  }, [data]);

  // TODO: Render a different component if no entityId
  if (templateData && entityId && templateId) {
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
            templateId={templateId}
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
