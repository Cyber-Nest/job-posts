import { Helmet } from "@dr.pogodin/react-helmet";

export default function TermsOfUsePage() {
  const year = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>Terms of Use — Youth Employment Canada</title>
        <meta
          name="description"
          content="Youth Employment Canada Terms of Use explain the rules for employers, job seekers, and visitors using the job posting and browsing platform."
        />
      </Helmet>

      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-blue-100 rounded-[2rem] p-10 shadow-sm">
            <h1
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Terms of Use
            </h1>
            <p className="text-gray-500 leading-relaxed text-lg mb-6">
              Last updated: {year}
            </p>
            <p className="text-gray-700 leading-relaxed text-base">
              Welcome to Youth Employment Canada. By accessing or using our
              website, employer account features, job posting tools, or job
              browsing pages, you agree to these Terms of Use. If you do not
              agree, please do not use the website.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Definitions
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <p>
                <strong>Platform</strong> means the Youth Employment Canada
                website and related services.
              </p>
              <p>
                <strong>User</strong> means any visitor, employer, job seeker,
                or person accessing the platform.
              </p>
              <p>
                <strong>Employer</strong> means a business, organization, or
                person posting job opportunities.
              </p>
              <p>
                <strong>Job seeker</strong> means any person browsing jobs or
                using employer-provided application instructions.
              </p>
              <p>
                <strong>Job posting</strong> means information submitted by an
                employer about an employment opportunity.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Purpose of the Platform
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>
                Youth Employment Canada helps connect young Canadians and
                youth-focused employers across Canada.
              </p>
              <p>
                The platform allows employers to post job opportunities and
                allows job seekers to browse jobs and view how-to-apply
                instructions.
              </p>
              <p>
                The platform does not guarantee employment, hiring, interviews,
                applications, or employer responses.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Eligibility
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  For Employers
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>
                    Employers must provide accurate business and contact
                    information.
                  </li>
                  <li>
                    Employers must post genuine, lawful job opportunities.
                  </li>
                  <li>
                    Employers must comply with applicable Canadian employment,
                    labour, human rights, privacy, and workplace laws.
                  </li>
                  <li>
                    Employers are responsible for the accuracy of their job
                    postings and how-to-apply details.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  For Job Seekers
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>
                    Job seekers may browse jobs without creating an account.
                  </li>
                  <li>
                    Job seekers are responsible for contacting employers
                    directly using the application method listed.
                  </li>
                  <li>
                    Job seekers should use their own judgment before sharing
                    personal information with employers.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Employer Accounts
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>
                Employers are responsible for keeping login credentials secure.
              </p>
              <p>
                Employers must not share account access with unauthorized users.
              </p>
              <p>
                Youth Employment Canada may suspend or restrict accounts for
                misuse, suspicious activity, false information, or violation of
                these terms.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Job Posting Rules
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>Employers must not post jobs that are:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>false, misleading, fraudulent, or expired</li>
                <li>discriminatory or unlawful</li>
                <li>exploitative or unsafe</li>
                <li>unrelated to genuine employment</li>
                <li>requesting illegal fees from job seekers</li>
                <li>containing offensive, abusive, or harmful content</li>
                <li>violating Canadian labour or human rights laws</li>
              </ul>
              <p className="mt-4">
                Youth Employment Canada may edit, remove, suspend, or refuse job
                postings that violate these terms or appear suspicious.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Application Process
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>
                Youth Employment Canada does not collect or manage job
                applications.
              </p>
              <p>
                Job seekers apply directly using the method provided by the
                employer, such as email, phone, mail, or in-person instructions.
              </p>
              <p>
                Employers are fully responsible for receiving, reviewing,
                responding to, and managing applications outside the website.
              </p>
              <p>
                Youth Employment Canada is not responsible for employer
                communications, interviews, hiring decisions, or workplace
                outcomes.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Acceptable Use
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>Users agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>misuse the platform</li>
                <li>attempt unauthorized access</li>
                <li>interfere with website security</li>
                <li>scrape, copy, or harvest data without permission</li>
                <li>submit false or misleading information</li>
                <li>impersonate another person or organization</li>
                <li>upload or submit harmful code</li>
                <li>use the platform for spam, scams, or unlawful activity</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Public Job Posting Information
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>
                Information employers submit in job postings may be publicly
                visible, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>company name</li>
                <li>job title</li>
                <li>location or province</li>
                <li>salary or pay information if provided</li>
                <li>job criteria</li>
                <li>job description</li>
                <li>requirements</li>
                <li>how-to-apply instructions</li>
                <li>employer-selected contact methods</li>
              </ul>
              <p className="mt-4">
                Employers should not include private or sensitive information in
                public job postings unless they want it visible.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Fees, Packages, and Payments
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>Payment integration is not active yet.</p>
              <p>
                Pricing plans and packages may be displayed for informational or
                future use.
              </p>
              <p>Payment functionality may be added later.</p>
              <p>
                Until payment is activated, employers may contact Youth
                Employment Canada for package or posting support.
              </p>
              <p>
                Future paid services may be subject to additional payment and
                refund terms.
              </p>
              <p>
                Youth Employment Canada may update pricing, package features, or
                posting limits at any time.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Refund Policy
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              At this stage, online payments are not processed through the
              website. If paid services are introduced later, refund terms will
              be posted or provided at the time of purchase. Refunds, if
              applicable, will depend on the service purchased, whether the
              service was delivered, and applicable law.
            </p>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              Use of the platform is also governed by our{" "}
              <a
                href="/privacy-policy"
                className="text-blue-600 hover:underline font-medium"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Intellectual Property
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>
                Website design, content, branding, software, and platform
                materials belong to Youth Employment Canada or its licensors.
              </p>
              <p>
                Users may not copy, reproduce, modify, distribute, or exploit
                platform content without permission.
              </p>
              <p>
                Employers retain responsibility for the content they submit, but
                grant Youth Employment Canada permission to display job postings
                on the platform.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Third-Party Links and External Communication
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              The website may display employer contact details, external
              application instructions, or third-party links. Youth Employment
              Canada is not responsible for third-party websites, employer email
              systems, phone communications, mail delivery, interviews, or
              external application processes.
            </p>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No Employment Guarantee
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>
                Youth Employment Canada does not guarantee job availability,
                interview invitations, hiring outcomes, employer responses, job
                suitability, or the accuracy of employer statements beyond what
                employers provide.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Disclaimer
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              The platform is provided on an "as available" basis. We try to
              keep information accurate and the platform available, but we do
              not guarantee uninterrupted access, error-free operation, or that
              every job posting will be accurate or current.
            </p>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              To the fullest extent permitted by law, Youth Employment Canada is
              not liable for indirect, incidental, consequential, or other
              losses related to use of the platform, employer or job seeker
              interactions, external applications, or third-party
              communications.
            </p>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Indemnification
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              Users agree to hold Youth Employment Canada harmless from claims,
              losses, damages, or expenses arising from their misuse of the
              platform, violation of these terms, or content they submit.
            </p>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Suspension or Termination
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>
                Youth Employment Canada may suspend or terminate access if a
                user:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>violates the Terms</li>
                <li>posts false, harmful, or unlawful content</li>
                <li>misuses the platform</li>
                <li>creates security or fraud concerns</li>
                <li>engages in abusive conduct</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              We may update these Terms of Use from time to time. Updates will
              be posted on this page. Continued use of the platform after
              changes means users accept the updated terms.
            </p>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              These Terms of Use are governed by the laws of Canada and the
              applicable laws of the province or territory where Youth
              Employment Canada operates, without regard to conflict of law
              rules.
            </p>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              Youth Employment Canada
              <br />
              Email:{" "}
              <a
                href="mailto:info.youthemployment@cyber-nest.ca"
                className="text-blue-600 hover:underline font-medium"
              >
                info.youthemployment@cyber-nest.ca
              </a>
              <br />
              Service Area: Canada-wide
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed text-sm">
              By using Youth Employment Canada, you agree to these Terms of Use.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
