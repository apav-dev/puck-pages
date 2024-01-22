import { useMemo } from "react";

export const useParsedText = (text: string = "", document?: string) => {
  return useMemo(() => {
    const regex = /\[\[(.+?)\]\]/g;
    const matches = text.match(regex);

    if (matches && fieldValue) {
      matches.forEach((match) => {
        text = text.replace(match, fieldValue);
      });
      return text;
    }

    return text;
  }, [text, fieldValue]);
};
