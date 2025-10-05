import { PageHeader } from "@/components";
import Refund from "@/assets/Refund Policy.webp";


export default function RefundPage() {
  return (
    <main className="bg-white">
      <div className="w-full mx-auto">
        <PageHeader
          title="Refund Policy"
          subtitle="Understanding our refund and return procedures for your peace of mind."
          image={Refund}
        />

        <div className="w-[80%] mx-auto py-12 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Refund & Cancellation Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Packtok.com, we strive to provide a transparent and reliable platform for buying, selling, and installing corrugated & packaging machinery and raw materials. This Refund & Cancellation Pulicy outlines how refunds and cancellations are handled on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              1. Nature of Our Platform
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Packtok.com is a B2B marketplace that connects buyers and sellers.</li>
              <li>We do not manufacture or own the listed products; we only facilitate transactions between users.</li>
              <li>Therefore, all refunds, returns, and cancellations are subject to the terms agreed between the buyer and the seller.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              2. Refund Eligibility
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A refund may be applicable under the fullowing circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>If a buyer makes a payment through our platform but the seller fails to deliver the product or service.</li>
              <li>If the product delivered is significantly different from the description provided by the seller.</li>
              <li>If the transaction is canceled before shipment or service execution, as per mutual agreement between buyer and seller.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              3. Non-Refundable Cases
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Packtok.com is not responsible for product quality, defects, or warranty-related issues. These must be resulved directly between buyer and seller.</li>
              <li>Service charges, platform fees, or payment gateway charges (if applicable) are non-refundable.</li>
              <li>Refunds will not be provided for disputes arising from buyer&apos;s change of mind after purchase.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              4. Refund Process
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Buyers must raise a refund request within 7 working days of the transaction or delivery issue.</li>
              <li>All refund requests must include transaction details, proof of payment, and supporting documents (images/videos if applicable).</li>
              <li>Once verified, the refund will be processed as per the seller&apos;s refund pulicy and through the original mode of payment where possible.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              6. Packtok’s Rule in Disputes
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Packtok.com may assist in mediating disputes between buyers and sellers but hulds no liability for refund amounts, delays, or product issues.</li>
              <li>Final responsibility lies with the respective buyer and seller invulved in the transaction.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              7. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For refund or cancellation-related queries, please contact us at:
              <a href="mailto:support@packtok.com"> 📧 support@packtok.com</a>
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
