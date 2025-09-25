import { CtaBanner as WebCtaBanner } from "@/components";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const checklistLeft = [
  "End to End Project Management",
  "Machinery selection and integration",
  "Design and engineering",
  "Installation and commissioning",
  "Maintenance & After-Sales Support",
];

const checklistRight = [
  "Raw Material Handling & Optimization",
  "Automation & Digitalization",
  "Customized Program Design",
  "Productivity & Efficiency Enhancement",
  "Full-Scale Implementation",
];

export default function TunkeryPage() {
  return (
    <>
      <main className=" w-full">
        <HeroSection />
        <TrustedChoiceSection />
        <ExcellenceSection />
        <PointsCoveredSection />
        <HowItWorksSection />
      </main>
      <WebCtaBanner
        href="/services/turnkey-projects/form"
        title={
          <>
            Not sure where to begin? Start <br /> with a free consultation.
          </>
        }
        buttonText="GET STARTED TODAY!"
      />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative h-[520px] before:absolute before:content-[''] before:z-10 before:top-0 before:overflow-hidden before:bg-[#00000078] before:w-full before:h-[500px]  md:h-[560px] overflow-hidden rounded-b-[48px]">
      <Image
        src="/tunkery1.png"
        alt="Turnkey Packaging Hero"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

      <div className="relative  z-10 h-full max-w-[1100px] mx-auto px-6 md:px-0 flex items-center">
        <div className="max-w-2xl text-gray-900">
          <h1 className="text-4xl text-white md:text-5xl font-semibold leading-tight">
            Transform Your Business with Our Turnkey
            <br /> Packaging solutions
          </h1>
          <p className="mt-4 text-white text-gray-800 text-justify">
            We provide a comprehensive, all-in-one service—from design and
            production to logistics—streamlining the entire packaging process
            for efficiency, consistency, and cost savings.
          </p>
          <button className="mt-6 px-6 py-3 bg-black text-white rounded-sm uppercase text-xs tracking-widest">
            <Link href="/services/turnkey-projects/form">Submit Request </Link>
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-1 left-0 right-0 h-12 md:h-16 bg-white rounded-t-[48px]" />
    </section>
  );
}

function TrustedChoiceSection() {
  return (
    <section className="bg-white">
      <div className="w-full text-center py-12">
        <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
          The Trusted Choice for Packaging
          <br /> Industry Installation &amp; Supply
        </h2>
        <p className="mt-4 max-w-[760px] mx-auto text-gray-600 text-justify leading-relaxed">
          Beyond just repairs, PackTok offers ongoing guidance and proactive
          support to ensure your assets perform at their best and last longer.
          We work closely with you to optimize maintenance strategies, reduce
          downtime, and extend equipment life—delivering long-term value and
          reliability.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-[95%] sm:w-[90%] md:w-[85%] mx-auto">
          <FeatureCard
            icon={
              <Image
                src="/tunkery2.png"
                alt="Experience icon"
                width={28}
                height={28}
              />
            }
            title="Experience Matters"
            desc="Decades of expertise and deep technical knowledge drive your operational efficiency and advantage."
          />
          <FeatureCard
            icon={
              <Image
                src="/tunkery3.png"
                alt="Proven results icon"
                width={28}
                height={28}
              />
            }
            title="Proven Results"
            desc="Measurable achievements in corrugated plant, machinery maintenance & servicing."
          />
          <FeatureCard
            icon={
              <Image
                src="/tunkery4.png"
                alt="Dedicated support icon"
                width={28}
                height={28}
              />
            }
            title="Dedicated Support"
            desc="From design to delivery with unmatched packaging lifecycle reliability."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-left shadow-sm">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
        {icon}
      </div>
      <h4 className="text-[18px] font-semibold text-gray-900">{title}</h4>
      <p className="mt-3 text-gray-600 text-sm leading-relaxed text-justify">{desc}</p>
    </div>
  );
}

function ExcellenceSection() {
  return (
    <section className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 p-6 md:p-8 rounded-2xl">
        <div className="overflow-hidden rounded-2xl">
          <Image
            src="/tunkery5.jpg"
            alt="Partnering"
            width={640}
            height={420}
            className="object-cover w-full h-[300px] md:h-[360px]"
          />
        </div>
        <div>
          <h2 className="text-3xl font-semibold">
            Partnering for Operational Excellence Since 35+ years
          </h2>
          <p className="mt-4 text-gray-700 leading-relaxed text-justify">
            From concept to commissioning, we provide reliable, innovative
            turnkey packaging solutions. With over 35 years of experience, we
            support industry leaders by streamlining operations, enhancing
            productivity, and ensuring long-term success through consistent
            guidance and comprehensive machinery setup and maintenance.
          </p>
          <button className="mt-6 px-6 py-3 bg-black text-white rounded-sm uppercase text-xs tracking-widest">
            Request Consultation
          </button>
        </div>
      </div>
    </section>
  );
}

function PointsCoveredSection() {
  return (
    <section className="py-16">
      <h2 className="text-center text-[28px] md:text-[32px] font-semibold leading-snug">
        Points We Cover in Our Turnkey
        <br /> Solution:
      </h2>

      <div className="mt-10 w-[95%] sm:w-[90%] md:w-[85%] max-w-[1180px] mx-auto grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 flex items-center justify-center md:justify-start">
          <Image
            src="/tunkery6.png"
            alt="Checklist Illustration"
            width={420}
            height={420}
            className="object-contain w-[260px] sm:w-[320px] md:w-[360px] h-auto"
          />
        </div>

        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
          <ul className="space-y-4">
            {checklistLeft.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-[#0DB0F3]" />
                <span className="text-[15px] text-gray-800 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <ul className="space-y-4">
            {checklistRight.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-[#0DB0F3]" />
                <span className="text-[15px] text-gray-800 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-12">
      <h2 className="text-center text-2xl md:text-3xl font-semibold">
        How it works
      </h2>
      <div className="mt-8 grid gap-6 w-[95%] sm:w-[90%] md:w-[85%] mx-auto sm:grid-cols-2 lg:grid-cols-3">
        <HowCard
          title="Consultation"
          desc="We conduct a thorough analysis of your machinery, parts, and raw material processes to identify precise needs and optimization opportunities."
          image="/tunkery7.jpg"
        />
        <HowCard
          title="Strategic Planning"
          desc="Our experts develop customized maintenance schedules, spare parts strategies, and material flow plans tailored to your operational requirements."
          image="/tunkery8.png"
        />
        <HowCard
          title="Optimized Operations"
          desc="We implement solutions that deliver enhanced machinery uptime, streamlined inventory, and improved material handling for sustained growth."
          image="/tunkery9.png"
        />
      </div>
    </section>
  );
}

function HowCard({
  title,
  desc,
  image,
}: {
  title: string;
  desc: string;
  image?: string;
}) {
  const imgSrc = image || "/bidding-header.png";
  return (
    <article className="rounded-2xl overflow-hidden border bg-white">
      <Image
        src={imgSrc}
        alt={title}
        width={480}
        height={260}
        className="object-cover w-full h-[180px]"
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-gray-600 text-sm leading-relaxed text-justify">{desc}</p>
      </div>
    </article>
  );
}
