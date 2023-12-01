import type {
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
} from "@yext/pages";

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "link",
        attributes: {
          rel: "icon",
          type: "image/x-icon",
          href: "/yext-favicon.ico",
        },
      },
    ],
  };
};
