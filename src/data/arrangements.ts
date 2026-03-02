import type { LucideIcon } from 'lucide-react';
import { Flame, Heart, Hotel, Leaf, Sparkles, Sun, UtensilsCrossed, Users, Waves, Zap } from 'lucide-react';

export type ArrangementPricing =
  | {
      from: string;
      to: string;
      note?: string;
    }
  | {
      note: string;
      from?: string;
      to?: string;
    };

export type Arrangement = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  image?: string;
  duration: string;
  includes: string[];
  featured?: boolean;
  pricing?: ArrangementPricing;
};

export const ARRANGEMENTS: Arrangement[] = [
  {
    id: 'japanese-urban-retreat',
    title: 'Japanese Urban Retreat',
    subtitle: 'Japanese urban retreat',
    image: "/Blue Diamonds Foto's/IMG_0268.jpeg",
    description:
      'Japanse sauna is een populaire manier om te ontgiften door het gebruiken van verschillende hitte-graden. Het is een rustgevende ervaring die je helpt je lichaam te ontgiften en je geest te kalmeren. Daarnaast is Japanse massage een krachtige manier om lichamelijke spanningen te verlichten. Met drukpunten, strekkingen en een aantal stevige wrijvingen, laat het je hoofd leegmaken terwijl het je lichaam ontspant. Door beide opties samen te gebruiken, kan je de ideale manier creëren om je lichaam te ontgiften en te relaxen. Door de warmte uit de sauna in combinatie met de rustgevende massage, zal je geest en je lichaam rust en energie krijgen.',
    icon: Flame,
    duration: '60 minuten',
    includes: [
      'MLX i³Dome triple detox therapie (moderne Japanse sauna: licht, plasma & FIR energie) — 30 minuten',
      'Japanse massage van 30 minuten inclusief bamboestokken therapie',
    ],
    pricing: {
      from: '€ 79,95',
      to: '€ 69,95',
      note: 'Arrangementen kunnen alleen telefonisch gereserveerd en naar wens aangepast worden.',
    },
  },
  {
    id: 'destress',
    title: 'De-stress',
    subtitle: 'De-stress',
    image: "/Blue Diamonds Foto's/IMG_0298.jpeg",
    description:
      'Het is belangrijk om af en toe rust te nemen, maar veel mensen hebben geen tijd om dit te doen. Daarom is een 45 minuten durende sessie om te ontspannen en te ontstressen precies wat je nodig hebt. Na afloop van deze 45 minuten durende sessie voel je je heerlijk ontspannen en klaar om de rest van de dag tegemoet te gaan. Geniet van deze heerlijke ervaring en gun jezelf deze verwennerij.',
    icon: Heart,
    duration: '60 minuten',
    includes: [
      'Keuze ontspanningsmassage (gezicht-& hoofd óf rug, nek & schouders) — 30 minuten',
      'Stress-relief programma met akoestische vibratietherapie op een speciale Welnamis waterbed — 30 minuten (uniek in NL)',
    ],
    pricing: {
      from: '€ 69,95',
      to: '€ 59,95',
      note: 'Arrangementen kunnen alleen telefonisch gereserveerd en naar wens aangepast worden.',
    },
  },
  {
    id: 'beauty-weekend',
    title: 'Beauty weekend arrangement',
    subtitle: 'Beauty weekend',
    image: "/Blue Diamonds Foto's/IMG_0324.jpeg",
    description:
      'Het weekend is een tijd die vaak uitnodigt om even een stapje terug te doen, te ontspannen en te genieten. Als je je weekend extra special wilt maken, waarom zou je dan niet eens het ultieme pakket met beauty behandelingen proberen? Het beauty pakket is een geweldige manier om je weekend extra leuk en mooi te maken.',
    icon: Sparkles,
    duration: 'Op maat (meerdere behandelingen)',
    includes: [
      'Manicure van 30 minuten',
      'Pedicure van 45 minuten',
      'Wenkbrauwen epileren, verven en shapen',
      'Haarstylen / föhnen',
      'Glas champagne, rode wijn, witte wijn of koffie/thee',
    ],
    pricing: {
      from: '€ 214,95',
      to: '€ 149,95',
      note: 'Arrangementen kunnen alleen telefonisch gereserveerd en naar wens aangepast worden.',
    },
  },
  {
    id: 'energy-boost',
    title: 'Energy boost arrangement',
    subtitle: 'Energy boost',
    image: "/Blue Diamonds Foto's/IMG_0269.jpeg",
    description:
      'Met dit energieboost–arrangement kun je genieten van een aantal verschillende wellness–activiteiten om je energie te verhogen. Het arrangement duurt ongeveer twee uur en is een geweldige manier om je energieniveau op te krikken en je geest en lichaam te revitaliseren.',
    icon: Zap,
    duration: '± 110 minuten',
    includes: [
      'Magnesium experience intensive behandeling — 80 minuten',
      'Magnesiumrijke smoothie',
      'Welnamis — 30 minuten (akoestisch waterbed met vibratietherapie)',
    ],
    pricing: {
      from: '€ 144,95',
      to: '€ 119,95',
      note: 'Arrangementen kunnen alleen telefonisch gereserveerd en naar wens aangepast worden.',
    },
  },
  {
    id: 'private-party',
    title: 'Private party arrangement',
    subtitle: 'Private party',
    image: "/Blue Diamonds Foto's/IMG_0282.jpeg",
    description:
      'Wordt op maat samengesteld! Je kunt een unieke ervaring samenstellen die precies bij jouw groep en je persoonlijke behoeften past om te ontspannen en genieten. Van een geavanceerde privé wellness tot luxe facials, make up, massages en manicures & pedicures: je kunt je eigen persoonlijke evenement creëren. Je kunt ook de sfeer upgraden met luxe producten en een selectie van lekkere drankjes, hapjes of een uitgebreide catering.',
    icon: Users,
    duration: 'Op maat',
    includes: ['Op maat samengesteld (groep & wensen)', 'Prijs in overleg'],
    pricing: {
      note: 'Prijs in overleg. Arrangementen kunnen alleen telefonisch gereserveerd worden.',
    },
  },
  {
    id: 'slimming-sculpting',
    title: 'Slimming arrangement',
    subtitle: 'Slimming/sculpting',
    image: "/Blue Diamonds Foto's/IMG_0294.jpeg",
    description:
      'Dit arrangement is een met zorg samengestelde pakket dat perfect is voor iedereen die op zoek is naar een manier om hun lichaam te verstrakken en centimeters te verliezen zonder al te veel inspanning. Het is een combinatie van een aantal verschillende 100 procent natuurlijke body shape behandelingen. Het helpt uw huid te verstevigen en uw figuur te verbeteren zonder ingrijpende chirurgie. Dit pakket is ook gericht op vet-en vochthuishouding en cellulitis op armen, benen, heupen & buik en je verliest centimeters omvang.',
    icon: Leaf,
    duration: '120 minuten',
    includes: [
      'Cavitatie van 30 minuten',
      'Japanse i3-Dome triple detox therapie (licht, plasma & FIR energie) — 30 minuten',
      'Bindweefselmassage of shaping — 60 minuten',
    ],
    pricing: {
      from: '€ 189,95',
      to: '€ 129,95',
      note: 'Arrangementen kunnen alleen telefonisch gereserveerd en naar wens aangepast worden.',
    },
  },
  {
    id: 'mind-body',
    title: 'Mind & Body arrangement',
    subtitle: 'Mind & Body',
    image: "/Blue Diamonds Foto's/IMG_0315.jpeg",
    description:
      'Dit arrangement helpt jou om je stress en spanningen te verminderen, je emotionele balans te herstellen en je geestelijke helderheid te vergroten. Dit pakket is samengesteld om jou te helpen om je energie, vitaliteit en levensstijl op peil houden en of te verbeteren. Door deze behandelingen ben je beter in staat om met dagelijkse uitdagingen om te gaan en leef je een gezondere en gelukkiger leven.',
    icon: Sun,
    duration: '± 95 minuten',
    includes: [
      'MLX i³Dome triple detox therapie (moderne Japanse sauna: licht, plasma & FIR energie) — 30 minuten',
      'Ontspanningsmassage van 40 minuten op een warme dynamic quartz bed',
      'Akoestische vibratietherapie van 25 minuten op een speciale waterbed (Welnamis)',
    ],
    featured: true,
    pricing: {
      from: '€ 139,95',
      to: '€ 119,95',
      note: 'Uniek in Nederland. Arrangementen kunnen alleen telefonisch gereserveerd en naar wens aangepast worden.',
    },
  },
  {
    id: 'before-after-holiday',
    title: 'Before & after Holiday arrangement',
    subtitle: 'Before holiday',
    image: "/Blue Diamonds Foto's/IMG_0338.png",
    description:
      'Een beauty pakket voor je (zomer) vakantie is de perfecte manier om je goed voor te bereiden op de komende seizoen. Het pakket bestaat uit een aantal behandelingen en nuttige producten die je voor en na de zomer (vakantie) zeker nog nodig hebt.',
    icon: Waves,
    duration: '90 minuten',
    includes: [
      'Gezichtsbehandeling van 30 minuten',
      'Manicure van 30 minuten',
      'Pedicure van 30 minuten',
      'Mini size skincare met 4 producten + leuk klein tasje',
    ],
    pricing: {
      from: '€ 164,95',
      to: '€ 129,95',
      note: 'Arrangementen kunnen in overleg worden ge-upgrade of aangepast.',
    },
  },
  {
    id: 'hotel-wellness',
    title: 'Hotel & Wellness-arrangement',
    subtitle: 'Hotel & Wellness-arrangement',
    // Same visual theme as "Beauty weekend" (hotel/robe wellness vibe)
    image: "/Blue Diamonds Foto's/IMG_0350.jpeg",
    description:
      'Blue Diamonds Health & Beauty Club heeft een bijzondere samenwerking met een aantal luxe hotels in Den Haag. Deze samenwerking is uniek omdat het een gezamenlijke inspanning is om de gasten van hotels in Den Haag de best mogelijke verblijfservaring te bieden, inclusief hoge kortingen op hun overnachtingen. LET OP: Dit arrangement is exclusief te boeken via Blue Diamonds Health & Beauty Club.',
    icon: Hotel,
    duration: 'Op maat (hoteloptie + behandelingen)',
    includes: [
      'Een ontspanningsmassage van 30 minuten',
      'Een stressverlichtend programma met akoestische vibratietherapie op een speciaal Welnamis-waterbed — 22 minuten (uniek in Nederland)',
      'Overnachting(en) in een luxe kamer, inclusief ontbijt',
      'Hotelopties: Hotel Indigo, Voco Hotel, Hilton Hotel, Hotel Des Indes, Hotel Staybridge Suites',
    ],
    pricing: {
      note: 'De prijzen zijn afhankelijk van de gekozen hoteloptie. Exclusief te boeken via Blue Diamonds Health & Beauty Club.',
    },
  },
  {
    id: 'callas',
    title: "Calla's arrangement",
    subtitle: "Calla's arrangement",
    image: "/Blue Diamonds Foto's/cella.jpg",
    description:
      'Blue Diamonds, de grootste High End Health & Beauty Club, is een unieke samenwerking aangegaan met Calla’s, het enige Michelin sterren restaurant in Den Haag. Deze samenwerking combineert culturele, culinaire en wellness ervaringen in één exclusieve en verfijnde beleving. Let op: dit arrangement is alleen te reserveren op aanvraag via ons en kan in overleg worden gewijzigd of aangevuld.',
    icon: UtensilsCrossed,
    duration: 'Lunch of diner (combinatie)',
    includes: [
      'Keuze uit: Beauty / Before holiday / Energy boost / Mind & Body arrangement',
      'Ontvangst met een glas Champagne en 3 appetizers',
      '4-gangen menu',
      'Premium water (onbeperkt geserveerd)',
      'Lunch combinatie: € 199,- (dinsdag t/m vrijdag)',
      'Diner combinatie: € 224,- (dinsdag t/m zaterdag)',
    ],
    pricing: {
      note: "Reserveren op aanvraag via ons. Voor info over Calla’s: restaurantcallas.nl",
    },
  },
];

