import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import dashboardApi from "~/apis/modules/dashboard.api";


export function useGetAllDashboard() {
  const getAllFn = async () => {
    const { response } = await dashboardApi.getAll();
    return response;
  };
  return useQuery({
    queryKey: dashboardQueryKeys.all,
    queryFn: getAllFn
  });
}

export function useDashboardInvoice() {
  const queryClient = useQueryClient();

  const editInvoiceFn = async (updated) => {
    const { response } = await dashboardApi.getInvoice(updated);
    return response;
  };

  return useMutation({
    mutationFn: editInvoiceFn
  });
}

export const dashboardQueryKeys = {
  all: ["all-dashboard"],
  details: () => [...dashboardQueryKeys.all, "detail"],
  detail: (id) => [...dashboardQueryKeys.details(), id]
};