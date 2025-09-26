import { CtaBanner as WebCtaBanner } from "@/components";
import {
  CalendarClock,
  Check,
  CheckCircle2,
  BadgeCheck,
  Clock8,
  FileText,
  PhoneCall,
  ShieldCheck,
  MapPin,
  Users,
  Wrench,
} from "lucide-react";
import Image from "next/image";


import installer_bg from "@/assets/installer_bg.png"
import installer_bg_2 from "@/assets/installer_bg_2.png"
import export_1 from "@/assets/export_1.png"
import our_machinary from "@/assets/our_machinary.png"
import Satisfaction_Guarantee from "@/assets/Satisfaction Guarantee.png"
import Free_Quotes from "@/assets/Free Quotes.png"
import Professionals from "@/assets/Professionals.png"
import Fast_24_Hour from "@/assets/Fast 24-Hour Service.png"
import Flexible_Scheduling from "@/assets/Flexible Scheduling.png"
import Commitment from "@/assets/Commitment_Free.png"






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
    <section className="pt-20 bg-black md:pt-24">
      <div className="w-[95%] sm:w-[90%] md:w-[95%] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Image */}
        <div className="md:col-span-3">
          <div className="rounded-lg">
            <Image
              src={installer_bg}
              alt="Technician"
              className="object-cover w-full"
              priority
            />
          </div>
        </div>

        {/* Center Card */}
        <div className="md:col-span-6 bg-black text-white text-center rounded-2xl p-5 relative overflow-hidden">
          <div className="text-[14px] tracking-[0.25em] font-meduim text-white/70">
            FOCUSED ON SKILLED PERSONNEL SUPPLY
          </div>
          <h1 className="mt-2 text-[45px] pb-3 font-bold leading-tight">
            Manpower Services
            <br /> for Machinery Setup
            <br /> &amp; Operations
          </h1>
          <div className="mt-3 text-center justify-center pb-4 flex gap-6 text-xs text-white/80">
            <div className="flex items-center text-[#15B2F5] gap-2">
              <Check className="h-4 w-4 text-[#15B2F5]" /> Free
              Consultations
            </div>
            <div className="flex items-center text-[#15B2F5] gap-2">
              <Check className="h-4 w-4 text-[#15B2F5]" /> No Obligation
            </div>
          </div>
          <button className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-[1.1rem] font-medium text-black">
            Book Now
          </button>

          <div className="mt-8 grid grid-cols-3 gap-3 text-[11px]">
            <div className="flex gap-2 justify-center items-center"><BadgeCheck className="w-[33px] h-[33px] bg-white rounded-full text-black p-2" /> <span className="text-[12.6px] font-semibold">Trained Machinery Operators</span></div>
            <div className="flex gap-2 justify-center items-center"><ShieldCheck className="w-[33px] h-[33px] bg-white rounded-full text-black p-2" /> <span className="text-[12.6px] font-semibold">Certified Local Professionals</span></div>
            <div className="flex gap-2 justify-center items-center"><MapPin className="w-[33px] h-[33px] bg-white rounded-full text-black p-2" /> <span className="text-[12.6px] font-semibold">On-Site Setup & Installationl</span></div>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:col-span-3">
          <div className=" rounded-lg">
            <Image
              src={installer_bg_2}
              alt="Worker"
              className="object-cover w-full"
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
      <div className="w-[95%] sm:w-[90%] md:w-[70%] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6">
          <h2 className="text-[2.5rem] font-bold leading-snug">
            Expert Manpower for
            <br /> Machinery Services
          </h2>
          <p className="mt-3 text-[14px] py-4 text-[#545971] max-w-md">
            Need skilled technicians for machinery setup, operation, or
            maintenance? We provide certified professionals to ensure your
            equipment runs smoothly and efficiently.
          </p>
          <ul className="mt-5 space-y-3 text-[16px]">
            {[
              "Installation & Setup",
              "Maintenance & Repair",
              "Operator Training & Support",
            ].map((item) => (
              <li key={item} className="flex items-start font-bold gap-3 pb-4 text-gray-800">
                <Check className="mt-0.5 h-5 w-5 text-black" />
                <span className="font-bold">{item}</span>
              </li>
            ))}
          </ul>
          <button className="mt-6 inline-flex items-center bg-black text-white justify-center rounded-full border border-black px-8 py-3 text-[13.5px] font-medium">
            Book your service Now
          </button>
        </div>

        <div className="md:col-span-6">
          <div className="w-full">
            <Image
              src={export_1}
              alt="Installers"

              className="object-cover w-full"
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
    <section className="py-30">
      <div className="w-[95%] sm:w-[90%] md:w-[70%] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6">
          <div className="relative left-[-12%]">
            <div className=" rounded-xl">
              <Image
                src={our_machinary}
                alt="verified"
                className="object-contain w-full"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-6">
          <h3 className="text-[2.5rem] leading-12 font-semibold">
            How Our Machinery
            <br /> Manpower Service Works
          </h3>
          <div className="mt-6 space-y-6">
            {steps.map((s, i) => (


              <div key={s.title} className="flex gap-5 items-end">
                <div className="flex gap-5 w-[176px]">
                  <span className="text-[2.5rem] text-[#9EA3B5] font-semibold">{i + 1}.</span>
                  <span className="text-[1.1rem] font-bold ">{s.title}</span>
                </div>

                <p className="text-[13.5px] text-[#545971] w-[323px] leading-relaxed">
                  {s.desc}
                </p>
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
      icon: Satisfaction_Guarantee,
    },
    {
      title: "Professionals",
      desc: "Experts available in urban, suburban & rural areas—for both short-term projects and long-term maintenance.",
      icon: Professionals,
    },
    {
      title: "Flexible Scheduling",
      desc: "24/7 availability, including nights & weekends—we work around your operational hours to minimize downtime.",
      icon: Flexible_Scheduling,
    },
    {
      title: "Free Quotes",
      desc: "Get personalized cost estimates without any obligation. Experience transparency and peace of mind as you explore our service.",
      icon: Free_Quotes,
    },
    {
      title: "Fast 24-Hour Service",
      desc: "Need fast handling for repairs or installs? Our experts are available anytime to help you resolve the problem.",
      icon: Fast_24_Hour,
    },
    {
      title: "100% Commitment-Free",
      desc: "You are free to ask us about the problems you are facing. We offer a no-commitment approach to put your mind at ease.",
      icon: Commitment,
    },
  ];

  return (
    <section className="pt-12 pb-30">
      <div className="w-[95%] sm:w-[90%] md:w-[90%] mx-auto">
        <div className="rounded-2xl bg-black text-white p-20">
          <h3 className="text-[2.5rem] pb-16 font-bold">
            Fast, Friendly, and
            <br /> Satisfaction Guarantee
          </h3>
          <div className="mt-8 grid gap-30 gap-y-[5rem] sm:grid-cols-2 lg:grid-cols-2">
            {items.map((it) => (
              <div
                key={it.title}
                className=" p-5"
              >
                <div className="flex items-center gap-8 ">
                  <div className="flex w-[100px] h-[100px] items-center justify-center rounded-md ">
                    <Image src={it.icon} alt={it.title} className="w-full" />
                  </div>
                  <div>
                    <div className="text-[1.1rem] font-semibold">{it.title}</div>
                    <p className="mt-2 text-[0.9rem] text-white/80 leading-relaxed">
                      {it.desc}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
