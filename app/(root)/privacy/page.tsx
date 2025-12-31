export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Strava - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 mb-8 py-16 max-w-4xl">
      <h1 className="cormorant text-4xl md:text-5xl mb-8">Privacy Policy</h1>

      <div className="text-sm text-[#575657] leading-relaxed space-y-6">
        <p className="text-xs tracking-[0.15em] uppercase text-[#575657] mb-4">
          Last Updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            1. Introduction
          </h2>
          <p>
            Welcome to Strava ("we," "our," or "us"). We are committed to
            protecting your privacy and ensuring you have a positive experience
            on our website and in using our services. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you visit our astrology website.
          </p>
          <p>
            By using our service, you agree to the collection and use of
            information in accordance with this policy. If you do not agree with
            our policies and practices, please do not use our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            2. Information We Collect
          </h2>

          <h3 className="font-semibold text-base mt-4 mb-2">
            2.1 Personal Information
          </h3>
          <p>
            When you create an account or use our services, we may collect the
            following personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email address (required for account creation)</li>
            <li>Name (optional, may be collected during signup)</li>
            <li>Birth date, birth time, and birth place</li>
            <li>
              Geographic coordinates (latitude and longitude) of your birth
              location
            </li>
            <li>Timezone information</li>
          </ul>

          <h3 className="font-semibold text-base mt-4 mb-2">
            2.2 Automatically Collected Information
          </h3>
          <p>
            When you access our website, we may automatically collect certain
            information about your device, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages you visit and time spent on pages</li>
            <li>Referring website addresses</li>
          </ul>

          <h3 className="font-semibold text-base mt-4 mb-2">
            2.3 AI-Generated Content
          </h3>
          <p>
            We cache AI-generated astrological insights and predictions
            associated with your account to improve performance and provide
            consistent experiences. This cached content is linked to your user
            account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            3. How We Use Your Information
          </h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide, maintain, and improve our astrology services</li>
            <li>
              To generate accurate birth charts and astrological predictions
              using NASA data
            </li>
            <li>
              To create and deliver personalized astrological insights using AI
              technology
            </li>
            <li>To authenticate your identity and manage your account</li>
            <li>
              To communicate with you about your account, our services, or
              updates to our policies
            </li>
            <li>To analyze usage patterns and improve user experience</li>
            <li>
              To detect, prevent, and address technical issues or security
              threats
            </li>
            <li>To comply with legal obligations and protect our rights</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            4. Data Storage and Security
          </h2>
          <p>
            We use industry-standard security measures to protect your personal
            information. Your data is stored securely using:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encrypted database connections (PostgreSQL)</li>
            <li>Secure authentication through Supabase</li>
            <li>Regular security updates and monitoring</li>
          </ul>
          <p>
            However, no method of transmission over the Internet or electronic
            storage is 100% secure. While we strive to use commercially
            acceptable means to protect your personal information, we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            5. Third-Party Services
          </h2>
          <p>
            We use the following third-party services that may collect or
            process your information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Supabase:</strong> For user authentication and account
              management
            </li>
            <li>
              <strong>Google Gemini AI:</strong> For generating astrological
              insights and predictions
            </li>
            <li>
              <strong>NASA Data:</strong> For accurate astronomical calculations
            </li>
          </ul>
          <p>
            These third-party services have their own privacy policies governing
            the collection and use of your information. We encourage you to
            review their privacy policies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            6. Data Sharing and Disclosure
          </h2>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information only in the following
            circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With your explicit consent</li>
            <li>
              To comply with legal obligations, court orders, or government
              requests
            </li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>
              In connection with a business transfer, merger, or acquisition
            </li>
            <li>
              With service providers who assist us in operating our website and
              conducting our business, subject to confidentiality agreements
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            7. Your Rights and Choices
          </h2>
          <p>
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Access:</strong> You can request access to the personal
              information we hold about you
            </li>
            <li>
              <strong>Correction:</strong> You can update or correct your
              personal information through your account settings
            </li>
            <li>
              <strong>Deletion:</strong> You can request deletion of your
              account and associated data
            </li>
            <li>
              <strong>Opt-out:</strong> You can opt-out of certain
              communications from us
            </li>
          </ul>
          <p>
            To exercise these rights, please contact us at{" "}
            <a href="mailto:shrit1401@gmail.com" className="underline">
              shrit1401@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            8. Cookies and Tracking Technologies
          </h2>
          <p>
            We may use cookies and similar tracking technologies to track
            activity on our website and store certain information. You can
            instruct your browser to refuse all cookies or to indicate when a
            cookie is being sent. However, if you do not accept cookies, you may
            not be able to use some portions of our service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            9. Children's Privacy
          </h2>
          <p>
            Our service is not intended for children under the age of 13. We do
            not knowingly collect personal information from children under 13.
            If you are a parent or guardian and believe your child has provided
            us with personal information, please contact us immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            10. International Data Transfers
          </h2>
          <p>
            Your information may be transferred to and maintained on computers
            located outside of your state, province, country, or other
            governmental jurisdiction where data protection laws may differ from
            those in your jurisdiction.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            11. Changes to This Privacy Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            12. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
          <p>
            <strong>Shrit Shrivastava</strong>
            <br />
            Email:{" "}
            <a href="mailto:shrit1401@gmail.com" className="underline">
              shrit1401@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
