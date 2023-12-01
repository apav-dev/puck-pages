import type { GetPath, TemplateProps } from "@yext/pages";

/**
 * Defines the path that the generated file will live at for production.
 *
 * NOTE: This currently has no impact on the local dev path. Local dev urls currently
 * take on the form: featureName/entityId
 */
export const getPath: GetPath<TemplateProps> = (data) => {
  return data.document.slug;
};
