import { getRuntime } from "@yext/pages/util";

export const getTemplateIdFromUrl = () => {
  const runtime = getRuntime();
  if (runtime.isServerSide) {
    return "";
  }

  // logic is required because rewrite logic does not work locally
  // if templateId is in the params, that takes precedence
  const urlParams = new URLSearchParams(window.location.search);
  const templateIdParam = urlParams.get("templateId");
  if (templateIdParam) {
    return templateIdParam;
  } else {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf("/") + 1);
  }
};
