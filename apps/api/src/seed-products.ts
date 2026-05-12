/**
 * Seed script: Creates 10 real-world industrial/packaging marketplace products.
 *
 * Covers all 4 ProductTypes:
 *   - MACHINERY      (3 products)
 *   - SPARE_PARTS    (3 products)
 *   - CONSUMABLES    (2 products)
 *   - RAW_MATERIALS  (2 products)
 *
 * Run:
 *   pnpm --filter @packtok/api tsx src/seed-products.ts
 *
 * Prerequisites:
 *   - DATABASE_URL must be set in apps/api/.env
 *   - A seed user (SUPER_ADMIN / ADMIN) must already exist — we use the
 *     founder@packtok.io account created by the main seed.ts script.
 *     If you need a different creator, change SEED_CREATOR_EMAIL below.
 */

import "dotenv/config";
import {
  prisma,
  MarketplaceProductStatus,
  ProductCondition,
  ProductType,
  MachineType,
} from "@packtok/db";

const SEED_CREATOR_EMAIL = "founder@packtok.io";

// ---------------------------------------------------------------------------
// Category helper — upsert by name so the script is idempotent
// ---------------------------------------------------------------------------
async function upsertCategory(name: string, subcategories: string[] = []) {
  return prisma.category.upsert({
    where: { name },
    update: {},
    create: { name, subcategories },
  });
}

