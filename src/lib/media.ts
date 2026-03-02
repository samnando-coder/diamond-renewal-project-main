import { getCloudinaryImageUrl } from './cloudinaryMapping';

export type MediaKind = "image" | "video";

export type MediaItem = {
  src: string;
  kind: MediaKind;
  alt: string;
  tags: string[];
  /** Optional cropping hint for <img style={{ objectPosition }}> */
  objectPosition?: string;
};

/**
 * Get the actual image URL - uses Cloudinary if available, otherwise local path
 */
export function getMediaItemSrc(item: MediaItem): string {
  if (item.kind === "image" && item.src.includes("Blue Diamonds Foto's")) {
    return getCloudinaryImageUrl(item.src);
  }
  return item.src;
}

// NOTE:
// Assets in /public are served from the site root. So:
// public/Blue Diamonds Foto's/IMG_5438.jpg -> "/Blue Diamonds Foto's/IMG_5438.jpg"
// public/Blue Diamonds Short 1.mp4 -> "/Blue Diamonds Short 1.mp4"
export const MEDIA: MediaItem[] = [
  // Shorts (vertical videos)
  { src: "/Blue Diamonds Short 1.mp4", kind: "video", alt: "Blue Diamonds short video 1", tags: ["shorts", "actueel"] },
  { src: "/Blue Diamonds Short 2.mp4", kind: "video", alt: "Blue Diamonds short video 2", tags: ["shorts", "actueel"] },
  { src: "/Blue Diamonds Short 3.mp4", kind: "video", alt: "Blue Diamonds short video 3", tags: ["shorts", "actueel"] },
  { src: "/Blue Diamonds Short 4.mp4", kind: "video", alt: "Blue Diamonds short video 4", tags: ["shorts", "actueel"] },
  { src: "/Blue Diamonds Short 5.mp4", kind: "video", alt: "Blue Diamonds short video 5", tags: ["shorts", "actueel"] },

  // Hero / general (landscape)
  {
    src: "/Blue Diamonds Foto's/IMG_5438.jpg",
    kind: "image",
    alt: "Wellness ruimte met therapiebed",
    tags: ["hero", "wellness", "interior", "actueel"],
  },
  {
    src: "/Blue Diamonds Foto's/IMG_5392.jpg",
    kind: "image",
    alt: "Relax lounge met ligstoelen",
    tags: ["hero", "arrangements", "interior", "lounge", "actueel"],
  },
  {
    src: "/Blue Diamonds Foto's/IMG_5319.jpg",
    kind: "image",
    alt: "Lounge ruimte met bloemenplafond en kroonluchter",
    tags: ["hero", "interior", "lounge", "actueel"],
    // Hide exterior scaffold by cropping down (remove the top window area from view)
    objectPosition: "center 90%",
  },

  // Treatments
  { src: "/Blue Diamonds Foto's/IMG_5602.jpg", kind: "image", alt: "Wenkbrauw/gezichtsbehandeling", tags: ["facial", "treatment", "services"] },
  { src: "/Blue Diamonds Foto's/IMG_5476.jpg", kind: "image", alt: "Gezichtsbehandeling met massage", tags: ["facial", "treatment", "services"] },
  { src: "/Blue Diamonds Foto's/IMG_5512.jpg", kind: "image", alt: "Gezichtsmasker behandeling", tags: ["facial", "treatment", "services"] },
  { src: "/Blue Diamonds Foto's/IMG_5643.jpg", kind: "image", alt: "Massage behandeling met twee behandelbedden", tags: ["massage", "treatment", "services"] },
  { src: "/Blue Diamonds Foto's/IMG_5623.jpg", kind: "image", alt: "Massage met kruidenstempels", tags: ["massage", "treatment", "services"] },
  { src: "/Blue Diamonds Foto's/IMG_5453.jpg", kind: "image", alt: "Behandelruimte met bedden", tags: ["treatment-room", "interior", "services"] },
  { src: "/Blue Diamonds Foto's/IMG_5587.jpg", kind: "image", alt: "Ontspannende wellness setting met klankschaal", tags: ["wellness", "relax", "services"] },
  { src: "/Blue Diamonds Foto's/IMG_5525.jpg", kind: "image", alt: "Wellness/mineralen detailshot", tags: ["wellness", "magnesium", "services"] },

  // Reception / brand
  { src: "/Blue Diamonds Foto's/IMG_5361.jpg", kind: "image", alt: "Receptie van Blue Diamonds", tags: ["hero", "reception", "brand", "actueel"] },
  { src: "/Blue Diamonds Foto's/IMG_5424.jpg", kind: "image", alt: "Welkom bij de receptie", tags: ["hero", "reception", "brand", "actueel"] },
  { src: "/Blue Diamonds Foto's/IMG_5546.jpg", kind: "image", alt: "Blue Diamonds logo detail", tags: ["brand"] },
  { src: "/Blue Diamonds Foto's/IMG_5646.jpg", kind: "image", alt: "Massage behandeling", tags: ["massage", "treatment", "services"] },

  // Products
  { src: "/Blue Diamonds Foto's/IMG_5503.jpg", kind: "image", alt: "Thalion producten op een tray", tags: ["products", "shop", "actueel"] },
  { src: "/Blue Diamonds Foto's/IMG_5412.jpg", kind: "image", alt: "Thalion productverpakking", tags: ["products", "shop"] },
  { src: "/Blue Diamonds Foto's/IMG_5418.jpg", kind: "image", alt: "Productwand met merken", tags: ["products", "shop"] },
  { src: "/Blue Diamonds Foto's/IMG_5419.jpg", kind: "image", alt: "Blue Diamonds raamlogo", tags: ["brand", "exterior"] },
  { src: "/Blue Diamonds Foto's/IMG_5489.jpg", kind: "image", alt: "Badjas in kleedruimte", tags: ["interior", "relax"] },
  { src: "/Blue Diamonds Foto's/IMG_5621.jpg", kind: "image", alt: "Thalion product close-up", tags: ["products", "shop"] },

  // Extra sfeerbeelden (nieuw toegevoegd) — alleen als extra content, we vervangen niets.
  {
    src: "/Blue Diamonds Foto's/IMG_0336.jpeg",
    kind: "image",
    alt: "Interieur van de salon met receptie en productwand",
    tags: ["impressie", "interior", "brand"],
  },
  {
    src: "/Blue Diamonds Foto's/IMG_0304.jpeg",
    kind: "image",
    alt: "Blue Diamonds logo op de muur",
    tags: ["impressie", "brand", "interior"],
  },
  {
    src: "/Blue Diamonds Foto's/IMG_0273.jpeg",
    kind: "image",
    alt: "Massage olie wordt aangebracht tijdens een behandeling",
    tags: ["impressie", "massage", "treatment", "services"],
  },
  {
    src: "/Blue Diamonds Foto's/IMG_0314.jpeg",
    kind: "image",
    alt: "Kruidenstempelmassage op de rug",
    tags: ["impressie", "massage", "treatment", "services"],
  },
  {
    src: "/Blue Diamonds Foto's/IMG_0359.jpeg",
    kind: "image",
    alt: "Nagelproducten en kleurstalen",
    tags: ["impressie", "handen", "nails", "services"],
  },
  {
    src: "/Blue Diamonds Foto's/IMG_0349.jpeg",
    kind: "image",
    alt: "Skin analysis systeem en behandelproducten",
    tags: ["impressie", "facial", "treatment", "services"],
  },
  {
    src: "/Blue Diamonds Foto's/IMG_0341.jpeg",
    kind: "image",
    alt: "Wenkbrauwen threading behandeling",
    tags: ["impressie", "wenkbrauwen", "treatment", "services"],
  },
  {
    src: "/Blue Diamonds Foto's/IMG_0284.jpeg",
    kind: "image",
    alt: "Laser ontharing behandeling",
    tags: ["impressie", "treatment", "services"],
  },
  {
    src: "/Blue Diamonds Foto's/IMG_0290.jpeg",
    kind: "image",
    alt: "Gezichtsbehandeling door specialist",
    tags: ["impressie", "facial", "treatment", "services"],
  },
];

function hashString(input: string): number {
  // FNV-1a 32-bit
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function daySeed(d = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function pickByTag(tag: string, count = 1, seed = daySeed()): MediaItem[] {
  const items = MEDIA.filter((m) => m.tags.includes(tag));
  const sorted = [...items].sort((a, b) => {
    const ha = hashString(`${seed}:${tag}:${a.src}`);
    const hb = hashString(`${seed}:${tag}:${b.src}`);
    return ha - hb;
  });
  return sorted.slice(0, Math.max(0, count));
}

export function pickImagesByTag(tag: string, count = 1, seed = daySeed()): MediaItem[] {
  const items = MEDIA.filter((m) => m.kind === "image" && m.tags.includes(tag));
  const sorted = [...items].sort((a, b) => {
    const ha = hashString(`${seed}:${tag}:${a.src}`);
    const hb = hashString(`${seed}:${tag}:${b.src}`);
    return ha - hb;
  });
  return sorted.slice(0, Math.max(0, count));
}

