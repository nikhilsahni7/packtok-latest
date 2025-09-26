import Protected from "@/components/auth/protected";
import { Suspense } from "react";
import { MaintenanceForm } from "../components/maintenance-form";

export default function MaintenancePage() {
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
              <MaintenanceForm />
            </div>
          </div>
        </main>
      </Protected>
    </Suspense>
  );
}
