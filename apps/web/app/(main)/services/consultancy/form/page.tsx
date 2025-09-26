import Protected from "@/components/auth/protected";
import { ConsultancyForm } from "../components/consultancy-form";

export default function ConsultancyPage() {
  return (
    <Protected>
      <main>
        <div className="w-full mx-auto">
          <div className="py-12">
            <ConsultancyForm />
          </div>
        </div>
      </main>
    </Protected>
  );
}
