import {
  GetHeadConfig,
  GetPath,
  GetRedirects,
  HeadConfig,
  Template,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import { Image } from "@yext/sites-components";
import "../index.css";
import { Main } from "../layouts/Main";
import { Header } from "../components/Header";
import { BackButton } from "../components/BackButton";
import { MarkdownContent } from "../components/MarkdownContent";
import Footer from "../components/Footer";
import { Blogs } from "../types/autogen";

export const config: TemplateConfig = {
  stream: {
    $id: "blogs",
    fields: [
      "id",
      "name",
      "datePosted",
      "slug",
      "blogStarter_coverPhoto",
      "blogStarter_body",
      "blogStarter_description",
      "blogStarter_metaDescription",
      "blogStarter_keywords",
      "blogStarter_blogAuthor",
      "c_premium",
    ],
    filter: {
      entityTypes: ["blogStarter_blog"],
    },
    // The entity language profiles that documents will be generated for.
    localization: {
      locales: ["en", "es"],
    },
  },
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return document.slug ?? document.name;
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const EntityPage: Template<TemplateRenderProps<Blogs>> = ({
  relativePrefixToRoot,
  path,
  document,
}) => {
  const { name, _site } = document;

  return (
    <Main>
      <Header logo={_site?.logo} />
      <main className="mx-auto max-w-5xl px-6 pb-52">
        <div className="flex flex-col max-w-2xl gap-8 my-8 mx-auto">
          <BackButton backToUrl="/" />
          <div className="flex gap-2 items-center">
            <p className="text-gray-400 font-light base">
              {document.blogStarter_blogAuthor}
            </p>
            <span className="w-0.5 rounded-full h-4 text-gray-400" />
          </div>
          <h1 className="text-gray-900 font-bold text-4xl">{document.name}</h1>
          {document.blogStarter_coverPhoto && (
            <Image
              className="aspect-video w-full"
              image={document.blogStarter_coverPhoto}
            />
          )}
          <MarkdownContent content={document.blogStarter_body.markdown} />
        </div>
      </main>
      <Footer />
    </Main>
  );
};

export default EntityPage;
