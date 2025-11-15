"use client";

import { useState } from "react";

interface FormData {
  email: string;
  name: string;
  role: string;
  organization: string;
  struggles: string;
}

export function WaitlistSection() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    role: "",
    organization: "",
    struggles: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement actual form submission
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Form submitted:", formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSubmitted) {
    return (
      <section id="waitlist" className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="rounded-2xl border border-green-600/30 bg-green-600/10 p-12">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-4 text-green-400">
              Welcome to the TourBrain roster!
            </h2>
            <p className="text-neutral-300">
              We'll be in touch soon about your early access. In the meantime,
              feel free to reach out to{" "}
              <a
                href="mailto:hello@tourbrain.ai"
                className="text-blue-400 hover:text-blue-300"
              >
                hello@tourbrain.ai
              </a>{" "}
              with any questions.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">
            Join the TourBrain early access roster.
          </h2>
          <p className="text-xl text-neutral-300 mb-8">
            We're onboarding a small group of venues, promoters, and agencies
            who want to run tours on a modern tour OS. If you're actively
            routing shows or managing tours, we'd love to explore a pilot with
            you.
          </p>

          <div className="space-y-3 text-neutral-200 mb-8">
            <div className="flex items-start justify-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Work directly with the product team on your real shows.</p>
            </div>
            <div className="flex items-start justify-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Shape workflows before we open up broadly.</p>
            </div>
            <div className="flex items-start justify-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Founding partner pricing once we launch.</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 space-y-6"
        >
          {/* Email (required) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Your Name"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select your role</option>
              <option value="venue">Venue / Talent Buyer</option>
              <option value="promoter">Promoter</option>
              <option value="agency">Agency / Tour Manager</option>
              <option value="artist">Artist / Manager</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Organization */}
          <div>
            <label
              htmlFor="organization"
              className="block text-sm font-medium mb-2"
            >
              Organization
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Your venue, agency, or company"
            />
          </div>

          {/* Struggles */}
          <div>
            <label
              htmlFor="struggles"
              className="block text-sm font-medium mb-2"
            >
              What are you struggling with today?
            </label>
            <textarea
              id="struggles"
              name="struggles"
              rows={4}
              value={formData.struggles}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Tell us about your current tour ops challenges..."
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-lg font-semibold text-white transition-colors"
          >
            {isSubmitting ? "Joining..." : "Join Early Access"}
          </button>

          <p className="text-sm text-neutral-400 text-center">
            Early access • No spam • Unsubscribe anytime
          </p>
        </form>
      </div>
    </section>
  );
}
