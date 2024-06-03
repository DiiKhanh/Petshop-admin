import itemApi from "~/apis/modules/item.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


export function useCreateItem({ setOpen, reset, setArr }) {
  const queryClient = useQueryClient();

  const createItemFn = async (updated) => {
    const { response } = await itemApi.addItem(updated);
    return response;
  };

  return useMutation({
    mutationFn: createItemFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: itemQueryKeys.all });
    },
    onSuccess: () => {
      reset();
      setOpen(false);
      setArr([]);
      toast.success("Thêm mới thành công!");
    },
    onError: (err, newUser, context) => {
      toast.error(err);
      queryClient.setQueryData(itemQueryKeys.all, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.all });
    }
  });
}


export function useGetAllItem() {
  const getAllItemFn = async () => {
    const { response } = await itemApi.getAllAdmin();
    return response;
  };
  return useQuery({
    queryKey: itemQueryKeys.all,
    queryFn: getAllItemFn
  });
}

export function useGetItem(id) {

  const getItemFn = async () => {
    const { response } = await itemApi.getItem({ id });
    return response;
  };

  return useQuery({
    queryKey: itemQueryKeys.detail(id),
    queryFn: getItemFn,
    retry: 1
  });
}

export function useEditItem(id) {
  const queryClient = useQueryClient();

  const editItemFn = async (updated) => {
    const { response } = await itemApi.editItem(updated);
    return response;
  };

  return useMutation({
    mutationFn: editItemFn,
    onMutate: async (updated) => {
      await queryClient.cancelQueries(itemQueryKeys.detail(id));
      const previous = queryClient.getQueryData(
        itemQueryKeys.detail(id)
      );
      queryClient.setQueryData(itemQueryKeys.detail(id), updated);
      return { previous: previous, updated: updated };
    },
    onError: (err, updated, context) => {
      queryClient.setQueryData(
        itemQueryKeys.detail(id),
        context.previous
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(itemQueryKeys.all);
    }
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  const deleteItemFn = async (id) => {
    const response = await itemApi.deleteItem({ id });
    return response;
  };

  return useMutation({
    mutationFn: deleteItemFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: itemQueryKeys.all });
    },
    onSuccess: () => {
      toast.success("Chỉnh sửa thành công!");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.all });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.all });
    }
  });
}


export const itemQueryKeys = {
  all: ["all-item"],
  details: () => [...itemQueryKeys.all, "detail"],
  detail: (id) => [...itemQueryKeys.details(), id],
  pagination: (page) => [...itemQueryKeys.all, "pagination", page],
  infinite: () => [...itemQueryKeys.all, "infinite"]
};