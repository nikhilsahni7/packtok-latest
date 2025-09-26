import Protected from "@/components/auth/protected";
import { JobSeekerForm } from "./components/job-seeker-form";

export default function JobSeekerPage() {
  return (
    <Protected>
      <main>
        <div className="w-full">
          <div className="py-12">
            <JobSeekerForm />
          </div>
        </div>
      </main>
    </Protected>
  );
}
