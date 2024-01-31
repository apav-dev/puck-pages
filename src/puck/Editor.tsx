import { Button, Puck, resolveAllData, usePuck } from "@measured/puck";
import type { Data } from "@measured/puck";
import config from "../config";
import { useToast } from "../components/useToast";
import { ToastAction } from "../components/shadcn/Toast";
import { Header } from "../components/puck-overrides/Header";
import { useEditorContext } from "../utils/useEditorContext";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export interface EditorProps {}

export const Editor = ({}: EditorProps) => {
  const { toast } = useToast();

  const { linkedTemplateEntity, entitySlug, isResolvingData } =
    useEditorContext();

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
          // plugins={[ModifyStreamPlugin]}
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
                      onClick={() => handleCreateSuggestion(appState.data)}
                      variant="secondary"
                    >
                      Create Suggestion
                    </Button>
                  </div>
                </>
              );
            },
            // preview: ({ children }) => <CustomPreview children={children} />,
          }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

const CustomPreview = ({ children }: { children: React.ReactNode }) => {
  const { dispatch } = usePuck();

  const { linkedTemplateEntity, entityId } = useEditorContext();

  useEffect(() => {
    console.log("linkedTemplateEntity", linkedTemplateEntity);
  }, [linkedTemplateEntity]);

  const { data: resolvedTemplateData, isPending: resolvingData } = useQuery({
    queryKey: ["resolveData", linkedTemplateEntity.template],
    queryFn: () =>
      resolveAllData(
        linkedTemplateEntity?.template || {
          content: [],
          root: { props: { title: "Title" } },
          zones: {},
        },
        config,
        (item) => {
          console.log(console.log(item));
        }
      ),
    enabled: entityId !== "",
  });

  useEffect(() => {
    if (resolvedTemplateData) {
      dispatch({
        type: "setData",
        data: resolvedTemplateData || {
          content: [],
          root: { props: { title: "Title" } },
          zones: {},
        },
      });
    }
  }, [resolvedTemplateData]);

  return <div>{children}</div>;
};
