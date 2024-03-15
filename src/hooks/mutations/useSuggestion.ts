import { useMutation } from "@tanstack/react-query";
import { createEntitySuggestion } from "../../utils/api";

type Suggestion = {
  handleComplete: (suggestionId: string | undefined, error: any) => void;
};

const useSuggestion = ({ handleComplete }: Suggestion) => {
  const suggestionMutation = useMutation({
    mutationFn: async ({ entityId, body }: { entityId: string; body: any }) => {
      const resp = await createEntitySuggestion(entityId, body);
      return resp.response.id;
    },
    mutationKey: ["suggestion"],
    onSettled: (data, error) => {
      // data will be non-null on success, error will be non-null on failure
      handleComplete(data, error);
    },
  });

  return suggestionMutation;
};

export default useSuggestion;
