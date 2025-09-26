import Protected from "@/components/auth/protected";
import { CompanyAcquisitionForm } from "../components/company-acquisition-form";

export default function InvestmentAndTakeoverPage() {
  return (
    <Protected>
      <main>
        <div className="w-full mx-auto">
          <div className="py-12">
            <CompanyAcquisitionForm />
          </div>
        </div>
      </main>
    </Protected>
  );
}
