import { Button, Puck, usePuck } from "@measured/puck";
import type { Data } from "@measured/puck";
import config from "../config";
import { useToast } from "../components/useToast";
import { ToastAction } from "../components/shadcn/Toast";
import { Header } from "../components/puck-overrides/Header";
import useUpdateEntity from "../hooks/mutations/useUpdateEntity";
import { useEditorStore } from "../hooks/useEditorStore";
import useSuggestion from "../hooks/mutations/useSuggestion";

export interface EditorProps {}

export const Editor = ({}: EditorProps) => {
  const { toast } = useToast();

  const handleSuggestionComplete = (suggestionId: string | undefined) => {
    if (suggestionId) {
      toast({
        title: "Success",
        description: `Your changes have been suggested.`,
        action: (
          <ToastAction altText="suggestion" className="hover:bg-slate-100">
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
  };

  const suggestionMutation = useSuggestion({
    handleComplete: handleSuggestionComplete,
  });

  const handleSuggestion = async (data: Data) => {
    const c_template = JSON.stringify(data);
    suggestionMutation.mutate({
      entityId: linkedTemplateEntity.id,
      body: { c_template },
    });
  };

  const { linkedTemplateEntity, entitySlug, isResolvingData } =
    useEditorStore();

  const handlePublishComplete = (success: boolean) => {
    if (success) {
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

  const updateEntityMutation = useUpdateEntity({
    handleComplete: handlePublishComplete,
  });

  const handlePublish = async (data: Data) => {
    const c_template = JSON.stringify(data);
    updateEntityMutation.mutate({
      entityId: linkedTemplateEntity.id,
      body: { c_template },
    });
  };

  return (
    <>
      {linkedTemplateEntity ? (
        <Puck
          config={config}
          data={
            linkedTemplateEntity?.template ?? {
              content: [],
              root: { props: { title: "Title" } },
              zones: {},
            }
          }
          // data={{ content: [], root: { props: { title: "Title" } }, zones: {} }}
          onPublish={handlePublish}
          overrides={{
            header: ({ actions }) => (
              <Header
                actions={actions}
                templateName={linkedTemplateEntity?.name}
              />
            ),
            headerActions: ({ children }) => {
              const { appState } = usePuck();
              return (
                <>
                  {children}
                  <div>
                    <Button
                      onClick={() => handleSuggestion(appState.data)}
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
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
