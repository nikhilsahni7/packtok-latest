import { PageHeader } from "@/components";

export default function TermsPage() {
  return (
    <main className="bg-white">
      <div className="w-full">
        <PageHeader
          title="Terms & Conditions"
          subtitle="Please read these terms and conditions carefully before using our services."
          image="/footer-logo1.png"
        />

        <div className="w-[80%] mx-auto py-12 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to PackTok. These Terms and Conditions (&quot;Terms&quot;)
              govern your use of our website and services. By accessing or using
              our platform, you agree to be bound by these Terms. If you
              disagree with any part of these terms, then you may not access the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              2. Services Overview
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PackTok provides a comprehensive platform for packaging industry
              solutions, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Marketplace for packaging machinery and equipment</li>
              <li>Turnkey project management services</li>
              <li>Maintenance and consultancy services</li>
              <li>Investment and acquisition facilitation</li>
              <li>Job placement and manpower hiring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              3. User Responsibilities
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Users are responsible for maintaining the confidentiality of their
              account information and for all activities that occur under their
              account. You agree to provide accurate, current, and complete
              information during the registration process and to update such
              information to keep it accurate, current, and complete.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              4. Platform Usage
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You may not use our platform for any unlawful purpose or to
              solicit others to perform unlawful acts. You are prohibited from
              posting or transmitting any unlawful, threatening, defamatory,
              obscene, scandalous, inflammatory, pornographic, or profane
              material or any material that could constitute or encourage
              conduct that would be considered a criminal offense.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              5. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The PackTok platform and its original content, features, and
              functionality are and will remain the exclusive property of
              PackTok and its licensors. The platform is protected by copyright,
              trademark, and other laws.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall PackTok, nor its directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect,
              incidental, special, consequential, or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              7. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days notice prior to any new terms taking
              effect.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              8. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms & Conditions, please
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
