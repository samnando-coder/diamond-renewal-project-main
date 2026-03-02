import type { Treatment, TreatmentLabel } from './treatments';
import { TREATMENTS } from './treatments';
import { IMPORTED_TREATMENT_PAGES } from './legacyImportedTreatments';

export type PriceItem = {
  name: string;
  price: string;
  duration?: string;
  note?: string;
};

export type PriceSection = {
  title: string;
  items: PriceItem[];
};

export type TreatmentPage = Treatment & {
  quote?: string;
  pricing?: PriceSection[];
  /** For category-style navigation (e.g. "Haar" -> subpages) */
  category?: string;
  parent?: { title: string; href: string };
};

type MassageGroupKey =
  | 'relaxation'
  | 'recovery'
  | 'sport'
  | 'shaping'
  | 'special'
  | 'face'
  | 'neckBack'
  | 'handFoot'
  | 'duo';

const LEGACY_MASSAGE_PAGE = (IMPORTED_TREATMENT_PAGES as unknown as TreatmentPage[]).find(
  (t) => t.slug === 'massage-stijlen'
);

const LEGACY_MASSAGE_ITEMS: PriceItem[] =
  LEGACY_MASSAGE_PAGE?.pricing?.flatMap((sec) => sec.items ?? []).map((it) => ({
    name: it.name,
    price: it.price,
    duration: it.duration,
    note: it.note,
  })) ?? [];

function massageGroupForItemName(name: string): MassageGroupKey {
  const n = name.toLowerCase();

  if (n.includes('sportmassage')) return 'sport';

  if (n.includes('gezicht') || n.includes('face cupping') || n.includes('hoofdmassage')) return 'face';
  if (n.includes('rug') || n.includes('nek') || n.includes('schouder')) return 'neckBack';
  if (n.includes('handmassage') || n.includes('voetmassage')) return 'handFoot';

  if (n.includes('maderotherapie') || n.includes('bindweefselmassage lichaam') || n.includes('cavitatie')) return 'shaping';

  if (n.includes('lymfedrainage') || n.includes('cupping massage')) return 'recovery';

  if (n.includes('zwangerschapsmassage') || n.includes('voetreflex')) return 'special';

  // Default bucket for the remaining massage types
  return 'relaxation';
}

function buildMassagePricing(group: MassageGroupKey): PriceSection[] {
  if (group === 'duo') {
    return [
      {
        title: 'Duo massage',
        items: [
          {
            name: 'Duo massage',
            price: 'Op aanvraag',
            note: 'Neem contact op voor beschikbaarheid en opties.',
          },
        ],
      },
    ];
  }

  const items = LEGACY_MASSAGE_ITEMS.filter((it) => massageGroupForItemName(it.name) === group);
  const titleByGroup: Record<Exclude<MassageGroupKey, 'duo'>, string> = {
    relaxation: 'Relaxation massage',
    recovery: 'Recovery massage',
    sport: 'Sportmassage',
    shaping: 'Shaping & Contouring massage',
    special: 'Speciale massages',
    face: 'Gezichtsmassage',
    neckBack: 'Nek-, Schouder- & Rug massage',
    handFoot: 'Hand- & Voet massage',
  };

  return [
    {
      title: titleByGroup[group],
      items,
    },
  ];
}

/**
 * Treatment detail pages (subpages) we want to support, inspired by the current website structure.
 * These pages are intentionally minimal unless you provided real copy/prices.
 */
