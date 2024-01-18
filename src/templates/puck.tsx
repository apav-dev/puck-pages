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
import { EditorContextProvider } from "../utils/useEditorContext";
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

export interface LinkedTemplateEntity {
  id: string;
  name: string;
  template: any;
  linkedEntityIds: string[];
}

// TODO: Fetch config JSON via template ID rather than entity id in path, hard code entity id for now
// TODO: eventually add the ability to toggle entity id in the editor. Used list of linked entities
const Puck: Template<TemplateRenderProps> = (props) => {
  const [templateId, setTemplateId] = useState<string>("");
  const [entityId, setEntityId] = useState<string>("");
  const [entitySlug, setEntitySlug] = useState<string>("");
  const [linkedTemplateEntity, setLinkedTemplateEntity] =
    useState<LinkedTemplateEntity>();

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
        console.log(data);
        setEntitySlug(data.response.document.slug);

        // TODO: Handle case where fields are missing
        const linkedTemplateEntity =
          data.response.document.c_linkedTemplate?.[0];

        const jsonUrl = linkedTemplateEntity.c_template?.url;
        const response = await fetch(jsonUrl);
        const templateJson = await response.json();

        setLinkedTemplateEntity({
          ...linkedTemplateEntity,
          template: templateJson,
          linkedEntityIds: linkedTemplateEntity.c_linkedEntities.map(
            (linkedEntity) => linkedEntity.id
          ),
        });
      }
    };
    fetchTemplateData();
  }, [data]);

  // TODO: Render a different component if no entityId
  if (linkedTemplateEntity && entityId && templateId) {
    return (
      <>
        <EditorContextProvider
          value={{
            entityId,
            setEntityId,
            templateId,
            setTemplateId,
            entitySlug,
            setEntitySlug,
            linkedTemplateEntity,
            setLinkedTemplateEntity,
          }}
        >
          <Editor />
          <Toaster />
        </EditorContextProvider>
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default Puck;
