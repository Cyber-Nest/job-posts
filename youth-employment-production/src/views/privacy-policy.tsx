import { Helmet } from "@dr.pogodin/react-helmet";

export default function PrivacyPolicyPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>Privacy Policy — Youth Employment Canada</title>
        <meta
          name="description"
          content="Youth Employment Canada Privacy Policy explains how employer and visitor information is collected, used, shared, and protected on our job posting platform."
        />
      </Helmet>

      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-blue-100 rounded-[2rem] p-10 shadow-sm">
            <h1
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Privacy Policy
            </h1>
            <p className="text-gray-500 leading-relaxed text-lg">
              Last updated: {year}
            </p>
            <p className="text-gray-700 leading-relaxed mt-6">
              Youth Employment Canada respects your privacy. This Privacy Policy
              explains how we collect, use, store, and protect information when
              employers, job seekers, and visitors use our website.
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
              Information We Collect
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Information from Employers
                </h3>
                <p>
                  Employers who register or post jobs on Youth Employment Canada
                  provide information needed to create and manage an account and
                  publish job listings.
                </p>
                <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
                  <li>Name</li>
                  <li>Business or company name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Province or location</li>
                  <li>Login credentials</li>
                  <li>Job posting information</li>
                  <li>
                    How-to-apply details provided by the employer, such as
                    application email, phone number, mailing address, and
                    in-person application details
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Information from Job Seekers and Visitors
                </h3>
                <p>
                  Job seekers can browse jobs on Youth Employment Canada without
                  creating an account. We do not collect job applications,
                  resumes, or cover letters through the website.
                </p>
                <p className="mt-3">
                  If a visitor contacts us through the contact form, we may
                  collect their name, email address, inquiry type, and message
                  in order to respond.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Automatically Collected Information
                </h3>
                <p>
                  We may also collect information automatically when visitors
                  use the site, including IP address, browser or device
                  information, pages visited, cookies or session data, and basic
                  analytics or security logs.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              How We Use Information
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>
                We use information to operate the website and deliver services
                to employers, job seekers, and visitors.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Create and manage employer accounts.</li>
                <li>Allow employers to post and manage job listings.</li>
                <li>Display job postings to job seekers.</li>
                <li>Show employer-provided application instructions.</li>
                <li>Respond to contact inquiries.</li>
                <li>Improve website functionality and security.</li>
                <li>Prevent fraud, misuse, or unauthorized access.</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Job Applications
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              Youth Employment Canada does not collect or manage job
              applications. Job seekers apply directly using the method provided
              by the employer. Employers are responsible for handling
              applications they receive outside our website.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed text-sm">
              Youth Employment Canada is not responsible for employer hiring
              decisions or communications that occur outside the platform.
            </p>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Sharing of Information
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm">
              <p>
                We do not sell personal information. We may share information
                only when necessary:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>With service providers who help operate the website.</li>
                <li>If required by law.</li>
                <li>To protect rights, safety, or prevent fraud.</li>
                <li>
                  When employers choose to publish information in job postings,
                  that information may be visible publicly.
                </li>
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
            <p className="text-gray-700 leading-relaxed text-sm">
              Some employer-provided details may be publicly visible in job
              postings, including company name, job title, location or province,
              salary information if provided, job description, requirements,
              how-to-apply instructions, and employer contact methods selected
              for the posting.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Cookies and Sessions
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                The website may use cookies and session storage to keep
                employers logged in, improve security, remember basic
                preferences, and support website functionality.
              </p>
            </div>

            <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                We use reasonable technical and administrative safeguards to
                protect information, but no online system can be guaranteed 100%
                secure.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                We retain information as long as necessary to provide the
                platform, maintain employer accounts and job postings, respond
                to inquiries, comply with legal obligations, and improve
                security and prevent misuse.
              </p>
            </div>

            <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                User Choices and Access
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                Employers may request to update or delete account information by
                contacting us. Visitors may contact us for privacy-related
                questions at the address below.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Children and Youth
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              Youth Employment Canada is designed to support youth employment
              opportunities, but users should follow applicable laws and
              employer requirements. We do not knowingly collect personal
              information from children under the age required by applicable law
              without appropriate consent.
            </p>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              Job postings may include employer contact methods or external
              application instructions. We are not responsible for the privacy
              practices of third-party websites, employers, or external
              communication channels.
            </p>
          </div>

          <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              We may update this Privacy Policy from time to time. Updates will
              be posted on this page with a revised date.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-sm">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Contact Us
            </h2>
            <p className="text-sm leading-relaxed mb-2 text-blue-100">
              Youth Employment Canada
            </p>
            <p className="text-sm leading-relaxed mb-2 text-blue-100">
              Email:{" "}
              <a
                href="mailto:info.youthemployment@cyber-nest.ca"
                className="text-white hover:underline"
              >
                info.youthemployment@cyber-nest.ca
              </a>
            </p>
            <p className="text-sm leading-relaxed text-blue-100">
              Service Area: Canada-wide
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
