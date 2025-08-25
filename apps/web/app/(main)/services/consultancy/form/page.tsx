import { PageHeader } from "@/components";
import Protected from "@/components/auth/protected";
import { ConsultancyForm } from "../components/consultancy-form";

export default function ConsultancyPage() {
  return (
    <Protected>
      <main>
        <div className="w-[85%] mx-auto">
          <PageHeader
            title="Consultancy Services"
            subtitle="Get expert consultancy services to optimize your operations."
            image="/services.png"
          />
          <div className="py-12">
            <ConsultancyForm />
          </div>
        </div>
      </main>
    </Protected>
  );
}
