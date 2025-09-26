import Protected from "@/components/auth/protected";
import { Suspense } from "react";
import { TurnkeyProjectForm } from "../components/turnkey-project-form";

export default function TurnkeyProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20 h-screen">
          Loading...
        </div>
      }
    >
      <Protected>
        <main className="w-full">
          <TurnkeyProjectForm />
        </main>
      </Protected>
    </Suspense>
  );
}
