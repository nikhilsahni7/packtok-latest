"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@packtok/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@packtok/ui/components/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@packtok/ui/components/form";
import { Input } from "@packtok/ui/components/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@packtok/ui/components/select";
import { Textarea } from "@packtok/ui/components/textarea";
import { useEffect, useMemo } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useCreateAuction } from "../../../../hooks";
import {
    auctionFormSchema,
    AuctionFormValues,
} from "../../../../schemas/auction-schema";
import { MarketplaceProduct } from "../../../../types/product";

interface CreateAuctionDialogProps {
  product: MarketplaceProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const toLocalIsoString = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzOffset).toISOString();
  return localISOTime.slice(0, 16);
};

export function CreateAuctionDialog({
  product,
  open,
  onOpenChange,
}: CreateAuctionDialogProps) {
  const createAuctionMutation = useCreateAuction();
  const auctionFormResolver = zodResolver(
    auctionFormSchema
  ) as unknown as Resolver<AuctionFormValues>;

  const defaultStart = useMemo(() => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    return toLocalIsoString(now);
  }, []);

  const defaultEnd = useMemo(() => {
    const end = new Date();
    end.setMinutes(0, 0, 0);
    end.setHours(end.getHours() + 3);
    return toLocalIsoString(end);
  }, []);

  const form = useForm<AuctionFormValues>({
    resolver: auctionFormResolver,
    defaultValues: {
      mode: "FORWARD",
      currency: "INR",
      startAt: defaultStart,
      endAt: defaultEnd,
      startingAmount: product?.price ?? 0,
      earnestAmount: Number(product?.price ?? 0) * 0.1 || 1000,
      minBidIncrement: 100,
      minBidDecrement: null,
      reservePrice: null,
      maxWinners: 3,
      notes: "",
    },
  });

  const mode = form.watch("mode");

  useEffect(() => {
    if (product) {
      form.reset({
        mode: "FORWARD",
        currency: "INR",
        startAt: defaultStart,
        endAt: defaultEnd,
        startingAmount: product.price,
        earnestAmount: Math.max(Number(product.price) * 0.1 || 0, 1000),
        minBidIncrement: 100,
        minBidDecrement: null,
        reservePrice: null,
        maxWinners: 3,
        notes: "",
      });
    }
  }, [product, form, defaultStart, defaultEnd]);

  const handleSubmit = async (values: AuctionFormValues) => {
    if (!product) {
      toast.error("Select a product to create an auction");
      return;
    }

    try {
      await createAuctionMutation.mutateAsync({
        productId: product.id,
        mode: values.mode,
        startAt: new Date(values.startAt).toISOString(),
        endAt: new Date(values.endAt).toISOString(),
        startingAmount: values.startingAmount,
        earnestAmount: values.earnestAmount,
        currency: values.currency,
        minBidIncrement:
          values.mode === "FORWARD"
            ? (values.minBidIncrement ?? undefined)
            : null,
        minBidDecrement:
          values.mode === "REVERSE"
            ? (values.minBidDecrement ?? undefined)
            : null,
        reservePrice: values.reservePrice ?? undefined,
        maxWinners: values.maxWinners,
        notes: values.notes ?? null,
      });

      toast.success("Auction created successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create auction");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Auction</DialogTitle>
          <DialogDescription>
            Configure auction settings for <strong>{product?.title}</strong> and
            publish it for bidders.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auction Mode</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FORWARD">Forward</SelectItem>
                        <SelectItem value="REVERSE">Reverse</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INR">🇮🇳 INR - Indian Rupee</SelectItem>
                        <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                        <SelectItem value="AED">🇦🇪 AED - UAE Dirham</SelectItem>
                        <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                        <SelectItem value="GBP">🇬🇧 GBP - British Pound</SelectItem>
                        <SelectItem value="CNY">🇨🇳 CNY - Chinese Yuan</SelectItem>
                        <SelectItem value="TWD">🇹🇼 TWD - Taiwan Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startingAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="earnestAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Earnest Money</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {mode === "FORWARD" && (
                <FormField
                  control={form.control}
                  name="minBidIncrement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Bid Increment</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {mode === "REVERSE" && (
                <FormField
                  control={form.control}
                  name="minBidDecrement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Bid Decrement</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="reservePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reserve Price (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxWinners"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Winners</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={25}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Important instructions for bidders"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createAuctionMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createAuctionMutation.isPending}>
                {createAuctionMutation.isPending
                  ? "Saving..."
                  : "Create Auction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
