import { CtaBanner as WebCtaBanner } from "@/components";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@packtok/ui";

export default function MaintenancePage() {
  return (
    <>
      <main className="mt-16 w-[95%] sm:w-[90%] md:w-[85%] mx-auto">
        <Hero />
        <About />
        <Services />
        <WhyPacktok />
      </main>
      <WebCtaBanner
        href="/services/maintenance/form"
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

function Hero() {
  const rows = [
    {
      label: "Emergency Servicing",
      icon: <Wrench className="h-4 w-4 text-white" />,
    },
    {
      label: "System Repair & Optimization",
      icon: <SlidersHorizontal className="h-4 w-4 text-white" />,
    },
    {
      label: "Preventive Maintenance Checks",
      icon: <ShieldCheck className="h-4 w-4 text-white" />,
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-14">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100/70 px-4 py-2 text-[11px] tracking-[0.2em] uppercase text-gray-700">
          <Star className="h-3.5 w-3.5" />
          Expert Maintenance & Servicing
        </div>
        <h1 className="mt-5 text-[44px] leading-[1.15]  font-semibold text-gray-900">
          Fast, reliable, corrugated packaging machinery maintenance solutions.
        </h1>

        <div className="mt-6 flex items-center gap-4">
          <Button
            asChild
            className="bg-black  text-white text-end hover:bg-gray-800 px-10 py-6 rounded-md font-bold w-fit text-lg shadow-lg"
          >
            <Link href="/services/maintenance/form">Book Now</Link>
          </Button>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#4B3CFB]" />
            <div className="text-[13px] leading-tight text-gray-800">
              <div className="font-semibold">1000+ Happy Clients</div>
              <div className="text-xs text-gray-500">
                Satisfied customers who trust PackTok
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border overflow-hidden divide-y">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-5 py-5 bg-white"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-gray-900">
                  {row.icon}
                </span>
                <span className="text-[15px] font-medium text-gray-900">
                  {row.label}
                </span>
              </div>
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-700">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <Link
          href="#"
          className="mt-4 inline-block text-xs text-gray-700 underline"
        >
          All Services
        </Link>
      </div>

      <div className="relative aspect-[4/5] md:aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image
          src="/maintain1.jpg"
          alt="maintenance hero"
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative w-full overflow-hidden rounded-xl">
          <Image
            src="/maintain2.jpg"
            alt="about"
            width={640}
            height={420}
            className="object-cover w-full h-[320px] md:h-[380px]"
          />
        </div>
        <div>
          <div className="text-[1.2rem] tracking-[0.2em] uppercase text-gray-600 mb-2">
            About us
          </div>
          <h2 className="text-[32px] md:text-[36px] font-semibold leading-snug">
            Your Trusted Partner in Maintenance & Servicing
          </h2>
          <p className="mt-3 text-gray-600 leading-relaxed text-justify">
            At PackTok, we ensure smooth board and converting line operations
            with proactive maintenance, timely repairs, expert troubleshooting,
            and reliable spare parts management—maximizing uptime, boosting
            productivity, and delivering consistent, high-quality packaging
            performance.
          </p>

         
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    {
      title: "Machinery Servicing",
      desc: "Rapid response minimizes downtime, swiftly restoring critical machinery operations.",
      icon: <Wrench className="h-5 w-5 text-gray-900" />,
    },
    {
      title: "Spare Parts Servicing",
      desc: "Efficient spare parts procurement ensures uninterrupted machinery performance.",
      icon: <SlidersHorizontal className="h-5 w-5 text-gray-900" />,
    },
    {
      title: "Raw Material Handling",
      desc: "Maintaining conveyors, feeders, dosing systems to ensure flow, reduce failures, maximize efficiency.",
      icon: <ShieldCheck className="h-5 w-5 text-gray-900" />,
    },
  ];

  return (
    <section className="py-14">
      <div className="text-[1.2rem] tracking-[0.2em] uppercase text-gray-600 mb-6">
        Our Services
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-xl border bg-white p-6">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-gray-100">
              {it.icon}
            </div>
            <div className="text-base font-semibold">{it.title}</div>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed text-justify">
              {it.desc}
            </p>
          </div>
        ))}
      </div>

      {/* <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600 max-w-3xl">
          We provide tailored packaging solutions that extend equipment lifespan
          and maximize operational efficiency beyond our core services.
        </p>
        <div>
          <button className="px-5 py-2 text-xs rounded-full bg-gray-900 text-white">
            See All Services
          </button>
        </div>
      </div> */}
    </section>
  );
}

function WhyPacktok() {
  const bullets = [
    {
      title: "Experienced Technicians",
      desc: "Our skilled technicians specialize in board & converting lines, delivering precise, reliable maintenance and repairs to keep your production running efficiently.",
    },
    {
      title: "24/7 Emergency Service",
      desc: "Packaging downtime is costly. Our dedicated team offers rapid response and critical repairs to minimize disruptions and keep production on track.",
    },
    {
      title: "Transparent Pricing",
      desc: "We provide transparent, tailored pricing with detailed quotes and no hidden fees, giving you full confidence and control before work starts.",
    },
  ];

  return (
    <section className="py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div>
        <div className="text-[1.2rem] tracking-[0.2em] uppercase text-gray-600 mb-4">
          Why Packtok
        </div>
        <h3 className="text-3xl md:text-4xl font-semibold leading-snug">
          Trusted, Professional, and Committed to Excellence
        </h3>

        <ul className="mt-6 space-y-6">
          {bullets.map((b) => (
            <li key={b.title} className="flex items-start gap-4">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-sm bg-black">
                <Check className="h-3.5 w-3.5 text-white" />
              </span>
              <div>
                <div className="font-semibold">{b.title}</div>
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                  {b.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative w-full overflow-hidden rounded-xl">
        <Image
          src="/maintain3.png"
          alt="technician"
          width={640}
          height={640}
          className="object-cover w-full h-[420px] md:h-[520px]"
        />
      </div>
    </section>
  );
}
