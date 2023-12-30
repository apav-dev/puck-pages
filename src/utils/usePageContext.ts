import { createCtx } from "./createCtx";

type PageContextType = {
  entityId: string;
  setEntityId: (entityId: string) => void;
};

export const [usePageContext, PageContextProvider] = createCtx<PageContextType>(
  "Attempted to call usePageContext outside of PageContextProvider"
);
