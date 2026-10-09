"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      if (!formData.subject) {
        newErrors.subject = "Please select an option";
      }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
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
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          subject: formData.subject,
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      toast.success(
        "Your message has been sent successfully. We'll get back to you soon.",
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });

      setErrors({});
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-[#FAF5EE] py-16 lg:py-24 relative overflow-hidden">
        <OrganicShape className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] text-[#C8782A] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.p
              variants={fadeUp}
              className="text-[#C8782A] font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Get in Touch
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl lg:text-6xl font-bold text-[#1C1C1C] mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              We're Here to Help
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-[#6B3A2A]/70 text-lg max-w-xl mx-auto leading-relaxed"
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
                className="text-2xl font-bold text-[#1C1C1C] mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Contact Information
              </h2>
              <div className="flex flex-col gap-6 mb-10">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "info.aboriginal@cyber-nest.ca",
                    href: "mailto:info.aboriginal@cyber-nest.ca",
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
                    <div className="w-10 h-10 rounded-xl bg-[#C8782A]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon size={18} className="text-[#C8782A]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#6B3A2A]/50 uppercase tracking-wider mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-[#1C1C1C] font-medium hover:text-[#C8782A] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[#1C1C1C] font-medium">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#6B3A2A] rounded-2xl p-7 text-[#FAF5EE] relative overflow-hidden">
                <OrganicShape className="absolute -right-10 -bottom-10 w-48 h-48 text-[#C8782A] pointer-events-none" />
                <div className="relative z-10">
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Employer Inquiries
                  </h3>
                  <p className="text-[#FAF5EE]/70 text-sm leading-relaxed mb-4">
                    Interested in posting jobs or learning about our packages?
                    We'd love to connect and help you find the right solution.
                  </p>
                  <a
                    href="mailto:employer.aboriginal@cyber-nest.ca"
                    className="text-[#C8782A] font-semibold text-sm hover:underline"
                  >
                    employer.aboriginal@cyber-nest.ca{" "}
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
              <div className="bg-[#FAF5EE] rounded-3xl p-8 lg:p-10 border border-[#C8782A]/10">
                <h2
                  className="text-2xl font-bold text-[#1C1C1C] mb-7"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="firstName"
                        className="text-[#6B3A2A] font-medium text-sm"
                      >
                        First Name <span className="text-[#C8782A]">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Your first name"
                        className={`bg-white border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30 ${
                          errors.firstName ? "border-red-500" : ""
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="lastName"
                        className="text-[#6B3A2A] font-medium text-sm"
                      >
                        Last Name <span className="text-[#C8782A]">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Your last name"
                        className={`bg-white border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30 ${
                          errors.lastName ? "border-red-500" : ""
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="email"
                      className="text-[#6B3A2A] font-medium text-sm"
                    >
                      Email Address <span className="text-[#C8782A]">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`bg-white border-[#C8782A]/20 focus-visible:ring-[#C8782A]/30 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="subject"
                      className="text-[#6B3A2A] font-medium text-sm"
                    >
                      I am a... <span className="text-[#C8782A]">*</span>
                    </Label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30 ${
                        errors.subject ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select one</option>
                      <option value="jobseeker">Job Seeker</option>
                      <option value="employer">Employer</option>
                      <option value="organization">
                        Indigenous Organization
                      </option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="text-xs text-red-500">{errors.subject}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="message"
                      className="text-[#6B3A2A] font-medium text-sm"
                    >
                      Message <span className="text-[#C8782A]">*</span>
                    </Label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className={`w-full rounded-md border border-[#C8782A]/20 bg-white px-3 py-2 text-sm text-[#1C1C1C] placeholder:text-[#1C1C1C]/40 focus:outline-none focus:ring-2 focus:ring-[#C8782A]/30 resize-none ${
                        errors.message ? "border-red-500" : ""
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500">{errors.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={
                      isLoading ||
                      !formData.firstName.trim() ||
                      !formData.lastName.trim() ||
                      !formData.email.trim() ||
                      !formData.subject ||
                      !formData.message.trim()
                    }
                    className="bg-[#C8782A] hover:bg-[#B06820] text-white font-semibold w-full disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message <Send size={16} className="ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
