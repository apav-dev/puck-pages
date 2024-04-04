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
import { useEffect } from "react";
import { Toaster } from "../components/shadcn/Toaster";
import { useEditorStore } from "../hooks/useEditorStore";
import { useEditorSetup } from "../hooks/useEditorSetup";
import useEntityDocument from "../hooks/queries/useEntityDocument";
import { DocumentProvider } from "../hooks/useDocument";

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

const Edit: Template<TemplateRenderProps> = () => {
  useEditorSetup();

  const { entityId, templateId, setEntitySlug, setLinkedTemplateEntity } =
    useEditorStore();

  const { entityDocument } = useEntityDocument({ templateId, entityId });

  useEffect(() => {
    if (entityDocument) {
      setEntitySlug(entityDocument?.response.document.slug);

      const linkedTemplateEntity =
        entityDocument?.response.document.c_linkedTemplate?.[0];

      if (linkedTemplateEntity && linkedTemplateEntity.c_template) {
        const template = JSON.parse(linkedTemplateEntity.c_template);

        setLinkedTemplateEntity({
          ...linkedTemplateEntity,
          template,
          linkedEntityIds:
            linkedTemplateEntity.c_linkedEntities?.map(
              (linkedEntity) => linkedEntity.id
            ) ?? [],
        });
      }
    }
  }, [entityDocument]);

  return (
    <DocumentProvider value={entityDocument?.response.document}>
      <Editor />
      <Toaster />
    </DocumentProvider>
  );
};

export default Edit;
