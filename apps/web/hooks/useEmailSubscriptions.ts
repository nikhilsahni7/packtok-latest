"use client";

import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export type EmailSubscriptionType = "PODCAST" | "NEWSLETTER";

type ApiEnvelope<T> = {
  data: T;
  message: string;
  statusCode: number;
};

type SubscribePayload = {
  email: string;
  type: EmailSubscriptionType;
};

type SubscribeResult = {
  subscribed: boolean;
  alreadySubscribed: boolean;
  subscription: {
    id: string;
    email: string;
    type: EmailSubscriptionType;
  };
};

const parseErrorMessage = (error: unknown, fallback: string) => {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? fallback
  );
};

export const useSubscribeEmail = () => {
  return useMutation({
    mutationFn: async (payload: SubscribePayload) => {
      const { data } = await api.post<ApiEnvelope<SubscribeResult>>(
        "/api/v1/email-subscriptions",
        payload
      );
      return data.data;
    },
    onSuccess: (result) => {
      if (result.alreadySubscribed) {
        toast.success("You are already subscribed");
        return;
      }
      toast.success("Subscription confirmed. Check your email.");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error, "Failed to subscribe"));
    },
  });
};
