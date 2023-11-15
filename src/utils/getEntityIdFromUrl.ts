import { getRuntime } from "@yext/pages/util";

export const getEntityIdFromUrl = () => {
  const runtime = getRuntime();
  if (runtime.isServerSide) {
    return undefined;
  }

  // logic is required because rewrite logic does not work locally
  // if entityId is in the params, that takes precedence
  const urlParams = new URLSearchParams(window.location.search);
  const entityIdParam = urlParams.get("entityId");
  if (entityIdParam) {
    return entityIdParam;
  } else {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf("/") + 1);
  }
};
