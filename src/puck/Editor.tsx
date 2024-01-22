import { Button, Puck, usePuck } from "@measured/puck";
import type { Data } from "@measured/puck";
import config from "../config";
import { useToast } from "../components/useToast";
import { ToastAction } from "../components/shadcn/Toast";
import ModifyStreamPlugin from "../plugins/ModifyStream";
import { Header } from "../components/puck-overrides/Header";
import { useEditorContext } from "../utils/useEditorContext";

export interface EditorProps {}

export const Editor = ({}: EditorProps) => {
  const { toast } = useToast();

  const { linkedTemplateEntity, entitySlug, entityId } = useEditorContext();

  const handlePublish = async (data: Data) => {
    const resp = await fetch(`/api/entity/${linkedTemplateEntity.id}`, {
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
      const resp = await fetch(
        `/api/entity/${linkedTemplateEntity.id}/suggestion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ c_template: data }),
        }
      );
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
      data={linkedTemplateEntity.template}
      onPublish={handlePublish}
      plugins={[ModifyStreamPlugin]}
      overrides={{
        header: ({ actions }) => (
          <Header actions={actions} templateName={linkedTemplateEntity.name} />
        ),
        headerActions: ({ children }) => {
          const { appState } = usePuck();
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
