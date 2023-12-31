import { cn } from "../../utils/cn";
import { useParsedText } from "../../utils/useParsedText";

export interface EntityHeadingTextProps {
  text: {
    inputValue: string;
    stringFields?: { fieldId: string; value: string }[];
  };
  headingLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

export const EntityHeadingText = ({
  text,
  headingLevel,
  className,
}: EntityHeadingTextProps) => {
  const parsedText = useParsedText(text);

  const HeadingTag = headingLevel;

  return (
    <HeadingTag className={cn(`leading-relaxed px-0`, className)}>
      {parsedText}
    </HeadingTag>
  );
};
