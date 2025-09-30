import consultation from "@/assets/consultation.png";
import consumables from "@/assets/consumables.png";
import industrial from "@/assets/industrial.png";
import machinery from "@/assets/machinery2.png";
import maintenance from "@/assets/maintenance.png";
import rawmaterials from "@/assets/raw_material.png";
import spareparts from "@/assets/sparepart_bg.webp";
import tunkeryprojects from "@/assets/tunkery-projects.png";

export const navbarLinks: {
  title: string;
  href: string;
}[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Marketplace",
    href: "/marketplace",
  },
  {
    title: "Services",
    href: "/services",
  },
  {
    title: "Podcasts",
    href: "/podcasts",
  },
  {
    title: "Contact Us",
    href: "/contact",
  },
];

export const marketplaceCategories = [
  {
    title: "Machinery",
    slug: "machinery",
    subtitle: "Premium Machinery for Peak Performance",
    description:
      "Explore our extensive range of high-performance machinery designed to boost productivity and efficiency. From industrial-grade heavy equipment to precision tools, we offer reliable solutions for construction, manufacturing, agriculture, and more. Our selection includes top brands, ensuring durability, advanced technology, and exceptional performance. Whether you need excavators, CNC machines, tractors, or generators, we provide competitive pricing and trusted quality. Browse user-friendly listings with detailed specs, images, and customer reviews to make informed decisions. Enjoy seamless purchasing, flexible financing, and expert support. Upgrade your operations today with the best machinery",
    image: machinery,
  },
  {
    title: "Spare Parts",
    slug: "spare-parts",
    subtitle: "Smooth Operations Guaranteed",
    description:
      "Upgrade your machinery with our premium spare parts, designed for durability and peak performance. We stock a wide range of genuine components for construction, agriculture, industrial, and automotive equipment—ensuring seamless repairs and minimal downtime. From engine parts to hydraulic components, filters, and bearings, we source only high-quality replacements from trusted manufacturers. Enjoy easy browsing with detailed descriptions, compatibility guides, and competitive pricing. Whether for maintenance or urgent repairs, our spare parts keep your machines running longer and stronger. Shop now for reliable solutions and expert support",
    image: spareparts,
  },

  {
    title: "Raw Materials",
    slug: "raw-materials",
    subtitle: "Quality Uncompromised",
    description:
      "Source the finest raw materials for your industrial and manufacturing needs from our trusted marketplace. We offer high-quality metals, plastics, ceramics, textiles, and more—sourced from reliable suppliers to ensure strength, durability, and consistency. Whether you need steel beams, polymer pellets, or specialty alloys, our selection meets strict industry standards. Enjoy competitive pricing, bulk order options, and fast delivery to keep your production running smoothly. Build with confidence using materials that deliver performance and longevity. Browse now and elevate your projects",
    image: rawmaterials,
  },
  {
    title: "Consumables",
    slug: "consumables",
    subtitle: "Unstoppable Productivity",
    description:
      "Keep your operations running smoothly with our high-quality consumables, designed for efficiency and durability. From industrial lubricants and welding supplies to safety gear and cutting tools, we stock everything you need to minimize downtime and maximize productivity. Our competitively priced products come from trusted brands, ensuring consistent performance for workshops, factories, and job sites. Whether you need routine replacements or bulk orders, we deliver fast and hassle-free. Reduce waste and optimize costs with our carefully curated selection",
    image: consumables,
  },
  // {
  //   title: "Man Power",
  //   slug: "man-power",
  //   subtitle: "Skilled Equipment Specialists",
  //   description:
  //     "Certified machine operators & technicians for factories—expert in CNC, assembly lines, and heavy equipment. We provide skilled, safety-trained manpower to optimize your production with minimal downtime. 24/7 staffing solutions.",
  //   image: "/marketplace1.png",
  // },
];
export const serviceCategories = [
  {
    title: "Turnkey projects",
    slug: "turnkey-projects",
    subtitle: "End-to-end turnkey project solutions",
    description:
      "PackTok delivers end-to-end turnkey project solutions for industrial clients, handling everything from initial planning and machinery procurement to installation, testing, and final handover—all tailored to your specific requirements. Our expert team ensures seamless execution with cost-efficient, timely delivery, backed by professional training and ongoing support, so you can focus on your core operations while we bring your industrial vision to life",
    image: tunkeryprojects,
    isServiceCard: true,
  },
  {
    title: "Maintenance",
    slug: "maintenance",
    subtitle: "Proactive maintenance solutions",
    description:
      "At PackTok, we specialize in predictive and preventive maintenance services designed to keep your industrial machinery operating at peak performance. Our expert technicians utilize advanced diagnostics, real-time monitoring, and scheduled servicing to identify potential issues before they escalate, reducing costly downtime and extending equipment lifespan. From lubrication and calibration to wear-and-tear assessments, we offer tailored maintenance plans that align with your production schedules and operational demands.",
    image: maintenance,
    isServiceCard: true,
  },

  {
    title: "Consultancy",
    slug: "consultancy",
    subtitle: "PackTok’s expert consultancy",
    description:
      "PackTok provides expert industrial consultancy services, offering tailored solutions to optimize your operations, reduce costs, and drive sustainable growth. Our seasoned consultants deliver data-driven insights, process audits, and customized strategies—from machinery upgrades and automation integration to waste reduction and regulatory compliance—helping you make informed decisions for scalable, future-ready operations. Partner with us to transform challenges into opportunities with actionable roadmaps and trusted expertise.",
    image: consultation,
    isServiceCard: true,
  },
  {
    title: "Buy & Sell Machinery",
    slug: "buy-sell-machinery",
    subtitle: "Asset Equipment & Value Recovery",
    description:
      "Buy and sell industrial machinery through our trusted marketplace. Whether you're looking to upgrade your equipment or liquidate surplus assets, we provide comprehensive valuation, marketing, and transaction support to maximize your return on investment.",
    image: machinery,
    isServiceCard: true,
  },
  {
    title: "Investment and Takeover",
    slug: "investment-and-takeover",
    subtitle: "Investment & Acquisition Solutions",
    description:
      "Connect with vetted investors and buyers for equity investment or complete acquisitions. We facilitate seamless transactions with data-driven valuations, from partial stake placements to full business takeovers, ensuring optimal deals for all parties involved.",
    image: industrial,
    isServiceCard: true,
  },
  {
    title: "Job Finder",
    slug: "job-finder",
    subtitle: "Asset Liquidation & Value Recovery",
    description:
      "Find your next opportunity in the industrial sector. Whether you're a skilled machine operator, technician, or maintenance worker, we connect job seekers with leading industrial companies looking for talent. Submit your profile and discover exciting career possibilities.",
    image: consultation,
    isServiceCard: true,
  },
];
