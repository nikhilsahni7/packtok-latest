import { PageHeader } from "@/components";
import Shipping from "@/assets/Shipping.webp";


export default function ShippingPage() {
  return (
    <main className="bg-white">
      <div className="w-full mx-auto">
        <PageHeader
          title="Shipping & Delivery"
          subtitle="Learn about our shipping options, delivery times, and what to expect with your order."
          image={Shipping}
        />

        <div className="w-[80%] mx-auto py-12 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Shipping & Delivery Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Packtok.com, we aim to provide a smooth and reliable experience for the purchase and delivery of corrugated and packaging machinery as well as raw materials. Since our platform connects buyers and sellers, all shipping and delivery processes are managed directly by the respective sellers or logistics partners.
            </p>

          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              1. Shipping Responsibility
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Sellers are responsible for arranging shipping and delivery of machinery, spare parts, or raw materials listed on Packtok.com.</li>
              <li>Buyers must confirm shipping charges, delivery timelines, and transportation mode with the seller before completing the purchase.</li>
              <li>Packtok.com does not handle shipping directly but facilitates communication between buyers, sellers, and logistics partners.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              2. Delivery Timelines
            </h2>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Delivery timelines vary depending on product type (machinery or raw materials), order size, and shipping location.</li>
              <li>Sellers are expected to provide buyers with an estimated delivery schedule before dispatch.</li>
              <li>Any delays due to transportation, customs clearance, or unforeseen circumstances are beyond Packtok&apos;s control.</li>
            </ul>

          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              3. Packaging & Handling
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Sellers must ensure proper packaging of machinery and raw materials to prevent damage during transit.</li>
              <li>Heavy and large machines should be secured with industrial-grade packing and handling measures.</li>
              <li>Buyers are advised to inspect packaging upon delivery and report any visible damage immediately.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              4. Shipping Costs
            </h2>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Shipping charges are borne by the buyer unless otherwise agreed with the seller.</li>
              <li>Costs depend on product dimensions, weight, distance, and mode of transport (road, sea, or air).</li>
              <li>Sellers must clearly communicate all applicable charges before finalizing the order.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              5. Risk & Insurance
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Risk of damage or loss during transit lies with the seller until delivery is completed.</li>
              <li>For high-value machinery, sellers and buyers are encouraged to arrange transit insurance.</li>
              <li>Packtok.com is not responsible for transit damages, delays, or losses.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              6. International Shipping
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>For exports and imports of corrugated machinery and raw materials, buyers and sellers must comply with applicable customs laws, duties, and documentation.</li>
              <li>Packtok.com does not handle customs clearance but provides a platform to facilitate global trade.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              7. Delivery Confirmation
            </h2>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>   Buyers should verify product details, quantity, and condition at the time of delivery.</li>
              <li>Once delivery is accepted, future claims regarding damage or shortages may not be considered valid.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              8. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For queries regarding shipping & delivery, please contact us at:
 <a href="mailto:support@packtok.com" className="font-bold"> 📧 support@packtok.com</a>
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
