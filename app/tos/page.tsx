export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Strava - Read our terms and conditions for using our astrology services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <h1 className="cormorant text-4xl md:text-5xl mb-8">Terms of Service</h1>

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
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using Strava ("the Service"), you accept and agree
            to be bound by the terms and provision of this agreement. If you do
            not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            2. Description of Service
          </h2>
          <p>
            Strava is an astrology website that provides birth chart readings,
            natal chart analysis, and astrological predictions. Our service uses
            NASA data for astronomical calculations and AI technology to
            generate personalized astrological insights.
          </p>
          <p>
            The Service is provided for entertainment and informational purposes
            only. Astrological predictions and insights are not intended to be
            used as the sole basis for making important life decisions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            3. User Accounts
          </h2>
          <h3 className="font-semibold text-base mt-4 mb-2">
            3.1 Account Creation
          </h3>
          <p>
            To use certain features of our Service, you must create an account.
            When creating an account, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and account</li>
            <li>
              Accept responsibility for all activities that occur under your
              account
            </li>
            <li>
              Notify us immediately of any unauthorized use of your account
            </li>
          </ul>

          <h3 className="font-semibold text-base mt-4 mb-2">
            3.2 Account Requirements
          </h3>
          <p>
            You must be at least 13 years old to create an account. By creating
            an account, you represent and warrant that you meet this age
            requirement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            4. Acceptable Use
          </h2>
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Transmit any harmful, offensive, or inappropriate content</li>
            <li>
              Attempt to gain unauthorized access to the Service or related
              systems
            </li>
            <li>
              Interfere with or disrupt the Service or servers connected to the
              Service
            </li>
            <li>
              Use automated systems (bots, scrapers) to access the Service
              without permission
            </li>
            <li>
              Reproduce, duplicate, copy, sell, or exploit any portion of the
              Service without express written permission
            </li>
            <li>
              Impersonate any person or entity or misrepresent your affiliation
              with any person or entity
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            5. Intellectual Property
          </h2>
          <p>
            The Service and its original content, features, and functionality
            are owned by Shrit Shrivastava and are protected by international
            copyright, trademark, patent, trade secret, and other intellectual
            property laws.
          </p>
          <p>
            You may not modify, reproduce, distribute, create derivative works,
            publicly display, or commercially exploit any content from the
            Service without our prior written permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            6. Disclaimers
          </h2>
          <h3 className="font-semibold text-base mt-4 mb-2">
            6.1 Astrological Content
          </h3>
          <p>
            The astrological predictions, insights, and information provided by
            the Service are for entertainment and informational purposes only.
            They should not be considered as professional advice, including but
            not limited to medical, financial, legal, or relationship advice.
          </p>

          <h3 className="font-semibold text-base mt-4 mb-2">
            6.2 Service Availability
          </h3>
          <p>
            We strive to provide continuous access to the Service, but we do not
            guarantee that the Service will be available at all times. The
            Service may be unavailable due to maintenance, updates, technical
            issues, or other reasons beyond our control.
          </p>

          <h3 className="font-semibold text-base mt-4 mb-2">
            6.3 Accuracy of Information
          </h3>
          <p>
            While we use NASA data and professional astrological methods, we do
            not warrant the accuracy, completeness, or usefulness of any
            information on the Service. You rely on any information at your own
            risk.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            7. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, in no event shall Shrit
            Shrivastava, Strava, or its affiliates be liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss
            of profits or revenues, whether incurred directly or indirectly, or
            any loss of data, use, goodwill, or other intangible losses
            resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your use or inability to use the Service</li>
            <li>Any conduct or content of third parties on the Service</li>
            <li>
              Any unauthorized access to or use of our servers and/or any
              personal information stored therein
            </li>
            <li>
              Any interruption or cessation of transmission to or from the
              Service
            </li>
            <li>
              Any bugs, viruses, trojan horses, or the like that may be
              transmitted to or through the Service
            </li>
            <li>
              Any decisions made based on astrological content provided by the
              Service
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            8. Indemnification
          </h2>
          <p>
            You agree to defend, indemnify, and hold harmless Shrit Shrivastava,
            Strava, and its affiliates from and against any claims, damages,
            obligations, losses, liabilities, costs, or debt, and expenses
            (including attorney's fees) arising from:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your use of and access to the Service</li>
            <li>Your violation of any term of these Terms of Service</li>
            <li>
              Your violation of any third-party right, including without
              limitation any copyright, property, or privacy right
            </li>
            <li>
              Any claim that your use of the Service caused damage to a third
              party
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            9. Termination
          </h2>
          <p>
            We may terminate or suspend your account and access to the Service
            immediately, without prior notice or liability, for any reason,
            including if you breach the Terms of Service.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately
            cease. If you wish to terminate your account, you may simply
            discontinue using the Service or contact us to request account
            deletion.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            10. Governing Law
          </h2>
          <p>
            These Terms of Service shall be governed by and construed in
            accordance with applicable laws, without regard to its conflict of
            law provisions. Any disputes arising under or in connection with
            these Terms shall be subject to the exclusive jurisdiction of the
            courts in the applicable jurisdiction.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            11. Changes to Terms
          </h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms of Service at any time. If a revision is material, we
            will try to provide at least 30 days notice prior to any new terms
            taking effect.
          </p>
          <p>
            What constitutes a material change will be determined at our sole
            discretion. By continuing to access or use our Service after any
            revisions become effective, you agree to be bound by the revised
            terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            12. Severability
          </h2>
          <p>
            If any provision of these Terms of Service is held to be invalid or
            unenforceable by a court, the remaining provisions of these Terms
            will remain in effect.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            13. Entire Agreement
          </h2>
          <p>
            These Terms of Service, together with our Privacy Policy, constitute
            the entire agreement between you and Strava regarding the use of the
            Service and supersede all prior agreements and understandings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="cormorant text-2xl md:text-3xl mt-8 mb-4">
            14. Contact Information
          </h2>
          <p>
            If you have any questions about these Terms of Service, please
            contact us:
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
