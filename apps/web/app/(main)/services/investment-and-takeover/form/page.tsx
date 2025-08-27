import { PageHeader } from "@/components";
import Protected from "@/components/auth/protected";
import { CompanyAcquisitionForm } from "../components/company-acquisition-form";

export default function InvestmentAndTakeoverPage() {
  return (
    <Protected>
      <main>
        <div className="w-[85%] mx-auto">
          <PageHeader
            title="Investment & Takeover"
            subtitle="Investment and acquisition solutions for business growth and expansion."
            image="/services.png"
          />
          <div className="py-12">
            <CompanyAcquisitionForm />
          </div>
        </div>
      </main>
    </Protected>
  );
}
