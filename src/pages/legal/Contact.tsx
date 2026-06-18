import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft2, Sms } from "iconsax-react";
import Header from "@/components/onboarding/shared/Header";
import { Button } from "@/components/ui/button";
import { showSuccess, showDanger } from "@/components/ui/toast";
import api from "@/api/axios";

const COMPANY = "Wavetifi Limited";
const CONTACT_EMAIL = "info@sendcoins.ca";

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.name.trim() || !emailOk(form.email) || !form.message.trim()) {
      showDanger("Please enter your name, a valid email, and a message.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/contact", form);
      showSuccess(data?.message || "Thanks for reaching out — we'll be in touch shortly.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      showDanger(
        err.response?.data?.message || "Could not send your message. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-[#F9F9F9] px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#0647F7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0647F7] transition";

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
        >
          <ArrowLeft2 size="16" color="currentColor" />
          Back
        </button>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-2xl px-4 pt-8 pb-6 text-center md:px-8">
        <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0647F7]">
          Contact
        </span>
        <h1 className="mt-4 text-[32px] font-semibold leading-tight text-neutral-900 md:text-[40px]">
          Get in touch
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-neutral-500">
          Have a question or need help? Send us a message and the {COMPANY} team
          will get back to you.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#0647F7] hover:underline"
        >
          <Sms size="16" color="#0647F7" variant="Bold" />
          {CONTACT_EMAIL}
        </a>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-4 pb-20 md:px-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Full name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={update("name")}
                placeholder="Jane Doe"
                className={inputClass}
                disabled={submitting}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="you@example.com"
                className={inputClass}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Subject <span className="text-neutral-400">(optional)</span>
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={update("subject")}
              placeholder="How can we help?"
              className={inputClass}
              disabled={submitting}
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Message
            </label>
            <textarea
              value={form.message}
              onChange={update("message")}
              placeholder="Write your message..."
              rows={6}
              className={`${inputClass} resize-y`}
              disabled={submitting}
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-[#0647F7] text-white hover:bg-[#2563EB]"
          >
            {submitting ? "Sending..." : "Send message"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/terms")}
            className="text-sm font-semibold text-[#0647F7] transition hover:underline"
          >
            View Terms &amp; Conditions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
