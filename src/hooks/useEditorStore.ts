import { create } from "zustand";

type LinkedTemplateEntity = {
  id: string;
  name: string;
  template: any;
  linkedEntityIds: string[];
};

type State = {
  entityId: string | undefined;
  templateId: string | undefined;
  entitySlug: string | undefined;
  linkedTemplateEntity: LinkedTemplateEntity | undefined;
  isResolvingData: boolean;
  templateConfig: any;
};

type Action = {
  setEntityId: (entityId: State["entityId"]) => void;
  setTemplateId: (templateId: State["templateId"]) => void;
  setEntitySlug: (entitySlug: State["entitySlug"]) => void;
  setLinkedTemplateEntity: (
    linkedTemplateEntity: State["linkedTemplateEntity"]
  ) => void;
  setTemplateConfig: (templateConfig: State["templateConfig"]) => void;
};

export const useEditorStore = create<State & Action>((set) => ({
  entityId: undefined,
  templateId: undefined,
  entitySlug: undefined,
  linkedTemplateEntity: undefined,
  isResolvingData: false,
  setEntityId: (entityId) => set({ entityId }),
  setTemplateId: (templateId) => set({ templateId }),
  setEntitySlug: (entitySlug) => set({ entitySlug }),
  setLinkedTemplateEntity: (linkedTemplateEntity) =>
    set({ linkedTemplateEntity }),
  templateConfig: undefined,
  setTemplateConfig: (templateConfig) => set({ templateConfig }),
}));
