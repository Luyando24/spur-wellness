"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
    }, 1200);
  };

  const faqs = [
    {
      q: "How long does shipping take?",
      a: "Standard freight and package shipping takes 3–7 business days depending on weight and destination. Larger turf shipments may require scheduling a freight window."
    },
    {
      q: "What is your return policy?",
      a: "We offer a 30-day product trial on all fitness equipment. If you are not fully satisfied, contact our support team to arrange a return. Custom cut turf orders are subject to specialized protocols."
    },
    {
      q: "Do you supply commercial gyms and landscaping projects?",
      a: "Yes. We offer commercial wholesale pricing on volume orders of kettlebells, mats, and gym turf rolls. Please submit a wholesale quote request."
    },
  ];

  return (
    <div className="bg-white min-h-screen text-black">
      
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-black text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-400 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <MessageCircle className="h-3 w-3" /> Get In Touch
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white mb-4">CONTACT US.</h1>
          <p className="text-lg max-w-xl mx-auto text-neutral-400 font-light leading-relaxed">
            We would love to hear from you. Our team is here to assist with your home or commercial design.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Info + FAQ */}
          <div className="space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
                Reach Out
              </span>
              <h2 className="font-display text-3xl font-extrabold mt-2 mb-4 tracking-tight">
                CONTACT SPUR.
              </h2>
              <p className="text-sm leading-relaxed text-neutral-500 font-light">
                Have questions about our equipment specifications, freight logistics, or need help mapping out turf rolls for your facility? Contact our California support team.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <Phone className="h-5 w-5" />,
                  title: "Phone Support",
                  value: "714-983-7351",
                  sub: "Mon–Fri, 9am–6pm PST",
                },
                {
                  icon: <Mail className="h-5 w-5" />,
                  title: "Email Inquiry",
                  value: "info@spurwellness.com",
                  sub: "Replied within 1 business day",
                },
                {
                  icon: <MapPin className="h-5 w-5" />,
                  title: "Headquarters",
                  value: "3920 Prospect Ave, Unit B\nYorba Linda, CA 92886, USA",
                  sub: "",
                },
                {
                  icon: <Clock className="h-5 w-5" />,
                  title: "Office Hours",
                  value: "Monday – Friday",
                  sub: "9:00 AM – 6:00 PM PST",
                },
              ].map((contact, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 bg-white"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-neutral-100 text-black"
                  >
                    {contact.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-display)" }}>{contact.title}</h3>
                    <p className="text-sm whitespace-pre-line text-neutral-600 font-light">{contact.value}</p>
                    {contact.sub && <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>{contact.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div>
              <h3 className="font-display text-xl font-extrabold mb-5 uppercase tracking-wide">
                FAQs
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-neutral-200 overflow-hidden bg-white"
                  >
                    <button
                      className="w-full flex justify-between items-center px-5 py-4 text-left"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    >
                      <span className="text-sm font-semibold text-black">{faq.q}</span>
                      <span
                        className="text-lg font-bold transition-transform duration-200 text-black"
                        style={{
                          transform: openFaq === idx ? "rotate(45deg)" : "rotate(0)",
                        }}
                      >
                        +
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-4 border-t border-neutral-100">
                        <p className="text-xs sm:text-sm pt-3 leading-relaxed text-neutral-500 font-light">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="p-8 md:p-10 rounded-xl border border-neutral-200 bg-neutral-50">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
              Submit Form
            </span>
            <h2 className="font-display text-2xl font-extrabold mt-2 mb-8 tracking-tight uppercase">
              SEND A MESSAGE.
            </h2>

            {formStatus === 'success' ? (
              <div className="flex flex-col items-center text-center gap-4 py-12">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-black text-white"
                >
                  ✓
                </div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider">Message Sent</h3>
                <p className="text-sm text-neutral-500 font-light">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="text-xs font-bold uppercase tracking-widest border-b-2 border-black transition-colors pb-0.5 mt-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "firstName", label: "First Name", type: "text", placeholder: "Alex" },
                    { id: "lastName", label: "Last Name", type: "text", placeholder: "Smith" },
                  ].map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.id}
                        required
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-black"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-lg border border-neutral-200 bg-white outline-none cursor-pointer focus:border-black"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <option>General Inquiry</option>
                    <option>Order Status</option>
                    <option>Commercial Turf Quotes</option>
                    <option>Wholesale Equipment</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    placeholder="Tell us how we can help you out..."
                    className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none resize-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formStatus === 'submitting' ? (
                    'SENDING...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">SEND MESSAGE <Send className="h-3.5 w-3.5" /></span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
