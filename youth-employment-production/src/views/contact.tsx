import { useState } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function OrganicShape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.15"
      />
      <circle
        cx="200"
        cy="200"
        r="130"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.12"
      />
      <circle
        cx="200"
        cy="200"
        r="80"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.1"
      />
      <circle cx="200" cy="200" r="30" fill="currentColor" opacity="0.08" />
    </svg>
  );
}

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async (e: React.MouseEvent) => {
    e.preventDefault();

    setFormError("");
    setFormSuccess("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !inquiryType.trim() ||
      !message.trim()
    ) {
      setFormError("Please complete all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          inquiryType,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setFormSuccess(
        "Your message has been sent successfully. We'll get back to you soon.",
      );
      toast.success("Message sent! We'll get back to you soon.");

      setFirstName("");
      setLastName("");
      setEmail("");
      setInquiryType("");
      setMessage("");
    } catch (error: any) {
      const msg = error.message || "Failed to send message";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Contact Youth Employment Canada — Canada's Youth Employment Network
        </title>
        <meta
          name="description"
          content="Get in touch with the Youth Employment Canada team. We're here to help job seekers and employers connect across Canada."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24 relative overflow-hidden">
        <OrganicShape className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] text-blue-600 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.p
              variants={fadeUp}
              className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Get in Touch
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              We're Here to Help
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed"
            >
              Have a question about posting a job, creating a profile, or our
              packages? Our team is ready to assist you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <h2
                className="text-2xl font-bold text-gray-900 mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Contact Information
              </h2>
              <div className="flex flex-col gap-6 mb-10">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "info.youthemployment@cyber-nest.ca",
                    href: "mailto:info.youthemployment@cyber-nest.ca",
                  },
                  {
                    icon: MapPin,
                    label: "Service Area",
                    value: "Canada-Wide",
                    href: null,
                  },
                  {
                    icon: Clock,
                    label: "Support Hours",
                    value: "Monday – Friday, 9am – 5pm MT",
                    href: null,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <item.icon size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-7 text-white relative overflow-hidden">
                <OrganicShape className="absolute -right-10 -bottom-10 w-48 h-48 text-white/10 pointer-events-none" />
                <div className="relative z-10">
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Employer Inquiries
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed mb-4">
                    Interested in posting jobs or learning about our packages?
                    We'd love to connect and help you find the right solution.
                  </p>
                  <a
                    href="mailto:employers.youth@cyber-nest.ca"
                    className="text-white font-semibold text-sm hover:underline"
                  >
                    employers.youth@cyber-nest.ca
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-blue-50 rounded-3xl p-8 lg:p-10 border border-blue-200">
                <h2
                  className="text-2xl font-bold text-gray-900 mb-7"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Send Us a Message
                </h2>

                {/* Success Message */}
                {formSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <CheckCircle
                      size={18}
                      className="text-green-600 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-green-700">{formSuccess}</p>
                  </div>
                )}

                {/* Error Message */}
                {formError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle
                      size={18}
                      className="text-red-600 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-red-700">{formError}</p>
                  </div>
                )}

                <form className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="firstName"
                        className="text-gray-700 font-medium text-sm"
                      >
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Your first name"
                        className="bg-white border-blue-200 focus-visible:ring-blue-300"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="lastName"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Your last name"
                        className="bg-white border-blue-200 focus-visible:ring-blue-300"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium text-sm"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-white border-blue-200 focus-visible:ring-blue-300"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="inquiryType"
                      className="text-gray-700 font-medium text-sm"
                    >
                      I am a... <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="inquiryType"
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="">Select one</option>
                      <option value="Job Seeker">Job Seeker</option>
                      <option value="Employer">Employer</option>
                      <option value="Youth Organization">
                        Youth Organization
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="message"
                      className="text-gray-700 font-medium text-sm"
                    >
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={isLoading}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Sending Message...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Message <Send size={16} />
                      </span>
                    )}
                  </Button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Your inquiry will be sent securely to our support team.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
