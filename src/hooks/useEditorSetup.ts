import { getRuntime } from "@yext/pages/util";
import { useEditorStore } from "../hooks/useEditorStore";
import { useEffect } from "react";

export const useEditorSetup = () => {
  const { setEntityId, setTemplateId } = useEditorStore();

  useEffect(() => {
    const runtime = getRuntime();
    if (runtime.isServerSide) return;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("entityId")) {
      const entityId = urlParams.get("entityId");
      setEntityId(entityId ?? undefined);
    }

    if (urlParams.has("templateId")) {
      const templateId = urlParams.get("templateId");
      setTemplateId(templateId ?? undefined);
    }
  }, []);
};
