import { Puck } from "@measured/puck";
import type { Data } from "@measured/puck";
import "@measured/puck/dist/index.css";
import { fetch } from "@yext/pages/util";
import config, { initialData as puckInitialData } from "../config";

export interface EditorProps {
  initialData: Data;
  entityId: string;
}

export const Editor = ({ initialData, entityId }: EditorProps) => {
  const handlePublish = async (data: Data) => {
    await fetch(`/api/entity/${entityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ c_template: data }),
    });
  };

  return (
    <Puck config={config} data={puckInitialData} onPublish={handlePublish} />
  );
};
