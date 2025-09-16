import Protected from "@/components/auth/protected";
import { TurnkeyProjectForm } from "../components/turnkey-project-form";

export default function TurnkeyProjectsPage() {
  return (
    <Protected>
      <main className="w-full">
        <TurnkeyProjectForm />
      </main>
    </Protected>
  );
}
