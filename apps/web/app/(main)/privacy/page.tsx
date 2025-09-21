import { PageHeader } from "@/components";

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <div className="w-full mx-auto">
        <PageHeader
          title="Privacy Policy"
          subtitle="Your privacy is important to us. Learn how we collect, use, and protect your information."
          image="/footer-logo1.png"
        />

        <div className="w-[80%] mx-auto py-12 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information you provide directly to us, such as when
              you create an account, make a purchase, or contact us for support.
              This may include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Name, email address, and contact information</li>
              <li>Payment information and billing details</li>
              <li>Company information and business requirements</li>
              <li>Service requests and project specifications</li>
              <li>Communication preferences and feedback</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Communicate with you about products, services, and events</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy. We may share your information with
              trusted partners who assist us in operating our platform,
              conducting business, or serving our customers.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              4. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to track activity
              on our platform and hold certain information. You can instruct
              your browser to refuse all cookies or to indicate when a cookie is
              being sent.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              6. Your Rights and Choices
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You have the right to access, update, or delete your personal
              information. You may also opt out of receiving promotional
              communications from us by following the instructions in those
              communications.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              7. Children&apos;s Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for individuals under the age of 18.
              We do not knowingly collect personal information from children
              under 18.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              8. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              9. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us at +91 81045-43204 or through our contact page.
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
