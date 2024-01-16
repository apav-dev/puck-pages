import { getRuntime } from "@yext/pages/util";

export const getEntityIdFromUrl = () => {
  const runtime = getRuntime();
  if (runtime.isServerSide) {
    return "";
  }

  const urlParams = new URLSearchParams(window.location.search);
  const entityIdParam = urlParams.get("entityId");
  if (entityIdParam) {
    return entityIdParam;
  } else {
    return "";
  }
};
