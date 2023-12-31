import { cn } from "../../utils/cn";
import { useParsedText } from "../../utils/useParsedText";

export interface EntityTextProps {
  text: {
    inputValue: string;
    stringFields?: { fieldId: string; value: string }[];
  };
  className?: string;
}

export const EntityText = ({ text, className }: EntityTextProps) => {
  const parsedText = useParsedText(text);

  return (
    <span className={cn(`leading-relaxed px-0`, className)}>{parsedText}</span>
  );
};
