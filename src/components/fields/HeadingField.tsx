import { useQuery } from "@tanstack/react-query";
import { CustomField, FieldLabel } from "@measured/puck";
import { getEntityFieldsList } from "../../utils/puck-utils";
import { Input } from "../shadcn/Input";

export interface HeadingFieldProps {
  field: CustomField;
  name: string;
  value: any;
  onChange: (value: Props) => void;
  readOnly?: boolean;
  entityId?: string;
  label?: string;
}

export const HeadingField = ({
  onChange,
  value,
  entityId,
  label,
  name,
}: HeadingFieldProps) => {
  const entityQuery = useQuery({
    queryKey: ["entity", entityId],
    retry: false,
    enabled: !!entityId,
    queryFn: () => getEntityFieldsList(entityId, "string"),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      inputValue: e.target.value,
      stringFields: entityQuery.data ?? [],
    });
  };

  return (
    <>
      <FieldLabel label={label ?? name} />
      <Input value={value?.inputValue} onChange={handleInputChange} />
    </>
  );
};
