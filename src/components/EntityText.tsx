import { useParsedText } from "../utils/useParsedText";

export interface EntityTextProps {
  text: {
    inputValue: string;
    stringFields?: { fieldId: string; value: string }[];
  };
}

export const EntityText = ({ text }: EntityTextProps) => {
  const parsedText = useParsedText(text);

  return (
    <span
      className={`
    
    leading-relaxed px-0`}
      style={{
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {parsedText}
    </span>
  );
};
