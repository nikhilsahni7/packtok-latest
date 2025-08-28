import { PageHeader } from "@/components";
import Protected from "@/components/auth/protected";
import { TurnkeyProjectForm } from "../components/turnkey-project-form";

export default function TurnkeyProjectsPage() {
  return (
    <Protected>
      <main>
        <div className="w-[85%] mx-auto">
          <PageHeader
            title="Turnkey Projects"
            subtitle="Complete end-to-end project solutions for your industrial needs."
            image="/services.png"
          />
          <div className="py-12">
            <TurnkeyProjectForm />
          </div>
        </div>
      </main>
    </Protected>
  );
}
