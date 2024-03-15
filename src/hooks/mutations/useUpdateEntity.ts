import { useMutation } from "@tanstack/react-query";
import { updateEntity } from "../../utils/api";

type Update = {
  handleComplete: (success: boolean) => void;
};

const useUpdateEntity = ({ handleComplete }: Update) => {
  const updateEntityMutation = useMutation({
    mutationFn: async ({ entityId, body }: { entityId: string; body: any }) => {
      await updateEntity(entityId, body);
    },
    mutationKey: ["updateEntity"],
    onSettled: (data, error) => {
      handleComplete(error ? false : true);
    },
  });

  return updateEntityMutation;
};

export default useUpdateEntity;
