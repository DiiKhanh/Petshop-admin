import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import invoiceApi from "~/apis/modules/invoice.api";


export function useGetAllInvoice() {
  const getAllFn = async () => {
    const { response } = await invoiceApi.getAll();
    return response;
  };
  return useQuery({
    queryKey: invoiceQueryKeys.all,
    queryFn: getAllFn
  });
}

export function useGetInvoice(id) {
  const getInvoiceFn = async () => {
    const { response } = await invoiceApi.getById({ id });
    return response;
  };

  return useQuery({
    queryKey: invoiceQueryKeys.detail(id),
    queryFn: getInvoiceFn,
    retry: 1
  });
}

export function useEditInvoice(id) {
  const queryClient = useQueryClient();

  const editInvoiceFn = async (updated) => {
    const { response } = await invoiceApi.update(updated);
    return response;
  };

  return useMutation({
    mutationFn: editInvoiceFn,
    onMutate: async (updated) => {
      await queryClient.cancelQueries(invoiceQueryKeys.detail(id));
      const previous = queryClient.getQueryData(
        invoiceQueryKeys.detail(id)
      );
      queryClient.setQueryData(invoiceQueryKeys.detail(id), updated);
      return { previous: previous, updated: updated };
    },
    onError: (err, updatedPet, context) => {
      toast.error(err);
      queryClient.setQueryData(
        invoiceQueryKeys.detail(id),
        context.previous
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(invoiceQueryKeys.all);
    }
  });
}

export const invoiceQueryKeys = {
  all: ["all-invoice"],
  details: () => [...invoiceQueryKeys.all, "detail"],
  detail: (id) => [...invoiceQueryKeys.details(), id]
};