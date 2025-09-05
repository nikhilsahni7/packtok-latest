import { PageHeader } from "@/components";

export default function RefundPage() {
  return (
    <main className="bg-white">
      <div className="w-[85%] mx-auto">
        <PageHeader
          title="Refund Policy"
          subtitle="Understanding our refund and return procedures for your peace of mind."
        />

        <div className="max-w-4xl mx-auto py-12 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              1. Refund Eligibility
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer refunds under the following conditions:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Products are returned within 30 days of delivery</li>
              <li>Items are in original condition and packaging</li>
              <li>Proof of purchase is provided</li>
              <li>Products have not been used or damaged</li>
              <li>Custom or made-to-order items may have different terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              2. Non-Refundable Items
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Certain items cannot be returned or refunded:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Custom machinery and equipment built to specifications</li>
              <li>Consumable parts and materials that have been used</li>
              <li>Software licenses and digital products</li>
              <li>Services that have been completed</li>
              <li>Items damaged by misuse or normal wear and tear</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              3. Refund Process
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To initiate a refund:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Contact our customer service team within 30 days</li>
              <li>Provide your order number and reason for return</li>
              <li>Wait for return authorization and instructions</li>
              <li>Package items securely and ship to our facility</li>
              <li>
                Refund will be processed within 5-10 business days after
                inspection
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              4. Service Refunds
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For service-related refunds (consultancy, maintenance, etc.),
              refunds are evaluated on a case-by-case basis. Refunds may be
              prorated based on work completed and resources allocated to your
              project.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              5. Shipping Costs
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Original shipping costs are non-refundable unless the return is
              due to our error. Customers are responsible for return shipping
              costs unless the item was defective or shipped incorrectly.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              6. Exchanges
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We offer exchanges for defective items or incorrect shipments.
              Contact us immediately if you receive damaged or incorrect
              products. Exchanges are subject to product availability.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              7. Warranty Claims
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Products under warranty may be repaired or replaced at no cost.
              Warranty terms vary by manufacturer and product type. Contact us
              for specific warranty information and claims procedures.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              8. Processing Time
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Refunds are typically processed within 5-10 business days after we
              receive and inspect returned items. The time it takes for the
              refund to appear in your account depends on your payment method
              and financial institution.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              9. Contact for Refunds
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For refund requests or questions about our refund policy, please
              contact us at +91 81045-43204 or through our contact page. Our
              customer service team is ready to assist you.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">Last updated: January 2025</p>
          </div>
        </div>
      </div>
    </main>
  );
}
