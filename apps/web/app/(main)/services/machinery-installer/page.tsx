import Commitment from "@/assets/Commitment_Free.png";
import export_1 from "@/assets/export_1.png";
import Fast_24_Hour from "@/assets/Fast 24-Hour Service.png";
import Flexible_Scheduling from "@/assets/Flexible Scheduling.png";
import Free_Quotes from "@/assets/Free Quotes.png";
import installer_bg from "@/assets/installer_bg.png";
import installer_bg_2 from "@/assets/installer_bg_2.png";
import our_machinary from "@/assets/our_machinary.png";
import Professionals from "@/assets/Professionals.png";
import Satisfaction_Guarantee from "@/assets/Satisfaction Guarantee.png";
import { CtaBanner as WebCtaBanner } from "@/components";
import {
    BadgeCheck,
    CalendarClock,
    Check,
    MapPin,
    PhoneCall,
    ShieldCheck,
    Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";






export default function MachineryInstallerPage() {
  return (
    <main className="w-full overflow-x-hidden">
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
    <section className="bg-black pt-20 md:pt-24">
      <div className="mx-auto grid w-[95%] grid-cols-1 items-center gap-4 sm:w-[90%] md:w-[95%] md:grid-cols-12 md:gap-6">
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
        <div className="relative overflow-hidden rounded-2xl bg-black p-4 text-center text-white sm:p-5 md:col-span-6">
          <div className="text-[12px] font-medium tracking-[0.15em] text-white/70 sm:text-[14px] sm:tracking-[0.25em]">
            FOCUSED ON SKILLED PERSONNEL SUPPLY
          </div>
          <h1 className="mt-2 pb-3 text-2xl font-bold leading-tight sm:text-3xl md:text-[45px]">
            Manpower Services
            <br /> for Machinery Setup
            <br /> &amp; Operations
          </h1>
          <div className="mt-3 flex flex-wrap justify-center gap-3 pb-4 text-center text-xs text-white/80 sm:gap-6">
            <div className="flex items-center gap-2 text-[#15B2F5]">
              <Check className="h-4 w-4 text-[#15B2F5]" /> Free
              Consultations
            </div>
            <div className="flex items-center gap-2 text-[#15B2F5]">
              <Check className="h-4 w-4 text-[#15B2F5]" /> No Obligation
            </div>
          </div>
          <Link
            href="/services/machinery-installer/form"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-[1.1rem] font-medium text-black"
          >
            Book Now
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-3 text-[11px] sm:grid-cols-3">
            <div className="flex items-center justify-center gap-2">
              <BadgeCheck className="h-[33px] w-[33px] rounded-full bg-white p-2 text-black" />
              <span className="text-sm font-semibold">Trained Machinery Operators</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="h-[33px] w-[33px] rounded-full bg-white p-2 text-black" />
              <span className="text-sm font-semibold">Certified Local Professionals</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-[33px] w-[33px] rounded-full bg-white p-2 text-black" />
              <span className="text-sm font-semibold">On-Site Setup & Installation</span>
            </div>
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

function ExpertSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="w-[95%] sm:w-[90%] md:w-[70%] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6">
          <h2 className="text-3xl md:text-[2.5rem] font-bold leading-snug">
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
          <Link
            href="/services/machinery-installer/form"
            className="mt-6 inline-flex items-center bg-black text-white justify-center rounded-full border border-black px-8 py-3 text-[13.5px] font-medium"
          >
            Book your service Now
          </Link>
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
    <section className="py-14 md:py-24">
      <div className="mx-auto grid w-[95%] grid-cols-1 items-center gap-8 sm:w-[90%] md:w-[70%] md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="md:relative md:left-[-12%]">
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
          <h3 className="text-3xl font-semibold leading-tight md:text-[2.5rem] md:leading-[3rem]">
            How Our Machinery
            <br /> Manpower Service Works
          </h3>
          <div className="mt-6 space-y-6">
            {steps.map((s, i) => (


              <div
                key={s.title}
                className="flex flex-col items-start gap-5 md:flex-row md:items-end"
              >
                <div className="flex gap-5 w-full md:w-[176px]">
                  <span className="text-[2.5rem] font-semibold text-[#9EA3B5]">{i + 1}.</span>
                  <span className="text-[1.1rem] font-bold ">{s.title}</span>
                </div>

                <p className="text-[13.5px] text-[#545971] w-full md:w-[323px] leading-relaxed">
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
    <section className="py-14 md:py-24">
      <div className="w-[95%] sm:w-[90%] md:w-[90%] mx-auto">
        <div className="rounded-2xl bg-black text-white p-6 md:p-20">
          <h3 className="text-3xl md:text-[2.5rem] pb-8 md:pb-16 font-bold">
            Fast, Friendly, and
            <br /> Satisfaction Guarantee
          </h3>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-12">
            {items.map((it) => (
              <div
                key={it.title}
                className="p-0 sm:p-2 md:p-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 ">
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
