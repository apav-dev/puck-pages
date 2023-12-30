import { useParsedText } from "../utils/useParsedText";

export interface EntityHeadingTextProps {
  text: {
    inputValue: string;
    stringFields?: { fieldId: string; value: string }[];
  };
  headingLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const EntityHeadingText = ({
  text,
  headingLevel,
}: EntityHeadingTextProps) => {
  const parsedText = useParsedText(text);

  const HeadingTag = headingLevel;

  return (
    <HeadingTag
      className={`
    
    leading-relaxed px-0`}
      style={{
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {parsedText}
    </HeadingTag>
  );
};
