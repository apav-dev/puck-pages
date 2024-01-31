import { AppState } from "@measured/puck";
import { ReactNode, useEffect, useState } from "react";
import { SidebarSection } from "../components/SidebarSection";
import { useQuery } from "@tanstack/react-query";
import { fetchEndpoint, fetchEntity, updateStream } from "../utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/shadcn/Dialog";
import { getEntityIdFromUrl } from "../utils/getEntityIdFromUrl";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField } from "../components/shadcn/Form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/shadcn/Table";
import { Checkbox } from "../components/shadcn/Checkbox";
import { ScrollArea } from "../components/shadcn/ScrollArea";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Button } from "../components/shadcn/Button";
import { useToast } from "../components/useToast";

export const FieldSelector = () => {
  // hardcode endpointId for now
  const [endpointId, setEndpointId] = useState<string>("locations");
  const [entityId, setEntityId] = useState<string | undefined>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    setEntityId(getEntityIdFromUrl());
  }, []);

  const endpointQuery = useQuery({
    queryKey: ["endpoint", endpointId],
    retry: false,
    enabled: !!entityId,
    // TODO: swap to use fetch document endpoint
    queryFn: () => fetchEndpoint(endpointId),
  });

  const entityQuery = useQuery({
    queryKey: ["entity", entityId],
    retry: false,
    enabled: !!entityId,
    queryFn: () => fetchEntity(entityId),
  });

  const resetForm = () => {
    const fieldsList = Object.entries(entityQuery.data).map(([k, v]) => ({
      fieldId: k,
      checked: endpointQuery.data?.response.stream.fields.includes(k) ?? false,
    }));

    // Sort the fields list so that checked fields appear first
    const sortedFieldsList = [...fieldsList].sort((a, b) => {
      if (a.checked && !b.checked) {
        return -1;
      } else if (!a.checked && b.checked) {
        return 1;
      } else {
        return 0;
      }
    });

    form.setValue("fields", sortedFieldsList);
  };

  useEffect(() => {
    if (entityQuery.isSuccess) {
      resetForm();
    }
  }, [entityQuery.data, entityQuery.status]);

  const formSchema = z.object({
    fields: z.array(
      z.object({
        fieldId: z.string(),
        checked: z.boolean(),
      })
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fields: [],
    },
  });

  const handleCheckedChange = (
    field: {
      fieldId: string;
      checked: boolean;
    },
    cs: CheckedState
  ) => {
    const updatedFields = form.getValues("fields").map((f) => {
      if (f.fieldId === field.fieldId) {
        return {
          ...f,
          checked: cs === true ? true : false,
        };
      }
      return f;
    });
    form.setValue("fields", updatedFields);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDialogOpen(false);
    setWarningDialogOpen(true);
  };

  const handleFinalSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDialogOpen(false);
    setWarningDialogOpen(false);
    try {
      await updateStream(endpointId, form.getValues());
      toast({
        title: "Success",
        description: `Stream updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Failed to update stream.",
      });
    }
  };

  // TODO: Why is Dialog appearing on cancel?
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setWarningDialogOpen(false);
    setDialogOpen(false);
    resetForm();
  };

  return (
    <SidebarSection title="Modify Stream" noPadding>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          setTimeout(() => {
            if (!open) {
              resetForm();
            }
          }, 500);
        }}
      >
        <DialogTrigger onClick={() => setDialogOpen(true)} className="p-4">
          Open
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Locations Stream</DialogTitle>
            <DialogDescription>
              Add addition fields from location entities to the stream.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Enabled</TableHead>
                    <TableHead>Field Id</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <ScrollArea className="h-[350px] border-l border-b border-r">
                <Table className="table-fixed w-full">
                  <TableBody>
                    <FormField
                      control={form.control}
                      name={"fields"}
                      render={({ field }) => {
                        return (
                          <>
                            {field.value.map((f, i) => (
                              <TableRow key={f.fieldId}>
                                <TableCell className="w-[100px]">
                                  <FormControl>
                                    <Checkbox
                                      checked={f.checked}
                                      onCheckedChange={(cs) =>
                                        handleCheckedChange(f, cs)
                                      }
                                    />
                                  </FormControl>
                                </TableCell>
                                <TableCell>{f.fieldId}</TableCell>
                              </TableRow>
                            ))}
                          </>
                        );
                      }}
                    />
                  </TableBody>
                </Table>
              </ScrollArea>

              <Button
                className="my-4"
                onClick={() => setWarningDialogOpen(true)}
              >
                Submit
              </Button>
              <Button
                className="my-4 ml-4"
                variant="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={warningDialogOpen}>
        <DialogContent>
          <DialogTitle>Are you sure you want to modify the stream?</DialogTitle>
          <DialogDescription>
            You will need to redeploy your site to see the changes on your site.
          </DialogDescription>
          <div className="flex">
            <Button className="my-4" onClick={handleFinalSubmit}>
              Submit
            </Button>
            <Button
              className="my-4 ml-4"
              variant="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarSection>
  );
};

// const ModifyStreamPlugin = ({
//   children,
//   state,
//   dispatch,
// }: {
//   children: ReactNode;
//   state: AppState;
//   dispatch: (action: PuckAction) => void;
// }) => {
//   return (
//     <div>
//       {children}
//       <FieldSelector />
//     </div>
//   );
// };

const ModifyStreamPlugin = {
  overrides: {
    fields: ({ children, itemSelector }) => (
      <>
        {children}

        <FieldSelector />
      </>
    ),
  },
};

export default ModifyStreamPlugin;
