export type BlogPost = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category?: string;
  /**
   * Optional full content (markdown-ish lines from the legacy website).
   * If absent, we fall back to showing the excerpt.
   */
  content?: string;
};

import bindweefselmassageGezicht from './blogContent/bindweefselmassage-gezicht.md?raw';
import wimperextensions from './blogContent/wimperextensions.md?raw';
import cavitatieBindweefselMassage from './blogContent/cavitatie-bindweefsel-massage.md?raw';
import podoposturaleTherapie from './blogContent/podoposturale-therapie.md?raw';
import dermaplaningLichttherapie from './blogContent/dermaplaning-lichttherapie.md?raw';
import sportmassage from './blogContent/wat-is-een-sportmassage.md?raw';
import mlxI3Dome from './blogContent/mlx-i3dome-oftewel-een-geavanceerde-sauna.md?raw';
import lashlifting from './blogContent/alles-wat-je-moet-weten-over-lashlifting.md?raw';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'bindweefselmassage-gezicht-ervaar-de-ultieme-verjonging-bij-blue-diamonds-health-beauty-club',
    title: 'Bindweefselmassage Gezicht: Ervaar de Ultieme Verjonging bij Blue Diamonds Health & Beauty Club',
    date: '10 februari 2025',
    excerpt:
      'Welkom bij Blue Diamonds Health & Beauty Club, uw bestemming voor luxueuze en effectieve schoonheidsbehandelingen. Vandaag lichten we een van onze meest gevraagde behandelingen uit:',
    category: 'Gezichtsbehandelingen',
    content: bindweefselmassageGezicht,
  },
  {
    id: 'wimperextensions-bij-blue-diamonds-health-beauty-club-in-den-haag-perfecte-wimpers-op-maat',
    title: 'Wimperextensions bij Blue Diamonds Health & Beauty Club in Den Haag – Perfecte Wimpers op Maat!',
    date: '9 februari 2025',
    excerpt:
      'Krijg de Perfecte Wimpers bij Blue Diamonds Health & Beauty Club in Den Haag! Droom jij van volle, lange en perfect gekrulde wimpers zonder gedoe',
    category: 'Wimpers',
    content: wimperextensions,
  },
  {
    id: 'cavitatie-bindweefsel-massage',
    title: 'Cavitatie + Bindweefsel massage',
    date: '12 maart 2024',
    excerpt:
      'Cavitatie en bindweefsel massage zijn twee behandelingen die steeds populairder worden in de wereld van health en beauty. Deze krachtige technieken worden vaak gecombineerd om',
    category: 'Lichaam',
    content: cavitatieBindweefselMassage,
  },
  {
    id: 'podoposturale-therapie',
    title: 'Podoposturale therapie',
    date: '7 februari 2024',
    excerpt:
      'Podoposturale therapie is een behandelmethode die zich richt op het herstellen van lichamelijke klachten door het corrigeren van houding en beweging. Het is gebaseerd op',
    category: 'Health',
    content: podoposturaleTherapie,
  },
  {
    id: 'dermaplaning-lichttherapie',
    title: 'Dermaplaning & Lichttherapie',
    date: '9 oktober 2023',
    excerpt:
      'De combinatie van Dermaplaning en lichttherapie is een geweldige behandelingscombinatie voor een stralende huid. Dermaplaning is een innovatieve exfoliatietechniek die de huid diep reinigt en',
    category: 'Gezichtsbehandelingen',
    content: dermaplaningLichttherapie,
  },
  {
    id: 'wat-is-een-sportmassage',
    title: 'Wat is een sportmassage?',
    date: '8 september 2023',
    excerpt:
      'Sportmassage is een vorm van massage die gericht is op het optimaal laten functioneren van het lichaam door het verbeteren van de bloed- en lymfestroom',
    category: 'Massage',
    content: sportmassage,
  },
  {
    id: 'gezichtsbehandelingen-voordelen',
    title: 'Gezichtsbehandelingen en de ongelofelijke voordelen ervan!',
    date: '17 juli 2023',
    excerpt:
      'Een gezichtsbehandeling is een procedure waarbij verschillende schoonheidsproducten en behandelingen op het gelaat worden toegepast om het uiterlijk en de gezondheid te verbeteren. Gezichtsbehandelingen zijn',
    category: 'Gezichtsbehandelingen',
  },
  {
    id: 'mlx-i3dome-oftewel-een-geavanceerde-sauna',
    title: 'MLX i³Dome oftewel een geavanceerde sauna',
    date: '4 juli 2023',
    excerpt:
      'Dit modernere en meer comfortabele alternatief voor een traditionele sauna biedt een schone en gezonde ervaring, dankzij een combinatie van infrarood, ozon en meervoudige detoxen.',
    category: 'Urban Wellness',
    content: mlxI3Dome,
  },
  {
    id: 'alles-wat-je-moet-weten-over-lashlifting',
    title: 'Alles wat je moet weten over lashlifting',
    date: '15 juni 2023',
    excerpt:
      'Wat is een lashlifting? Lash lifting is een natuurlijke methode van permanente make-up. Het is gericht op het liften en buigen van je natuurlijke wimpers,',
    category: 'Wimpers',
    content: lashlifting,
  },
  {
    id: 'prx-t33',
    title: 'PRX-T33 De beste skinbooster voor anti-aging',
    date: '15 mei 2023',
    excerpt:
      'De PRX–T33 gezichtsbehandeling is een revolutionaire behandeling die de conditie van de huid verbetert. Deze behandeling is ideaal voor mensen die last hebben van acne,',
    category: 'Gezichtsbehandelingen',
  },
  {
    id: 'pedicure',
    title: 'Pedicure',
    date: '21 april 2023',
    excerpt:
      'Pedicure is een vorm van verzorging en behandeling van de voeten. Het is een behandeling die je doet om de voeten gezond en goed verzorgd',
    category: 'Voeten',
  },
  {
    id: 'body-tanning',
    title: 'Wat is een body tanning?',
    date: '27 maart 2023',
    excerpt:
      'Body spray tanning is een techniek waarbij een dunne laag zelfbruiner, meestal een melkachtige vloeistof, wordt aangebracht op de huid met behulp van een luchtspray.',
    category: 'Lichaam',
  },
  {
    id: 'brazilian-wax-faq',
    title: 'Brazilian wax FAQ',
    date: '19 februari 2023',
    excerpt:
      'Brazilian wax is een vorm van ontharing waarbij alle haren van het schaamgebied worden verwijderd. Het is een meer uitgebreide versie van de traditionele bikini',
    category: 'Waxen',
  },
  {
    id: 'fruitzuurpeeling',
    title: 'Wat is een fruitzuurpeeling behandeling?',
    date: '30 januari 2023',
    excerpt:
      'Een fruitzuurpeeling is een soort peeling die wordt gebruikt om dode huidcellen te verwijderen en de algehele teint van de huid te verbeteren. Het bevat',
    category: 'Gezichtsbehandelingen',
  },
  {
    id: 'colombian-butt-lift',
    title: 'Colombian butt lift',
    date: '24 januari 2023',
    excerpt:
      'Als je op zoek bent naar een manier om je billen te verbeteren, is de Colombian Butt Lift met Vacuüm therapie misschien wel iets voor jou. De',
    category: 'Lichaam',
  },
  {
    id: 'microneedling',
    title: 'Microneedling',
    date: '23 januari 2023',
    excerpt:
      'Met microneedling kunnen veel verschillende resultaten worden bereikt. Het is een effectieve behandeling voor het verminderen van rimpels, het verbeteren van de huidtextuur en het',
    category: 'Gezichtsbehandelingen',
  },
  {
    id: 'soorten-massages',
    title: 'Welke soorten massages zijn er en welke past het beste bij mij?',
    date: '22 januari 2023',
    excerpt:
      'Blue Diamonds Health & Beauty Club Den Haag biedt diverse soorten massages aan. De meest voorkomende zijn ontspanningsmassages, diepweefselmassages, sportmassages, hotstone massages, balinese massages en',
    category: 'Massage',
  },
  {
    id: 'hair-extensions',
    title: 'Hair extensions',
    date: '22 januari 2023',
    excerpt:
      'Haar extensions is een populaire oplossing om het haar langer en dikker te maken. Haar extensie is dus een methode waarmee je haar kunt verlengen',
    category: 'Haar',
  },
  {
    id: 'binaural-beats',
    title: 'Wat zijn binaural beats? Effecten en voordelen',
    date: '22 januari 2023',
    excerpt:
      'Binaurale beats zijn een manier om je hersengolven te beïnvloeden door twee verschillende frequenties tegelijk te laten horen. De theorie is dat de hersenen de',
    category: 'Urban Wellness',
  },
  {
    id: 'permanente-wenkbrauwen',
    title: 'Een permanente oplossing voor perfecte wenkbrauwen',
    date: '18 januari 2023',
    excerpt:
      'Je hebt gehoord van micro-needling en je hebt gehoord van make-up, maar heb je ook gehoord van micropigmentatie? Deze revolutionaire procedure combineert het beste van',
    category: 'Wenkbrauwen',
  },
  // NOTE: We keep blog content history, but treatments like "Tanden bleken" are removed from the treatments catalog/navigation.
  {
    id: 'tanden-bleken',
    title: 'Professioneel tandenbleken in Den Haag',
    date: '12 januari 2023',
    excerpt:
      'Heb je er altijd al van gedroomd om een mooie, oogverblindende glimlach te hebben? Blue Diamonds Health & Beauty Club in Den Haag biedt professionele',
    category: 'Tanden bleken',
  },
];

export function getBlogPostById(id: string): BlogPost | undefined {
  const normalized = (id ?? '').trim().replace(/^\/+|\/+$/g, '').replace(/³/g, '3');

  // Backward-compat aliases (older internal IDs we used before matching legacy slugs)
  const alias: Record<string, string> = {
    wimperextensions: 'wimperextensions-bij-blue-diamonds-health-beauty-club-in-den-haag-perfecte-wimpers-op-maat',
    sportmassage: 'wat-is-een-sportmassage',
    'mlx-i3-dome': 'mlx-i3dome-oftewel-een-geavanceerde-sauna',
    lashlifting: 'alles-wat-je-moet-weten-over-lashlifting',
    'bindweefselmassage-gezicht': 'bindweefselmassage-gezicht-ervaar-de-ultieme-verjonging-bij-blue-diamonds-health-beauty-club',
  };

  const key = alias[normalized] ?? normalized;
  return BLOG_POSTS.find((p) => p.id === key);
}

