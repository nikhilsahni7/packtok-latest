import { CtaBanner as WebCtaBanner } from "@/components";
import {
  CalendarClock,
  CheckCircle2,
  Clock8,
  FileText,
  PhoneCall,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import Image from "next/image";

export default function MachineryInstallerPage() {
  return (
    <main className="w-full">
      <HeroSection />
      <ExpertSection />
      <HowItWorks />
      <GuaranteeSection />
      <WebCtaBanner
        href="/services/machinery-installer/form"
        title={
          <>
            Not sure where to begin? Start <br /> with filling the form
          </>
        }
        buttonText="CLICK HERE!"
      />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="pt-20 md:pt-24">
      <div className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Image */}
        <div className="md:col-span-3 hidden md:block">
          <div className="relative h-[320px] lg:h-[360px] overflow-hidden rounded-lg">
            <Image
              src="/tunkery5.jpg"
              alt="Technician"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Center Card */}
        <div className="md:col-span-6 bg-black text-white rounded-2xl p-8 md:p-10 relative overflow-hidden">
          <div className="text-[11px] tracking-[0.25em] text-white/70">
            FOCUSED ON SKILLED PERSONNEL SUPPLY
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
            Manpower Services
            <br /> for Machinery Setup
            <br /> &amp; Operations
          </h1>
          <div className="mt-3 flex gap-6 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#0DB0F3]" /> Free
              Consultations
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#0DB0F3]" /> No Obligation
            </div>
          </div>
          <button className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-medium text-black">
            Book Now
          </button>

          <div className="mt-8 grid grid-cols-3 gap-3 text-[11px]">
            <FeaturePill label="Trained Machinery Operators" />
            <FeaturePill label="Certified Local Professionals" />
            <FeaturePill label="On-Site Setup & Installation" />
          </div>
        </div>

        {/* Right Image */}
        <div className="md:col-span-3 hidden md:block">
          <div className="relative h-[320px] lg:h-[360px] overflow-hidden rounded-lg">
            <Image
              src="/tunkery8.png"
              alt="Worker"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturePill({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10">
      <ShieldCheck className="h-3.5 w-3.5 text-[#0DB0F3]" />
      <span className="text-white/90">{label}</span>
    </div>
  );
}

function ExpertSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5">
          <h2 className="text-2xl md:text-3xl font-semibold leading-snug">
            Expert Manpower for
            <br /> Machinery Services
          </h2>
          <p className="mt-3 text-sm text-gray-600 max-w-md">
            Need skilled technicians for machinery setup, operation, or
            maintenance? We provide certified professionals to ensure your
            equipment runs smoothly and efficiently.
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              "Installation & Setup",
              "Maintenance & Repair",
              "Operator Training & Support",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-800">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#0DB0F3]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button className="mt-6 inline-flex items-center justify-center rounded-full border border-black px-4 py-2 text-xs font-medium">
            Book your service Now
          </button>
        </div>

        <div className="md:col-span-7">
          <div className="relative h-[320px] sm:h-[360px] md:h-[420px] overflow-hidden rounded-xl">
            <Image
              src="/tunkery7.jpg"
              alt="Installers"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Call us anytime 24/7",
      desc: "You can contact us directly; we will quickly put you in touch with professionals who are ready anytime.",
      icon: <PhoneCall className="h-4 w-4" />,
    },
    {
      title: "Schedule on-site Service",
      desc: "Our experts will discuss your requirements, provide solutions, and schedule a visit at your convenience.",
      icon: <CalendarClock className="h-4 w-4" />,
    },
    {
      title: "Service Execution",
      desc: "Technicians will assess, provide a clear estimate, and begin work immediately upon approval.",
      icon: <Wrench className="h-4 w-4" />,
    },
  ];

  return (
    <section className="py-10">
      <div className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative">
          <div className="relative h-[260px] sm:h-[300px] md:h-[340px] overflow-hidden rounded-xl">
            <Image
              src="/newsletter.png"
              alt="verified"
              fill
              className="object-contain p-4"
            />
          </div>
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold">
            How Our Machinery
            <br /> Manpower Service Works
          </h3>
          <div className="mt-6 space-y-6">
            {steps.map((s, i) => (
              <div key={s.title} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  {s.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {i + 1}. {s.title}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GuaranteeSection() {
  const items = [
    {
      title: "Satisfaction Guarantee",
      desc: "Trusted professionals—no scams, just proven results. We deliver quality work with optimal performance every time.",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
    {
      title: "Professionals",
      desc: "Experts available in urban, suburban & rural areas—for both short-term projects and long-term maintenance.",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Flexible Scheduling",
      desc: "24/7 availability, including nights & weekends—we work around your operational hours to minimize downtime.",
      icon: <Clock8 className="h-5 w-5" />,
    },
    {
      title: "Free Quotes",
      desc: "Get personalized cost estimates without any obligation. Experience transparency and peace of mind as you explore our service.",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Fast 24-Hour Service",
      desc: "Need fast handling for repairs or installs? Our experts are available anytime to help you resolve the problem.",
      icon: <Clock8 className="h-5 w-5" />,
    },
    {
      title: "100% Commitment-Free",
      desc: "You are free to ask us about the problems you are facing. We offer a no-commitment approach to put your mind at ease.",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
  ];

  return (
    <section className="py-12">
      <div className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto">
        <div className="rounded-2xl bg-black text-white p-8 md:p-10">
          <h3 className="text-2xl md:text-3xl font-semibold">
            Fast, Friendly, and
            <br /> Satisfaction Guarantee
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <div
                key={it.title}
                className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
                    {it.icon}
                  </div>
                  <div className="text-sm font-semibold">{it.title}</div>
                </div>
                <p className="mt-2 text-xs text-white/80 leading-relaxed">
                  {it.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
