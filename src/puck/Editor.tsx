import { Button, Puck, usePuck } from "@measured/puck";
import type { Data } from "@measured/puck";
import config from "../config";
import { useToast } from "../components/useToast";
import { ToastAction } from "../components/shadcn/Toast";

import "@measured/puck/dist/index.css";
import ModifyStreamPlugin from "../plugins/ModifyStream";

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
          <ToastAction
            altText="Successful Publish"
            className="hover:bg-slate-100"
          >
            <a
              href={`/${entitySlug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
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

  const handleCreateSuggestion = async (data: Data) => {
    try {
      const resp = await fetch(`/api/entity/${entityId}/suggestion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ c_template: data }),
      });
      if (resp.ok) {
        const respJson = await resp.json();
        const suggestionId = respJson.response.id;
        toast({
          title: "Success",
          description: `Your changes have been suggested.`,
          action: (
            <ToastAction altText="Try again" className="hover:bg-slate-100">
              <a
                href={`https://www.yext.com/s/3828375/suggestions/edit?ids=${suggestionId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Suggestion
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
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  return (
    <Puck
      config={config}
      data={initialData}
      onPublish={handlePublish}
      plugins={[ModifyStreamPlugin]}
      overrides={{
        headerActions: ({ children }) => {
          const { appState } = usePuck();
          console.log(appState.data);
          return (
            <>
              {children}
              <div>
                <Button
                  onClick={() => handleCreateSuggestion(appState.data)}
                  variant="secondary"
                >
                  Create Suggestion
                </Button>
              </div>
            </>
          );
        },
      }}
    />
  );
};
