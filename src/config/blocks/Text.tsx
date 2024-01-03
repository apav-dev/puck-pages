import { ComponentConfig } from "@measured/puck";
import { Section } from "../components/Section";
import { getEntityIdFromUrl } from "../../utils/getEntityIdFromUrl";
import { TextField } from "../../components/fields/TextField";
import { EntityText } from "../components/EntityText";

export type TextProps = {
  align: "left" | "center" | "right";
  text?: {
    inputValue: string;
    stringFields?: { fieldId: string; value: string }[];
  };
  padding?: string;
  size?: "s" | "m";
  color: "default" | "muted";
  maxWidth?: string;
};

export const Text: ComponentConfig<TextProps> = {
  fields: {
    text: {
      label: "Text",
      type: "custom",
      render: ({ field, onChange, value, name }) => {
        const entityId = getEntityIdFromUrl();
        return (
          <TextField
            entityId={entityId}
            field={field}
            value={value}
            name={name}
            onChange={onChange}
          />
        );
      },
    },
    size: {
      type: "select",
      options: [
        { label: "S", value: "s" },
        { label: "M", value: "m" },
      ],
    },
    align: {
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    color: {
      type: "radio",
      options: [
        { label: "Default", value: "default" },
        { label: "Muted", value: "muted" },
      ],
    },
    padding: { type: "text" },
    maxWidth: { type: "text" },
  },
  defaultProps: {
    align: "left",
    text: {
      inputValue: "text",
      stringFields: [],
    },
    padding: "24px",
    size: "m",
    color: "default",
  },
  render: ({ align, color, text, size, padding, maxWidth }: TextProps) => {
    const textColorClass =
      color === "default" ? "text-current" : "text-gray-400"; // Tailwind class for muted color
    const fontSizeClass = size === "m" ? "text-lg" : "text-base"; // Tailwind classes for different text sizes
    const textAlignClass = `justify-${align}`; // Tailwind class for text alignment

    return (
      <Section padding={padding} maxWidth={maxWidth}>
        <EntityText text={text} />
      </Section>
    );
  },
};
