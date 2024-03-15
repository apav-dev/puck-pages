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
import { Toaster } from "../components/shadcn/Toaster";
import { useEditorStore } from "../hooks/useEditorStore";
import { useEditorSetup } from "../hooks/useEditorSetup";
import useEntityDocument from "../hooks/queries/useEntityDocument";

export const getPath: GetPath<TemplateProps> = () => {
  return "edit";
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

const Edit: Template<TemplateRenderProps> = (props) => {
  // const hasMounted = useRef(false);
  useEditorSetup();

  const { entityId, templateId, setEntitySlug, setLinkedTemplateEntity } =
    useEditorStore();

  const { entityDocument } = useEntityDocument({ templateId, entityId });

  useEffect(() => {
    if (entityDocument) {
      setEntitySlug(entityDocument?.response.document.slug);

      const linkedTemplateEntity =
        entityDocument?.response.document.c_linkedTemplate?.[0];

      if (linkedTemplateEntity) {
        const template = JSON.parse(linkedTemplateEntity.c_template);

        setLinkedTemplateEntity({
          ...linkedTemplateEntity,
          template,
          linkedEntityIds: linkedTemplateEntity.c_linkedEntities.map(
            (linkedEntity) => linkedEntity.id
          ),
        });
      }
    }
  }, [entityDocument]);

  return (
    <>
      <Editor />
      <Toaster />
    </>
  );
};

export default Edit;
