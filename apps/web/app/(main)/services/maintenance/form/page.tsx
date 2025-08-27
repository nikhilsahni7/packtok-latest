import { PageHeader } from "@/components";
import Protected from "@/components/auth/protected";
import { MaintenanceForm } from "../components/maintenance-form";

export default function MaintenancePage() {
  return (
    <Protected>
      <main>
        <div className="w-[85%] mx-auto">
          <PageHeader
            title="Maintenance Services"
            subtitle="Request professional maintenance services for your machinery."
            image="/services.png"
          />
          <div className="py-12">
            <MaintenanceForm />
          </div>
        </div>
      </main>
    </Protected>
  );
}
