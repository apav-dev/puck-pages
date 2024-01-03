import { useQuery } from "@tanstack/react-query";
import { CustomField, FieldLabel } from "@measured/puck";
import { getEntityFieldsList } from "../../utils/puck-utils";
import { Textarea } from "../shadcn/Textarea";

export interface TextFieldProps {
  field: CustomField;
  name: string;
  value: any;
  onChange: (value: Props) => void;
  readOnly?: boolean;
  entityId?: string;
  label?: string;
}

export const TextField = ({
  field,
  name,
  onChange,
  value,
  readOnly,
  entityId,
  label,
}: TextFieldProps) => {
  const entityQuery = useQuery({
    queryKey: [`entityText-${name}`, entityId],
    retry: false,
    enabled: !!entityId,
    queryFn: () => getEntityFieldsList(entityId, "string"),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      inputValue: e.target.value,
      stringFields: entityQuery.data ?? [],
    });
  };

  return (
    <>
      <FieldLabel label={label ?? name} />
      <Textarea value={value.inputValue} onChange={handleInputChange} />
    </>
  );
};
