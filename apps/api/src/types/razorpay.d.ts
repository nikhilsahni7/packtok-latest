declare module "razorpay" {
  // Minimal type definitions required for current usage.
  export interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  export interface OrderRequest {
    amount: number;
    currency: string;
    receipt?: string;
    payment_capture?: 0 | 1;
    notes?: Record<string, string>;
  }

  export interface Order {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string | null;
    status: string;
    notes?: Record<string, unknown>;
    created_at: number;
  }

  export default class Razorpay {
    constructor(options: RazorpayOptions);
    orders: {
      create(params: OrderRequest): Promise<Order>;
    };
  }
}
