import { PageHeader } from "@/components";
import Protected from "@/components/auth/protected";
import { ProductSubmissionForm } from "./components/product-submission-form";

export default function SellYourProductPage() {
  return (
    <Protected>
      <main>
        <div className="w-full">
          <PageHeader
            title="Sell Your Items"
            subtitle="List your equipment and machinery for sale on our marketplace."
            image="/marketplace1.png"
          />
          <div className="py-12">
            <ProductSubmissionForm />
          </div>
        </div>
      </main>
    </Protected>

  );
}
