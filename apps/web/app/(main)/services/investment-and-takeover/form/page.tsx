import Protected from "@/components/auth/protected";
import { Suspense } from "react";
import { CompanyAcquisitionForm } from "../components/company-acquisition-form";

export default function InvestmentAndTakeoverPage() {
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
          <div className="w-full mx-auto">
            <div className="py-12">
              <CompanyAcquisitionForm />
            </div>
          </div>
        </main>
      </Protected>
    </Suspense>
  );
}