export const TREATMENT_PAGES: TreatmentPage[] = [
  // Gezichtsbehandelingen subpages (manually ported from legacy site)
  {
    slug: "gezichtsbehandelingen-basis",
    title: "Basis gezichtsbehandelingen",
    label: "beauty & health",
    intro: "Reiniging, verzorging en ontspanning — een stevige basis voor een stralende huid.",
    details:
      "Blue Diamonds Health & Beauty Club biedt een breed scala aan gezichtsbehandelingen aan die gericht zijn op het verbeteren en verzorgen van de huid.\n\nVan standaard reinigende gezichtsmassages en dieptereiniging tot luxe behandelingen met hoogwaardige huidverzorgingsproducten en geavanceerde technieken, er is voor elk huidtype en elk huidprobleem een oplossing.\n\nDaarnaast werken we met ervaren en gediplomeerde schoonheidsspecialisten die persoonlijke aandacht en professioneel advies bieden voor het beste resultaat.",
    image: "/Blue Diamonds Foto's/IMG_5512.jpg",
    category: "gezichtsbehandelingen",
    parent: { title: "Gezichtsbehandelingen soorten", href: "/behandelingen/gezichtsbehandelingen" },
    pricing: [
      {
        title: "Basis gezichtsbehandelingen",
        items: [
          {
            name: "Facial Diamonds treatment",
            price: "€64,95",
            duration: "30 minuten",
            note:
              "Reinigen, huidanalyse, keuze uit massage, onzuiverheden verwijderen of masker, serum en dag/nachtverzorging",
          },
          {
            name: "Facial Teen Diamonds treatment (leeftijd 13 t/m 17 jaar)",
            price: "€64,95",
            duration: "50 minuten",
            note:
              "Speciaal samengestelde behandeling voor een tiener huid van 13 t/m 17 jaar. Oppervlakte reinigen, huidanalyse, diepte reiniging, onzuiverheden verwijderen, speciale masker, serum en dag/nachtverzorging",
          },
          {
            name: "Facial Diamonds Algae Hydra Mineral treatment",
            price: "€114,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier speciaal voor hydratatie. Oppervlakte reinigen, huidanalyse, diepte reiniging, onzuiverheden verwijderen, keuze uit cupping/druk massage of massage hals, decolleté en hoofdhuid, speciale masker, serum en dag/nachtverzorging",
          },
          {
            name: "Facial Diamonds Algae Sensi Marine treatment",
            price: "€114,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier speciaal voor kalmering. Oppervlakte reinigen, huidanalyse, diepte reiniging, onzuiverheden verwijderen, keuze uit cupping/druk massage of massage hals, decolleté en hoofdhuid, speciale masker, serum en dag/nachtverzorging",
          },
          {
            name: "Facial Diamonds Algae Energy & Radiance treatment",
            price: "€114,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier gericht op futloze huid. Oppervlakte reinigen, huidanalyse, diepte reiniging, onzuiverheden verwijderen, keuze uit cupping/druk massage of massage hals, decolleté en hoofdhuid, speciale masker, serum en dag/nachtverzorging",
          },
          {
            name: "Facial Diamonds Men treatment",
            price: "€84,95",
            duration: "45 minuten",
            note:
              "Intensive reiniging, milde peeling, verwijderen onzuiverheden, serum, masker, dag/nacht verzorging",
          },
        ],
      },
    ],
  },
  {
    slug: "gezichtsbehandelingen-anti-aging",
    title: "Anti-aging gezichtsbehandelingen",
    label: "beauty & health",
    intro: "Gericht op versteviging, collageen en een frisse, jeugdige uitstraling.",
    details:
      "Ben je op zoek naar effectieve anti-aging gezichtsbehandelingen in Den Haag? Bij Blue Diamonds Health & Beauty Club bieden we behandelingen die gericht zijn op het verminderen van fijne lijntjes en het verbeteren van de huidstructuur.\n\nWe combineren technieken en hoogwaardige producten om de huid te ondersteunen, te verstevigen en zichtbaar te laten stralen. Onze specialisten adviseren op basis van jouw huid en wensen.",
    image: "/Blue Diamonds Foto's/IMG_5476.jpg",
    category: "gezichtsbehandelingen",
    parent: { title: "Gezichtsbehandelingen soorten", href: "/behandelingen/gezichtsbehandelingen" },
    pricing: [
      {
        title: "Anti-aging gezichtsbehandelingen",
        items: [
          {
            name: "Rood LED-lichttherapie",
            price: "€24,95",
            duration: "20 minuten",
            note:
              "Rood lichttherapie wordt gebruikt voor het tegengaan van huidveroudering. Dit type lichttherapie richt zich op de cellen in de huid en stimuleert de productie van collageen.",
          },
          {
            name: "Blue Diamonds PRX-T33 Skinbooster",
            price: "Van €110 voor €94,95",
            duration: "45 minuten",
            note:
              "De PRX-T33 gezichtsbehandeling is een revolutionaire behandeling die de conditie van de huid verbetert.",
          },
          {
            name: "Blue Diamonds PRX-T33 + Microneedling treatment",
            price: "Van €260 voor €199,95",
            duration: "45 minuten",
            note:
              "Combinatiebehandeling om de conditie van de huid te verbeteren met PRX-T33 en microneedling.",
          },
          {
            name: "Facial Diamonds Peeling treatment",
            price: "Van €65 voor €54,95",
            duration: "30 minuten",
            note:
              "Een verhelderende behandeling om vermoeidheid, hyperpigmentatie, acne en melasma te verminderen.",
          },
          {
            name: "Facial Diamonds Super Peeling treatment",
            price: "Van €125 voor €99,95",
            duration: "60 minuten",
            note:
              "Een verhelderende behandeling om vermoeidheid, hyperpigmentatie, acne en melasma te verminderen (met extra stappen zoals massage/masker).",
          },
          {
            name: "Facial Diamonds Algae Lift & Firm treatment",
            price: "€114,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier gericht op anti-aging.",
          },
          {
            name: "Facial Diamonds Algae Ocean Secrets treatment",
            price: "€144,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier speciaal voor anti-aging rijpere huid.",
          },
          {
            name: "Microneedling / 1Need Geheel Gezicht",
            price: "€159,95",
            duration: "50 minuten",
            note:
              "Microneedling is een techniek waarbij de huid met minuscule naaldjes gecontroleerd geperforeerd wordt om herstel te stimuleren (collageen/elastine).",
          },
        ],
      },
    ],
  },
  {
    slug: "gezichtsbehandelingen-huid-verbeterende",
    title: "Huidverbeterende gezichtsbehandelingen",
    label: "beauty & health",
    intro: "Voor gezondheid, elasticiteit en een egalere huid — gericht op verbetering.",
    details:
      "Deze gezichtsbehandelingen zijn gericht op het verbeteren van de huidconditie: hydratatie, voeding, kalmering en huidversteviging.\n\nWe adviseren graag welke behandeling het best past bij jouw huidtype en doelen.",
    image: "/Blue Diamonds Foto's/IMG_5602.jpg",
    category: "gezichtsbehandelingen",
    parent: { title: "Gezichtsbehandelingen soorten", href: "/behandelingen/gezichtsbehandelingen" },
    pricing: [
      {
        title: "Huidverbeterende gezichtsbehandelingen",
        items: [
          {
            name: "LED-lichttherapie treatment",
            price: "€24,95",
            duration: "20 minuten",
            note:
              "Niet-invasieve LED-lichtbehandeling met verschillende lichtkleuren om huidproblemen te ondersteunen.",
          },
          {
            name: "Facial Diamonds Algae Boost Treatment",
            price: "€94,95",
            duration: "40 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier om de huid een hydratatie boost te geven en te voeden.",
          },
          {
            name: "Facial Diamonds Algae Marine Nutrition",
            price: "€114,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier gericht op het voeden.",
          },
          {
            name: "Facial Diamonds Algae Marine Hydratation",
            price: "€114,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier gericht op het hydrateren en voeden.",
          },
          {
            name: "Facial Diamonds Algae Hydra Mineral treatment",
            price: "€114,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier speciaal voor hydratatie.",
          },
          {
            name: "Facial Diamonds Algae Sensi Marine treatment",
            price: "€114,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier speciaal voor kalmering.",
          },
          {
            name: "Facial Diamonds Algae Lift & Firm treatment",
            price: "€114,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier gericht op anti-aging.",
          },
          {
            name: "Facial Diamonds Algae Energy & Radiance treatment",
            price: "€114,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier gericht op futloze huid.",
          },
          {
            name: "Facial Diamonds Algae Intense White treatment",
            price: "€134,95",
            duration: "75 minuten",
            note:
              "Bij aanschaf van een kuur ontvangt u gratis een serum en cleanser van Thalion (t.w.v. €135,-).",
          },
          {
            name: "Facial Diamonds Algae Ocean Secrets treatment",
            price: "€144,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier speciaal voor anti-aging rijpere huid.",
          },
          {
            name: "Microneedling / 1Need Geheel Gezicht",
            price: "€159,95",
            duration: "50 minuten",
            note:
              "Microneedling om huidherstel en vernieuwing te stimuleren.",
          },
          {
            name: "Facial Teen Diamonds treatment (leeftijd 13 t/m 17 jaar)",
            price: "€64,95",
            duration: "50 minuten",
            note:
              "Speciaal samengestelde behandeling voor een tiener huid van 13 t/m 17 jaar.",
          },
          {
            name: "Dermaplaning inclusief vliesmasker",
            price: "€74,95",
            duration: "45 minuten",
            note:
              "Dermaplaning methode waarbij met een steriel mesje dode huidcellen en donshaartjes worden verwijderd voor een gladdere huid.",
          },
        ],
      },
    ],
  },
  {
    slug: "gezichtsbehandelingen-luxe",
    title: "Luxe gezichtsbehandelingen",
    label: "beauty & health",
    intro: "Extra uitgebreid en luxe — voor maximale ontspanning en een zichtbaar resultaat.",
    details:
      "Voor wie nét dat beetje extra wil: luxe gezichtsbehandelingen met hoogwaardige producten en aandacht voor ontspanning.\n\nOnze specialisten stemmen de behandeling af op jouw huid en wensen.",
    image: "/Blue Diamonds Foto's/IMG_5512.jpg",
    category: "gezichtsbehandelingen",
    parent: { title: "Gezichtsbehandelingen soorten", href: "/behandelingen/gezichtsbehandelingen" },
    pricing: [
      {
        title: "Luxe gezichtsbehandelingen",
        items: [
          {
            name: "Facial Diamonds Algae Lift & Firm treatment",
            price: "€114,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier gericht op anti-aging.",
          },
          {
            name: "Facial Diamonds Algae Intense White treatment",
            price: "€134,95",
            duration: "75 minuten",
            note:
              "Bij aanschaf van een kuur ontvangt u gratis een serum en cleanser van Thalion (t.w.v. €135,-).",
          },
          {
            name: "Facial Diamonds Algae Ocean Secrets treatment",
            price: "€144,95",
            duration: "75 minuten",
            note:
              "Gehele behandeling met producten van algen/zeewier speciaal voor anti-aging rijpere huid.",
          },
        ],
      },
    ],
  },
  {
    slug: "gezichtsbehandelingen-microneedling-derma-pen",
    title: "Microneedling / 1Need",
    label: "beauty & health",
    intro: "Focus op groei, herstel & vernieuwing van huidcellen — voor een stevigere huidstructuur.",
    details:
      "Microneedling (ook wel DermaPen / 1Need) stimuleert het natuurlijke herstelproces van de huid. Dit kan helpen bij huidverjonging en het verbeteren van huidtextuur.\n\nWe adviseren graag welke aanpak het best past bij jouw huid.",
    image: "/Blue Diamonds Foto's/IMG_5602.jpg",
    category: "gezichtsbehandelingen",
    parent: { title: "Gezichtsbehandelingen soorten", href: "/behandelingen/gezichtsbehandelingen" },
    pricing: [
      {
        title: "Microneedling / 1Need",
        items: [
          {
            name: "Microneedling / DermaPen 1Need (geheel gezicht)",
            price: "€159,95",
            duration: "50 minuten",
            note:
              "Microneedling is een techniek waarbij de huid met minuscule naaldjes gecontroleerd geperforeerd wordt om herstel te stimuleren.",
          },
          {
            name: "Blue Diamonds PRX-T33 + Microneedling treatment",
            price: "Van €260 voor €199,95",
            duration: "45 minuten",
            note:
              "Combinatiebehandeling met PRX-T33 en microneedling.",
          },
        ],
      },
    ],
  },
  {
    slug: "gezichtsbehandelingen-peeling",
    title: "Peeling gezichtsbehandelingen",
    label: "beauty & health",
    intro: "Focus op ontspannen en verminderen van oneffenheden — voor een egalere glow.",
    details:
      "Peeling gezichtsbehandelingen zijn gericht op het verhelderen en egaliseren van de huid. Ideaal bij een doffe huid, pigment, acne of oneffenheden.\n\nVoor het beste resultaat adviseren we graag over een passend schema/kuur.",
    image: "/Blue Diamonds Foto's/IMG_5476.jpg",
    category: "gezichtsbehandelingen",
    parent: { title: "Gezichtsbehandelingen soorten", href: "/behandelingen/gezichtsbehandelingen" },
    pricing: [
      {
        title: "Peeling gezichtsbehandelingen",
        items: [
          {
            name: "Facial Diamonds Peeling treatment",
            price: "Van €65 voor €54,95",
            duration: "30 minuten",
            note:
              "Een verhelderende behandeling om vermoeidheid, hyperpigmentatie, acne en melasma te verminderen.",
          },
          {
            name: "Facial Diamonds Super Peeling treatment",
            price: "Van €125 voor €99,95",
            duration: "60 minuten",
            note:
              "Een verhelderende behandeling om vermoeidheid, hyperpigmentatie, acne en melasma te verminderen.",
          },
          {
            name: "Blue Diamonds PRX-T33 Skinbooster",
            price: "Van €110 voor €94,95",
            duration: "45 minuten",
            note:
              "PRX-T33 behandeling om de conditie van de huid te verbeteren.",
          },
          {
            name: "Blue Diamonds PRX-T33 + Microneedling treatment",
            price: "Van €260 voor €199,95",
            duration: "45 minuten",
            note:
              "Combinatiebehandeling met PRX-T33 en microneedling.",
          },
        ],
      },
    ],
  },

  // Permanent make-up
  {
    slug: "permanent-make-up",
    title: "Permanent make up",
    label: "beauty",
    intro: "Een PMU behandeling van de wenkbrauwen!",
    details:
      "Bij Blue Diamonds kun je terecht voor Powder Brows (permanent make up) van de wenkbrauwen.\n\nJe afspraak begint bij onze PMU specialiste Cathleen. Zij luistert naar je wensen, analyseert de verwachtingen en beantwoordt al je vragen. Daarna krijg je een passend advies en licht zij alle stappen toe.\n\nMaak direct online een afspraak via de knop op deze pagina.",
    image: "/stock/pexels/treatment-pmu.jpg",
    pricing: [
      {
        title: "Powder Brows (PMU)",
        items: [
          {
            name: "Powder Brows intake",
            price: "€ 24,95",
            duration: "15 minuten",
            note:
              "Uw afspraak begint bij onze PMU specialiste Cathleen. Zij luistert naar uw wensen en analyseert de verwachtingen. Zij beantwoord al uw vragen over PMU wenkbrauwen en informeert over de do's en don'ts. Aansluitend geeft zij u een passend advies en licht alle stappen toe. Indien u bij ons Powder Brows gaat boeken zullen we de betaalde intake van daadwerkelijke bedrag eraf halen.",
          },
          {
            name: "Powder Brows (permanent make up)",
            price: "€249,95",
            duration: "120 minuten",
            note:
              "Bij Powder brows worden de wenkbrauwen ingeschaduwd met pigment. Powder brows is de nieuwste trend op het gebied van permanente make-up (PMU) voor wenkbrauwen. Maar de naam zegt het al; 'powder'. Met deze techniek van permanente make-up wordt met een PMU apparaat op een heel subtiele wijze pigment aangebracht. Hierdoor lijkt het alsof je je wenkbrauwen met wenkbrauwpoeder hebt ingekleurd. Alleen is het resultaat semi permanent. Dat houdt in dat je na ongeveer 1,5 jaar je wenkbrauwen een touch-up moet geven. Zo geniet je langer van je mooie wenkbrauwen.",
          },
          {
            name: "Powder Brows Touch Up",
            price: "€149,95",
            duration: "120-150 minuten",
            note:
              "Permanent make-up touch up is een nabehandeling die meestal plaatsvindt tussen 8 en 12 weken na de eerste behandeling van permanente make-up. Het doel van deze touch up is om eventuele onvolkomenheden of gebieden met opgehoopt pigment bij te werken en de kleur en vorm van de permanent make-up te perfectioneren. Het is belangrijk om deze touch up te laten doen, omdat de eerste behandeling nog niet perfect kan zijn door de natuurlijke afschilfering van de huid en de manier waarop pigmenten zich zetten. Deze touch up zorgt voor een langduriger resultaat en een optimaal esthetisch effect. Bovendien kan de permanent make-up artist tijdens de touch up eventuele wensen of aanpassingen van de klant bespreken en uitvoeren.",
          },
        ],
      },
    ],
  },

  // Wenkbrauwen / Wimpers (ported from legacy pages)
  {
    slug: "wenkbrauwen",
    title: "Wenkbrauwen",
    label: "beauty",
    intro: "Wenkbrauwen en wimpers in Den Haag",
    details:
      "Bij Blue Diamonds Health & Beauty Club bieden we een uitgebreide selectie aan wenkbrauw- en wimperbehandelingen aan die er voor zorgen dat jouw wenkbrauwen en wimpers natuurlijk, gezond en prachtig uitzien.\n\nIn onze salon maken wij gebruik van de beste producten en technieken om de beste resultaten te garanderen. Klanten kunnen kiezen uit een verscheidenheid aan tinten en stijlen om hun wenkbrauwen en wimpers te vormen, waardoor het een meer persoonlijke en afgestemde uitstraling krijgt.\n\nWij hebben een team van professionele en ervaren schoonheidsspecialisten die weten hoe je het beste resultaat kunt krijgen.\n\nLees ook onze blog over:\n- Een permanente oplossing voor perfecte wenkbrauwen",
    image: "/Blue Diamonds Foto's/IMG_0318.jpeg",
    category: "wenkbrauwen-wimpers",
    parent: { title: "Wenkbrauwen & Wimpers", href: "/wenkbrauwen-wimpers" },
    pricing: [
      {
        title: "Wenkbrauwen Den Haag",
        items: [
          {
            name: "Brow Lamination",
            price: "€ 64,95",
            duration: "40 minuten",
            note:
              "Deze behandeling is incl. shapen/epileren en excl. verven. Lamination is een behandeling waarbij jouw natuurlijke wenkbrauwhaartjes in de juiste richting geplaatst worden. Dit resultaat blijft 4-6 weken zitten.",
          },
          {
            name: "Henna Brows",
            price: "€ 59,95",
            duration: "30 minuten",
            note:
              "Henna brow treatment is incl. epileren/shapen. Het verven met henna is anders dan verven met normale wenkbrauw verf. De verf blijft langer op de haren zitten (ongeveer 4 tot 6 weken). Bij henna brows worden zowel de haartjes als de huid onder de wenkbrauwen geverfd, waardoor er een 'ingetekend' effect ontstaat.",
          },
          {
            name: "Wenkbrauwen Epileren",
            price: "€ 12,95",
            duration: "20 minuten",
            note: "Wenkbrauwen epileren met een pincet.",
          },
          {
            name: "Wenkbrauw Threading",
            price: "€ 12,95",
            duration: "30 minuten",
            note:
              "Epileren met behulp van twee garen die in elkaar worden gedraaid en over de huid oppervlak worden gerold voor een perfecte vorm.",
          },
          {
            name: "Wenkbrauw Waxen",
            price: "€ 15,95",
            duration: "30 minuten",
            note: "Epileren met behulp van hars voor een perfecte vorm.",
          },
          {
            name: "Wenkbrauwen Verven",
            price: "€ 19,95",
            duration: "30 minuten",
            note:
              "Met het verven van je wenkbrauwen kun je de kleur en (optische) volheid van u wenkbrauwen op een semi-permanente manier veranderen.",
          },
          {
            name: "Wenkbrauw Epileren + Verven",
            price: "€ 29,95",
            duration: "30 minuten",
            note:
              "Wenkbrauwen epileren met een pincet of hars/wax + wenkbrauwen verven.",
          },
          {
            name: "Wenkbrauwen Shapen",
            price: "€ 14,95",
            duration: "30 minuten",
            note: "Wenkbrauwen in gewenste vorm brengen zonder te epileren.",
          },
          {
            name: "Bovenlip & Onderlip Threading",
            price: "€ 19,95",
            duration: "20 minuten",
            note:
              "Epileren met behulp van twee garen die in elkaar worden gedraaid en over de huid oppervlak worden gerold voor het verwijderen van de haartjes boven en onder de lip. Bij threading worden je haren van de bovenlip en onderlip met een touwtje verwijderd. Dit zorgt ervoor dat de haren langer wegblijven en voor een strak resultaat.",
          },
        ],
      },
    ],
  },
  {
    slug: "wimpers",
    title: "Wimpers",
    label: "beauty",
    intro: "Wimpers en Wenkbrauwen in Den Haag",
    details:
      "Bij Blue Diamonds Health & Beauty Club bieden we een uitgebreide selectie aan wenkbrauw- en wimperbehandelingen aan die er voor zorgen dat jouw wenkbrauwen en wimpers natuurlijk, gezond en prachtig uitzien.\n\nIn onze salon maken wij gebruik van de beste producten en technieken om de beste resultaten te garanderen. Klanten kunnen kiezen uit een verscheidenheid aan tinten en stijlen om hun wenkbrauwen en wimpers te vormen, waardoor het een meer persoonlijke en afgestemde uitstraling krijgt.\n\nWij hebben een team van professionele en ervaren schoonheidsspecialisten die weten hoe je het beste resultaat kunt krijgen.\n\nLees ook onze blog over:\n- Alles wat je moet weten over Lashlifting!\n- Wimperextensions behandelingen",
    image: "/Blue Diamonds Foto's/IMG_0318.jpeg",
    category: "wenkbrauwen-wimpers",
    parent: { title: "Wenkbrauwen & Wimpers", href: "/wenkbrauwen-wimpers" },
    pricing: [
      {
        title: "Wimpers Den Haag",
        items: [
          {
            name: "Lashlifting",
            price: "€ 54,95",
            duration: "45 minuten",
            note:
              "Lashlifting is een behandeling waarbij de wimpers worden gelift en het resultaat 4-6 weken blijft. Wimperlifting is excl. verven.",
          },
          {
            name: "Wimpers Verven",
            price: "€ 19,95",
            duration: "30 minuten",
            note:
              "Met het verven van je wimpers kun je de kleur en (optische) volheid van je wimpers op een semi-permanente manier veranderen.",
          },
          {
            name: "Wimperextensions one by one new set",
            price: "€ 99,95",
            duration: "90 minuten",
            note:
              "Een techniek waarbij één enkele extension op één natuurlijke wimper wordt geplaatst. Dit zorgt voor een natuurlijke en elegante look, waarbij de wimpers langer en voller lijken zonder overmatige dikte.",
          },
          {
            name: "Wimperextensions hybrid",
            price: "€ 109,95",
            duration: "90 minuten",
            note:
              "Een combinatie van klassieke en volume wimperextensions. Dit zorgt voor een natuurlijke, maar toch volle en fluffy look.",
          },
          {
            name: "Wimperextensions Volume",
            price: "€ 119,95",
            duration: "90 minuten",
            note:
              "Meerdere ultradunne wimperextensions in een waaier op één natuurlijke wimper voor een vollere, dramatische en fluffy look.",
          },
          {
            name: "Wimperextensions Wispy",
            price: "€ 129,95",
            duration: "90 minuten",
            note:
              "Verschillende lengtes en diktes gecombineerd voor een speels, luchtig en gestructureerd effect (fluffy en gelaagd).",
          },
          {
            name: "Wimperextensions Mega Volume",
            price: "€ 139,95",
            duration: "90 minuten",
            note:
              "Extreem dunne wimperextensions in grote waaiers (6D tot 15D of meer) voor maximale volheid en intensiteit, met laag gewicht.",
          },
          {
            name: "Wimperextensions refill in 1 week",
            price: "€ 49,95",
            duration: "30 minuten",
            note:
              "Professionele refill om de levensduur te verlengen en volle wimpers te behouden. Prijzen starten vanaf een basisbedrag en variëren afhankelijk van het type wimperextensions.",
          },
          {
            name: "Wimperextensions refill in 2 weeks",
            price: "€ 54,95",
            duration: "45 minuten",
            note:
              "Professionele refill om de levensduur te verlengen en volle wimpers te behouden. Prijzen starten vanaf een basisbedrag en variëren afhankelijk van het type wimperextensions.",
          },
          {
            name: "Wimperextensions refill in 3 weeks",
            price: "€ 69,95",
            duration: "60 minuten",
            note:
              "Professionele refill om de levensduur te verlengen en volle wimpers te behouden. Prijzen starten vanaf een basisbedrag en variëren afhankelijk van het type wimperextensions.",
          },
          {
            name: "Wimperextensions verwijderen i.c.m. nieuwe set",
            price: "€ 24,95",
            duration: "30 minuten",
            note:
              "Oude wimperextensions veilig verwijderen voordat een nieuwe set geplaatst wordt. Ideaal als je wilt overstappen of een frisse nieuwe set zonder ophoping van lijmresten wilt.",
          },
          {
            name: "Wimperextensions verwijderen",
            price: "€ 44,95",
            duration: "30 minuten",
            note:
              "Professioneel verwijderen met speciale remover die de lijm oplost, zodat extensions moeiteloos loslaten zonder de natuurlijke wimpers te beschadigen.",
          },
          {
            name: "Bovenlip & Onderlip Threading",
            price: "€ 19,95",
            duration: "20 minuten",
            note:
              "Epileren met behulp van twee garen die in elkaar worden gedraaid en over de huid oppervlak worden gerold voor het verwijderen van de haartjes boven en onder de lip.",
          },
        ],
      },
    ],
  },
  {
    slug: "magnesium-behandeling",
    title: "Magnesium Behandelingen",
    label: "health",
    intro: "Magnesium behandelingen in Den Haag",
    details:
      "Magnesium heeft vele toepassingen. Met magnesium behandelingen van Blue Diamonds wordt magnesium optimaal door de huid opgenomen en heeft vele voordelen, zoals:\n\nHet werkt ontgiftend\nVerwijdt de bloedvaten\nVet verbrand sneller en afvalstoffen worden sneller afgevoerd\nVerhoging van de stofwisseling\nMagnesium ondersteunt het herstel van de lichaamscellen en reinigt en verbeterd de huid\nOntspannend voor u zenuwstelsel en stimuleert het immuunsysteem\nBevordert de nachtrust\nVermindert pijnprikkels uit zenuwstelsel\nHet verlicht pijn en verbetert de soepelheid bij mensen met gewrichtsspierpijn",
    image: "/stock/pexels/uw-sand-bed.jpg",
    pricing: [
      {
        title: "Magnesium behandelingen Den Haag",
        items: [
          {
            name: "Magnesium Experience Light",
            price: "€ 94,95",
            duration: "60 minuten",
            note: "Magnesium Voetenbad, Magnesium Scrub, Magnesium Ontspanningmassage.",
          },
          {
            name: "Magnesium Experience Light kuur 4+1 gratis",
            price: "€ 379,80",
            duration: "60 minuten",
          },
          {
            name: "Magnesium Experience Intensive",
            price: "€ 114,95",
            duration: "80 minuten",
            note:
              "Magnesium Voetenbad, Magnesium Scrub, Magnesium Ontspanningsmassage en Magnesium infrarooddeken lichaamspakking met Magnesium Sportolie Rozemarijn + Magnesium Aloë Vera Gezichtsmassage + Magnesiumrijke smoothie.",
          },
          {
            name: "Magnesium Experience Intensive kuur 4+1 grais",
            price: "€ 459,80",
            duration: "80 minuten",
          },
        ],
      },
    ],
  },
  {
    slug: "waxen",
    title: "Waxen",
    label: "beauty",
    intro: "Waxen in Den Haag",
    details:
      "Waxen is een tijdelijke manier van haarverwijdering. Na het waxen zullen de haren op langere termijn weer aangroeien. Dit aangroeien gebeurt met een zachte (haar)punt zodat je, anders dan bij scheren, na het waxen geen harde stoppels zult hebben.\n\nJe kunt bij Blue Diamonds Health & Beauty Club overtollige lichaamsharen door middel van vloeibare wax laten verwijderen. De haren worden tijdens het waxen helemaal verwijderd en het duurt gemiddeld 3-6 weken voordat ze weer zijn aangegroeid.",
    image: "/stock/pexels/treatment-waxen-2.jpg",
    pricing: [
      {
        title: "Waxen Den Haag",
        items: [
          { name: "Brazilian Wax", price: "€ 54,95", duration: "40 minuten" },
          { name: "Waxen Bikinilijn", price: "€ 49,95", duration: "40 minuten" },
          { name: "Waxen Geheel Gezicht", price: "€ 54,95", duration: "45 minuten" },
          { name: "Waxen Bovenlip of kin", price: "€ 24,95", duration: "30 minuten" },
          { name: "Waxen Bovenlip & kin", price: "€ 34,95", duration: "45 minuten" },
          { name: "Waxen Kaaklijn en wangen", price: "€ 39,95", duration: "30 minuten" },
          { name: "Waxen Oksels", price: "€ 39,95", duration: "45 minuten" },
          { name: "Waxen Armen", price: "€ 59,95", duration: "45 minuten" },
          { name: "Waxen Boven-of onderarmen", price: "€ 34,95", duration: "35 minuten" },
          { name: "Waxen Benen", price: "€ 79,95", duration: "45 minuten" },
          { name: "Waxen Boven-of onderbenen", price: "€ 44,95", duration: "30 minuten" },
          { name: "Waxen Rug", price: "€ 69,95", duration: "45 minuten" },
          { name: "Waxen Boven-of onderrug", price: "€ 39,95", duration: "35 minuten" },
          { name: "Waxen Borst", price: "€ 44,95", duration: "40 minuten" },
          { name: "Waxen Buik", price: "€ 39,95", duration: "35 minuten" },
          { name: "Waxen Billen met bilnaad", price: "€ 34,95", duration: "40 minuten" },
          { name: "Waxen Billen", price: "€ 29,95", duration: "40 minuten" },
          { name: "Waxen Handen", price: "€ 34,95", duration: "40 minuten" },
        ],
      },
    ],
  },
  // LED-lichttherapie subpages
  {
    slug: "led-lichttherapie-blauw",
    title: "Blauw LED-lichttherapie",
    label: "health & beauty",
    intro: "Verminderen van acne en angstgevoelens",
    details:
      "Blauw LED-lichttherapie; o.a. verminderen van acne en angstgevoelens\n\nBlauw lichttherapie\n\nPositieve invloed op eczeem / psoriasis\nVermindert acne\nAntiseptische en antibacteriële effecten\nAnti-talgproductie\nVermindert angstgevoelens\nVersterkt het immuunsysteem\n\nAcne is een ontsteking van de talgklieren in de huid. Er kan sprake zijn van acne als er meerdere puistjes of pukkels op de huid aanwezig zijn. Acne komt vooral voor bij mensen in de puberteit, maar ook volwassenen kunnen last hebben van acne. Acne wordt vaak veroorzaakt door verhoogde talgproductie, hormonale veranderingen, stress en gebruik van bepaalde cosmetica en medicatie. Sommige voedingsmiddelen kunnen ook een rol spelen in het ontstaan van acne, zoals chocolade, kaas en frisdrank.\n\nBlauw lichttherapie met de MLX i3 Dome is een effectieve behandeling tegen acne. Dit komt doordat blauw licht werkt antiseptisch en antibacterieel. Blauw licht vermindert ook de talgproductie, waardoor de huid minder snel vet wordt en puistjes ontstaan. Blauw lichttherapie is veilig en er zijn geen bijwerkingen bekend. Eén sessie duurt ongeveer 40 minuten en je merkt al snel resultaat.\n\nNaast het verminderen van acne, heeft blauw lichttherapie ook een positieve invloed op eczeem of psoriasis. Dit komt doordat blauw licht de ontsteking in de huid kan verminderen.\n\nBlauw lichttherapie met de MLX i3 Dome kan ook helpen bij angstgevoelens. Dit komt doordat blauw licht een rustgevend effect heeft op het centrale zenuwstelsel. Ook hier geldt weer dat eén sessie ongeveer 40 minuten duurt en je al snel resultaat zult merken.\n\nBlauw lichttherapie met de MLX i3 Dome is dus een veilige en effectieve behandeling tegen acne, eczeem of psoriasis én angstgevoelens. Deze behandeling kan je immuunsysteem ook versterken, waardoor je minder vatbaar bent voor infecties en ziektes.",
    image: "/Blue Diamonds Foto's/IMG_5609.jpg",
    category: "led-lichttherapie",
    parent: { title: "LED-lichttherapie soorten", href: "/behandelingen/led-lichttherapie" },
    pricing: [
      {
        title: "Blauw LED-lichttherapie",
        items: [
          {
            name: "LED-lichttherapie Blauw",
            price: "€ 24,95",
            duration: "20 minuten",
            note:
              "Blauw lichttherapie heeft een positieve invloed op eczeem, psoriasis, acne en angstgevoelens, heeft antiseptische en antibacteriële effecten, remt talgproductie, en versterkt het immuunsysteem.",
          },
        ],
      },
      {
        title: "Combineer LED-lichttherapie",
        items: [
          {
            name: "I-Dome Triple DETOX Therapie (FIR/LIGHT/PLASMA)",
            price: "€ 29,95",
            duration: "40 minuten",
            note:
              "Triple Detox Infrarood verlichting & lichttherapie. Deze technologie stimuleert het metabolisme door middel van langegolf infraroodstralen via de MLX-koepel. Het extra plasma- en lichttherapieapparaat, gelegen in het bovenste deel, maakt zichtbare verjonging en ontgifting van de huid mogelijk vanaf het eerste gebruik. Voordelen: Stressreductie, ontgifting, bevordert fysiekherstel, verbetert de huidkwaliteit en verbetert de slaapkwaliteit.",
          },
        ],
      },
    ],
  },
  {
    slug: "led-lichttherapie-groen",
    title: "Groen LED-lichttherapie",
    label: "health & beauty",
    intro: "Versterkt het immuunsysteem en verlicht stress",
    details:
      "Groen LED-lichttherapie: o.a. verlicht de stress en versterkt het immuunsysteem\n\nVermindert stress\n\nGroen lichttherapie\n\nOntgifting\nAntibacteriële toepassingen\nVerlicht stress\nVersterkt het immuunsysteem\nBouwt spieren en botten op\nAls afrodisiacum en seksueel tonicum\n\nIn de afgelopen jaren zijn er steeds meer mensen die last hebben van stress. Dit kan komen door werk, relaties of andere problemen in het leven.\nGroen lichttherapie is een nieuwe behandeling die ervoor kan zorgen dat je minder stress ervaart. Deze behandeling maakt gebruik van groene lichtjes die je helpen ontspannen. Groen lichttherapie wordt steeds populairder omdat het een aantal voordelen heeft.\n\nZo helpt het bij het ontgiften van je lichaam, verlicht de stress en versterkt het immuunsysteem. Daarnaast bouwt deze behandeling ook spieren en botten op, waardoor je fitter en gezonder wordt.\n\nDe MLX i³Dome is een nieuwe spa tafel die deze groene lichttherapie aanbiedt. Deze tafel maakt gebruik van Far Infrared technologie in combinatie met Plasma en Licht. Dit maakt de tafel super efficiënt en zorgt ervoor dat je sneller resultaten bereikt.\n\nDe sessies duren ongeveer 40 minuten, waarna je weer helemaal ontspannen bent. Groene lichttherapie is een nieuwe manier om stress te verminderen en je lichaam te ontgiften. De MLX i³Dome is een unieke spa tafel die deze behandeling aanbiedt en ervoor zorgt dat je sneller resultaten bereikt.",
    image: "/Blue Diamonds Foto's/IMG_5609.jpg",
    category: "led-lichttherapie",
    parent: { title: "LED-lichttherapie soorten", href: "/behandelingen/led-lichttherapie" },
    pricing: [
      {
        title: "Groen LED-lichttherapie",
        items: [
          {
            name: "LED-lichttherapie Groen",
            price: "€ 24,95",
            duration: "20 minuten",
            note:
              "Groene lichttherapie bevordert ontgifting, heeft antibacteriële eigenschappen, verlicht stress, versterkt het immuunsysteem, en bouwt spieren en botten op. Het heeft ook een afrodiserende werking en werkt als seksueel tonicum.",
          },
        ],
      },
      {
        title: "Combineer LED-lichttherapie",
        items: [
          {
            name: "I-Dome Triple DETOX Therapie (FIR/LIGHT/PLASMA)",
            price: "€ 29,95",
            duration: "40 minuten",
            note:
              "Triple Detox Infrarood verlichting & lichttherapie. Deze technologie stimuleert het metabolisme door middel van langegolf infraroodstralen via de MLX-koepel. Het extra plasma- en lichttherapieapparaat, gelegen in het bovenste deel, maakt zichtbare verjonging en ontgifting van de huid mogelijk vanaf het eerste gebruik. Voordelen: Stressreductie, ontgifting, bevordert fysiekherstel, verbetert de huidkwaliteit en verbetert de slaapkwaliteit.",
          },
        ],
      },
    ],
  },
  {
    slug: "led-lichttherapie-rood",
    title: "Rood LED-lichttherapie",
    label: "health & beauty",
    intro: "Verminderen van littekenweefsel en ondersteuning van wondgenezing",
    details:
      "Rood LED-lichttherapie: o.a. verminderen van littekenweefsel en ondersteuning van wondgenezing\n\nRood lichttherapie\n\nAnti-aging\nAanmaak collageen\nHerstel & vernieuwing\nVermindert littekenweefsel\nOndersteunt wondgenezing\nVerbetert de doorbloeding\n\nRood lichttherapie is een behandeling die gebruik maakt van rood licht om de huid te verbeteren. Deze behandeling wordt steeds populairder omdat het een aantal voordelen heeft.\n\nRood lichttherapie kan helpen bij het verminderen van littekenweefsel en het ondersteunen van wondgenezing. Dit komt doordat rood licht de doorbloeding verbetert en de productie van collageen stimuleert. Collageen is een belangrijk eiwit dat de huid stevig en elastisch houdt.\n\nDaarnaast heeft rood lichttherapie ook een anti-aging effect. Dit komt doordat rood licht de aanmaak van collageen stimuleert, waardoor de huid er jonger en strakker uitziet. Rood lichttherapie kan ook helpen bij het herstellen en vernieuwen van de huidcellen.\n\nDe MLX i³Dome is een nieuwe spa tafel die deze rode lichttherapie aanbiedt. Deze tafel maakt gebruik van Far Infrared technologie in combinatie met Plasma en Licht. Dit maakt de tafel super efficiënt en zorgt ervoor dat je sneller resultaten bereikt.\n\nDe sessies duren ongeveer 40 minuten, waarna je weer helemaal ontspannen bent. Rode lichttherapie is een nieuwe manier om je huid te verbeteren en te verjongen.",
    image: "/Blue Diamonds Foto's/IMG_5609.jpg",
    category: "led-lichttherapie",
    parent: { title: "LED-lichttherapie soorten", href: "/behandelingen/led-lichttherapie" },
    pricing: [
      {
        title: "Rood LED-lichttherapie",
        items: [
          {
            name: "LED-lichttherapie Rood",
            price: "€ 24,95",
            duration: "20 minuten",
            note:
              "Rood lichttherapie wordt gebruikt voor het tegengaan van huidveroudering. Dit type lichttherapie richt zich op de cellen in de huid en stimuleert de productie van collageen. Het helpt ook bij het verminderen van littekenweefsel en ondersteunt wondgenezing door de doorbloeding te verbeteren.",
          },
        ],
      },
      {
        title: "Combineer LED-lichttherapie",
        items: [
          {
            name: "I-Dome Triple DETOX Therapie (FIR/LIGHT/PLASMA)",
            price: "€ 29,95",
            duration: "40 minuten",
            note:
              "Triple Detox Infrarood verlichting & lichttherapie. Deze technologie stimuleert het metabolisme door middel van langegolf infraroodstralen via de MLX-koepel. Het extra plasma- en lichttherapieapparaat, gelegen in het bovenste deel, maakt zichtbare verjonging en ontgifting van de huid mogelijk vanaf het eerste gebruik. Voordelen: Stressreductie, ontgifting, bevordert fysiekherstel, verbetert de huidkwaliteit en verbetert de slaapkwaliteit.",
          },
        ],
      },
    ],
  },
  {
    slug: "knippen-stijlen",
    title: "Knippen & Stijlen",
    label: "beauty",
    intro: "Professioneel knippen en stijlen — afgestemd op jouw look, persoonlijkheid en stijl.",
    quote:
      "Blue Diamonds Health & Beauty Club: “Bij ons ontvangen jij en je haar de professionele zorg, aandacht en expertise die jullie verdienen, zodat je je op je best voelt!”",
    details:
      "Welkom bij Blue Diamonds Health & Beauty Club, uw vertrouwde partner voor professioneel knippen en stijlen. Onze getalenteerde stylisten staan klaar om u de perfecte look te geven, afgestemd op uw unieke persoonlijkheid en stijl. Of u nu kiest voor een trendy coupe of een klassieke snit, wij zorgen ervoor dat uw haar er fris en verzorgd uitziet. Met ons oog voor detail en gebruik van hoogwaardige producten genieten onze klanten van een ultieme stylingervaring. Kom langs bij Blue Diamonds Health & Beauty Club en ontdek hoe wij uw haar naar een hoger niveau tillen met onze deskundige knip- en stijltechnieken.",
    category: "haar",
    parent: { title: "Haar", href: "/haar" },
    pricing: [
      {
        title: "Dames Knippen & Stijlen",
        items: [
          {
            name: "Dames wassen + knippen + blow dry kort haar (kaaklijn)",
            price: "€ 69,95",
            duration: "45 minuten",
          },
          {
            name: "Dames wassen + knippen + blow dry halflang haar (kaaklijn-schouder)",
            price: "€ 79,95",
            duration: "50 minuten",
          },
          {
            name: "Dames wassen + knippen + blow dry lang haar (vanaf schouder)",
            price: "€ 89,95",
            duration: "60 minuten",
          },
          {
            name: "Dames pony knippen excl. wassen",
            price: "€ 24,95",
            duration: "15 minuten",
          },
          {
            name: "Add hoofdmassage",
            price: "€ 9,95",
            duration: "10 minuten",
          },
        ],
      },
      {
        title: "Heren Knippen & Stijlen",
        items: [
          {
            name: "Wassen, knippen en stijlen",
            price: "€ 39,95",
            duration: "30 minuten",
          },
          {
            name: "Add hoofdmassage",
            price: "€ 9,95",
            duration: "10 minuten",
          },
        ],
      },
      {
        title: "Kids Knippen & Stijlen",
        items: [
          {
            name: "Knippen kinderen 5 t/m 8 jaar excl. wassen",
            price: "€ 29,95",
            duration: "30 minuten",
          },
          {
            name: "Knippen kinderen 5 t/m 8 jaar incl. wassen",
            price: "€ 34,95",
            duration: "40 minuten",
          },
          {
            name: "Kinderen 9 t/m 13 jaar knippen + wassen + stylen (meisjes)",
            price: "€ 54,95",
            duration: "40 minuten",
          },
          {
            name: "Kinderen 9 t/m 13 jaar knippen + wassen + stylen (jongen)",
            price: "€ 44,95",
            duration: "30 minuten",
          },
        ],
      },
    ],
  },
  {
    slug: "kleuren",
    title: "Kleuren",
    label: "beauty",
    intro: "Professionele haarkleuring — afgestemd op jouw wensen, tint en uitstraling.",
    quote:
      "Blue Diamonds Health & Beauty Club: “Bij ons ontvangen jij en je haar de professionele zorg, aandacht en expertise die jullie verdienen, zodat je je op je best voelt!”",
    details:
      "Welkom bij Blue Diamonds Health & Beauty Club, dé expert in professionele haarkleuring die uw stijl doet opleven. Onze ervaren coloristen staan klaar om samen met u de perfecte tint te creëren, afgestemd op uw persoonlijke voorkeuren en huidskleur. Of u nu kiest voor een natuurlijke uitstraling, een gedurfde nieuwe look of een subtiele kleurverandering, wij maken gebruik van geavanceerde technieken en hoogwaardige producten voor een schitterend en duurzaam resultaat. Bezoek Blue Diamonds Health & Beauty Club en laat ons uw haarkleur transformeren naar een meesterwerk vol leven en glans.",
    category: "haar",
    parent: { title: "Haar", href: "/haar" },
    pricing: [
      {
        title: "Kleuren",
        items: [
          { name: "Intake kapper behandeling", price: "€ 15", duration: "15 minuten" },
          { name: "Toner & blow dry kort haar (kaaklijn)", price: "€ 79,95", duration: "60 minuten" },
          {
            name: "Toner & blow dry halflang haar (kaaklijn-schouder)",
            price: "€ 89,95",
            duration: "85 minuten",
          },
          { name: "Toner & blow dry lang haar (vanaf schouder)", price: "€ 99,95", duration: "95 minuten" },
          { name: "Kleuren uitgroei incl blow dry kort haar (kaaklijn)", price: "€ 89,95", duration: "60 minuten" },
          {
            name: "Kleuren uitgroei incl blow dry halflang haar (kaaklijn-schouder)",
            price: "€ 99,95",
            duration: "60 minuten",
          },
          { name: "Kleuren uitgroei incl blow dry lang haar (vanaf schouder)", price: "€ 104,95", duration: "60 minuten" },
          { name: "Kleuren heel hoofd incl blow dry kort haar (kaaklijn)", price: "€ 114,95", duration: "120 minuten" },
          {
            name: "Kleuren heel hoofd incl blow dry halflang haar (kaaklijn-schouder)",
            price: "€ 129,95",
            duration: "135 minuten",
          },
          { name: "Kleuren heel hoofd incl blow dry lang haar (vanaf schouder)", price: "€ 149,95", duration: "145 minuten" },
          { name: "Add knippen vanaf", price: "€ 29,95", duration: "20 minuten" },
        ],
      },
    ],
  },
  {
    slug: "highlights",
    title: "Highlights",
    label: "beauty",
    intro: "Subtiele of opvallende accenten — voor extra dimensie, glans en een frisse look.",
    quote:
      "Blue Diamonds Health & Beauty Club: “Bij ons ontvangen jij en je haar de professionele zorg, aandacht en expertise die jullie verdienen, zodat je je op je best voelt!”",
    details:
      "Welkom bij Blue Diamonds Health & Beauty Club, de specialist in haar highlights die uw uitstraling moeiteloos verfrissen. Onze ervaren coloristen zijn meesters in het creëren van natuurlijke en dimensierijke accenten die uw haarkleur subtiel verbeteren. Of u nu een lichte glans of gedurfde contrasten wenst, onze op maat gemaakte highlights geven uw haar een prachtige gloed en diepte. Met veel aandacht voor detail en gebruik van hoogwaardige producten, zorgen wij voor een schitterend resultaat. Bezoek Blue Diamonds Health & Beauty Club en ontdek hoe de perfecte highlights uw look kunnen transformeren.",
    category: "haar",
    parent: { title: "Haar", href: "/haar" },
    pricing: [
      {
        title: "Highlights 1/4",
        items: [
          {
            name: "Highlights 1/4 hoofd incl toner en blow dry kort haar (kaaklijn)",
            price: "€ 229,95",
            duration: "100 minuten",
          },
          {
            name: "Highlights 1/4 hoofd incl toner en blow dry halflang haar (kaaklijn-schouder)",
            price: "€ 244,95",
            duration: "110 minuten",
          },
          {
            name: "Highlights 1/4 hoofd incl toner en blow dry lang haar (vanaf schouder)",
            price: "€ 259,95",
            duration: "120 minuten",
          },
        ],
      },
      {
        title: "Highlights 1/2",
        items: [
          {
            name: "Highlights 1/2 hoofd incl toner en blow dry kort haar (kaaklijn)",
            price: "€ 269,95",
            duration: "130 minuten",
          },
          {
            name: "Highlights 1/2 hoofd incl toner en blow dry halflang haar (kaaklijn-schouder)",
            price: "€ 274,95",
            duration: "140 minuten",
          },
          {
            name: "Highlights 1/2 hoofd incl toner en blow dry lang haar (vanaf schouder)",
            price: "€ 299,95",
            duration: "150 minuten",
          },
        ],
      },
      {
        title: "Highlights Full Head",
        items: [
          {
            name: "Highlights heel hoofd incl toner en blow dry kort haar (kaaklijn)",
            price: "€ 319,95",
            duration: "175 minuten",
          },
          {
            name: "Highlights heel hoofd incl toner en blow dry halflang haar (kaaklijn-schouder)",
            price: "€ 349,95",
            duration: "185 minuten",
          },
          {
            name: "Highlights heel hoofd incl toner en blow dry lang haar (vanaf schouder)",
            price: "€ 379,95",
            duration: "195 minuten",
          },
          {
            name: "Add knippen vanaf prijzen",
            price: "€ 29,95",
            duration: "20 minuten",
          },
        ],
      },
    ],
  },
  {
    slug: "balayage",
    title: "Balayage",
    label: "beauty",
    intro: "Natuurlijke kleurovergangen — voor een stralende, zachte en stijlvolle haarkleur.",
    quote:
      "Blue Diamonds Health & Beauty Club: “Bij ons ontvangen jij en je haar de professionele zorg, aandacht en expertise die jullie verdienen, zodat je je op je best voelt!”",
    details:
      "Welkom bij Blue Diamonds Health & Beauty Club, dé specialist in balayage voor een natuurlijke en stralende haarkleur. Onze ervaren stylisten beheersen de kunst van deze populaire verftechniek, waarbij uw haar subtiele kleurovergangen en diepte krijgt zonder harde lijnen. Of u nu op zoek bent naar een zongekuste look of een speelse kleuraccent, bij ons bent u verzekerd van prachtig en gezond uitziend haar. Ontdek de perfecte balans tussen stijl en verzorging met een balayage behandeling op maat. Bezoek Blue Diamonds Health & Beauty Club en laat ons uw haar transformeren in een meesterwerk.",
    category: "haar",
    parent: { title: "Haar", href: "/haar" },
    pricing: [
      {
        title: "Dames & Heren Balayage",
        items: [
          {
            name: "Balayage half hoofd incl. toner en blow dry halflang haar (kaaklijn-schouder)",
            price: "€ 259,95",
            duration: "160 minuten",
          },
          {
            name: "Balayage half hoofd incl. toner en blow dry lang haar (vanaf schouder)",
            price: "€ 289,95",
            duration: "195 minuten",
          },
          {
            name: "Balayage heel hoofd incl. toner en blow dry halflang haar (kaaklijn-schouder)",
            price: "€ 319,95",
            duration: "180 minuten",
          },
          {
            name: "Balayage heel hoofd incl. toner en blow dry lang haar (vanaf schouder)",
            price: "€ 359,95",
            duration: "180 minuten",
          },
          {
            name: "Add knippen vanaf",
            price: "€ 29,95",
            duration: "20 minuten",
          },
        ],
      },
    ],
  },
  {
    slug: "herstel",
    title: "Herstel",
    label: "beauty",
    intro: "Verzorging en herstel — voor sterk, glanzend en gezond haar.",
    quote:
      "Blue Diamonds Health & Beauty Club: “Bij ons ontvangen jij en je haar de professionele zorg, aandacht en expertise die jullie verdienen, zodat je je op je best voelt!”",
    details:
      "Welkom bij Blue Diamonds Health & Beauty Club, de ultieme bestemming voor eersteklas haarverzorging. Wij bieden op maat gemaakte behandelingen die uw haar laten stralen en gezond houden. Onze ervaren stylisten gebruiken hoogwaardige producten en de nieuwste technieken om aan al uw haarbehoeften te voldoen. Of het nu gaat om een verfrissende knipbeurt, een diepe conditioneringsbehandeling of een prachtige haarkleuring, bij ons bent u in goede handen. Kom langs en ervaar hoe wij uw natuurlijke schoonheid optimaal tot zijn recht laten komen. Bezoek Blue Diamonds Health & Beauty Club en ontdek de kunst van schitterende haarverzorging.",
    category: "haar",
    parent: { title: "Haar", href: "/haar" },
    pricing: [
      {
        title: "Dames & Heren Haarverzorging",
        items: [
          { name: "Masker", price: "€ 9,95", duration: "15 minuten" },
          { name: "Redken Proteine haarbehandeling", price: "€ 24,95", duration: "20 minuten" },
          { name: "Redken proteine en hydratatie haarbehandeling", price: "€ 34,95", duration: "20 minuten" },
          { name: "Schwartzkofp diepeherstelbehandeling", price: "€ 24,95", duration: "20 minuten" },
          { name: "Nioxin anti hairloss treatment", price: "€ 24,95", duration: "20 minuten" },
          { name: "Add hoofdmassage tijdens het wassen", price: "€ 9,95", duration: "10 minuten" },
        ],
      },
    ],
  },
  {
    slug: "keratine",
    title: "Keratine",
    label: "beauty",
    intro: "Zijdezacht, glanzend en pluisvrij haar — met een keratinebehandeling op maat.",
    quote:
      "Blue Diamonds Health & Beauty Club: “Bij ons ontvangen jij en je haar de professionele zorg, aandacht en expertise die jullie verdienen, zodat je je op je best voelt!”",
    details:
      "Welkom bij Blue Diamonds Health & Beauty Club, de toonaangevende bestemming in Den Haag voor professionele keratinebehandelingen die uw haar zijdezacht en pluisvrij maken. Onze ervaren stylisten gebruiken de beste technieken en hoogwaardige keratineproducten om uw haar te transformeren en langdurige resultaten te garanderen. Of u nu streeft naar meer gladheid, glans, of algehele haargezondheid, wij bieden gepersonaliseerde behandelingen die aan uw specifieke behoeften voldoen. Bezoek Blue Diamonds Health & Beauty Club en ontdek de voordelen van een keratinebehandeling die uw haar een ongeëvenaarde glans en zachtheid geeft.",
    category: "haar",
    parent: { title: "Haar", href: "/haar" },
    pricing: [
      {
        title: "Keratinebehandeling Den Haag",
        items: [
          {
            name: "De Keratine behandelingen komen binnenkort online!",
            price: "€ 00,00",
            duration: "32 jaar — Ervaring",
          },
        ],
      },
    ],
  },
  {
    slug: "massage-stijlen",
    title: "Massage stijlen",
    label: "health",
    intro: "Kies eerst een massagestijl. Daarna zie je de opties en prijzen.",
    details:
      "Ontdek onze massage stijlen — van ontspanning tot herstel en sport. Kies een stijl om de mogelijkheden en prijzen te bekijken.",
  },
  {
    slug: "massage-relaxation",
    title: "Relaxation massage",
    label: "health",
    intro: "Rustgevend & Ontspannend",
    details: "Focus op rust en diepe ontspanning.",
    category: "massage-stijlen",
    parent: { title: "Massage stijlen", href: "/behandelingen/massage-stijlen" },
    pricing: buildMassagePricing('relaxation'),
  },
  {
    slug: "massage-recovery",
    title: "Recovery massage",
    label: "health",
    intro: "Focus op herstel & klachten",
    details: "Focus op herstel, doorbloeding en het verminderen van klachten.",
    category: "massage-stijlen",
    parent: { title: "Massage stijlen", href: "/behandelingen/massage-stijlen" },
    pricing: buildMassagePricing('recovery'),
  },
  {
    slug: "massage-sportmassage",
    title: "Sportmassage",
    label: "health",
    intro: "Focus op spieren & prestatie",
    details: "Focus op spieren, prestatie en sneller herstel.",
    category: "massage-stijlen",
    parent: { title: "Massage stijlen", href: "/behandelingen/massage-stijlen" },
    pricing: buildMassagePricing('sport'),
  },
  {
    slug: "massage-shaping-contouring",
    title: "Shaping & Contouring massage",
    label: "health",
    intro: "Focus op vormgeven en verstrakking",
    details: "Focus op body shaping, contouring en versteviging.",
    category: "massage-stijlen",
    parent: { title: "Massage stijlen", href: "/behandelingen/massage-stijlen" },
    pricing: buildMassagePricing('shaping'),
  },
  {
    slug: "massage-speciale",
    title: "Speciale massages",
    label: "health",
    intro: "Focus op algehele welzijn en op maat",
    details: "Focus op maatwerk en specifieke wensen.",
    category: "massage-stijlen",
    parent: { title: "Massage stijlen", href: "/behandelingen/massage-stijlen" },
    pricing: buildMassagePricing('special'),
  },
  {
    slug: "massage-gezichtsmassage",
    title: "Gezichtsmassage",
    label: "health",
    intro: "Focus op lichaam & geest",
    details: "Focus op ontspanning, glow en balans.",
    category: "massage-stijlen",
    parent: { title: "Massage stijlen", href: "/behandelingen/massage-stijlen" },
    pricing: buildMassagePricing('face'),
  },
  {
    slug: "massage-nek-schouder-rug",
    title: "Nek-, Schouder- & Rug massage",
    label: "health",
    intro: "Focus op verminderen van spanning en druk",
    details: "Focus op het losmaken van spanning in nek, schouders en rug.",
    category: "massage-stijlen",
    parent: { title: "Massage stijlen", href: "/behandelingen/massage-stijlen" },
    pricing: buildMassagePricing('neckBack'),
  },
  {
    slug: "massage-hand-voet",
    title: "Hand- & Voet massage",
    label: "health",
    intro: "Focus op verlichting & bloedcirculatie",
    details: "Focus op verlichting, ontspanning en circulatie.",
    category: "massage-stijlen",
    parent: { title: "Massage stijlen", href: "/behandelingen/massage-stijlen" },
    pricing: buildMassagePricing('handFoot'),
  },
  {
    slug: "massage-duo",
    title: "Duo massage",
    label: "health",
    intro: "Samen genieten",
    details: "Samen ontspannen met een duo massage.",
    category: "massage-stijlen",
    parent: { title: "Massage stijlen", href: "/behandelingen/massage-stijlen" },
    pricing: buildMassagePricing('duo'),
  },
];

