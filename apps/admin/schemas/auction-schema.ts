import { z } from "zod";

export const auctionFormSchema = z
  .object({
    mode: z.enum(["FORWARD", "REVERSE"], {
      required_error: "Mode is required",
    }),
    startAt: z.string().min(1, "Start time is required"),
    endAt: z.string().min(1, "End time is required"),
    startingAmount: z.coerce
      .number({
        required_error: "Starting amount is required",
      })
      .positive("Starting amount must be greater than zero"),
    earnestAmount: z.coerce
      .number({
        required_error: "Earnest amount is required",
      })
      .positive("Earnest amount must be greater than zero"),
    currency: z.string().default("INR"),
    minBidIncrement: z.coerce
      .number({ invalid_type_error: "Minimum increment must be number" })
      .positive("Minimum increment must be positive")
      .optional()
      .nullable(),
    minBidDecrement: z.coerce
      .number({ invalid_type_error: "Minimum decrement must be number" })
      .positive("Minimum decrement must be positive")
      .optional()
      .nullable(),
    reservePrice: z.coerce
      .number({ invalid_type_error: "Reserve price must be number" })
      .positive("Reserve price must be positive")
      .optional()
      .nullable(),
    maxWinners: z.coerce
      .number({ invalid_type_error: "Max winners must be number" })
      .int("Max winners must be an integer")
      .positive("Max winners must be positive")
      .max(25, "Max winners limited to 25")
      .default(3),
    notes: z
      .string()
      .max(500, "Notes limited to 500 characters")
      .optional()
      .nullable(),
  })
  .superRefine((values, ctx) => {
    if (values.mode === "FORWARD" && !values.minBidIncrement) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minBidIncrement"],
        message: "Minimum bid increment is required for forward auctions",
      });
    }

    if (values.mode === "REVERSE" && !values.minBidDecrement) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minBidDecrement"],
        message: "Minimum bid decrement is required for reverse auctions",
      });
    }

    const start = new Date(values.startAt);
    const end = new Date(values.endAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startAt"],
        message: "Invalid start or end date",
      });
      return;
    }

    if (start >= end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endAt"],
        message: "End time must be after start time",
      });
    }
  });

export type AuctionFormValues = z.infer<typeof auctionFormSchema>;
