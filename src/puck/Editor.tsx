import { Puck } from "@measured/puck";
import type { Data } from "@measured/puck";
import "@measured/puck/dist/index.css";
import { fetch } from "@yext/pages/util";
import config from "../config";
import { useToast } from "../components/useToast";
import { ToastAction } from "../components/Toast";

export interface EditorProps {
  initialData: Data;
  entityId: string;
  entitySlug?: string;
}

export const Editor = ({ initialData, entityId, entitySlug }: EditorProps) => {
  const { toast } = useToast();

  const handlePublish = async (data: Data) => {
    const resp = await fetch(`/api/entity/${entityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ c_template: data }),
    });
    if (resp.ok) {
      toast({
        title: "Success",
        description: `Your changes have been published.`,
        action: (
          <ToastAction altText="Try again" className="hover:bg-slate-100">
            <a href={entitySlug} target="_blank" rel="noopener noreferrer">
              View Page
            </a>
          </ToastAction>
        ),
      });
    } else {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  return <Puck config={config} data={initialData} onPublish={handlePublish} />;
};
