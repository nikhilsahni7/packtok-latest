import { PageHeader } from "@/components";

import terms from "@/assets/terms.webp";




export default function TermsPage() {
  return (
    <main className="bg-white">
      <div className="w-full">
        <PageHeader
          title="Terms & Conditions"
          subtitle="Please read these terms and conditions carefully before using our services."
          image={terms}
        />

        <div className="w-[80%] mx-auto py-12 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Terms & Conditions
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Packtok.com. By accessing and using our platform, you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully before using our services.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 py-4"> By registering, browsing, or using Packtok.com, you acknowledge that you have read, understood, and agreed to these Terms & Conditions. If you do not agree, you may not use our platform.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              2. Platform Usage
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Packtok.com is an industrial marketplace that connects buyers and sellers of corrugated and packaging machinery, raw materials, and related services.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Users must be at least 18 years of age and authorized to enter into binding business contracts.</li>
              <li>You agree to use the platform only for lawful purposes and in compliance with applicable laws and regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              3. Account Registration
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Users must provide accurate company and contact details during registration</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>Any activity conducted under your account will be deemed your responsibility.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              4. Product Listings & Transactions
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>  Sellers are responsible for providing accurate descriptions, specifications, and images of their machinery or raw materials.</li>
              <li>Packtok.com does not guarantee the accuracy, quality, or legality of listings provided by sellers.</li>
              <li>Buyers must verify product details and negotiate directly with sellers before making purchases.</li>
              <li>Packtok.com acts as a facilitator and is not responsible for the outcome of transactions between users.</li>

            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              5. Payments & Pricing
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>All payments and pricing details are to be agreed upon between buyers and sellers.</li>
              <li>Packtok.com may provide payment gateway services, but it is not responsible for payment disputes, delays, or non-payment issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              6. Installation & Services
            </h2>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li> For machinery installation requests submitted through our platform, clients must provide complete details, including machine specifications, images/videos, site location, and requirements.</li>
              <li>Packtok.com only facilitates connections between customers and service providers; the responsibility for installation lies with the installer and the customer.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              7. Prohibited Activities
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Users are strictly prohibited from:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Posting false, misleading, or fraudulent listings.</li>
              <li>Uploading offensive, unlawful, or copyrighted content without permission.</li>
              <li>Misusing the platform for activities unrelated to corrugated and packaging trade.</li>

            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              8. Token Amount & Cancellations
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>In cases where a token amount is paid to confirm a deal, the token amount shall be non-refundable if the customer cancels the deal.</li>
              <li>If the cancellation is initiated from the company’s side, the company shall be liable to refund double the token amount paid by the customer.</li>
            </ul>
          </section>


          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              9. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All content, trademarks, designs, and materials on Packtok.com are the property of Packtok or its licensors. Users may not copy, distribute, or use any content without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              10. Limitation of Liability
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Packtok.com is a digital platform and does not own, manufacture, or inspect the listed machinery or raw materials.</li>
              <li>We are not liable for any loss, damage, or disputes arising from user transactions, product quality, or service delays.</li>
              <li>Users agree to transact at their own risk and responsibility.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              11. Privacy & Data Protection
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>We respect your privacy and safeguard your personal and business data.</li>
              <li>Information shared on the platform may be used to improve services, but will not be sold to third parties without consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              12. Modifications
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Packtok.com reserves the right to update or modify these Terms & Conditions at any time. Continued use of the platform after updates constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              13. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of courts in [Insert City, e.g., Delhi/NCR].
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
