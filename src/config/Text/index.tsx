import { ComponentConfig } from "@measured/puck";
import { Section } from "../Section";
import { getEntityIdFromUrl } from "../../utils/getEntityIdFromUrl";
import { TextField } from "../../components/fields/TextField";
import { useMemo } from "react";

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

    const parsedText = useMemo(() => {
      const regex = /\[\[(.+?)\]\]/g;
      const matches = text?.inputValue.match(regex);

      if (matches && text?.stringFields) {
        let parsedText = text.inputValue;
        matches.forEach((match) => {
          const fieldId = match.slice(2, -2);
          const matchingObject = text.stringFields?.find(
            (obj) => obj.fieldId === fieldId
          );

          if (matchingObject) {
            parsedText = parsedText.replace(match, matchingObject.value);
          }
        });
        return parsedText;
      }

      return text?.inputValue;
    }, [text]);

    return (
      <Section padding={padding} maxWidth={maxWidth}>
        <span
          className={`${textColorClass} ${fontSizeClass} ${textAlignClass} leading-relaxed px-0`}
          style={{
            maxWidth,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {parsedText}
        </span>
      </Section>
    );
  },
};
