import { useQuery } from "@tanstack/react-query";
import authApi from "~/apis/modules/auth.api";


export function useGetAllUser() {
  const getAllFn = async () => {
    const { response } = await authApi.getAllUser();
    return response;
  };
  return useQuery({
    queryKey: userQueryKeys.all,
    queryFn: getAllFn
  });
}

export const userQueryKeys = {
  all: ["all-user"],
  details: () => [...userQueryKeys.all, "detail"],
  detail: (id) => [...userQueryKeys.details(), id]
};