import Protected from "@/components/auth/protected";
import { Suspense } from "react";
import { ConsultancyForm } from "../components/consultancy-form";

export default function ConsultancyPage() {
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
              <ConsultancyForm />
            </div>
          </div>
        </main>
      </Protected>
    </Suspense>
  );
}
