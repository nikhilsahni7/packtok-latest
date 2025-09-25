import {
  Briefcase,
  Building2,
  Search,
  Send,
  Sparkles,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";

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
    <section className="pt-24 pb-10 w-[95%] sm:w-[90%] md:w-[85%] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Find a job that suits your interest &amp; skills.
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl">
            Whether you are a skilled technician, machine operator, or looking
            for entry-level warehouse work, connect with employers hiring in
            your area.
          </p>
        </div>
        <div className="md:col-span-6">
          <div className="relative h-[300px] sm:h-[360px] md:h-[420px] w-full overflow-hidden rounded-xl border border-gray-200">
            <Image
              src="/bidding-header.png"
              alt="Manpower hero"
              fill
              className="object-contain p-6 bg-white"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const items = [
    {
      icon: <Briefcase className="h-5 w-5" />,
      label: "Live Job",
      value: "1,75,324",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      label: "Companies",
      value: "97,354",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Candidates",
      value: "38,47,154",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      label: "New Jobs",
      value: "7,532",
    },
  ];

  return (
    <section className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto pb-6">
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
                  `flex h-10 w-10 items-center justify-center rounded-full ` +
                  (isHighlighted
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 ring-1 ring-blue-100")
                }
              >
                {i.icon}
              </div>
              <div>
                <div
                  className={`text-xl font-semibold ${isHighlighted ? "text-blue-700" : "text-gray-900"}`}
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
    <section className="py-12">
      <div className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto">
        <h3 className="text-xl font-semibold">Most Popular Vacancies</h3>
        <div className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
          {cols.map((c) => (
            <div key={c.id}>
              <div className="text-sm font-semibold text-gray-900">
                {c.title}
              </div>
              <div className="mt-1 text-xs text-gray-500">
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
      desc: "Sign up in seconds—no lengthy forms. Just basic details to get started.",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      title: "Upload CV/Resume",
      desc: "Share your CV or create a simple profile: skills, role, certification.",
      icon: <Upload className="h-5 w-5" />,
    },
    {
      title: "Find suitable job",
      desc: "We match you with nearby openings in manufacturing, warehouse, production, and more.",
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: "Apply job",
      desc: "Submit your application in one click. Many employers respond within 24 hours!",
      icon: <Send className="h-5 w-5" />,
    },
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto">
        <h3 className="text-center text-xl font-semibold">How ManPower work</h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => {
            const selected = idx === 1; // highlight Upload CV/Resume like Figma
            return (
              <div
                key={s.title}
                className={`rounded-xl bg-white p-5 shadow-sm ${selected ? "ring-2 ring-blue-100" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${selected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 ring-1 ring-blue-100"}`}
                  >
                    {s.icon}
                  </div>
                  <div className="text-sm font-semibold">{s.title}</div>
                </div>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  {s.desc}
                </p>
                <div className="mt-4 text-[11px] text-gray-400">
                  Step {idx + 1}
                </div>
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
    <section className="py-12">
      <div className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto">
        <h3 className="text-center text-xl font-semibold">Popular category</h3>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cats.map((c) => {
            const selected = c.title === "Packaging";
            return (
              <div
                key={c.title}
                className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${selected ? "bg-blue-50 border-blue-200 ring-1 ring-blue-100" : "bg-white border-gray-200 hover:border-gray-300"}`}
              >
                <div
                  className={`h-8 w-8 rounded-md ${selected ? "bg-blue-600" : "bg-blue-50 ring-1 ring-blue-100"}`}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{c.title}</div>
                  <div
                    className={`text-[11px] ${selected ? "text-blue-600" : "text-gray-500"}`}
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
      avatar: "/article1.png",
      rating: 5,
    },
    {
      name: "Bessie Cooper",
      role: "Creative Director",
      text: "Mauris eget lorem odio. Mauris convallis justo a rutrum dui. Suspendisse ut dui vulputate augue condimentum ornare.",
      avatar: "/article2.png",
      rating: 5,
    },
    {
      name: "Jane Cooper",
      role: "Photographer",
      text: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      avatar: "/article3.png",
      rating: 5,
    },
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto">
        <h3 className="text-center text-xl font-semibold">
          Clients Testimonial
        </h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <article
              key={t.name}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {new Array(t.rating).fill(0).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                {t.text}
              </p>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCtas() {
  return (
    <section className="py-12">
      <div className="w-[95%] sm:w-[90%] md:w-[85%] mx-auto grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 md:p-8 flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold">Become a Hiring Partner</h4>
            <p className="mt-2 text-sm text-gray-600 max-w-md">
              Access a qualified industrial workforce. Post jobs, screen
              applications, and hire faster.
            </p>
            <button className="mt-4 rounded-sm bg-black px-4 py-2 text-xs font-medium tracking-wide text-white">
              Register Now
            </button>
          </div>
          <div className="hidden md:block">
            <Image
              src="/newsletter.png"
              alt="Hiring Partner"
              width={220}
              height={140}
              className="object-contain"
            />
          </div>
        </div>
        <div className="rounded-xl bg-[#0B69FF] p-6 md:p-8 text-white relative overflow-hidden">
          <div>
            <h4 className="text-lg font-semibold">Become an Employer</h4>
            <p className="mt-2 text-sm text-white/90 max-w-md">
              Launch your factory talent program today. We specialize in skilled
              and semi-skilled hiring.
            </p>
            <button className="mt-4 rounded-sm bg-white px-4 py-2 text-xs font-medium tracking-wide text-black">
              Register Now →
            </button>
          </div>
          <Image
            src="/auth.png"
            alt="Employer"
            width={220}
            height={160}
            className="pointer-events-none absolute -right-4 bottom-0 hidden md:block opacity-95"
          />
        </div>
      </div>
    </section>
  );
}
