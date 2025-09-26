import Protected from "@/components/auth/protected";
import { Suspense } from "react";
import { JobSeekerForm } from "./components/job-seeker-form";

export default function JobSeekerPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-20 h-screen">Loading...</div>}>
      <Protected>
        <main>
          <div className="w-full">
            <div className="py-12">
              <JobSeekerForm />
            </div>
          </div>
        </main>
      </Protected>
    </Suspense>
  );
}