export type AnyTreatment = TreatmentPage | Treatment;

export function getTreatmentBySlug(slug: string): AnyTreatment | undefined {
  const legacySlugAliases: Record<string, string> = {
    // Legacy slugs from the current WP site -> our internal slugs
    'gezichtsbehandelingen-soorten': 'gezichtsbehandelingen',
    'make-up-hair': 'make-up-haarstyling',
    'massage-den-haag': 'massage-stijlen',
    // Our overview card uses this slug; map it to the full magnesium treatment page.
    'magnesium-energie-boost': 'magnesium-behandeling',
    'led-lichttherapie-behandelingen': 'led-lichttherapie',
    'verminderen-van-acne-en-angstgevoelens': 'led-lichttherapie-blauw',
    'versterkt-het-immuunsysteem-en-verlicht-de-stress': 'led-lichttherapie-groen',
    'verminderen-van-littekenweefsel-en-ondersteuning-van-wondgenezing': 'led-lichttherapie-rood',
    fysiotherapie: 'podoposturale-therapie-fysiotherapie',
    'lichaamsbehandelingen-den-haag': 'lichaam',
    verzorging: 'herstel',
  };

  const normalizedSlug = legacySlugAliases[slug] ?? slug;

  const page = TREATMENT_PAGES.find((t) => t.slug === normalizedSlug);
  if (page) return page;

  const imported = (IMPORTED_TREATMENT_PAGES as unknown as TreatmentPage[]).find((t) => t.slug === normalizedSlug);
  if (imported) return imported;
  return TREATMENTS.find((t) => t.slug === normalizedSlug);
}

export function treatmentLabelForCategory(category: string): TreatmentLabel {
  // For now keep simple; later you can refine.
  if (category === 'haar') return 'beauty';
  return 'beauty & health';
}

