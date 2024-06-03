import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import voucherApi from "~/apis/modules/voucher.api";


export function useCreateVoucher({ setOpen, reset }) {
  const queryClient = useQueryClient();

  const createVoucherFn = async (updated) => {
    const { response } = await voucherApi.addVoucher(updated);
    return response;
  };

  return useMutation({
    mutationFn: createVoucherFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: voucherQueryKeys.all });
    },
    onSuccess: () => {
      reset();
      setOpen(false);
      toast.success("Thêm mới thành công!");
    },
    onError: (err, newUser, context) => {
      toast.error(err);
      queryClient.setQueryData(voucherQueryKeys.all, context.previousVoucher);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: voucherQueryKeys.all });
    }
  });
}


export function useGetAll() {
  const getAllFn = async () => {
    const { response } = await voucherApi.getAll();
    return response;
  };
  return useQuery({
    queryKey: voucherQueryKeys.all,
    queryFn: getAllFn
  });
}

export function useGetVoucher(id) {

  const getVoucherFn = async () => {
    const { response } = await voucherApi.get({ id });
    return response;
  };

  return useQuery({
    queryKey: voucherQueryKeys.detail(id),
    queryFn: getVoucherFn,
    retry: 1
  });
}

export function useEditVoucher(id) {
  const queryClient = useQueryClient();

  const editVoucherFn = async (updated) => {
    const { response } = await voucherApi.editVoucher(updated);
    return response;
  };

  return useMutation({
    mutationFn: editVoucherFn,
    onMutate: async (updated) => {
      await queryClient.cancelQueries(voucherQueryKeys.detail(id));
      const previousVoucher = queryClient.getQueryData(
        voucherQueryKeys.detail(id)
      );
      queryClient.setQueryData(voucherQueryKeys.detail(id), updated);
      return { previousVoucher: previousVoucher, updated: updated };
    },
    onError: (err, updatedPet, context) => {
      toast.error(err);
      queryClient.setQueryData(
        voucherQueryKeys.detail(id),
        context.previousVoucher
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(voucherQueryKeys.all);
    }
  });
}

export function useDeleteVoucher() {
  const queryClient = useQueryClient();

  const deleteVoucherFn = async (id) => {
    const response = await voucherApi.delete({ id });
    return response;
  };

  return useMutation({
    mutationFn: deleteVoucherFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: voucherQueryKeys.all });
    },
    onSuccess: () => {
      toast.success("Chỉnh sửa thành công!");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: voucherQueryKeys.all });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: voucherQueryKeys.all });
    }
  });
}


export const voucherQueryKeys = {
  all: ["all-voucher"],
  details: () => [...voucherQueryKeys.all, "detail"],
  detail: (id) => [...voucherQueryKeys.details(), id]
};