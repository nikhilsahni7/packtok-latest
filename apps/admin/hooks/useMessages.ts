import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { ContactInquiry } from "../types/contact";
import { QK } from "../utils/queryKeys";

export function useMessages() {
  return useQuery({
    queryKey: QK.messages,
    queryFn: async () => {
      const { data } = await api.get("/api/v1/contact");
      return data.data as ContactInquiry[];
    },
  });
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/api/v1/contact/${id}`);
      return data.data as ContactInquiry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.messages });
    },
  });
}
