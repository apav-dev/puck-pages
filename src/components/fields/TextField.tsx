import { useQuery } from "@tanstack/react-query";
import { CustomField } from "@measured/puck";
import { getEntityFieldsList } from "../../utils/puck-utils";
import { Textarea } from "../Textarea";

export interface TextFieldProps {
  field: CustomField;
  name: string;
  value: any;
  onChange: (value: Props) => void;
  readOnly?: boolean;
  entityId?: string;
}

export const TextField = ({
  field,
  name,
  onChange,
  value,
  readOnly,
  entityId,
}: TextFieldProps) => {
  const entityQuery = useQuery({
    queryKey: ["entity", entityId],
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

  return <Textarea value={value.inputValue} onChange={handleInputChange} />;
};
