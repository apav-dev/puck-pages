import { useMemo } from "react";

export const useParsedText = (text: {
  inputValue: string;
  stringFields?: { fieldId: string; value: string }[];
}) => {
  return useMemo(() => {
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
};
