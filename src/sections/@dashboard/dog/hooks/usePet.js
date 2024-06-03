import dogApi from "~/apis/modules/dog.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


export function useCreatePet({ setOpen, reset, setArr }) {
  const queryClient = useQueryClient();

  const createPetFn = async (updatedPet) => {
    const { response } = await dogApi.addDog(updatedPet);
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
      setArr([]);
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
  const { response } = await dogApi.getAllDog();
  return response;
};

export function useGetAllPet() {
  return useQuery({
    queryKey: petQueryKeys.all,
    queryFn: getAllPetFn
  });
}

export function useGetPet(id) {

  const getPetFn = async () => {
    const { response } = await dogApi.getDogByIdAdmin({ id });
    return response;
  };

  return useQuery({
    queryKey: petQueryKeys.detail(id),
    queryFn: getPetFn,
    retry: 1
  });
}

export function useEditPet(id) {
  const queryClient = useQueryClient();

  const editPetFn = async (updatedPet) => {
    const { response } = await dogApi.editDogById(updatedPet);
    return response;
  };

  return useMutation({
    mutationFn: editPetFn,
    onMutate: async (updatedPet) => {
      await queryClient.cancelQueries(petQueryKeys.detail(id));
      const previousPet = queryClient.getQueryData(
        petQueryKeys.detail(id)
      );
      queryClient.setQueryData(petQueryKeys.detail(id), updatedPet);
      return { previousPet: previousPet, updatedPet: updatedPet };
    },
    onError: (err, updatedPet, context) => {
      queryClient.setQueryData(
        petQueryKeys.detail(id),
        context.previousPet
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(petQueryKeys.all);
    }
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  const deletePetFn = async (id) => {
    const response = await dogApi.deleteDog({ id });
    return response;
  };

  return useMutation({
    mutationFn: deletePetFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: petQueryKeys.all });
    },
    onSuccess: () => {
      toast.success("Chỉnh sửa thành công!");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: petQueryKeys.all });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: petQueryKeys.all });
    }
  });
}


export const petQueryKeys = {
  all: ["all-pet"],
  details: () => [...petQueryKeys.all, "detail"],
  detail: (id) => [...petQueryKeys.details(), id],
  pagination: (page) => [...petQueryKeys.all, "pagination", page],
  infinite: () => [...petQueryKeys.all, "infinite"]
};