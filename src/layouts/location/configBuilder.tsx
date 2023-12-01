import type { Stream, TemplateConfig } from "@yext/pages";

export const configBuilder: (
  id?: string,
  filter?: Stream["filter"]
) => Promise<TemplateConfig> = async (
  id?: string,
  filter?: Stream["filter"]
) => {
  try {
    const resp = await fetch(
      "https://rj5zl0ygxkk90ul8.public.blob.vercel-storage.com/streams-sOHBGXIVYy4DjZglr2hAEQcpKxGnCt.json"
    );
    const streams: TemplateConfig[] = await resp.json();
    return streams[0];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
