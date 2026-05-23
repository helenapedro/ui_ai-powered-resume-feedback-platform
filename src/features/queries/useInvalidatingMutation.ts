import {
  useMutation,
  useQueryClient,
  type MutationFunction,
  type QueryKey,
} from '@tanstack/react-query';

type InvalidatingMutationOptions<TData, TVariables> = {
  mutationFn: MutationFunction<TData, TVariables>;
  getQueryKeys: (data: TData, variables: TVariables) => QueryKey[];
};

export function useInvalidatingMutation<TData = unknown, TVariables = void>({
  mutationFn,
  getQueryKeys,
}: InvalidatingMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      getQueryKeys(data, variables).forEach((queryKey) => {
        void queryClient.invalidateQueries({ queryKey });
      });
    },
  });
}
