export type UrbanWellnessPriceOption = {
  label: string;
  price: string;
  note?: string;
};

export type UrbanWellnessDevice = {
  id: 'mlx-quartz' | 'mlx-i3-dome' | 'welnamis';
  title: string;
  ctaLabel: string;
  short: string;
  image?: string;
  description: string[];
  moreInfoText?: string;
  prices: UrbanWellnessPriceOption[];
  extra?: {
    title: string;
    body: string[];
  };
};

export const URBAN_WELLNESS_INTRO = {
  title: 'Urban Wellness',
  lead:
    'Retreat bij Blue Diamonds Health & Beauty Club is een rustige, verkwikkende ervaring waarbij u de mogelijkheid krijgt om te rusten en te ontspannen terwijl u geniet van de luxueuze omgeving.',
  paragraphs: [
    'Er zijn veel verschillende diensten die worden aangeboden, zodat u er zeker van kunt zijn dat u volop van de rust van de omgeving kunt genieten. Je kunt een verscheidenheid aan behandelingen krijgen, waaronder massage op een warme zandbed. Wij beschikken ook over een moderne infrarood sauna waar je kunt relaxen en je huid, je spieren en gehele lichaam kunt verzorgen. Er is ook een warme en zachte bed met computergestuurde akoestische vibratie die je hersenen en lichaam traint om te ontspannen.',
    'We zijn ook erg enthousiast om aan te kunnen kondigen dat we beschikken over 3 nieuwste en ultra moderne apparaten van het merk Gharieni in onze salon. Namelijk de MLX Quartz, MLX i3 Dome en de Welnamis.',
    'Gharieni, onze leverancier heeft ruim 30 jaar ervaring in wellness banken, behandelstoelen en apparatuur voor spa, wellness en beauty. Wij zijn er dus van overtuigd dat deze apparaten aan onze hoge eisen en die van onze klanten zullen voldoen.',
    'Met deze prachtige apparaten kunnen wij onze klanten het volgende bieden in Den Haag:',
  ],
};

export const URBAN_WELLNESS_HERO_IMAGE = "/Blue Diamonds Foto's/IMG_0268.jpeg";

export const URBAN_WELLNESS_DEVICES: UrbanWellnessDevice[] = [
  {
    id: 'mlx-quartz',
    title: 'MLX Quartz',
    ctaLabel: 'Bekijk',
    short: 'Ultramodern zandbed voor totale ontspanning en pijnverlichting.',
    image: "/Blue Diamonds Foto's/IMG_0343.jpeg",
    description: [
      'De MLX Quartz is een ultramodern zandbed dat totale ontspanning en pijnverlichting biedt.',
      'Het bed is gevuld met warm, fijn kwartszand dat zich naar uw lichaamsvorm vormt. De MLX Quartz is ideaal voor mensen met rugpijn, omdat het zand het gewicht gelijkmatig verdeelt en drukpunten verlicht.',
    ],
    prices: [{ label: '1x Quartz bed', price: '€ 19,95' }],
    extra: {
      title: 'Tip voor de beste ervaring',
      body: [
        'Voor de beste ervaring raden we aan om onze quartz bed te boeken in combinatie met een ontspannende massage.',
        'De unieke warmte en diepe druk van het zand helpt te ontladen en de gepersonaliseerde massage technieken werken diep om spanningen weg te nemen.',
        'De combinatie zorgt voor een ultieme ontspanning en retreat gevoel.',
      ],
    },
  },
  {
    id: 'mlx-i3-dome',
    title: 'MLX i3 Dome',
    ctaLabel: 'Bekijk',
    short: 'Uniek ontgiftingssysteem met infrarood-, plasma- en lichttherapie.',
    image: "/Blue Diamonds Foto's/IMG_0268.jpeg",
    description: [
      'De MLX i3 Dome is een uniek ontgiftingssysteem dat gebruik maakt van infrarood-, plasma- en lichttherapie om het lichaam te reinigen van gifstoffen.',
      'Deze behandeling is perfect voor mensen die hun huid of gezondheid in het algemeen willen verbeteren.',
      'Lees ook onze blog: - MLX i³Dome oftewel een geavanceerde sauna',
    ],
    prices: [
      { label: 'Triple detox 1 sessie', price: '€ 29,95' },
      { label: 'Triple detox 4 + 1 gratis sessies', price: '€ 119,95' },
      { label: 'Triple detox 7 + 2 gratis sessies', price: '€ 209,95' },
    ],
  },
  {
    id: 'welnamis',
    title: 'Welnamis',
    ctaLabel: 'Bekijk',
    short: 'Computergestuurde akoestische vibratietherapie die de hersenen traint om te ontspannen.',
    image: "/Blue Diamonds Foto's/IMG_0269.jpeg",
    description: [
      'Wetenschappelijk bewezen!',
      'Wetenschappelijke onderzoek hersencentrum & Onderzoek van wet van hartcoherentie',
      'De Welnamis is een computergestuurde akoestische vibratietherapie die de hersenen traint om te ontspannen. Met behulp van specifieke trillingen en binaurale audiofrequenties maakt Welnamis het zelfs voor de drukste geest mogelijk om een diep niveau van ontspanning te bereiken in een therapiesessie van 22, 30 of 60 minuten.',
      'De Welnamis is een geweldige manier om stress, angst en spanningshoofdpijn te verminderen. Het kan ook worden gebruikt om de slaapkwaliteit en de bloedsomloop te verbeteren.',
      'Lees ook onze blog: - Wat zijn binaural beats? effecten & voordelen',
    ],
    prices: [
      {
        label: 'Relax',
        price: '€ 24,95',
        note:
          '1 sessie: Na een sessie Welnamis Bed, zul je een gevoel van ontspanning ervaren. Door liggen op de speciale matras terwijl je omringd bent door trillingen van precieze frequenties en intensiteiten, leidt dit tot een diepgaande meditatie-achtige ervaring. Deze ervaring werkt als een soort van reset-knop om je zelf gecentreerd en ontspannen te voelen. Na een sessie kan je daarom lichamelijke klachten als gespannen spieren, hoofdpijn en gebrek aan energie ervaren verminderen.',
      },
      {
        label: 'Relaxation exercise 5x',
        price: '€ 99,95',
        note:
          '4+1 gratis sessies: welnamis bed zorgt dat je het techniek leert om zelf te leren ontspannen. Ontspannen is een vaardigheid die je moet ontwikkelen. Door meerdere sessies met welnamis bed te boeken, kun je steeds meer vertrouwd raken met ontspannen en hopelijk ook toepassen in je dagelijks leven.',
      },
      {
        label: 'A relaxation expert 9x',
        price: '€ 179,95',
        note:
          '7+2 gratis sessies: Het leren ontspannen van je geest en lichaam is een geweldige manier om kalmte en rust te ervaren. Met meer sessies kun je steeds meer fysieke en mentale processen activeren in het lichaam, zoals rust, ademhaling, zelfreflectie en meditatie. Je kunt beter stress, pijn en spanning herkennen, beheersen en vaak zelfs voorkomen.',
      },
    ],
  },
];

