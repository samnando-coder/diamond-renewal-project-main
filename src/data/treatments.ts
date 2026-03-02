export type TreatmentLabel = "beauty" | "health" | "beauty & health" | "health & beauty";

export type Treatment = {
  slug: string;
  title: string;
  label: TreatmentLabel;
  intro: string;
  details?: string;
  highlights?: string[];
  image?: string;
  images?: string[];
};

/**
 * IMPORTANT (requested):
 * - No AI placeholders for treatments.
 * - No repeated photos across treatments.
 * - Only use explicitly chosen real photos so the image matches the treatment.
 */
type OverrideValue = string | string[];

const TREATMENT_PHOTO_OVERRIDES: Record<string, OverrideValue> = {
  // User-provided in-house photos (Feb 2026)
  haar: ["/Blue Diamonds Foto's/IMG_0291.jpeg", "/Blue Diamonds Foto's/IMG_0293.jpeg"],
  "make-up-haarstyling": [
    "/Blue Diamonds Foto's/IMG_0292.jpeg",
    "/Blue Diamonds Foto's/IMG_0308.jpeg",
    "/Blue Diamonds Foto's/IMG_0310.jpeg",
  ],
  "massage-stijlen": [
    "/Blue Diamonds Foto's/IMG_0331.jpeg",
    "/Blue Diamonds Foto's/IMG_0295.jpeg",
    "/Blue Diamonds Foto's/IMG_0321.jpeg",
    "/Blue Diamonds Foto's/IMG_0335.jpeg",
    "/Blue Diamonds Foto's/IMG_5479.jpg",
  ],
  handen: ["/Blue Diamonds Foto's/IMG_0311.png", "/Blue Diamonds Foto's/IMG_0312.jpeg"],
  voeten: ["/Blue Diamonds Foto's/IMG_0319.jpeg", "/stock/pexels/treatment-voeten.jpg"],
  "wenkbrauwen-wimpers": "/Blue Diamonds Foto's/IMG_0318.jpeg",
  "magnesium-energie-boost": "/stock/pexels/uw-sand-bed.jpg",
  "podoposturale-therapie-fysiotherapie": "/Blue Diamonds Foto's/IMG_0325.jpeg",

  // Existing in-house images
  "gezichtsbehandelingen": "/Blue Diamonds Foto's/IMG_5530.jpg",
  "led-lichttherapie": "/Blue Diamonds Foto's/IMG_5609.jpg",

  // Not yet replaced (keep as-is until we pick in-house photos for these)
  "permanent-make-up": "/stock/pexels/treatment-pmu.jpg",
  waxen: "/stock/pexels/treatment-waxen-2.jpg",
  lichaam: "/Blue Diamonds Foto's/IMG_5623.jpg",
};

