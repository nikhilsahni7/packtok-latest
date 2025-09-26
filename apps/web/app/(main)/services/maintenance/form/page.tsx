import Protected from "@/components/auth/protected";
import { MaintenanceForm } from "../components/maintenance-form";

export default function MaintenancePage() {
  return (
    <Protected>
      <main>
        <div className="w-full mx-auto">
          <div className="py-12">
            <MaintenanceForm />
          </div>
        </div>
      </main>
    </Protected>
  );
}
