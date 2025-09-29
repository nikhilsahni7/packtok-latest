import Image from "next/image";
import heroimage from "@/assets/hero_manpower.png"

import briefcase from "@/assets/briefcase-duotone.png"
import buildings from "@/assets/buildings-duotone.png"
import users from "@/assets/users-duotone.png"

import userplus from "@/assets/user-plus.png"
import cloudArrow from "@/assets/CV/cloud-arrow-up-duotone 1.png"
import magnifying from "@/assets/magnifying-glass-plus.png"
import circle_wavy from "@/assets/circle-wavy-check.png"
import testi from "@/assets/testti.png"
import Quote from "@/assets/Quote.png"










export default function ManpowerPage() {
  return (
    <main className="w-full">
      <HeroSection />
      <StatsSection />
      <PopularVacanciesSection />
      <HowItWorksSection />
      <PopularCategorySection />
      <TestimonialsSection />
      <BottomCtas />
    </main>
  );
}

function HeroSection() {
  return (
    <div className="bg-[#F1F2F499]">
      <section className="py-17 w-[95%]  sm:w-[90%] md:w-[70%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6">
            <h1 className="text-[2.7rem] font-medium leading-tight">
              Find a job that suits your interest &amp; skills.
            </h1>
            <p className="mt-4 text-gray-600 max-w-xl">
              Whether you are a skilled technician, machine operator, or looking
              for entry-level warehouse work, connect with employers hiring in
              your area.
            </p>
          </div>
          <div className="md:col-span-6">
            <div className="relative h-[300px] sm:h-[360px] md:h-[420px] w-full overflow-hidden rounded-xl">
              <Image
                src={heroimage}
                alt="Manpower hero"
                fill
                className="object-contain p-6"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatsSection() {
  const items = [
    {
      icon: briefcase,
      label: "Live Job",
      value: "1,75,324",
    },
    {
      icon: buildings,
      label: "Companies",
      value: "97,354",
    },
    {
      icon: users,
      label: "Candidates",
      value: "38,47,154",
    },
    {
      icon: briefcase,
      label: "New Jobs",
      value: "7,532",
    },
  ];

  return (
    <div className="bg-[#F1F2F499]">
      <section className="w-[95%] sm:w-[90%] md:w-[70%] mx-auto pb-20">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {items.map((i, idx) => {
            const isHighlighted = idx === 1; // match Figma: 2nd card highlighted
            return (
              <div
                key={i.label}
                className={
                  `flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-colors ` +
                  (isHighlighted
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200")
                }
              >
                <div
                  className={
                    `flex h-[54px] w-[54px] items-center justify-center  ` +
                    (isHighlighted
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700 ring-1 ring-blue-100")
                  }
                >
                  <Image src={i.icon} alt="" />
                </div>
                <div>
                  <div
                    className={`text-[1.14rem] font-medium ${isHighlighted ? "text-blue-700" : "text-gray-900"}`}
                  >
                    {i.value}
                  </div>
                  <div
                    className={`text-xs ${isHighlighted ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {i.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function PopularVacanciesSection() {
  const cols = new Array(8).fill(0).map((_, i) => ({
    id: i,
    title: "Machine Operators",
    sub: [
      "45,304 Open Positions",
      "50,248 Open Positions",
      "43,239 Open Positions",
      "4,339 Open Positions",
    ][i % 4],
  }));

  return (
    <section className="py-30">
      <div className="w-[95%] sm:w-[90%] md:w-[70%] mx-auto">
        <h3 className="text-[2rem] pb-5 font-medium">Most Popular Vacancies</h3>
        <div className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
          {cols.map((c) => (
            <div key={c.id}>
              <div className="text-[13.5px] font-medium text-[#18191C]">
                {c.title}
              </div>
              <div className="mt-1 text-[10.5px] text-[#18191C]">
                <p>{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      title: "Create account",
      desc: "Sign up in seconds—no lengthy forms. Just basic details to get started in the industrial job market.",
      icon: userplus,
    },
    {
      title: "Upload CV/Resume",
      desc: "Share your CV/resume or simply list your skills (e.g., forklift certification, welding experience). Employers value hands-on expertise",
      icon: cloudArrow,
    },
    {
      title: "Find suitable job",
      desc: "We match you with nearby openings in manufacturing, warehouses, and production—filter by shift, pay, or job type.",
      icon: magnifying,
    },
    {
      title: "Apply job",
      desc: "Submit your application in one click. Many employers respond within 24 hours!",
      icon: circle_wavy,
    },
  ];

  return (
    <section className="bg-[#F1F2F499] py-26">
      <div className="w-[95%] sm:w-[90%] md:w-[70%] mx-auto">
        <h3 className="text-[2rem] pb-5 font-medium text-center">How ManPower work</h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => {
            const selected = idx === 1; // highlight Upload CV/Resume like Figma
            return (
              <div
                key={s.title}
                className={`rounded-xl   p-5   ${selected ? "" : ""}`}
              >
                <div className="flex items-center  flex-col gap-5">
                  <div
                    className={`flex h-[54px] w-[54px] items-center  justify-center rounded-full ${selected ? "bg-blue-600 text-white" : "bg-white text-blue-700 "}`}
                  >
                    <Image src={s.icon} alt="icons" />
                  </div>
                  <div className="text-[13.5px] font-medium">{s.title}</div>
                </div>
                <p className="mt-3 text-[10.5px] text-center text-gray-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PopularCategorySection() {
  const cats = [
    { title: "Production & Assembly", count: 357 },
    { title: "Welding & Metalwork", count: 312 },
    { title: "Packaging", count: 287 },
    { title: "Warehouse & Logistics", count: 204 },
    { title: "Machine Operation", count: 187 },
    { title: "Shipping", count: 178 },
    { title: "Quality Control", count: 197 },
    { title: "Safety & Maintenance", count: 165 },
  ];

  return (
    <section className="py-26">
      <div className="w-[95%] sm:w-[90%] md:w-[70%] mx-auto">
        <h3 className="text-center text-[2rem] pb-5 font-medium">Popular category</h3>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cats.map((c) => {
            const selected = c.title === "Packaging";
            return (
              <div
                key={c.title}
                className={`flex items-center gap-3  p-4  ${selected ? "" : ""}`}
              >
                <div
                  className={`h-[51px] w-[51px] rounded-md ${selected ? "bg-blue-50 ring-1 ring-blue-100" : "bg-blue-50 ring-1 ring-blue-100"}`}
                />
                <div className="flex-1">
                  <div className="text-[13.5px] pb-1 font-medium">{c.title}</div>
                  <div
                    className={`text-[11px] ${selected ? "text-gray-500" : "text-gray-500"}`}
                  >
                    {c.count} open position
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const items = [
    {
      name: "Robert Fox",
      role: "UI/UX Designer",
      text: "Ut ullamcorper hendrerit tempor. Aliquam in faucibus est. Maecenas ac placerat metus.",
      avatar: testi,
      rating: 5,
    },
    {
      name: "Bessie Cooper",
      role: "Creative Director",
      text: "Mauris eget lorem odio. Mauris convallis justo a rutrum dui. Suspendisse ut dui vulputate augue condimentum ornare.",
      avatar: testi,
      rating: 5,
    },
    {
      name: "Jane Cooper",
      role: "Photographer",
      text: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      avatar: testi,
      rating: 5,
    },
  ];

  return (
    <section className="bg-[#F1F2F4] py-35">
      <div className="w-[95%] sm:w-[90%] md:w-[70%] mx-auto">
        <h3 className="text-center text-[30px] font-meduim">
          Clients Testimonial
        </h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <article
              key={t.name}
              className="rounded-xl flex flex-col justify-between border  bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {new Array(t.rating).fill(0).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                {t.text}
              </p>
              <div className="flex items-center justify-between">
                <div className="mt-6 flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <Image
                    src={Quote}
                    alt={t.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCtas() {
  return (
    <section className="py-24">
      <div className="w-[95%] sm:w-[90%] md:w-[70%] mx-auto grid gap-6 md:grid-cols-2">
        <div className="rounded-xl become_man bg-no-repeat h-[232px] border bg-white p-6 md:p-8 flex items-center justify-between">
          <div>
            <h4 className="text-[24px] font-meduim">Become a Hiring Partner</h4>
            <p className="mt-2 text-sm text-gray-600 max-w-md">
              Grow your workforce with qualified industrial talent. Our platform connects you with pre-screened machine operators, warehouse staff, and skilled tradespeople ready to work.
            </p>
            <button className="mt-4 rounded-sm bg-black px-4 py-2 text-xs font-medium tracking-wide text-white">
              Register Now
            </button>
          </div>


        </div>
        <div className="rounded-xl become_man2 bg-no-repeat h-[232px]  bg-[50%_25%] p-6 md:p-8 text-white relative overflow-hidden">
          <div>
            <h4 className="text-[24px] font-meduim">Become an Employer</h4>
            <p className="mt-2 text-sm text-white/90 max-w-md">
              Launch your factory career with top manufacturers in your area. We specialize in production, assembly, and warehouse jobs with competitive pay.
            </p>
            <button className="mt-4 rounded-sm bg-white px-4 py-2 text-xs font-medium tracking-wide text-black">
              Register Now →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
