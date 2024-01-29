import { LinkedTemplateEntity } from "../templates/edit";
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
  isResolvingData: boolean;
  setIsResolvingData: (isResolvingData: boolean) => void;
};

export const [useEditorContext, EditorContextProvider] =
  createCtx<EditorContextType>(
    "Attempted to call useEditorContext outside of EditorContextProvider"
  );