// ---------------------------------------------------------------------------
// Product definitions — all real, industry-accurate data
// ---------------------------------------------------------------------------
async function buildProducts(creatorId: string) {
  // Resolve / create categories
  const catMachinery = await upsertCategory("Packaging Machinery", [
    "Mono Carton Machines",
    "Master Carton Machines",
    "Labelling Machines",
    "Filling & Sealing Machines",
    "Shrink Wrapping",
  ]);

  const catSpares = await upsertCategory("Spare Parts", [
    "Belts & Drives",
    "Bearings",
    "Sensors & Actuators",
    "Servo Drives",
    "Pneumatic Components",
  ]);

  const catConsumables = await upsertCategory("Consumables", [
    "Packaging Films",
    "Adhesives & Tapes",
    "Inks & Coatings",
    "Labels",
    "Straps & Wires",
  ]);

  const catRawMaterials = await upsertCategory("Raw Materials", [
    "Corrugated Board",
    "Kraft Paper",
    "BOPP Film",
    "Aluminium Foil",
    "Plastic Granules",
  ]);

  // ────────────────────────────────────────────────────────────────────────────
  // MACHINERY — 3 products
  // ────────────────────────────────────────────────────────────────────────────
  const p1 = {
    title: "Automatic Mono Carton Packaging Machine — 150 CPM",
    description: `The Futura 150 is a high-speed fully automatic mono carton erecting, filling and closing machine engineered for pharmaceutical, FMCG and cosmetics industries. Running at 150 cartons per minute with servo-driven pick-and-place, it integrates seamlessly with upstream blister and bottle conveyors. The cam-less servo architecture eliminates mechanical adjustments during changeovers — format changes are stored digitally and recalled at the HMI touch-screen in under 8 minutes.\n\nKey highlights:\n• Servo-driven chain transport with zero-play grippers for precise carton registration\n• Integrated hot-melt glue unit (Nordson compatible) with anti-drool control\n• Camera-based leaflet detection with automatic reject chute\n• IP65-rated electrical cabinet — suitable for washdown zones\n• Full OPC-UA connectivity for Industry 4.0 / MES integration\n• CE and cGMP compliant; optional GAMP 5 validation package`,
    price: 8500000,
    quantity: 2,
    productType: ProductType.MACHINERY,
    machineType: MachineType.MONO_CARTON,
    condition: ProductCondition.NEW,
    status: MarketplaceProductStatus.AVAILABLE,
    categoryId: catMachinery.id,
    subCategory: "Mono Carton Machines",
    manufacturer: "Futura Packaging Systems Pvt. Ltd.",
    model: "FPS-150 MC Pro",
    year: 2024,
    currency: "INR",
    displayPrice: false,
    cartEnabled: false,
    specifications: {
      speed: "Up to 150 cartons/min",
      carton_size_range: "30×20×10 mm to 200×120×80 mm",
      drive_system: "Full servo (8-axis Siemens S120)",
      glue_system: "Hot-melt Nordson compatible, 2-head",
      power_supply: "415V / 50Hz / 3-phase",
      power_consumption: "8 kW",
      air_consumption: "500 NL/min at 6 bar",
      machine_dimensions: "4200 × 1800 × 1950 mm (L×W×H)",
      machine_weight: "3200 kg",
      hmi: "15-inch Siemens TP1500 colour touch-screen",
      changeover_time: "< 8 minutes (tool-free)",
      reject_system: "Air-blast + belt diverter",
      certifications: "CE, cGMP, ISO 9001:2015",
      origin: "India",
    },
    additionalInfo:
      "Delivery lead time: 12–14 weeks from order confirmation. On-site FAT and SAT included. Spare parts kit for 1 year included in price. Training (3 days) at manufacturer's facility included.",
    images: [],
    faqs: [
      {
        question: "Can the machine handle both tuck-end and lock-bottom cartons?",
        answer:
          "Yes. The FPS-150 MC Pro supports straight-tuck, reverse-tuck and auto-lock-bottom carton styles. Style changeover requires a tooling kit (supplied) and takes approximately 20 minutes.",
      },
      {
        question: "What is the minimum order quantity?",
        answer:
          "Single machine orders are accepted. Volume discounts are available for 3+ units.",
      },
      {
        question: "Is the machine CE certified?",
        answer:
          "Yes. The machine carries full CE marking under Machinery Directive 2006/42/EC. Full technical file is available on request.",
      },
    ],
  };

  const p2 = {
    title: "Fully Automatic RSC Master Carton Erector & Sealer — 25 CPM",
    description: `The Correx 25 Master Carton Line is a robust, inline RSC (Regular Slotted Container) erecting and top-sealing system designed for high-volume secondary packaging in food, beverage, home-care and industrial goods. With a throughput of up to 25 cases per minute and automatic size-change capability, it dramatically reduces labour requirements on the end-of-line packing section.\n\nHighlights:\n• Rotary pre-breaking station eliminates manual carton opening\n• Hot-melt bottom-seal with triple glue-bead pattern for superior seal strength\n• Manual top-load station with optional robotic top-loading interface\n• Pressure-sensitive top sealing with adjustable belt pressure\n• Integrated carton coding station (inkjet or TTO compatible)\n• Quick-change size guides — format change in < 5 minutes\n• All stainless steel product contact parts for food-safe operation`,
    price: 3200000,
    quantity: 5,
    productType: ProductType.MACHINERY,
    machineType: MachineType.MASTER_CARTON,
    condition: ProductCondition.NEW,
    status: MarketplaceProductStatus.AVAILABLE,
    categoryId: catMachinery.id,
    subCategory: "Master Carton Machines",
    manufacturer: "Correx Engineering Works",
    model: "CEW-25 RSC",
    year: 2024,
    currency: "INR",
    displayPrice: false,
    cartEnabled: false,
    specifications: {
      speed: "Up to 25 cases/min",
      case_size_range: "200×150×100 mm to 600×400×350 mm",
      drive_system: "AC variable frequency drives (ABB)",
      glue_system: "Hot-melt — Robatech compatible, 4 nozzles",
      power_supply: "415V / 50Hz / 3-phase",
      power_consumption: "5.5 kW",
      air_consumption: "350 NL/min at 6 bar",
      machine_dimensions: "3500 × 1200 × 1800 mm",
      machine_weight: "1850 kg",
      hmi: "10-inch Allen-Bradley PanelView",
      changeover_time: "< 5 minutes",
      certifications: "CE, ISO 9001:2015",
      origin: "India",
    },
    additionalInfo:
      "Factory Acceptance Test (FAT) at customer's premises. 18-month comprehensive warranty. Robotic top-loader interface drawing available on request.",
    images: [],
    faqs: [
      {
        question: "Can it handle both top-seal and full-overlap cartons?",
        answer:
          "The standard CEW-25 RSC handles regular seal (H-seal) and full-overlap (FOL) patterns. Crash-lock and Houghland-style cartons require optional tooling.",
      },
      {
        question: "Is a case packer add-on available?",
        answer:
          "Yes. Correx offers the CPX-15 servo case packer that can be inline-coupled with the CEW-25 RSC. Contact sales for a bundled quote.",
      },
    ],
  };

  const p3 = {
    title: "Used Bosch sigpack TTM Horizontal Flow Wrapper — Refurbished 2022",
    description: `A premium refurbished Bosch Packaging sigpack TTM horizontal form-fill-seal (HFFS) flow-wrapping machine from 2017, comprehensively overhauled in 2022 at an authorised Bosch service centre. Ideal for confectionery bars, biscuits, medical devices and individual sachets. All wear parts (jaws, sealing elements, films path guides) have been replaced. Electrical cabinet rewired; new Servo drives installed for jaw and cross-seal.\n\nRefurbishment scope (2022):\n• New Siemens S7-1500 PLC + new HMI panel\n• Complete jaw assembly replacement (infeed, cross-seal)\n• New film web guides and tension rollers\n• Rewired electrical cabinet with new circuit breakers and contactors\n• Full calibration and FAT at service centre\n• 12-month conditional warranty on refurbished parts`,
    price: 2100000,
    quantity: 1,
    productType: ProductType.MACHINERY,
    machineType: MachineType.OTHER,
    condition: ProductCondition.USED,
    status: MarketplaceProductStatus.AVAILABLE,
    categoryId: catMachinery.id,
    subCategory: "Filling & Sealing Machines",
    manufacturer: "Bosch Packaging Technology (Robert Bosch GmbH)",
    model: "sigpack TTM",
    year: 2017,
    currency: "INR",
    displayPrice: false,
    cartEnabled: false,
    specifications: {
      speed: "Up to 300 packs/min",
      film_width: "Up to 470 mm",
      pack_length: "40–300 mm",
      pack_width: "20–130 mm",
      pack_height: "5–80 mm",
      drive_system: "Full servo — Siemens S7-1500 (new 2022)",
      jaw_type: "Rotary cross-seal + continuous longitudinal seal",
      power_supply: "400V / 50Hz / 3-phase",
      power_consumption: "7 kW",
      machine_dimensions: "4500 × 1050 × 1850 mm",
      machine_weight: "2700 kg",
      refurbishment_year: "2022",
      warranty: "12 months on refurbished parts",
      certifications: "CE (original), refurbishment to EC standards",
      origin: "Germany (refurbished in India)",
    },
    additionalInfo:
      "Complete documentation package: original Bosch manuals, 2022 refurbishment report and new CE declaration. Machine is ready for immediate dispatch from Ahmedabad warehouse. Inspection visits welcome by appointment.",
    images: [],
    faqs: [
      {
        question: "What film types are compatible?",
        answer:
          "BOPP, laminated BOPP/PE, OPP, CPP, alu-foil laminates, paper/PE laminates and most cold-seal films. Minimum film thickness 20 µm.",
      },
      {
        question: "Is installation and commissioning included in the price?",
        answer:
          "Commissioning and operator training (2 days) at the buyer's plant is included within India. International installation can be arranged at cost.",
      },
    ],
  };

  // ────────────────────────────────────────────────────────────────────────────
  // SPARE PARTS — 3 products
  // ────────────────────────────────────────────────────────────────────────────
  const p4 = {
    title: "Sealing Jaw Assembly — Multivac R530 / R535 Thermoformer (OEM Grade)",
    description: `Complete OEM-grade upper + lower sealing jaw assembly for Multivac R530 and R535 thermoforming packaging machines. Manufactured from tool steel DIN 1.2379 with precision ground sealing surfaces and hard-chrome plating on the sealing bars. Fits directly without any machining. Each assembly includes: upper jaw body, lower jaw body, heating cartridges (4×, 600W), thermocouple (J-type), insulation pads, and all mounting hardware.\n\nCompatibility: Multivac R530, R535 (web width 530 mm). Not compatible with R245, R405 or R570 series.`,
    price: 185000,
    quantity: 8,
    productType: ProductType.SPARE_PARTS,
    machineType: null,
    condition: ProductCondition.NEW,
    status: MarketplaceProductStatus.AVAILABLE,
    categoryId: catSpares.id,
    subCategory: "Bearings",
    manufacturer: "PrecisionPack Spares Pvt. Ltd. (OEM Grade)",
    model: "SJA-MV530",
    year: 2024,
    currency: "INR",
    displayPrice: true,
    cartEnabled: true,
    specifications: {
      compatible_machines: "Multivac R530, R535",
      web_width: "530 mm",
      jaw_material: "Tool steel DIN 1.2379, hard-chrome plated sealing face",
      heating_cartridges: "4 × 600W, 230V",
      thermocouple: "J-type, M4 connector",
      sealing_temperature_range: "80–220°C",
      jaw_weight_full_set: "18 kg",
      surface_finish: "Ra 0.4 µm",
      warranty: "12 months against manufacturing defects",
      lead_time: "In stock — ships within 48 hours",
      packaging: "Custom foam-lined crate",
    },
    additionalInfo:
      "All parts are 100% dimensionally inspected before dispatch with a CMM report supplied on request. Bulk pricing available for 5+ sets. Exchange scheme available for core return.",
    images: [],
    faqs: [
      {
        question: "Can I order just the upper or lower jaw separately?",
        answer:
          "Yes. Upper jaw assembly (SJA-MV530-U) and lower jaw assembly (SJA-MV530-L) can be purchased separately at 55% and 45% of the full set price respectively.",
      },
      {
        question: "Are the heating cartridges pre-installed?",
        answer:
          "No. To allow inspection of the jaw channels, cartridges are supplied separately and can be installed in under 20 minutes using the supplied hex key.",
      },
    ],
  };

  const p5 = {
    title: "INA RUPE25 Linear Guideway Carriage — Knapp KHS / Schubert Compatible",
    description: `Genuine INA brand RUPE25 linear guideway carriages (preload class P1 / C3 clearance) suitable for Gerhard Schubert TLM transmodule pick-and-place gantries and Knapp KHS open-channel conveyor systems. Sold individually. These are INA (Schaeffler Group) original parts, not aftermarket, supplied with INA's standard quality certificate.\n\nClass: Standard-duty (up to 25 kN dynamic load rating). Lubrication port: BSPT 1/8" standard. Material: hardened 100Cr6 steel races, 20MnCr5 steel carriage body. Suitable for speeds up to 3 m/s continuous.`,
    price: 12500,
    quantity: 50,
    productType: ProductType.SPARE_PARTS,
    machineType: null,
    condition: ProductCondition.NEW,
    status: MarketplaceProductStatus.AVAILABLE,
    categoryId: catSpares.id,
    subCategory: "Bearings",
    manufacturer: "INA (Schaeffler Group) — Supplied by PacTek Spares Hub",
    model: "RUPE25",
    year: 2024,
    currency: "INR",
    displayPrice: true,
    cartEnabled: true,
    specifications: {
      size: "25 mm",
      dynamic_load_rating: "25 kN",
      static_load_rating: "30.5 kN",
      preload_class: "P1 (light preload, ~2% of C)",
      clearance: "C3 (standard class 3)",
      lubrication_port: "BSPT 1/8\"",
      max_speed: "3 m/s continuous",
      operating_temperature: "-20°C to +80°C",
      sealing: "Double-lip seal both ends (FKM optional)",
      material_races: "100Cr6 bearing steel, hardened to 58–62 HRC",
      material_body: "20MnCr5 carriage body, case-hardened",
      weight: "0.43 kg",
      manufacturer_part_no: "INA RUPE25",
      certifications: "ISO 9001, Schaeffler quality certificate",
      lead_time: "In stock — ships within 24 hours",
    },
    additionalInfo:
      "Minimum order 1 unit. Discount tiers: 10+ units 5%, 25+ units 10%, 50+ units 15%. Genuine INA inspection certificate available on request.",
    images: [],
    faqs: [
      {
        question: "Is this compatible with the Bosch Rexroth R160 rail?",
        answer:
          "The RUPE25 carriage is specifically matched to INA KWVE25 rails. It is NOT directly interchangeable with Rexroth R160220 rails due to different ball recirculation geometry. Use INA RUPE25 carriages on INA KWVE25 rails only.",
      },
    ],
  };

  const p6 = {
    title: "Nordson ProBlue 10 Hot-Melt Adhesive Unit — Complete Service Kit",
    description: `Complete annual service kit for Nordson ProBlue 10 (10-litre) hot-melt adhesive melter units, widely used in mono and master carton erecting lines across the packaging industry. This kit covers one full preventive maintenance cycle and includes all wearable and scheduled-replacement components per Nordson's recommended maintenance schedule.\n\nKit Contents (all genuine Nordson parts):\n• 4× Filter cartridges (100 mesh, PN 1043286)\n• 2× Tank O-ring seal kits\n• 4× Nozzle tip inserts (standard round 0.3 mm, PN 1020439)\n• 1× Manifold O-ring set (PN 1030071)\n• 2× RTD temperature sensors\n• 1× Pressure relief valve (PN 1027015)\n• 1× Hose quick-disconnect O-ring kit\n• 1× Applicator reconnect O-ring kit`,
    price: 28500,
    quantity: 30,
    productType: ProductType.SPARE_PARTS,
    machineType: null,
    condition: ProductCondition.NEW,
    status: MarketplaceProductStatus.AVAILABLE,
    categoryId: catSpares.id,
    subCategory: "Pneumatic Components",
    manufacturer: "Nordson Corporation — Authorised Stocking Distributor",
    model: "ProBlue 10 Annual Service Kit",
    year: 2024,
    currency: "INR",
    displayPrice: true,
    cartEnabled: true,
    specifications: {
      compatible_unit: "Nordson ProBlue 10 (10-litre tank)",
      also_compatible: "ProBlue 4, ProBlue 7 (filter cartridge only differs)",
      filter_mesh: "100 mesh (150 µm)",
      nozzle_orifice: "0.3 mm round (standard)",
      rtd_accuracy: "±1°C",
      kit_weight: "0.8 kg",
      storage_condition: "Dry, 15–35°C",
      warranty: "12 months against manufacturing defect",
      lead_time: "In stock — ships within 24 hours",
      certifications: "Nordson genuine parts authenticity sticker",
    },
    additionalInfo:
      "Buy 5 kits, get 1 free (promotional pricing valid until current stock lasts). Also available: ProBlue 4 and ProBlue 7 service kits — enquire separately.",
    images: [],
    faqs: [
      {
        question: "Is this compatible with Nordson DuraBlue units?",
        answer:
          "This kit is designed for ProBlue 10 only. DuraBlue (AD-31, AD-33) units use a different filter and manifold design — a separate DuraBlue service kit is available on request.",
      },
    ],
  };

  // ────────────────────────────────────────────────────────────────────────────
  // CONSUMABLES — 2 products
  // ────────────────────────────────────────────────────────────────────────────
  const p7 = {
    title: "Transparent BOPP Self-Adhesive Carton Sealing Tape — 48mm × 100m (Box of 72)",
    description: `Premium-grade biaxially oriented polypropylene (BOPP) hot-melt self-adhesive carton sealing tape, widely used in packaging lines for RSC master carton sealing where hot-melt glue or water-activated tape is not preferred. The acrylic-coated backing delivers excellent UV resistance and performance from -10°C to +60°C storage.\n\nSpecifications match ASTM D-1000 standard. Consistent caliper across roll width (±2 µm) ensures smooth passage through automated tape dispensers including Tesa 6400, 3M AccuGlide and Ranpak systems.\n\nSold as carton of 72 rolls. Per-roll pricing available for sample orders (minimum 6 rolls).`,
    price: 5400,
    quantity: 200,
    productType: ProductType.CONSUMABLES,
    machineType: null,
    condition: ProductCondition.NEW,
    status: MarketplaceProductStatus.AVAILABLE,
    categoryId: catConsumables.id,
    subCategory: "Adhesives & Tapes",
    manufacturer: "PakTape Industries Pvt. Ltd.",
    model: "PT-BOPP-4810 Clear",
    year: 2024,
    currency: "INR",
    displayPrice: true,
    cartEnabled: true,
    specifications: {
      width: "48 mm ± 0.5 mm",
      roll_length: "100 m",
      backing_material: "BOPP film 30 µm",
      adhesive_type: "Hot-melt pressure-sensitive acrylic",
      adhesive_coat_weight: "22 g/m²",
      total_caliper: "52 µm ± 2 µm",
      tensile_strength: "≥ 55 N/25mm (ASTM D-5034)",
      elongation_at_break: "120%",
      peel_adhesion: "≥ 8 N/25mm (180° peel on corrugated, ASTM D-903)",
      tack: "≥ 14 N (rolling ball, ASTM D-3121)",
      temperature_range: "-10°C to +60°C (storage and service)",
      core_id: "76 mm (3 inch)",
      rolls_per_box: 72,
      box_dimensions: "500 × 250 × 250 mm",
      box_weight: "11 kg",
      certifications: "ISO 9001:2015, RoHS compliant",
    },
    additionalInfo:
      "Custom printing (1–6 colours, flexo) available for orders of 1,000 rolls+. Also available in 72mm width (PT-BOPP-7210 Clear). Halal/Kosher certified adhesive option available.",
    images: [],
    faqs: [
      {
        question: "Is this tape compatible with cold storage cartons?",
        answer:
          "Yes. The PT-BOPP-4810 Clear performs down to -10°C and is suitable for cold storage and chilled logistics applications. For deep-freeze (-25°C and below), enquire about our low-temperature grade PT-BOPP-4810 LT.",
      },
      {
        question: "What is the shelf life?",
        answer:
          "18 months from manufacture date when stored at 15–25°C, ≤65% RH, away from direct sunlight.",
      },
    ],
  };

  const p8 = {
    title: "HP Indigo ElectroInk Cyan — 1 kg Canister (HP AP722C / Indigo 7900 Series)",
    description: `Genuine HP Indigo Liquid ElectroInk in Cyan for HP Indigo 7900, 7600, 6900 and 15K digital label and flexible packaging presses. HP ElectroInk is the industry benchmark for digital flexible packaging print, delivering photographic image quality, vibrant colour and full Pantone-coverage capability. This is authentic HP original ink — not a third-party compatible.\n\nElectroInk HP AP722C Cyan meets FDA 21 CFR 175.300 requirements for indirect food contact printing and EU Regulation 10/2011 compliance. Suitable for printing directly onto flexible film substrates for lamination or as stand-alone label stock.`,
    price: 32000,
    quantity: 25,
    productType: ProductType.CONSUMABLES,
    machineType: null,
    condition: ProductCondition.NEW,
    status: MarketplaceProductStatus.AVAILABLE,
    categoryId: catConsumables.id,
    subCategory: "Inks & Coatings",
    manufacturer: "HP Inc. (Indigo Division) — Authorised HP Partner",
    model: "HP ElectroInk AP722C Cyan",
    year: 2024,
    currency: "INR",
    displayPrice: true,
    cartEnabled: true,
    specifications: {
      colour: "Cyan (C)",
      part_number: "Q4072A / AP722C",
      compatible_presses:
        "HP Indigo 7900, 7600, 6900, 6600, 5900, 5600, 15K, WS6900",
      canister_weight: "1 kg net",
      ink_technology: "Liquid ElectroInk (LEP)",
      resolution: "Up to 812 dpi HP Indigo native",
      food_contact_compliance: "FDA 21 CFR 175.300 (indirect), EU 10/2011",
      storage_temperature: "15–25°C",
      shelf_life_from_manufacture: "24 months (unopened)",
      substrates:
        "BOPP, PET, PE, OPP, PVC, paper label stocks, thermal transfer topcoats",
      certifications: "HP original, ISO 9001, ISO 14001",
    },
    additionalInfo:
      "Pricing is per canister. Volume pricing available: 10+ canisters 5% off, 50+ canisters 12% off. Full ink set (CMYK + W) quotation available. Genuine HP authentication chip included.",
    images: [],
    faqs: [
      {
        question: "Does this ink support Pantone matching?",
        answer:
          "Yes. HP Indigo ElectroInk in the standard CMYK + Spot Silver + Spot White set covers 97%+ of the Pantone Solid Coated gamut when profiled correctly with the HP IndiChrome solution.",
      },
    ],
  };

  // ────────────────────────────────────────────────────────────────────────────
  // RAW MATERIALS — 2 products
  // ────────────────────────────────────────────────────────────────────────────
  const p9 = {
    title:
      "Virgin Grade BOPP Film Roll — 20 µm, 750mm Wide, 10,000m (Treofan / Cosmo Grade)",
    description: `Biaxially Oriented Polypropylene (BOPP) film in virgin grade for flexible food packaging, labelling and lamination applications. Suitable for snack foods, confectionery, bakery, noodles and processed food inner wrapping. Standard heat-sealable grade (one-side corona, one-side acrylic heat-seal coating) meeting strict food safety standards.\n\nMeet BIS IS:2633 (packaging film), FDA 21 CFR 177.1520 and EU Regulation 10/2011 for food contact. Supplied as a single parent roll per unit listing. Standard slit-to-width service available (48hr turnaround) for widths from 110mm to 750mm.`,
    price: 42000,
    quantity: 100,
    productType: ProductType.RAW_MATERIALS,
    machineType: null,
    condition: ProductCondition.NEW,
    status: MarketplaceProductStatus.AVAILABLE,
    categoryId: catRawMaterials.id,
    subCategory: "BOPP Film",
    manufacturer: "IndiaFilm Polymers Ltd. (Cosmo-grade raw resin)",
    model: "IFP-BOPP-20-HS",
    year: 2024,
    currency: "INR",
    displayPrice: true,
    cartEnabled: true,
    specifications: {
      film_type: "BOPP — Heat Sealable (1-sided)",
      thickness: "20 µm ± 1 µm",
      roll_width: "750 mm",
      roll_length: "10,000 m",
      roll_weight_approx: "13.5 kg",
      core_id: "76 mm (3 inch)",
      heat_seal_range: "100–120°C / 1 bar / 0.5 sec",
      haze: "≤ 1.5% (ASTM D-1003)",
      gloss_60deg: "≥ 92 GU (ASTM D-2457)",
      tensile_strength_md: "≥ 170 MPa",
      tensile_strength_td: "≥ 250 MPa",
      elongation_md: "110–130%",
      elongation_td: "55–75%",
      oxygen_transmission: "1800 cc/m²/day (ASTM D-3985)",
      wvtr: "3.5 g/m²/day (38°C, 90% RH, ASTM E-96)",
      surface_tension_corona: "≥ 40 dynes/cm",
      food_contact: "FDA 21 CFR 177.1520, EU Regulation 10/2011",
      certifications: "ISO 9001:2015, BIS IS:2633",
    },
    additionalInfo:
      "Minimum order: 10 rolls. Slit rolls (smaller widths) available within 48 hours; call to confirm current slit width availability. Storage: 15–30°C, ≤60% RH, away from UV. Shelf life 12 months in original packaging.",
    images: [],
    faqs: [
      {
        question: "Is this film suitable for reverse printing (solvent-based inks)?",
        answer:
          "Yes, the un-coated side (corona-treated to ≥38 dynes/cm) is suitable for reverse gravure printing with toluene- and MEK-based inks. Verify ink adhesion with your press trials before full production.",
      },
      {
        question: "Can you supply metallised BOPP?",
        answer:
          "Metallised variants (IFP-BOPP-20-MET, 12 µm) are available with 3-tonne minimum. Please submit a raw material enquiry for pricing.",
      },
    ],
  };

  const p10 = {
    title: "Kraft Liner Board 200 GSM — 1.3m × 1500m Roll (Virgin Fibres, BF Grade)",
    description: `Premium quality virgin-fibre Bleached Kraft Liner (BF Grade) at 200 GSM, supplied as a large-format parent roll for the corrugated board and carton manufacturing industry. Sourced from FSC-certified pulp mills; suitable as the outer liner for B-flute and E-flute corrugated boards used in premium retail packaging and high-print-quality export cartons.\n\nBurst Factor ≥ 32; Cobb60 ≤ 28 g/m² (excellent moisture resistance for humid storage environments). CMT (Concora Medium Test) 170–180 N at conditioned state. Consistent moisture content 7-9% for uniform printing and lamination.`,
    price: 58000,
    quantity: 60,
    productType: ProductType.RAW_MATERIALS,
    machineType: null,
    condition: ProductCondition.NEW,
    status: MarketplaceProductStatus.AVAILABLE,
    categoryId: catRawMaterials.id,
    subCategory: "Kraft Paper",
    manufacturer: "Kerala Newsprint & Paper Mills Ltd. — Export Division",
    model: "KNPM-KL-200-BF",
    year: 2024,
    currency: "INR",
    displayPrice: true,
    cartEnabled: true,
    specifications: {
      grade: "Bleached Kraft Liner (BF) — Virgin Fibre",
      grammage: "200 GSM ± 3 GSM (ISO 536)",
      roll_width: "1300 mm",
      roll_length: "1500 m",
      roll_weight_approx: "390 kg",
      core_id: "150 mm",
      burst_factor: "≥ 32 (TAPPI T-403)",
      cobb60: "≤ 28 g/m² (ISO 535)",
      tensile_strength_md: "≥ 9.0 kN/m (ISO 1924-3)",
      tensile_strength_cd: "≥ 5.0 kN/m",
      tear_strength_md: "≥ 750 mN (ISO 1974)",
      cmt: "170–180 N (TAPPI T-809)",
      moisture_content: "7–9%",
      brightness: "≥ 80% ISO (ISO 2470)",
      smoothness_felt_side: "≤ 150 mL/min Bendtsen (ISO 8791-2)",
      pulp_source: "Virgin long-fibre softwood kraft (FSC-certified)",
      food_contact:
        "Suitable for food-contact outer layer (indirect), REACH compliant",
      certifications: "FSC, ISO 9001:2015, BIS IS:1848",
    },
    additionalInfo:
      "Minimum order: 5 rolls. Loading: 20-foot container holds 16 rolls. Palletised delivery with polypropylene strapping and kraft wrap protection. Price is ex-warehouse, Ernakulam. Freight to be arranged by buyer or quoted separately.",
    images: [],
    faqs: [
      {
        question: "Is this suitable as the inner liner (medium) in corrugated board?",
        answer:
          "No. This is a flat liner grade, not a semi-chemical medium. For corrugated fluting (medium), use our KNPM-SC-160 semi-chemical grade. The liner grade has insufficient CMT for the fluting application.",
      },
      {
        question: "Can I get a sample roll before placing a bulk order?",
        answer:
          "Yes. Sample sheets (500mm × 500mm, 10 sheets) are dispatched free of charge within India. Contact our sales team with your GSM requirement.",
      },
    ],
  };

  return [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("🌱  Seeding 10 marketplace products...\n");

  // Find the seed creator
  const creator = await prisma.user.findUnique({
    where: { email: SEED_CREATOR_EMAIL },
  });

  if (!creator) {
    throw new Error(
      `Seed creator "${SEED_CREATOR_EMAIL}" not found in users table.\n` +
        `Run the main seed script first:\n  pnpm --filter @packtok/api seed`
    );
  }

  console.log(`✅  Creator found: ${creator.name} (${creator.email})`);

  const products = await buildProducts(creator.id);

  let created = 0;
  let skipped = 0;

  for (const productData of products) {
    // Idempotency: skip if a product with the same title already exists
    const existing = await prisma.marketplaceProduct.findFirst({
      where: { title: productData.title },
    });

    if (existing) {
      console.log(`   ⏭️   SKIP  "${productData.title.slice(0, 60)}…"`);
      skipped++;
      continue;
    }

    const { categoryId: _cid, ...rest } = productData as any;

    await prisma.marketplaceProduct.create({
      data: {
        ...rest,
        categoryId: productData.categoryId,
        createdById: creator.id,
        submissionStatus: null, // admin-created — no approval required
      },
    });

    console.log(
      `   ✅  CREATE ${productData.productType.padEnd(14)} "${productData.title.slice(0, 55)}…"`
    );
    created++;
  }

  console.log(
    `\n🎉  Done! Created: ${created}, Skipped (already exist): ${skipped}\n`
  );
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
