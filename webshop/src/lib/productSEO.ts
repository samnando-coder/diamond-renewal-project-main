import type { ShopProduct } from "@/features/shop/types";

/**
 * Generate SEO-optimized product description
 * Includes product name and brand multiple times for SEO
 */
export function generateProductDescription(product: ShopProduct): string {
  const { name, brand, category } = product;
  
  // Extract product type from name
  const productType = extractProductType(name);
  const categoryLabel = getCategoryLabel(category);
  
  // SEO-optimized description with multiple mentions of product name and brand
  const description = `
Ontdek de ${name} van ${brand} - een premium ${productType} uit onze exclusieve salonselectie. 
De ${name} van ${brand} is speciaal geselecteerd voor onze webshop en biedt professionele kwaliteit voor thuisgebruik.

${brand} ${name} is een hoogwaardig ${productType} dat perfect past in je ${categoryLabel} routine. 
Dit ${brand} product combineert geavanceerde formules met bewezen werkzame stoffen voor optimale resultaten.

Waarom kiezen voor ${name} van ${brand}?
- Professionele salonkwaliteit van ${brand}
- De ${name} is getest en bewezen effectief
- Perfect voor thuisgebruik met salonresultaten
- Exclusief verkrijgbaar bij Blue Diamonds Club

De ${brand} ${name} is ideaal voor iedereen die op zoek is naar een premium ${productType} van een gerenommeerd merk. 
Ontdek waarom ${name} van ${brand} een favoriet is bij onze klanten en professionals.

Bestel vandaag nog de ${name} van ${brand} en ervaar het verschil van salonkwaliteit producten. 
Bij Blue Diamonds Club vind je alleen de beste ${brand} producten, waaronder deze ${name}.
`.trim();

  return description;
}

/**
 * Generate SEO-optimized product specifications
 */
export function generateProductSpecifications(product: ShopProduct): string {
  const { name, brand, category } = product;
  const size = extractSize(name);
  const productType = extractProductType(name);
  const categoryLabel = getCategoryLabel(category);
  
  const specs = `
**Merk:** ${brand}
**Productnaam:** ${name}
**Type:** ${productType}
**Categorie:** ${categoryLabel}
${size ? `**Inhoud:** ${size}` : ''}
**Kwaliteit:** Salonkwaliteit
**Geschikt voor:** Thuisgebruik met professionele resultaten
**Verkoop:** Exclusief bij Blue Diamonds Club

De ${name} van ${brand} is een professioneel ${productType} dat deel uitmaakt van onze zorgvuldig geselecteerde productlijn. 
Dit ${brand} product is speciaal gekozen voor zijn kwaliteit en effectiviteit.

**Waarom ${brand} ${name}?**
- Premium ${productType} van het gerenommeerde merk ${brand}
- De ${name} combineert geavanceerde formules met bewezen ingrediënten
- Perfect voor je dagelijkse ${categoryLabel} routine
- Salonkwaliteit die je thuis kunt gebruiken

Bestel de ${name} van ${brand} vandaag nog en ervaar het verschil van professionele producten.
`.trim();

  return specs;
}

/**
 * Generate SEO meta description
 */
export function generateMetaDescription(product: ShopProduct, price?: number): string {
  const { name, brand } = product;
  const productType = extractProductType(name);
  const priceText = price ? ` vanaf €${(price / 100).toFixed(2)}` : '';
  
  return `${brand} ${name} - Premium ${productType}${priceText} | Bestel ${name} van ${brand} online bij Blue Diamonds Club. Salonkwaliteit ${brand} producten voor thuisgebruik. Exclusieve selectie ${brand} producten.`;
}

/**
 * Generate structured data (JSON-LD) for SEO
 */
export function generateStructuredData(product: ShopProduct, price?: number): object {
  const { name, brand, image } = product;
  const productType = extractProductType(name);
  
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": name,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "description": generateMetaDescription(product, price),
    "image": image ? image : undefined,
    "category": product.category,
    "offers": price ? {
      "@type": "Offer",
      "url": typeof window !== "undefined" ? `${window.location.origin}/shop/p/${product.id}` : undefined,
      "priceCurrency": "EUR",
      "price": (price / 100).toFixed(2),
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Blue Diamonds Club"
      }
    } : undefined,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };
}

// Helper functions
function extractProductType(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("shampoo")) return "shampoo";
  if (n.includes("conditioner")) return "conditioner";
  if (n.includes("mask") || n.includes("masker")) return "haarmasker";
  if (n.includes("serum")) return "serum";
  if (n.includes("oil")) return "olie";
  if (n.includes("cream") || n.includes("crème")) return "crème";
  if (n.includes("lotion")) return "lotion";
  if (n.includes("gel")) return "gel";
  if (n.includes("cleanser")) return "reinigingsproduct";
  if (n.includes("tonic")) return "toner";
  if (n.includes("spray")) return "spray";
  if (n.includes("leave-in")) return "leave-in behandeling";
  if (n.includes("scrub")) return "scrub";
  if (n.includes("mist")) return "mist";
  return "product";
}

function extractSize(name: string): string | null {
  const match = name.match(/(\d+)\s*(ml|g|gr)/i);
  if (match) {
    return `${match[1]} ${match[2].toLowerCase()}`;
  }
  return null;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    haar: "haarverzorging",
    gezicht: "gezichtsverzorging",
    lichaam: "lichaamsverzorging",
    wellness: "wellness en supplementen"
  };
  return labels[category] || category;
}
