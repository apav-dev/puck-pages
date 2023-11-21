import { AppState } from "@measured/puck";
import { ReactNode, useEffect, useState } from "react";
import { SidebarSection } from "../components/SidebarSection";
import { useQuery } from "@tanstack/react-query";
import { fetchEndpoint } from "../utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/Dialog";
import { getEntityIdFromUrl } from "../utils/getEntityIdFromUrl";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField } from "../components/Form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../components/Table";
import { Checkbox } from "../components/Checkbox";

const fields = [
  { id: "field1", label: "Field 1" },
  { id: "field2", label: "Field 2" },
  // Add more fields as needed
];

export const FieldSelector = () => {
  const [endpointId, setEndpointId] = useState<string>("locations");
  const [entityId, setEntityId] = useState<string | undefined>("");

  const form = useForm({
    defaultValues: {
      fields: fields.reduce(
        (acc, field) => ({ ...acc, [field.id]: false }),
        {}
      ),
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    setEntityId(getEntityIdFromUrl());
  }, []);

  const endpointQuery = useQuery({
    queryKey: ["endpoint", endpointId],
    retry: false,
    queryFn: () => fetchEndpoint(endpointId),
  });

  const entityQuery = useQuery({
    queryKey: ["entity", entityId],
    retry: false,
    enabled: !!entityId,
    queryFn: () => fetchEndpoint(endpointId),
  });

  return (
    <SidebarSection title="Modify Stream" noPadding>
      <Dialog>
        <DialogTrigger className="p-4">Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Enabled</TableCell>
                    <TableCell>Field ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`fields.${field.id}`}
                          render={({ field }) => (
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>{field.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <button type="submit">Submit</button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarSection>
  );
};

const Plugin = ({
  children,
  state,
  dispatch,
}: {
  children: ReactNode;
  state: AppState;
  dispatch: (action: PuckAction) => void;
}) => {
  return (
    <div>
      {children}
      <FieldSelector />
    </div>
  );
};

const ModifyStreamPlugin = {
  renderRootFields: Plugin,
};

export default ModifyStreamPlugin;
