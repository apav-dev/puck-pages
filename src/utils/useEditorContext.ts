import { LinkedTemplateEntity } from "../templates/puck";
import { createCtx } from "./createCtx";

type EditorContextType = {
  entityId: string;
  setEntityId: (entityId: string) => void;
  templateId: string;
  setTemplateId: (templateId: string) => void;
  entitySlug: string;
  setEntitySlug: (entitySlug: string) => void;
  linkedTemplateEntity: LinkedTemplateEntity;
  setLinkedTemplateEntity: (linkedTemplateEntity: LinkedTemplateEntity) => void;
};

export const [useEditorContext, EditorContextProvider] =
  createCtx<EditorContextType>(
    "Attempted to call useEditorContext outside of EditorContextProvider"
  );