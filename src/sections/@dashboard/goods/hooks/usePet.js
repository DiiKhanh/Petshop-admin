import goodsApi from "~/apis/modules/goods.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


export function useCreatePet({ setOpen, reset }) {
  const queryClient = useQueryClient();

  const createPetFn = async (updatedPet) => {
    const { response } = await goodsApi.add(updatedPet);
    return response;
  };

  return useMutation({
    mutationFn: createPetFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: petQueryKeys.all });
    },
    onSuccess: () => {
      reset();
      setOpen(false);
      toast.success("Thêm mới thành công!");
    },
    onError: (err, newUser, context) => {
      toast.error(err);
      queryClient.setQueryData(petQueryKeys.all, context.previousPet);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: petQueryKeys.all });
    }
  });
}

const getAllPetFn = async () => {
  const { response } = await goodsApi.getAll();
  return response;
};

export function useGetAllPet() {
  return useQuery({
    queryKey: petQueryKeys.all,
    queryFn: getAllPetFn
  });
}

export const petQueryKeys = {
  all: ["all-goods"],
  details: () => [...petQueryKeys.all, "detail"],
  detail: (id) => [...petQueryKeys.details(), id],
  pagination: (page) => [...petQueryKeys.all, "pagination", page],
  infinite: () => [...petQueryKeys.all, "infinite"]
};