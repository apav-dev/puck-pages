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
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEntityDocument } from "../utils/api";
import { getEntityIdFromUrl } from "../utils/getEntityIdFromUrl";
import { Toaster } from "../components/shadcn/Toaster";
import { EditorContextProvider } from "../utils/useEditorContext";
import { getTemplateIdFromUrl } from "../utils/getTemplateIdFromUrl";
import { Main } from "../layouts/main";

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

const Puck: Template<TemplateRenderProps> = (props) => {
  const hasMounted = useRef(false);

  const [templateId, setTemplateId] = useState<string>("");
  const [entityId, setEntityId] = useState<string>("");
  const [entitySlug, setEntitySlug] = useState<string>("");
  const [linkedTemplateEntity, setLinkedTemplateEntity] =
    useState<LinkedTemplateEntity>();
  const [isResolvingData, setIsResolvingData] = useState<boolean>(false);

  useEffect(() => {
    setEntityId(getEntityIdFromUrl());
    setTemplateId(getTemplateIdFromUrl());
  }, []);

  useEffect(() => {
    if (hasMounted.current) {
      const url = new URL(window.location.href);
      url.searchParams.set("entityId", entityId);
      window.history.replaceState({}, "", url.toString());
    } else {
      hasMounted.current = true;
    }
  }, [entityId]);

  const { data: entityDocument, isLoading } = useQuery({
    queryKey: ["entityId", entityId],
    retry: false,
    queryFn: () => fetchEntityDocument(templateId, entityId),
    enabled: entityId !== "" && templateId !== "",
  });

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (entityDocument) {
        setEntitySlug(entityDocument.response.document.slug);

        // TODO: Handle case where fields are missing
        const linkedTemplateEntity =
          entityDocument.response.document.c_linkedTemplate?.[0];

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
  }, [entityDocument]);

  // TODO: Render a different component if no entityId
  // if (linkedTemplateEntity && entityId && templateId) {
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
          isResolvingData,
          setIsResolvingData,
        }}
      >
        <Main data={{}}>
          <>
            <Editor />
            <Toaster />
          </>
          {/* )} */}
        </Main>
      </EditorContextProvider>
    </>
  );
};

export default Puck;
