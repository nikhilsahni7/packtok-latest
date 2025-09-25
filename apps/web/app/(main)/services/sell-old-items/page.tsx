import { PageHeader } from "@/components";
import Protected from "@/components/auth/protected";
import { ProductSubmissionForm } from "./components/product-submission-form";

export default function SellYourProductPage() {
  return (
    
      <main>
        <div className="w-full">
          <div className="py-12">
            <ProductSubmissionForm />
          </div>
        </div>
      </main>


  );
}
