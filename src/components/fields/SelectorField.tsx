import { useQuery } from "@tanstack/react-query";
import { CustomField, FieldLabel } from "@measured/puck";
import { getEntityFieldsList } from "../../utils/puck-utils";
import { Textarea } from "../shadcn/Textarea";
import { EntityFieldType } from "../../types/yext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/Dropdown";
import { Button } from "../shadcn/Button";
import { useState } from "react";

export interface SelectorFieldProps {
  field: CustomField;
  name: string;
  value: any;
  onChange: (value: Props) => void;
  readOnly?: boolean;
  entityId?: string;
  label?: string;
  entityFieldType: EntityFieldType;
}

export const SelectorField = ({
  field,
  name,
  onChange,
  value,
  readOnly,
  entityId,
  label,
  entityFieldType,
}: SelectorFieldProps) => {
  const [position, setPosition] = useState("Select Field");

  const entityQuery = useQuery({
    queryKey: [`entitySelector-${name}`, entityId],
    retry: false,
    enabled: !!entityId,
    queryFn: () => getEntityFieldsList(entityId, entityFieldType),
  });

  const handleInputChange = (e: Event) => {
    // debugger;
    const fieldId = e.target?.textContent;
    onChange({
      fieldId,
      value: entityQuery.data.find((field) => field.fieldId === fieldId).value,
    });
  };

  return (
    <>
      <FieldLabel label={label ?? name} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{position}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={"bottom"} onValueChange={setPosition}>
            {entityQuery.data?.map((field) => (
              <DropdownMenuRadioItem
                className="pl-1.5"
                value={field.fieldId}
                onSelect={handleInputChange}
              >
                {field.fieldId}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
