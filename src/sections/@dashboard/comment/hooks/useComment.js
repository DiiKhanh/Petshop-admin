import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import commentApi from "~/apis/modules/comment.api";


export function useGetAllComment() {
  const getAllFn = async () => {
    const { response } = await commentApi.getAll();
    return response;
  };
  return useQuery({
    queryKey: commentQueryKeys.all,
    queryFn: getAllFn
  });
}

export function useEditComment(id) {
  const queryClient = useQueryClient();

  const editCommentFn = async (updated) => {
    const { response } = await commentApi.update(updated);
    return response;
  };

  return useMutation({
    mutationFn: editCommentFn,
    onMutate: async (updated) => {
      await queryClient.cancelQueries(commentQueryKeys.detail(id));
      const previous = queryClient.getQueryData(
        commentQueryKeys.detail(id)
      );
      queryClient.setQueryData(commentQueryKeys.detail(id), updated);
      return { previous: previous, updated: updated };
    },
    onError: (err, updatedPet, context) => {
      toast.error(err);
      queryClient.setQueryData(
        commentQueryKeys.detail(id),
        context.previous
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(commentQueryKeys.all);
    }
  });
}

export const commentQueryKeys = {
  all: ["all-comment"],
  details: () => [...commentQueryKeys.all, "detail"],
  detail: (id) => [...commentQueryKeys.details(), id]
};