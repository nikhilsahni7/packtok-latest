import api from "@/lib/axios";
import { contactFormSchema } from "@/schemas/contact-form-schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { z } from "zod";

type ContactFormData = z.infer<typeof contactFormSchema>;

export function useContact() {
  return useMutation({
    mutationFn: async (payload: ContactFormData) => {
      // We strip agreeToTerms before sending to backend as it's not stored
      const { agreeToTerms, ...rest } = payload;
      const { data } = await api.post("/api/v1/contact", rest);
      return data;
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Failed to send message";
      toast.error(message);
    },
  });
}
