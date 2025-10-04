import { PageHeader } from "@/components";


import Privacy from "@/assets/Privacy.webp";


export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <div className="w-full mx-auto">
        <PageHeader
          title="Privacy Policy"
          subtitle="Your privacy is important to us. Learn how we collect, use, and protect your information."
          image={Privacy}
        />

        <div className="w-[80%] mx-auto py-12 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At Packtok.com, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal and business information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 py-4">When you use Packtok.com, we may collect the following information:</p>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Company Details: Name, address, registration details.</li>
              <li>Contact Information: Name, email, phone number.</li>
              <li>Business Activity: Product listings, purchase/sale preferences, service requests.</li>
              <li> Media Files: Images, videos, and documents uploaded by users. </li>
              <li>Usage Data: Log files, browser type, IP address, and platform activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The information we collect is used to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Facilitate buying, selling, and installation services for corrugated & packaging machinery and raw materials.</li>
              <li>Provide a secure and smooth user experience.</li>
              <li>Communicate updates, offers, and important platform information.</li>
              <li>Improve platform features, usability, and customer support.</li>
              <li>Ensure compliance with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              3.  Sharing of Information
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Packtok.com does not sell or rent your personal or business information to third parties.</li>
              <li>Information may be shared with trusted service providers or partners who assist in payment processing, logistics, or installation services.</li>
              <li>We may disclose information if required by law, regulation, or legal process.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              4. Data Security
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>We use industry-standard measures to safeguard your data against unauthorized access, misuse, or disclosure.</li>
              <li>While we strive to protect your data, no online platform can guarantee 100% security. Users share information at their own risk.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              5. Cookies & Tracking
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Our platform may use cookies to enhance user experience, store preferences, and analyze site performance.</li>
              <li>Users can choose to disable cookies in their browser settings, though some features may not function properly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              6.  User Responsibilities
            </h2>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li> Users are responsible for maintaining the confidentiality of their account details.</li>
              <li>Please ensure the information you provide is accurate, updated, and lawful.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              7. Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Packtok.com may contain links to third-party websites. We are not responsible for the privacy practices or content of such external sites.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              8. Children&apos;s Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are designed for businesses and professionals. We do not knowingly collect information from individuals under 18 years of age.
            </p>
          </section>


          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              9. Policy Updates
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page, and continued use of the platform constitutes acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              10. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy, please contact us at:
              <a href="mailto:support@packtok.com" className="font-bold"> support@packtok.com</a>
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
