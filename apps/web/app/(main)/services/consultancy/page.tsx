"use client";

import { CtaBanner as WebCtaBanner } from "@/components";
import { Checkbox } from "@packtok/ui/components/checkbox";
import { cn } from "@packtok/ui/lib/utils";
import { MessageCircleMore } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import image1 from "@/assets/spare_part_1.png";
import Comprehensive from "@/assets/Comprehensive Solutions.png";
import Support from "@/assets/24:7 Customer Support.png";
import Trust from "@/assets/Confidentiality & Trust.png";
import printer from "@/assets/printer slotter.png";


import image2 from "@/assets/image1.jpeg";
import Raw_material from "@/assets/Raw material.webp";




export default function ConsultancyPage() {
  return (
    <main
      className={cn(
        // Layout & box model
        "flex w-full flex-col",

        // Typography
        "text-foreground",

        // Colors
        "bg-background"
      )}
    >
      <HeroSection />
      <AboutSection />
      <WhyChooseUs />
      <ConsultancyGrid />
      <WebCtaBanner href="/services/consultancy/form" />
    </main>
  );
}

function HeroSection() {
  return (
    <section
      className={cn(
        // Layout & box model
        "container mx-auto px-4 sm:px-6 lg:px-8",
        "pt-24 sm:pt-28", // space under fixed navbar per Figma
        "pb-12 sm:pb-16 lg:pb-20"
      )}
    >
      <div
        className={cn(
          // Layout & box model
          "grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12"
        )}
      >
        {/* Text Column */}
        <div className={cn("lg:col-span-7")}>
          <div
            className={cn(
              "mb-4 text-xs  uppercase tracking-[0.2em] text-muted-foreground"
            )}
          >
            Consultancy Services
          </div>
          <h1
            className={cn(
              // Typography
              "text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl"
            )}
          >
            Unlock Your Business Potential with Our Expert Consultancy Services
          </h1>
          <p className={cn("mt-4 max-w-2xl text-muted-foreground")}>
            Leverage our specialized consultancy services to enhance operational
            efficiency and capitalize on new opportunities. We provide strategic
            solutions to overcome challenges and achieve sustainable success.
          </p>
          <div className={cn("mt-6")}>
            <Link
              href="/services/consultancy/form"
              className={cn(
                // Layout & box model
                "inline-flex items-center justify-center rounded-sm px-5 py-2.5",

                // Typography
                "text-sm font-medium",

                // Colors
                "bg-primary text-primary-foreground",

                // Visuals
                "shadow-xs",

                // States
                "hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              Book Your Slot
            </Link>
          </div>
        </div>

        {/* Stats Column */}
        <div className={cn("lg:col-span-5")}>
          <div
            className={cn(
              // Layout & box model
              "grid grid-cols-2 gap-6 rounded-md border p-6 sm:gap-8",

              // Colors
              "border-border"
            )}
          >
            <StatBox label="Years of Experience" value="35+" />
            <StatBox
              label="Professionals Available"
              value={<MessageCircleMore className="text-3xl mb-2" />}
              style="text-3xl"
            />
          </div>
        </div>
      </div>

      {/* Wide Image */}
      <div
        className={cn("mt-5 overflow-hidden rounded-md border border-border")}
      >
        <div className={cn("relative h-[380px] sm:h-[440px] lg:h-[520px]")}>
          <Image
            src="/consult-mainpage1.png"
            alt="Consultancy overview"
            fill
            sizes="(min-width: 1024px) 1200px, 100vw"
            className={cn("w-full object-cover")}
            priority
          />
        </div>
      </div>
    </section>
  );
}

function StatBox({
  label,
  value,
  style,
}: {
  label: string;
  value: any;
  style?: any;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-2")}>
      <div className={cn(`text-3xl font-semibold ${style}`)}>{value}</div>
      <div className={cn("text-xs font-semibold text-muted-foreground")}>
        {label}
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section
      className={cn(
        // Layout & box model
        "container mx-auto px-4 sm:px-6 lg:px-8",
        "py-14 lg:py-16"
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12"
        )}
      >
        {/* Image column */}
        <div className={cn("lg:col-span-6")}>
          <div
            className={cn(
              "relative h-[420px] sm:h-[460px] lg:h-[520px] overflow-hidden rounded-md border border-border"
            )}
          >
            <Image
              src={image2}
              alt="Consultancy team"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={cn("object-cover")}
            />
          </div>
        </div>
        {/* Content column */}
        <div className={cn("lg:col-span-6")}>
          <div
            className={cn(
              "text-xs uppercase tracking-[0.2em] text-muted-foreground"
            )}
          >
            About Us
          </div>
          <h2
            className={cn(
              "mt-2 text-3xl font-semibold sm:text-4xl lg:text-5xl"
            )}
          >
            Your Trusted Consultancy Partner
          </h2>
          <p className={cn("mt-4 max-w-2xl text-muted-foreground")}>
            We are dedicated to empowering businesses and individuals with
            strategic insights and actionable solutions. Our expertise spans
            various domains, helping you navigate challenges and seize
            opportunities for growth.
          </p>

          <ul className={cn("mt-6 space-y-3")}>
            {[
              "Tailored Strategic Solutions",
              "Transparent and Results-Oriented Approach",
            ].map((item) => (
              <li key={item} className={cn("flex items-start gap-3")}>
                <Checkbox checked aria-readonly className={cn("mt-0.5")} />
                <span className={cn("text-sm font-medium")}>{item}</span>
              </li>
            ))}
          </ul>

          <div className={cn("mt-8 grid grid-cols-2 gap-6 sm:max-w-md")}>
            <KpiBox value="2X" label="Faster Problem Solving" />
            <KpiBox value="90%" label="Client Success Rate" />
          </div>
        </div>
      </div>
    </section>
  );
}

function KpiBox({ value, label }: { value: string; label: string }) {
  return (
    <div
      className={cn(
        // Layout & box model
        "rounded-md border p-4",
        // Colors
        "border-border"
      )}
    >
      <div className={cn("text-2xl font-semibold")}>{value}</div>
      <div className={cn("mt-1 text-xs text-muted-foreground")}>{label}</div>
    </div>
  );
}

function WhyChooseUs() {
  return (
    <section
      className={cn(
        // Layout & box model
        "container mx-auto px-4 sm:px-6 lg:px-8",
        "py-14 lg:py-16"
      )}
    >
      <div className={cn("mx-auto max-w-3xl text-center")}>
        <div
          className={cn(
            "text-xs uppercase tracking-[0.2em] text-muted-foreground"
          )}
        >
          Why Choose Us
        </div>
        <h3 className={cn("mt-2 text-2xl font-semibold sm:text-3xl")}>
          Experience the Difference
        </h3>
        <p className={cn("mx-auto mt-3 max-w-2xl text-muted-foreground")}>
          We deliver expert, tailor-made solutions focused on your unique
          needs—ensuring lasting success and measurable results for your
          business.
        </p>
      </div>

      <div className={cn("mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3")}>
        <FeatureItem
          title="Comprehensive Solutions"
          desc="End-to-end strategic guidance, covering analysis, planning, and implementation for holistic business growth."
          iconLabel={Comprehensive}
        />
        <FeatureItem
          title="Confidentiality & Trust"
          desc="Your sensitive business information is handled with utmost discretion, building a foundation of trust."
          iconLabel={Support}
        />
        <FeatureItem
          title="24/7 Customer Support"
          desc="Continuous communication and dedicated support throughout our engagement to keep objectives on track."
          iconLabel={Trust}
        />
      </div>
    </section>
  );
}

function FeatureItem({
  title,
  desc,
  iconLabel
}: {
  title: string;
  desc: string;
  iconLabel?: any;
}) {
  return (
    <div
      className={cn(
        // Layout & box model
        "rounded-md border p-6",
        // Colors
        "border-border"
      )}
    >
      <div />
      <div className={cn("h-[64px] w-[64px] rounded-sm p-4 bg-[#7A7A7A]")}><Image src={iconLabel} className="w-full h-full object-contain" alt={title} /></div>
      <h4 className={cn("mt-4 text-base font-semibold")}>{title}</h4>
      <p className={cn("mt-2 text-sm text-muted-foreground")}>{desc}</p>
    </div>
  );
}

function ConsultancyGrid() {
  return (
    <section
      id="consultancy-grid"
      className={cn(
        // Layout & box model
        "container mx-auto px-4 sm:px-6 lg:px-8",
        "py-12 sm:py-16 lg:py-20"
      )}
    >
      <div
        className={cn(
          "text-xs uppercase tracking-[0.2em] text-muted-foreground"
        )}
      >
        Consultancy List
      </div>
      <h3 className={cn("mt-3 text-3xl font-semibold sm:text-4xl")}>
        Explore Our Consultancy
      </h3>

      <div className={cn("mt-10 grid grid-cols-1 gap-8 md:grid-cols-3")}>
        <ConsultancyCard
          title="Machinery"
          price=""
          img={printer}
          url="/marketplace/machinery"
        />
        <ConsultancyCard title="Spare Parts"

          price=""
          img={image1}
          url="/marketplace/spare-parts"

        />
        <ConsultancyCard
          title="Raw Products"
          price=""
          img={Raw_material}
          url="/marketplace/raw-materials"
        />
      </div>
    </section>
  );
}

function ConsultancyCard({
  title,
  price,
  img,
  url
}: {
  title: string;
  price: string;
  img: any;
  url: string;
}) {
  return (
    <div
      className={cn(
        // Layout & box model
        "flex h-full flex-col overflow-hidden rounded-md border",
        // Colors
        "border-border",
        // Visuals
        "bg-card"
      )}
    >
      <div className={cn("flex items-center justify-between px-5 pt-5")}>
        <div className={cn("text-sm font-medium")}>{title}</div>
        <div
          className={cn(
            "h-8 w-8 rounded-sm bg-foreground/90 text-background flex items-center justify-center text-[0.75rem]"
          )}
        >
          ★
        </div>
      </div>
      <div
        className={cn(
          "mt-4 aspect-[4/3] w-full overflow-hidden border-y border-border bg-muted"
        )}
      >
        <Image
          src={img}
          alt={title}
          width={800}
          height={600}
          className={cn("h-full w-full object-fill p-6")}
        />
      </div>
      <div className={cn("flex flex-1 flex-col p-5")}>
        <div className={cn("flex items-center justify-between")}>
          <div className={cn("text-base flex items-center font-semibold")}>
            {price}
            <span
              className={cn("ml-1 align-top text-[10px] text-muted-foreground")}
            >
              {title === "Machinery" ? "" : ""}
            </span>
          </div>
        </div>
        <Link

          href={url}
          className={cn(
            // Layout & box model
            "mt-5 inline-flex items-center justify-center rounded-sm px-4 py-2",
            // Typography
            "text-xs font-medium",
            // Colors
            "bg-primary text-primary-foreground",
            // States
            "hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          type="button"
        >
          Book Your Slot
        </Link>
      </div>
    </div>
  );
}
