import type { ShopCategory, ShopProduct } from "./types";

export function pickBrand(name: string): string {
  const trimmed = name.trim();
  if (trimmed.toLowerCase().startsWith("redken")) return "Redken";
  if (trimmed.toLowerCase().startsWith("thalion")) return "Thalion";
  if (trimmed.toLowerCase().startsWith("thalisens")) return "ThaliSens";
  if (trimmed.toLowerCase().startsWith("l’eau")) return "Thalion";
  if (trimmed.toLowerCase().startsWith("mineral booster")) return "Thalion";
  return trimmed.split(" ")[0] ?? "Product";
}

export function inferCategoryFromName(name: string): ShopCategory {
  const n = name.toLowerCase();

  const hair = ["shampoo", "conditioner", "hair", "masker", "mask", "hit", "leave-in", "serum", "spray", "bandage", "balm"];
  if (n.includes("redken")) return "haar";
  if (hair.some((k) => n.includes(k))) return "haar";

  if (n.includes("body") || n.includes("bust") || n.includes("cellulite") || n.includes("thalasso") || n.includes("bath"))
    return "lichaam";
  if (n.includes("hand") || n.includes("feet") || n.includes("foot")) return "lichaam";

  if (n.includes("magnesium") || n.includes("tea") || n.includes("caps") || n.includes("detox") || n.includes("energie"))
    return "wellness";
  if (n.includes("sun") || n.includes("spf")) return "wellness";

  return "gezicht";
}

export function categoryLabel(category: ShopCategory): string {
  if (category === "haar") return "Haar";
  if (category === "gezicht") return "Gezicht";
  if (category === "lichaam") return "Lichaam";
  return "Wellness";
}

export function extractSize(name: string): string | null {
  const n = name.trim();

  // e.g. 10X6 ml, 10 x 6ml
  const multiMl = n.match(/(\d+)\s*[xX]\s*(\d+)\s*ml\b/i);
  if (multiMl) return `${multiMl[1]}x${multiMl[2]} ml`;

  // e.g. 250ml, 250 ml, 7 gram, 60 caps, 20 sachets, 30 pcs
  const simple = n.match(/\b(\d+)\s*(ml|g|gr|gram|caps?|sachets?|pcs?|pc)\b/i);
  if (!simple) return null;

  const amount = simple[1];
  const unitRaw = simple[2].toLowerCase();
  const unit =
    unitRaw === "gr" || unitRaw === "gram"
      ? "g"
      : unitRaw === "pc" || unitRaw === "pcs"
        ? "pcs"
        : unitRaw.startsWith("cap")
          ? "caps"
          : unitRaw.startsWith("sachet")
            ? "sachets"
            : unitRaw;

  return `${amount} ${unit}`;
}

export function getCategory(p: Pick<ShopProduct, "name">): ShopCategory {
  return inferCategoryFromName(p.name);
}

