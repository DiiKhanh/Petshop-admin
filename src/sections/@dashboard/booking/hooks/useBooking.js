import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import bookingApi from "~/apis/modules/booking.api";


export function useGetAllBooking() {
  const getAllFn = async () => {
    const { response } = await bookingApi.getAll();
    return response;
  };
  return useQuery({
    queryKey: bookingQueryKeys.all,
    queryFn: getAllFn
  });
}

export function useEditBooking(id) {
  const queryClient = useQueryClient();

  const editBookingFn = async (updated) => {
    const { response } = await bookingApi.update(updated);
    return response;
  };

  return useMutation({
    mutationFn: editBookingFn,
    onMutate: async (updated) => {
      await queryClient.cancelQueries(bookingQueryKeys.detail(id));
      const previous = queryClient.getQueryData(
        bookingQueryKeys.detail(id)
      );
      queryClient.setQueryData(bookingQueryKeys.detail(id), updated);
      return { previous: previous, updated: updated };
    },
    onError: (err, updatedPet, context) => {
      toast.error(err);
      queryClient.setQueryData(
        bookingQueryKeys.detail(id),
        context.previous
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(bookingQueryKeys.all);
    }
  });
}

export const bookingQueryKeys = {
  all: ["all-booking"],
  details: () => [...bookingQueryKeys.all, "detail"],
  detail: (id) => [...bookingQueryKeys.details(), id]
};