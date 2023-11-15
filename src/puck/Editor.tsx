import { Puck } from "@measured/puck";
import type { Data } from "@measured/puck";
import "@measured/puck/dist/index.css";
import config from "../../puck.config";
import { fetch } from "@yext/pages/util";

export interface EditorProps {
  initialData: Data;
  entityId: string;
}

export const Editor = ({ initialData, entityId }: EditorProps) => {
  console.log("entityId", entityId);
  const handlePublish = async (data: Data) => {
    console.log("pass template data to entity", data);
    await fetch(`/api/entity/${entityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ c_template: data }),
    });
  };

  return <Puck config={config} data={initialData} onPublish={handlePublish} />;
};
