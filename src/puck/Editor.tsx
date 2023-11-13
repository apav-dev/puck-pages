import { Puck } from "@measured/puck";
import type { Data } from "@measured/puck";
import "@measured/puck/dist/index.css";
import config from "../../puck.config";

export interface EditorProps {
  initialData: Data;
}

// Save the data to your database
const save = (data) => {};

export const Editor = ({ initialData }: EditorProps) => {
  return <Puck config={config} data={initialData} onPublish={save} />;
};
