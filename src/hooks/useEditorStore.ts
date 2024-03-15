import { create } from "zustand";

type LinkedTemplateEntity = {
  id: string;
  name: string;
  template: any;
  linkedEntityIds: string[];
};

type State = {
  entityId: string | null;
  templateId: string | null;
  entitySlug: string | null;
  linkedTemplateEntity: LinkedTemplateEntity | null;
  isResolvingData: boolean;
};

type Action = {
  setEntityId: (entityId: State["entityId"]) => void;
  setTemplateId: (templateId: State["templateId"]) => void;
  setEntitySlug: (entitySlug: State["entitySlug"]) => void;
  setLinkedTemplateEntity: (
    linkedTemplateEntity: State["linkedTemplateEntity"]
  ) => void;
};

export const useEditorStore = create<State & Action>((set) => ({
  entityId: null,
  templateId: null,
  entitySlug: null,
  linkedTemplateEntity: null,
  isResolvingData: false,
  setEntityId: (entityId) => set({ entityId }),
  setTemplateId: (templateId) => set({ templateId }),
  setEntitySlug: (entitySlug) => set({ entitySlug }),
  setLinkedTemplateEntity: (linkedTemplateEntity) =>
    set({ linkedTemplateEntity }),
}));
