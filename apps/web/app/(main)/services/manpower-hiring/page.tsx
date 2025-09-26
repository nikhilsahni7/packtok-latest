import Protected from "@/components/auth/protected";
import { Suspense } from "react";
import { ManpowerHiringForm } from "./components/manpower-hiring-form";

export default function ManpowerHiringPage() {
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
              <ManpowerHiringForm />
            </div>
          </div>
        </main>
      </Protected>
    </Suspense>
  );
}
