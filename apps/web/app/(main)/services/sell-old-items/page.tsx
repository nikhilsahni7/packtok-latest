import Protected from "@/components/auth/protected";
import { Suspense } from "react";
import { ProductSubmissionForm } from "./components/product-submission-form";

export default function SellYourProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20 h-screen">
          Loading...
        </div>
      }
    >
      <Protected>
        <main>
          <div className="w-full">
            <div className="py-12">
              <ProductSubmissionForm />
            </div>
          </div>
        </main>
      </Protected>
    </Suspense>
  );
}
