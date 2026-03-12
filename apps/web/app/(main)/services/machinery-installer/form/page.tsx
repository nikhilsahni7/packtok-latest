import Protected from "@/components/auth/protected";
import { Suspense } from "react";
import { MachineryInstallerForm } from "../components/machinery-installer-form";

export default function MachineryInstallerFormPage() {
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
              <MachineryInstallerForm />
            </div>
          </div>
        </main>
      </Protected>
    </Suspense>
  );
}
