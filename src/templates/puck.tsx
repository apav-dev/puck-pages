import "@measured/puck/dist/index.css";
import "../index.css";
import {
  Template,
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import { Editor } from "../puck/Editor";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEntity } from "../utils";

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return "puck";
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}): HeadConfig => {
  return {
    title: "Puck Editor",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const Puck: Template<TemplateRenderProps> = () => {
  const [entityId, setEntityId] = useState<string>("");
  const [templateData, setTemplateData] = useState<any>();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const entityIdParam = searchParams.get("entityId");
    if (entityIdParam) {
      setEntityId(entityIdParam);
    }
  }, []);

  const { data, isSuccess } = useQuery({
    queryKey: ["entityId", entityId],
    retry: false,
    queryFn: () => fetchEntity(entityId),
    enabled: entityId !== "",
  });

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (data) {
        const response = await fetch(data.response.docs[0].c_template.url);
        const json = await response.json();
        debugger;
        setTemplateData(json);
      }
    };
    fetchTemplateData();
  }, [data]);

  if (templateData) {
    return <Editor initialData={templateData} />;
  } else {
    return <div>Loading...</div>;
  }
};

export default Puck;
