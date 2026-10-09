"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  Sparkles,
  MessageSquare,
  Building2,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject) {
      newErrors.subject = "Please select an inquiry type";
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
      toast.error("Please fill in all required fields correctly.");
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
        "Your message has been sent successfully. Our team will get back to you soon!",
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
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-900 pb-20">
      {/* Light Hero Section (Left Aligned & Fresh Theme) */}
      <section className="relative bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 border-b border-slate-200/60 py-12 lg:py-16 overflow-hidden">
        {/* Subtle Light Accent */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#059669]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl text-left"
          >
            {/* Premium Top Hero Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-emerald-50/80 border border-emerald-200/80 shadow-xs mb-4"
            >
              <span className="bg-[#059669] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                Support
              </span>
              <span className="text-xs font-semibold text-slate-700 leading-none">
                We're Here to Help You
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3"
            >
              Get in Touch with{" "}
              <span className="text-[#059669]">GetJobsCanada</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-slate-600 text-base sm:text-lg leading-relaxed"
            >
              Have a question about posting a job, managing your employer
              account, or exploring packages? Our Canadian support team is ready
              to assist you.
            </motion.p>
          </motion.div>

          {/* Quick Contact Cards (Light Theme, Left Aligned) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#059669]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-4">
                <Mail size={20} />
              </div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                General Inquiries
              </h3>
              <a
                href="mailto:inquiries@getjobscanada.ca"
                className="text-base font-bold text-slate-900 hover:text-[#059669] transition-colors mt-1 block truncate"
              >
                inquiries@getjobscanada.ca
              </a>
              <p className="text-xs text-slate-500 mt-1.5">
                Average response time: under 24 hours
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#059669]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-4">
                <Building2 size={20} />
              </div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Employer Support
              </h3>
              <a
                href="mailto:employersupport@getjobscanada.ca"
                className="text-base font-bold text-slate-900 hover:text-[#059669] transition-colors mt-1 block truncate"
              >
                employersupport@getjobscanada.ca
              </a>
              <p className="text-xs text-slate-500 mt-1.5">
                Dedicated support for recruiters
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#059669]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-4">
                <Clock size={20} />
              </div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Support Hours
              </h3>
              <p className="text-base font-bold text-slate-900 mt-1">
                Mon – Fri: 9:00 AM – 5:00 PM EST
              </p>
              <p className="text-xs text-slate-500 mt-1.5">
                Nationwide Coverage Across Canada
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Form & Content Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Info Panel (4 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-4 bg-[#059669] text-white rounded-3xl p-6 lg:p-7 shadow-lg flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Premium Green Card Badge */}
              <div className="inline-flex items-center gap-2.5 p-1 pr-4 rounded-full bg-white/15 border border-white/20 shadow-xs mb-4 text-white">
                <span className="bg-emerald-300 text-emerald-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                  Assistance
                </span>
                <span className="text-xs font-semibold text-white leading-none">
                  Fast & Reliable Help
                </span>
              </div>

              <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight mb-2">
                Why reach out to GetJobsCanada?
              </h2>
              <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed mb-5">
                Whether you are a job seeker looking for career guidance or an
                employer seeking top Canadian talent, we are here to ensure your
                journey is smooth and successful.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  "Quick resolution for employer posting questions",
                  "Guidance on choosing the right job package",
                  "Technical assistance for candidate accounts",
                  "Dedicated support team across Canadian timezones",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-200 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-xs sm:text-sm font-medium text-white">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-400/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center font-bold text-xs">
                  🇨🇦
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Canada Wide Operations
                  </h4>
                  <p className="text-[11px] text-emerald-100">
                    Connecting employers & job seekers nationwide
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Contact Form (8 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80"
          >
            <div className="mb-5 text-left">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Fill out the form below and a representative will reply within
                24 business hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="firstName"
                    className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                  >
                    First Name <span className="text-[#059669]">*</span>
                  </Label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className={`w-full h-11 bg-slate-50/50 border border-slate-200 rounded-2xl px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all ${
                      errors.firstName ? "border-red-500 bg-red-50/30" : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="lastName"
                    className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                  >
                    Last Name <span className="text-[#059669]">*</span>
                  </Label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className={`w-full h-11 bg-slate-50/50 border border-slate-200 rounded-2xl px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all ${
                      errors.lastName ? "border-red-500 bg-red-50/30" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                >
                  Email Address <span className="text-[#059669]">*</span>
                </Label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full h-11 bg-slate-50/50 border border-slate-200 rounded-2xl px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all ${
                    errors.email ? "border-red-500 bg-red-50/30" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject Dropdown */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="subject"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                >
                  I am a... <span className="text-[#059669]">*</span>
                </Label>
                <div className="relative">
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full h-11 bg-slate-50/50 border border-slate-200 rounded-2xl pl-4 pr-10 text-sm text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all cursor-pointer ${
                      errors.subject ? "border-red-500 bg-red-50/30" : ""
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="jobseeker">Job Seeker</option>
                    <option value="employer">Employer / Recruiter</option>
                    <option value="organization">
                      Community / Organization
                    </option>
                    <option value="other">Other Inquiry</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                {errors.subject && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="message"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                >
                  Message <span className="text-[#059669]">*</span>
                </Label>
                <textarea
                  id="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  className={`w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all resize-none ${
                    errors.message ? "border-red-500 bg-red-50/30" : ""
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full h-11 bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-900/10 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={16} />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