function hashString(input: string): number {
  // FNV-1a 32-bit
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function daySeed(d = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Note: imageFor and imagesFor return local paths.
// Components should use getCloudinaryImageUrl() to transform them to Cloudinary URLs.
const imageFor = (slug: string): string => {
  const value = TREATMENT_PHOTO_OVERRIDES[slug];
  if (!value) return "/Blue Diamonds Foto's/IMG_5421.jpg";
  if (typeof value === "string") return value;
  if (value.length === 0) return "/Blue Diamonds Foto's/IMG_5421.jpg";

  // Deterministic "daily" rotation per slug, so multiple photos get used without random flicker.
  const idx = hashString(`${daySeed()}:${slug}`) % value.length;
  return value[idx]!;
};

const imagesFor = (slug: string): string[] => {
  const value = TREATMENT_PHOTO_OVERRIDES[slug];
  if (!value) return ["/Blue Diamonds Foto's/IMG_5421.jpg"];
  if (typeof value === "string") return [value];
  return value.length ? value : ["/Blue Diamonds Foto's/IMG_5421.jpg"];
};

export const TREATMENTS: Treatment[] = [
  {
    slug: "haar",
    title: "Haar",
    label: "beauty",
    intro: "Mooi & verzorgd — van verzorging tot styling. We denken mee op basis van jouw haar en wensen.",
    highlights: ["Advies op maat", "Salonkwaliteit", "Verzorging & styling"],
  },
  {
    slug: "make-up-haarstyling",
    title: "Make-up & Haarstyling",
    label: "beauty",
    intro: "Voor een natuurlijke look of juist glam: make-up en haarstyling afgestemd op jouw gelegenheid.",
    highlights: ["Dag- & avondlook", "Bruidsstyling", "Touch-ups"],
  },
  {
    slug: "massage-stijlen",
    title: "Massage stijlen",
    label: "health",
    intro: "Ontspanning, herstel en balans — verschillende massagestijlen, altijd met aandacht voor jouw lichaam.",
    highlights: ["Ontspanningsmassage", "Diepe ontspanning", "Stress release"],
  },
  {
    slug: "gezichtsbehandelingen",
    title: "Gezichtsbehandelingen (soorten)",
    label: "beauty & health",
    intro: "Huidverbetering en verzorging met professionele producten voor een stralende, gezonde huid.",
    highlights: ["Reiniging", "Hydratatie", "Anti-aging", "Glow"],
  },
  {
    slug: "handen",
    title: "Handen",
    label: "health & beauty",
    intro: "Verzorgde handen met aandacht voor comfort en uitstraling.",
    highlights: ["Verzorging", "Hydratatie", "Mooi resultaat"],
  },
  {
    slug: "voeten",
    title: "Voeten",
    label: "health & beauty",
    intro: "Comfort en verzorging — van onderhoud tot ontspanning.",
    highlights: ["Verzorging", "Comfort", "Ontspanning"],
  },
  {
    slug: "lichaam",
    title: "Lichaam",
    label: "health & beauty",
    intro: "Body behandelingen gericht op verzorging, ontspanning en een frisse uitstraling.",
    highlights: ["Scrub & verzorging", "Body focus", "Ontspanning"],
  },
  {
    slug: "permanent-make-up",
    title: "Permanent make up",
    label: "beauty",
    intro: "Een verzorgde look, iedere dag — subtiel en passend bij jouw gezicht.",
    highlights: ["Subtiel resultaat", "Persoonlijk advies", "Natuurlijke look"],
  },
  {
    slug: "wenkbrauwen-wimpers",
    title: "Wenkbrauwen & Wimpers",
    label: "beauty",
    intro: "Accentueer je blik met behandelingen die écht bij jou passen.",
    highlights: ["Vorm & definitie", "Natuurlijke uitstraling", "Strakke afwerking"],
  },
  {
    slug: "magnesium-energie-boost",
    title: "Magnesium energie boost",
    label: "health",
    intro: "Gericht op ontspanning, herstel en energie. Perfect als je ‘even’ wilt opladen.",
    highlights: ["Ontspanning", "Herstel", "Energie"],
  },
  {
    slug: "waxen",
    title: "Waxen",
    label: "beauty",
    intro: "Glad en verzorgd — met aandacht voor comfort en huidvriendelijkheid.",
    highlights: ["Glad resultaat", "Snel", "Verzorgd"],
  },
  {
    slug: "led-lichttherapie",
    title: "LED-lichttherapie",
    label: "health & beauty",
    intro: "Ondersteun je huid en herstel met innovatieve lichttherapie (op advies).",
    highlights: ["Innovatief", "Ondersteunend", "Huidgericht"],
  },
  {
    slug: "podoposturale-therapie-fysiotherapie",
    title: "Podoposturale therapie & Fysiotherapie",
    label: "health",
    intro: "Beweging, houding en comfort — met focus op balans en herstel.",
    highlights: ["Houding", "Balans", "Herstel"],
  },
].map((t) => ({ ...t, image: imageFor(t.slug), images: imagesFor(t.slug) }));

export function getTreatmentBySlug(slug: string): Treatment | undefined {
  return TREATMENTS.find((t) => t.slug === slug);
}

