import { PageHeader } from "@/components";

export default function ShippingPage() {
  return (
    <main className="bg-white">
      <div className="w-[85%] mx-auto">
        <PageHeader
          title="Shipping & Delivery"
          subtitle="Learn about our shipping options, delivery times, and what to expect with your order."
          image="/footer-logo1.png"
        />

        <div className="max-w-4xl mx-auto py-12 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              1. Shipping Coverage
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We currently ship to the following regions:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>India - All states and union territories</li>
              <li>China - Major industrial cities and regions</li>
              <li>United Arab Emirates - All emirates</li>
              <li>Australia - Major cities and industrial areas</li>
              <li>International shipping available upon request</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              2. Delivery Times
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Standard Items
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>Local (Same City): 1-2 business days</li>
                  <li>Domestic: 3-7 business days</li>
                  <li>International: 7-14 business days</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Heavy Machinery
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>Local: 3-5 business days</li>
                  <li>Domestic: 7-14 business days</li>
                  <li>International: 14-30 business days</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              3. Shipping Methods
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Standard Shipping
                </h3>
                <p className="text-gray-700">
                  Economical option for most products. Includes basic tracking
                  and insurance coverage.
                </p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Express Shipping
                </h3>
                <p className="text-gray-700">
                  Faster delivery with priority handling. Available for urgent
                  orders and standard-sized items.
                </p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  White Glove Delivery
                </h3>
                <p className="text-gray-700">
                  Premium service for heavy machinery including installation and
                  setup assistance.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              4. Shipping Costs
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Shipping costs are calculated based on:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Product weight and dimensions</li>
              <li>Destination location and delivery distance</li>
              <li>Chosen shipping method and urgency</li>
              <li>Special handling requirements (fragile, hazardous, etc.)</li>
              <li>Insurance coverage and declared value</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Free shipping is available for orders over ₹50,000 within India
              (conditions apply).
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              5. Order Processing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Order processing times:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>In-stock items: 1-2 business days</li>
              <li>Made-to-order products: 5-15 business days</li>
              <li>Custom machinery: 30-90 days (varies by complexity)</li>
              <li>Special orders: Confirmed during order placement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              6. Tracking Your Order
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Once your order ships, you&apos;ll receive a tracking number via
              email. Use this to monitor your shipment&apos;s progress through
              our partner carriers&apos; websites or our order tracking system
              in your account dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              7. Delivery Requirements
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">Please ensure:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Someone is available to receive the delivery</li>
              <li>Delivery address is accurate and accessible</li>
              <li>Special equipment access for heavy machinery</li>
              <li>Proper identification is available during delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              8. International Shipping
            </h2>
            <p className="text-gray-700 leading-relaxed">
              International orders may be subject to customs duties, taxes, and
              import fees. These charges are the responsibility of the recipient
              and are not included in the product price or shipping costs.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              9. Delivery Issues
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you experience any delivery issues, damaged packages, or
              missing items, please contact us within 48 hours of delivery at
              +91 81045-43204 or through our contact page.
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
