import type { PriceSection } from '@/data/treatmentsCatalog';

export type PriceCategory = {
  id: string;
  title: string;
  sections: PriceSection[];
};

/**
 * Source: provided by client (paste) based on Blue Diamonds price list.
 * Keep this file as the canonical price list used on /prijslijst.
 */
export const PRICE_LIST: PriceCategory[] = [
  {
    id: 'permanent-make-up',
    title: 'Permanent make-up',
    sections: [
      {
        title: 'Powder Brows',
        items: [
          {
            name: 'Powder Brows intake',
            price: '€ 24,95',
            duration:
              "15 minuten - Uw afspraak begint bij onze PMU specialiste Cathleen. Zij luistert naar uw wensen en analyseert de verwachtingen. Zij beantwoord al uw vragen over PMU wenkbrauwen en informeert over de do`s en don`ts. Aansluitend geeft zij u een passend advies en licht alle stappen toe. Indien u bij ons Powder Brows gaat boeken zullen wij de betaalde intake van daadwerkelijke bedrag eraf halen.",
          },
          {
            name: 'Powder Brows',
            price: '€ 249,95',
            duration:
              "120 minuten - Bij Powder brows worden de wenkbrauwen ingeschaduwd met pigment. Powder brows is de nieuwste trend op het gebied van permanente make-up (PMU) voor wenkbrauwen. Maar de naam zegt het al; `powder`. Met deze techniek van permanente make-up wordt met een PMU apparaat op een heel subtiele wijze pigment aangebracht. Hierdoor lijkt het alsof je je wenkbrauwen met wenkbrauwpoeder hebt ingekleurd. Alleen is het resultaat semi permanent. Dat houdt in dat je na ongeveer 1,5 jaar je wenkbrauwen een touch-up moet geven. Zo geniet je langer van je mooie wenkbrauwen.",
          },
          {
            name: 'Powder Brows Touch Up',
            price: '€ 149,95',
            duration:
              `120-150 minuten — Permanent make-up touch up is een nabehandeling die meestal plaatsvindt tussen 8 en 12 weken na de eerste behandeling van permanente make-up. Het doel van deze touch up is om eventuele onvolkomenheden of gebieden met opgehoopt pigment bij te werken en de kleur en vorm van de permanent make-up te perfectioneren. Het is belangrijk om deze touch up te laten doen, omdat de eerste behandeling nog niet perfect kan zijn door de natuurlijke afschilfering van de huid en de manier waarop pigmenten zich zetten. Deze touch up zorgt voor een langduriger resultaat en een optimaal esthetisch effect. Bovendien kan de permanent make-up artist tijdens de touch up eventuele wensen of aanpassingen van de klant bespreken en uitvoeren.`,
          },
        ],
      },
    ],
  },
  {
    id: 'gezichtsbehandelingen',
    title: 'Gezichtsbehandelingen',
    sections: [
      {
        title: 'LED-lichttherapie treatments',
        items: [
          {
            name: 'LED-lichttherapie treatments',
            price: '€24,95',
            duration:
              `20 minuten — In slechts 20 minuten kunnen niet-invasieve LED-lichtbehandelingen diverse huidproblemen verbeteren. Hierbij worden verschillende kleuren licht, zoals rood, groen en blauw, gebruikt voor een stralende en gezondere huid zonder hersteltijd. Deze behandelingen kunnen op zichzelf worden toegepast of in combinatie met andere gezichtsbehandelingen voor een langdurig effect. Onze experts kunnen je adviseren welke LED-lichttherapie het beste past bij jouw gekozen gezichtsbehandeling.`,
          },
        ],
      },
      {
        title: 'Facial Diamonds',
        items: [
          {
            name: 'Facial Diamonds Algae Hydra Mineral treatment',
            price: '€ 114,95',
            duration:
              `75 minuten — Geheel behandeling met producten van algen/zeewier speciaal voor hydratatie. oppervlakte reinigen, huidanalyse, diepte reiniging, onzuiverheden verwijderen, gezichtsmassage, speciaal masker, serum en dag/nachtverzorging`,
          },
          {
            name: 'Facial Diamonds Algae Sensi Marine treatment',
            price: '€ 114,95',
            duration:
              `75 minuten — Geheel behandeling met producten van algen/zeewier speciaal voor kalmering. oppervlakte reinigen, huidanalyse, diepte reiniging, onzuiverheden verwijderen, gezichtsmassage, speciaal masker, serum en dag/nachtverzorging`,
          },
          {
            name: 'Facial Diamonds Algae Lift & Firm treatment',
            price: '€ 114,95',
            duration:
              `75 minuten — Geheel behandeling met producten van algen/zeewier gericht op anti-aging. oppervlakte reinigen, huidanalyse, diepte reiniging, onzuiverheden verwijderen, gezichtsmassage, speciaal masker, serum en dag/nachtverzorging`,
          },
          {
            name: 'Facial Diamonds Algae Energy & Radiance treatment',
            price: '€ 114,95',
            duration:
              `75 minuten — Geheel behandeling met producten van algen/zeewier gericht op futloze huid. oppervlakte reinigen, huidanalyse, diepte reiniging, onzuiverheden verwijderen, gezichtsmassage, speciaal masker, serum en dag/nachtverzorging`,
          },
          {
            name: 'Facial Diamonds Algae Intense White treatment',
            price: '€ 134,95',
            duration:
              `75 minuten — behandeling met producten van algen/zeewier gericht op pigmentatie. oppervlakte reinigen, huidanalyse, diepte reiniging, onzuiverheden verwijderen, gezichtsmassage, speciaal masker, serum en dag/nachtverzorging. Voor optimale resultaat adviseren wij een kuur van 6 behandelingen. Bij aanschaf van een kuur ontvang je gratis een Serum en Cleanser van Thalion twv €135,-`,
            note: '(Bij aanschaf van een kuur ontvangt u gratis een Serum en Cleanser van Thalion twv €135,-)',
          },
          {
            name: 'Facial Diamonds Algae Ocean Secrets treatment',
            price: '€ 144,95',
            duration:
              `75 minuten — Geheel behandeling met producten van algen/zeewier speciaal voor anti-aging rijpere huid. oppervlakte reinigen, huidanalyse, diepte reiniging, onzuiverheden verwijderen, gezichtsmassage, speciaal masker, serum en dag/nachtverzorging`,
          },
          {
            name: 'Facial Diamonds treatment',
            price: '€ 64,95',
            duration:
              `30 minuten — Reinigen, huidanalyse, keuze uit massage, onzuiverheden verwijderen of masker, serum en dag/nachtverzorging`,
          },
          {
            name: 'Facial Teen Diamonds treatment (leeftijd 13 t/m 17 jaar)',
            price: '€ 64,95',
            duration:
              `50 minuten — Speciaal samengestelde behandeling voor een tiener huid van 13 t/m 17 jaar. Oppervlakte reinigen, huidanalyse, diepte reiniging, onzuiverheden verwijderen, speciale masker, serum en dag/nachtverzorging`,
          },
          {
            name: 'Microneedling/ 1Need Geheel Gezicht',
            price: '€ 159,95',
            duration:
              `50 minuten — Microneedling is een techniek, waarbij de huid met minuscule naaldjes gecontroleerd geperforeerd wordt. Dit stimuleert de huid zichzelf te herstellen. Het natuurlijk wondgenezingsproces in de huid wordt geactiveerd, waardoor keratinocyten en fibroblasten worden bevorderd. Doordat actieve groei- en helende factoren vrijkomen, kunnen fibroblasten zich vermenigvuldigen en die zorgen weer voor een versnelde aanmaak van collageen en elastine. De epidermis wordt verstevigd, de huid ziet er gezonder uit, de doorbloeding is geoptimaliseerd en de huid voelt gladder en steviger aan. Naast huidverjonging kunnen ook de verschillende aandoeningen als acne, littekens, rimpels, grove poriën, couperose, vitiligo, hypopigmentatie, alopecia, ouderdomsvlekjes en milia kunnen worden behandeld`,
          },
          {
            name: 'Blue Diamonds PRX-T33 Skinbooster',
            price: 'Van €110 voor €94,95',
            duration:
              `45 minuten — De PRX-T33 gezichtsbehandeling is een revolutionaire behandeling die de conditie van de huid verbetert. Deze behandeling is ideaal voor mensen die last hebben van acne, littekens, vermoeidheid of fijne lijntjes. De behandeling gebruikt een speciaal ingrediënt genaamd trichloroacetic acid (TCA) dat helpt bij het verminderen van hyperpigmentatie, het verbeteren van de elasticiteit van de huid en het verzachten van rimpels. Behandeling bestaat uit: oppervlakte reinigen, inmasseren van PRX-T33 vloeistof en daarna speciale verzorgingscreme en SPF foundation.`,
          },
          {
            name: 'Blue Diamonds PRX-T33 + Microneedling Treatment',
            price: 'Van €260 voor €199,95',
            duration:
              `45 minuten — De PRX–T33 gezichtsbehandeling is een revolutionaire behandeling die de conditie van de huid verbetert. Deze behandeling is ideaal voor mensen die last hebben van acne, littekens, vermoeidheid of fijne lijntjes. De behandeling gebruikt een speciaal ingrediënt genaamd trichloroacetic acid (TCA) dat helpt bij het verminderen van hyperpigmentatie, het verbeteren van de elasticiteit van de huid en het verzachten van rimpels. Behandeling bestaat uit: oppervlakte reinigen, insluizen van PRX-T33 met 1Need/microneedling en daarna speciale verzorging crème en SPF foundation.`,
          },
          {
            name: 'Facial Diamonds Peeling treatment',
            price: 'Van €65 voor €54,95',
            duration:
              `30 minuten — Een verhelderende behandeling om vermoeidheid, hyper-pigmentatie, acne en melasma te verminderen. Dankzij deze peeling krijgt de huid een egalere uitstraling en een vermindering van pigmentvlekken. oppervlakte reiniging, verhelderende fruitzuurpeeling van Dr Tadlea, dag/nacht verzorging. Voor een optimale resultaat adviseren wij om deze behandeling in een kuur van maximaal 8 behandelingen te nemen`,
          },
          {
            name: 'Facial Diamonds Super Peeling treatment',
            price: 'Van €125 voor €99,95',
            duration:
              `60 minuten — Een verhelderende behandeling om vermoeidheid, hyper-pigmentatie, acne en melasma te verminderen. Dankzij deze peeling krijgt de huid een egalere uitstraling en een vermindering van pigmentvlekken. oppervlakte reiniging, verhelderende fruitzuurpeeling van Dr Tadlea, bindweefsel/cupping massage, masker, dag/nacht verzorging. We adviseren deze behandeling in een kuur van maximaal 8 behandelingen`,
          },
          {
            name: 'Dermaplaning inclusief vliesmasker',
            price: '€ 74,95',
            duration:
              `45 minuten — Bij de Dermaplaning methode wordt er een steriel chirurgisch mes gebruikt om over de huid te schrapen. Dit zorgt ervoor dat kleine haartjes, dode huidcellen en vuil van het gezicht verwijderd worden. Het resultaat is een zachte, gladde huid met een mooie glans. Na de behandeling voelt de huid zijdezacht aan en ziet make-up er prachtig uit door de egale huid. Tevens stimuleert Dermaplaning de opname van actieve ingrediënten door de huid, waardoor de effecten van aanvullende behandelingen en thuisproducten nog meer versterkt worden.`,
          },
        ],
      },
    ],
  },
  {
    id: 'handen',
    title: 'Handen',
    sections: [
      {
        title: 'Handen & Nagels',
        items: [
          {
            name: 'Biab',
            price: '€ 69,95',
            duration:
              `60 minuten - Een BIAB (builder in a bottle) treatment is een behandeling die is gericht op het sterker en gezonder maken van je nagels.`,
          },
          {
            name: 'Biab + Gellak',
            price: '€ 74,95',
            duration:
              `70 minuten - Een BIAB (builder in a bottle) treatment is een behandeling die is gericht op het sterker en gezonder maken van je nagels. Bij een biab met gellak wordt er een transparante biab gebruikt met een gellak kleur naar keuze.`,
          },
          {
            name: 'Biab + Press on',
            price: '€ 94,95',
            duration: `70 minuten - Verlenging met Biab door middel van een zachte tip.`,
          },
          {
            name: 'Biab + Verlenging',
            price: '€ 89,95',
            duration:
              `70 minuten - De natuurlijke nagel wordt in model gevijld en dof gemaakt. De nagelriemen worden verzorgd. De nagel wordt stofvrij gemaakt en ontvet. Een korte verlenging met Gel. Hierna wordt je nagel in model gebracht.`,
          },
          {
            name: 'Biab opvullen',
            price: '€ 64,95',
            duration:
              `60 minuten - Biab gel blijft 3 tot 4 weken perfect zitten en lift niet, helpt hierbij de natuurlijke nagels groeien. Het is zeer stevig! Na deze periode is het verstandig om de nagels op te vullen met een Biab opvul behandeling.`,
          },
          {
            name: 'Biab + verlenging opvullen',
            price: '€89,95',
            duration:
              `70 minuten - Biab gel blijft 3 tot 4 weken perfect zitten en lift niet, helpt hierbij de natuurlijke nagels groeien. Het is zeer stevig! Na deze periode is het verstandig om de nagels op te vullen met een Biab opvul behandeling.`,
          },
          {
            name: 'Gelnagels nieuw set',
            price: '€ 74,95',
            duration:
              `70 minuten - Verlenging op je nagels met Gel. Gelnagels worden over het algemeen gezien als de meest natuurlijke vorm van kunstnagels. Ze worden gebruikt voor een versteviging van natuurlijke nagels`,
          },
          {
            name: 'Gelnagels + Gellak',
            price: '€ 89,95',
            duration: `80 minuten`,
          },
          {
            name: 'Opvullen gelnagels',
            price: '€ 54,95',
            duration: `70 minuten - Het opvullen van Gelnagels raden we aan tussen 3 a 4 weken.`,
          },
          {
            name: 'Nagelbijt behandeling',
            price: '€ 94,95',
            duration:
              `90 minuten - Nagelbijtbehandeling :De natuurlijke nagel wordt in model gevijld en dof gemaakt. De nagelriemen worden verzorgd. De nagel wordt stofvrij gemaakt en ontvet. De gel wordt aangebracht en zorgt voor een stukje verlenging. Hierdoor kunnen je eigennagels beter groeien. We adviseren om een tussentijdse behandeling te nemen na 4 dagen.`,
          },
          {
            name: 'Nagelbijt behandeling opvullen',
            price: '€ 54,95',
            duration: `90 minuten - tussentijdse herstelbehandeling`,
          },
          {
            name: 'Basis Manicure',
            price: '€ 44,95',
            duration:
              `30 minuten - Deze behandeling bestaat uit: Het vijlen van de nagels in je favoriete vorm en het verwijderen van de nagelriemen van de nagelplaat. Het resultaat prachtig verzorgde handen. Add een heerlijke handmassage van 15 minuten voor maar €11 extra.`,
          },
          {
            name: 'Spa Manicure',
            price: '€ 49,95',
            duration:
              `45 minuten - Geniet van onze nieuwe spa manicure behandeling. Deze behandeling bestaat uit: handenbadje, scrubben, nagelriemen knippen, nagels vijlen en hydrateren. Hierbij kunt u een Nagellak of Gellak erbij boeken. Het resultaat prachtig verzorgde handen. Add een heerlijke handmassage van 15 minuten voor maar €11 extra.`,
          },
          {
            name: 'Manicure + Nagellak',
            price: '€ 54,95',
            duration:
              `45 minuten - Deze behandeling bestaat uit een uitgebreide manicure behandeling + nagellak naar keuze. Add ook een heerlijke handmassage van 15 minuten voor maar €11 extra.`,
          },
          {
            name: 'Manicure + Gellak',
            price: '€ 59,95',
            duration:
              `60 minuten - Deze behandeling bestaat uit een uitgebreide manicure behandeling + gellak naar keuze. Add ook een heerlijke handmassage van 15 minuten voor maar €11 extra.`,
          },
          {
            name: 'Polygel nieuw set',
            price: '€ 89,95',
            duration:
              `80 minuten - Polygel is een combinatie tussen Gel en Acryl. Het heeft de flexibiliteit die gel ook heeft, maar ook de stevigheid van acryl. Waar gel normaliter zichzelf in vorm brengt, is dit bij polygel niet het geval. De nagels blijven langer zitten, zijn flexibeler en makkelijker te modelleren dan gel –of acrylnagel. Polygel nagels zijn enerzijds flexibeler, maar toch steviger dan gel –en acrylnagels. Hierdoor blijven de nagels dan ook langer zitten en kan je er vanuit gaan dat ze ongeveer 3 tot 4 weken blijven zitten.`,
          },
          {
            name: 'Polygel Nagels + Gellak',
            price: '€ 99,95',
            duration: `90 minuten`,
          },
          {
            name: 'Opvullen polygel nagels',
            price: '€ 54,95',
            duration: `60 minuten - Wij adviseren om je Polygel nagels tussen 3 a 4 weken op te laten vullen.`,
          },
          {
            name: 'Herstel polygel per nagel',
            price: '€ 7,95',
            duration: `10 minuten`,
          },
          {
            name: 'Herstel gelnagels per nagel',
            price: '€ 7,95',
            duration: `10 minuten`,
          },
          {
            name: 'Nail art per nagel',
            price: '€ 2,95',
            duration: `10 minuten`,
          },
          {
            name: 'Verwijderen polygel/gelnagels andere salon',
            price: '€ 29,95',
            duration:
              `30 minuten - Er zijn vele merken op de markt van Gel en/of Polygel. Indien je nieuw bij ons bent dan moet de oude Gel of Polygel eraf gehaald worden. Verschillende materialen kunnen voor slechte hechting zorgen en/of schimmels veroorzaken.`,
          },
        ],
      },
    ],
  },
  {
    id: 'lichaam',
    title: 'Lichaam',
    sections: [
      {
        title: 'Lichaamsbehandelingen',
        items: [
          {
            name: 'Cavitatie + Shaping/bindweefsel massage',
            price: '€ 94,95',
            duration:
              `70 minuten — Een bindweefselmassage gecombineerd met cavitatie lichaam voor optimale spanning- en vetvermindering. Deze massage richt zich op het diepgaande ontspannen van bindweefsels met speciale technieken en massageoliën. Cavitatie lichaam maakt gebruik van een geavanceerd systeem met cavitatie, radiofrequentie, vacuüm en diodelaser lipolyse om vetcellen effectief te bestrijden. Verminder vetplooien, cellulitis en littekens terwijl je je doorbloeding en stofwisseling stimuleert. Verbrand vet efficiënt en verzacht littekens met deze unieke behandeling. Perfect voor diegenen die hun lichaam willen versterken en revitaliseren.`,
          },
          {
            name: 'Body Diamonds Thalisense Oceanic Bliss treatment',
            price: '€ 129,95',
            duration:
              `70 minuten — Geniet van deze heerlijke full body 3 stappen behandeling met onze exclusief en 100% natuurlijke producten van Thalion. Behandeling bestaat uit; Scrubben, massage en hydratatie.`,
          },
          {
            name: 'Body Diamonds Mineral Therapies treatment',
            price: '€ 119,95',
            duration:
              `60 minuten — Geniet van deze heerlijke full body 4 stappen behandeling met onze exclusief en 100% natuurlijke producten van Thalion. Behandeling bestaat uit; scrubben, sculpting wrap, slimming massage en hydratatie.`,
          },
          {
            name: 'Body Diamonds Butt peeling treatment',
            price: '€ 64,95',
            duration:
              `45 minuten — Butt peeling (ook wel butt facial genoemd) behandeling is een huidverjongingsmethode die gericht is op het verwijderen van dode huidcellen op de billen. De behandeling stelt de client in staat om een matte, gladder huid te behouden door het scrubben met speciale exfoliërende producten. Het resultaat van een butt peeling behandeling is een gezonder en jong aanvoelende huid, waardoor de elasticiteit wordt vergroot en de pigmentatie wordt verminderd.`,
          },
          {
            name: 'Colombian Buttlift',
            price: '€ 69,95',
            duration:
              `30 minuten — De Colombian butt lift is een nieuwe trend op het gebied van lifting. Bij deze techniek wordt gebruik gemaakt van een vacuümtherapie waarmee je billen niet enkel gelift worden, maar ook meer volume krijgen.`,
          },
          {
            name: 'Colombian Buttlift + Anticellulite',
            price: '€ 89,95',
            duration:
              `60 minuten — De Colombian butt lift is een nieuwe trend op het gebied van lifting. Bij deze techniek wordt gebruik gemaakt van een vacuümtherapie waarmee je billen niet enkel gelift worden, maar ook meer volume krijgen. Daarnaast is de deze behandeling ook erg doeltreffend tegen cellulite. Deze vorm van lifting heeft als doel de billen op een natuurlijke manier te vergroten en verstevigen en maakt het zelfs mogelijk om de vorm van je billen aan te passen`,
          },
        ],
      },
    ],
  },
  {
    id: 'voeten',
    title: 'Voeten',
    sections: [
      {
        title: 'Pedicure behandelingen',
        items: [
          {
            name: 'Spa Pedicure Speciaal voor grove eelt en kloven (Callus free)',
            price: '€ 79,95',
            duration:
              `60 minuten — Deze behandeling is speciaal voor voeten met dikke eelt en kloven. (callus free) Als extra bij je pedicure te boeken: gellak, nagellak of BIAB`,
          },
          {
            name: 'Basis Pedicure',
            price: '€ 34,95',
            duration:
              `30 minuten — Warme compress, vijlen, nagelriemen knippen en hydrateren. Als extra bij je pedicure te boeken: gellak, nagellak of BIAB`,
          },
          {
            name: 'Spa Pedicure',
            price: '€ 49,95',
            duration:
              `45 minuten — Voetbad, voeten scrubben, vijlen, nagelriemen knippen, eelt verwijderen en hydrateren. Als extra bij je pedicure te boeken: gellak, nagellak of BIAB.`,
          },
          {
            name: 'Spa Pedicure Pro Diamonds behandeling',
            price: '€ 79,95',
            duration:
              `60 minuten —Voetbad, vijlen, voeten scrubben, nagelriemen knippen, eet verwijderen, massage, hydrateren en nagellak.`,
          },
          {
            name: 'Spa Pedicure + Keuze uit een Magnesium behandeling',
            price: '€ 59,95',
            duration:
              `45 minuten — Voetbad, voeten scrubben, vijlen, nagelriemen knippen, eelt verwijderen en hydrateren. Keuze uit magnesium voetbad/magnesium scrub/ magnesium Olie Als extra bij je pedicure te boeken: gellak, nagellak of BIAB.`,
          },
          {
            name: 'Spa Pedicure Blue Diamonds Magnesium',
            price: '€ 69,95',
            duration:
              `45 minuten — Magnesium voetbad, voeten scrubben met magnesium scrub, vijlen, nagelriemen knippen, eelt verwijderen en hydrateren met magnesium olie. Als extra bij je pedicure te boeken: gellak, nagellak of BIAB.`,
          },
          {
            name: 'Spa Pedicure Pro Diamonds Magnesium compleet',
            price: '€ 89,95',
            duration:
              `60 minuten — Magnesium voetbad, magnesium scrub, , vijlen, nagelriemen knippen, eelt verwijderen, voetmassage met magnesium olie, hydrateren en nagellak.`,
          },
          {
            name: 'Add Gellak',
            price: '€ 19,95',
            duration:
              `20 minuten — Als extra bij je pedicure te boeken. Dit is alleen gellak aanbrengen op teennagels.`,
          },
          {
            name: 'Add Nagellak',
            price: '€ 9,95',
            duration:
              `25 minuten — Als extra bij je pedicure te boeken. Dit is alleen nagellak aanbrengen op teennagels.`,
          },
          {
            name: 'Add BIAB',
            price: '€ 24,95',
            duration:
              `20 minuten — Als extra bij je pedicure te boeken. Dit is alleen BIAB aanbrengen op teennagels.`,
          },
          {
            name: 'Gellak verwijderen',
            price: '€ 14,95',
            duration:
              `15 minuten — Als extra bij je pedicure te boeken.`,
          },
        ],
      },
    ],
  },
  {
    id: 'wenkbrauwen-wimpers',
    title: 'Wenkbrauwen & Wimpers',
    sections: [
      {
        title: 'Wenkbrauwen & Wimpers',
        items: [
          {
            name: 'Lashlifting',
            price: '€ 54,95',
            duration:
              `45 minuten — Lashlifting is een behandeling waarbij de wimpers worden gelift en het resultaat 4-6 weken blijft. Wimperlifting is excl. verven.`,
          },
          {
            name: 'Brow Lamination',
            price: '€ 64,95',
            duration:
              `40 minuten — Deze behandeling is incl. shapen/epileren en excl. verven. Lamination is een behandeling waarbij jouw natuurlijke wenkbrauwhaartjes in de juiste richting geplaatst worden. Dit resultaat blijft 4-6 weken zitten.`,
          },
          {
            name: 'Henna Brows',
            price: '€ 59,95',
            duration:
              "30 minuten — Henna brow treatment is incl. epileren/shapen. Het verven met henna is anders dan verven met normale wenkbrauw verf. De verf blijft langer op de haren zitten (ongeveer 4 tot 6 weken). Bij henna brows worden zowel de haartjes als de huid onder de wenkbrauwen geverfd, waardoor er een `ingetekend` effect ontstaat.",
          },
          {
            name: 'Wenkbrauwen Epileren',
            price: '€ 12,95',
            duration: `20 minuten — Wenkbrauwen epileren met een pincet of hars/wax`,
          },
          {
            name: 'Wenkbrauw Threading',
            price: '€ 12,95',
            duration:
              `30 minuten — Epileren met behulp van twee garen die in elkaar worden gedraaid en over de huid oppervlak worden gerold voor een perfecte vorm`,
          },
          {
            name: 'Wenkbrauw Waxen',
            price: '€ 15,95',
            duration: `30 minuten — Epileren met behulp van hars voor een perfecte vorm`,
          },
          {
            name: 'Wenkbrauwen Verven',
            price: '€ 19,95',
            duration:
              `30 minuten— Met het verven van je wenkbrauwen kun je de kleur en (optische) volheid van u wenkbrauwen op een semi-permanente manier veranderen`,
          },
          {
            name: 'Wenkbrauw Epileren + Verven',
            price: '€ 29,95',
            duration: `30 minuten — Wenkbrauwen epileren met een pincet of hars/wax + wenkbrauwen verven`,
          },
          {
            name: 'Wimpers Verven',
            price: '€ 19,95',
            duration:
              `30 minuten— Met het verven van je wimpers kun je de kleur en (optische) volheid van je wimpers op een semi-permanente manier veranderen`,
          },
          {
            name: 'Wimperextensions one by one new set',
            price: '€ 99,95',
            duration: `90 minuten`,
          },
          {
            name: 'Wimperextensions refill one by one in 1 week',
            price: '€ 49,95',
            duration: `30 minuten`,
          },
          {
            name: 'Wimperextensions one by one refill in 2 weeks',
            price: '€ 54,95',
            duration: `45 minuten`,
          },
          {
            name: 'Wimperextensions one by one refill in 3 weeks',
            price: '€ 69,95',
            duration: `60 minuten`,
          },
          {
            name: 'Wimperextensions verwijderen i.c.m. nieuwe set',
            price: '€ 24,95',
            duration: `30 minuten`,
          },
          {
            name: 'Wimperextensions verwijderen',
            price: '€ 44,95',
            duration: `30 minuten`,
          },
          {
            name: 'Wenkbrauwen Shapen',
            price: '€ 14,95',
            duration: `30 minuten —Wenkbrauwen in gewenste vorm brengen zonder te epileren`,
          },
          {
            name: 'Bovenlip & Onderlip Threading',
            price: '€ 19,95',
            duration:
              `20 minuten — Epileren met behulp van twee garen die in elkaar worden gedraaid en over de huid oppervlak worden gerold voor het verwijderen van de haartjes boven en onder de lip. Bij threading worden je haren van de bovenlip en onderlip met een touwtje verwijderd. Dit zorgt ervoor dat de haren langer wegblijven en voor een strak resultaat.`,
          },
        ],
      },
    ],
  },
  {
    id: 'waxen',
    title: 'Waxen',
    sections: [
      {
        title: 'Waxen Den Haag',
        items: [
          { name: 'Brazilian Wax', price: '€ 54,95', duration: `40 minuten` },
          { name: 'Waxen Bikinilijn', price: '€ 49,95', duration: `40 minuten` },
          { name: 'Waxen Geheel Gezicht', price: '€ 54,95', duration: `45 minuten` },
          { name: 'Waxen Bovenlip of kin', price: '€ 24,95', duration: `30 minuten` },
          { name: 'Waxen Bovenlip & kin', price: '€ 34,95', duration: `45 minuten` },
          { name: 'Waxen Kaaklijn en wangen', price: '€ 39,95', duration: `30 minuten` },
          { name: 'Waxen Oksels', price: '€ 39,95', duration: `45 minuten` },
          { name: 'Waxen Armen', price: '€ 59,95', duration: `45 minuten` },
          { name: 'Waxen Boven-of onderarmen', price: '€ 34,95', duration: `35 minuten` },
          { name: 'Waxen Benen', price: '€ 79,95', duration: `45 minuten` },
          { name: 'Waxen Boven-of ondebenen', price: '€ 44,95', duration: `30 minuten` },
          { name: 'Waxen Rug', price: '€ 69,95', duration: `45 minuten` },
          { name: 'Waxen Boven-of onderrug', price: '€ 39,95', duration: `35 minuten` },
          { name: 'Waxen Borst', price: '€ 44,95', duration: `40 minuten` },
          { name: 'Waxen Buik', price: '€ 39,95', duration: `35 minuten` },
          { name: 'Waxen Billen met bilnaad', price: '€ 34,95', duration: `40 minuten` },
          { name: 'Waxen Billen', price: '€ 29,95', duration: `40 minuten` },
          { name: 'Waxen Handen', price: '€ 34,95', duration: `40 minuten` },
        ],
      },
    ],
  },
  {
    id: 'led-lichttherapie',
    title: 'Led-lichttherapie',
    sections: [
      {
        title: 'LED-lichttherapie',
        items: [
          {
            name: 'LED lichttherapie Rood',
            price: '€24,95',
            duration:
              `20 minuten — Rood lichttherapie stimuleert de aanmaak van collageen, bevordert huidherstel en vernieuwing, vermindert littekenweefsel en ondersteunt wondgenezing door het verhogen van ATP in cellen en celreproductie.`,
          },
          {
            name: 'LED lichttherapie Groen',
            price: '€24,95',
            duration:
              `20 minuten — Groene lichttherapie bevordert ontgifting, heeft antibacteriële eigenschappen, verlicht stress, versterkt het immuunsysteem, en bouwt spieren en botten op. Het heeft ook een afrodiserende werking en werkt als seksueel tonicum.`,
          },
          {
            name: 'LED lichttherapie Blauw',
            price: '€24,95',
            duration:
              `20 minuten — Blauw lichttherapie heeft een positieve invloed op eczeem, psoriasis, acne en angstgevoelens, heeft antiseptische en antibacteriële effecten, remt talgproductie, en versterkt het immuunsysteem.`,
          },
        ],
      },
    ],
  },
  {
    id: 'hair-make-up',
    title: 'Hair & Make-up',
    sections: [
      {
        title: 'Hair & Make-up Den Haag',
        items: [
          { name: 'Blue Diamonds Blowdry', price: '€ 34,95', duration: `30 minuten` },
          { name: 'Blue Diamonds Beauty Make-up', price: '€ 54,95', duration: `30 minuten` },
          { name: 'Blue Diamonds Hairstyling', price: '€ 59,95', duration: `60 minuten` },
          { name: 'Blue Diamonds Hair & Make-up', price: '€ 104,95', duration: `90 minuten` },
          { name: 'Blue Diamonds Hair Extensions', price: '€ 349,95', duration: `120 minuten` },
          {
            name: 'Blue Diamonds Hair Extensions replacing',
            price: '€ 164,95',
            duration: `90 minuten`,
          },
          {
            name: 'Blue Diamonds Hair Extensions Removing',
            price: '€ 149,95',
            duration: `60 minuten`,
          },
          {
            name: 'Blue Diamonds Brides make-up inclusief Proefsessie',
            price: '€ 249,95',
            duration: `90 minuten`,
          },
          {
            name: 'Blue Diamonds Brides Hairstlying inclusief proefsessie',
            price: '€ 299,95',
            duration: `90 minuten`,
          },
          {
            name: 'Blue Diamonds Brides make-up & Hair inclusief proefsessie',
            price: '€ 499,95',
            duration: `120 minuten`,
          },
        ],
      },
    ],
  },
  {
    id: 'magnesium',
    title: 'Magnesium',
    sections: [
      {
        title: 'Magnesium behandelingen',
        items: [
          {
            name: 'Magnesium Experience Light',
            price: '€ 94,95',
            duration:
              `60 minuten — Magnesium Voetenbad, Magnesium Scrub, Magnesium Ontspanningmassage.`,
          },
          {
            name: 'Magnesium Experience Light kuur 4+1 gratis',
            price: '€ 379,80',
            duration: `60 minuten`,
          },
          {
            name: 'Magnesium Experience Intensive',
            price: '€ 114,95',
            duration:
              `80 minuten — Magnesium Voetenbad, Magnesium Scrub, Magnesium Ontspanningsmassage en Magnesium infrarooddeken lichaamspakking met Magnesium Sportolie Rozemarijn + Magnesium Aloë Vera Gezichtsmassage + Magnesiumrijke smoothie.`,
          },
          {
            name: 'Magnesium Experience Intensive kuur 4+1 grais',
            price: '€ 459,80',
            duration: `80 minuten`,
          },
        ],
      },
    ],
  },
  {
    id: 'massage',
    title: 'Massage',
    sections: [
      {
        title: 'Massage behandelingen',
        items: [
          {
            name: 'DUO Massages',
            price: 'N.t.b',
            duration:
              `30/60/90 minuten — Bij ons kun je ook genieten van DUO massages. Vrijwel al onze massages kunnen in DUO-vorm worden gegeven. Onze prachtige locatie, gevestigd in het voormalige gebouw van de Nederlandse bank, biedt ons de mogelijkheid om onze populaire DUO-massages aan te bieden in een ruime kluis. Onze klanten kunnen genieten van een ontspannende massage-ervaring op comfortabele en verwarmde bedden, omringd door muren met een dikte tot wel 1,5 meter. Gelegen in het hart van Den Haag, bieden wij deze luxe ervaring aan alle gasten.`,
          },
          {
            name: 'Maderotherapie',
            price: '€ 89,95',
            duration:
              `60 minuten — Bij Maderotherapie wordt er gebruik gemaakt van anatomisch gevormde houten instrumenten en warme olie om een bindweefsel massage uit te voeren. Het doel van deze behandeling is het verbeteren van lichaamscontouren, het losmaken van vetcellen en het stimuleren van het lymfatisch systeem van het lichaam.`,
          },
          {
            name: 'Bamboe Massage',
            price: '€ 84,95',
            duration:
              `60 minuten — Bij de bamboe massage methode worden warme bamboestokken gebruikt die de zenuwuiteinden en oppervlakkige spieren stimuleren. Dit bevordert de bloedsomloop, waardoor de cellen meer zuurstof en voeding krijgen. Dit zorgt voor een natuurlijke 'high' resultaat.`,
          },
          {
            name: 'Lomi Lomi Massage',
            price: '€ 84,95',
            duration:
              `60 minuten — De lomi lomi massage biedt innerlijke balans en harmonie in het lichaam. Het is niet alleen een ontspanningsmassage, maar het stimuleert tevens de vitaliteit, bevordert de bloedsomloop en heeft een positief effect op de orgaanfuncties.`,
          },
          {
            name: 'Thaise Massage',
            price: '€ 84,95',
            duration:
              `60 minuten — Thaise massage is een oude traditie die duizenden jaren geleden is begonnen in Thailand. Het is een drukpuntmassage waarbij er wordt gewerkt met technieken zoals kneden, stoten, strekken, wrijven en rollen om fysieke spanning in het lichaam te verlichten. Het kent vele voordelen zoals ontspanning, verhoging van de flexibiliteit, versterking van de bloedsomloop en het verbeteren van de immuniteit. Thaise massage kan ook gebruikt worden om bepaalde kwaaltjes als hoofdpijn en spierspanning te behandelen. Onze Thaise massage wordt uitgevoerd door een goed opgeleide en ervaren masseuse die bekend is met de technieken. Met haar jarenlange ervaring kunt u een onvergetelijke massage ervaren die uw lichaam zal verjongen en verfrissen.`,
          },
          {
            name: 'Ayurvedische Massage (Indiase massage)',
            price: '€ 84,95',
            duration:
              `60 minuten — Een Ayurvedische massage is een beoefende techniek uit het Ayurvedische traditionele geneeskundige systeem dat zich toelegt op het behouden van gezondheid en het voorkomen en beheersen van ziekte. De massage is gericht op het in evenwicht brengen van de energiebanen in het lichaam (dosha’s) via het gebruik van zachte, glijdende aanraking. Behandelingen kunnen variëren van lichte aanraking en geleide bewegingen, tot meer diepgaande strekkingen en kneedbewegingen ter stimulering van spieren, bindweefsel, aderen, meridianen en door het lichaam gestuurde eindorganen.`,
          },
          {
            name: 'Ayurvedische Massage (Indiase massage)',
            price: '€ 94,95',
            duration:
              `75 minuten — Een Ayurvedische massage is een beoefende techniek uit het Ayurvedische traditionele geneeskundige systeem dat zich toelegt op het behouden van gezondheid en het voorkomen en beheersen van ziekte. De massage is gericht op het in evenwicht brengen van de energiebanen in het lichaam (dosha’s) via het gebruik van zachte, glijdende aanraking. Behandelingen kunnen variëren van lichte aanraking en geleide bewegingen, tot meer diepgaande strekkingen en kneedbewegingen ter stimulering van spieren, bindweefsel, aderen, meridianen en door het lichaam gestuurde eindorganen. Elk gebied van het lichaam kan worden gemasseerd, waarbij de massagetherapeut gebruik maakt van oliën, kruiden en specerijen die gebruikt worden om de spieren en het bindweefsel los te maken.`,
          },
          {
            name: 'Ayurvedische Massage (Indiase massage)',
            price: '€ 99,95',
            duration:
              `90 minuten — Een Ayurvedische massage is een beoefende techniek uit het Ayurvedische traditionele geneeskundige systeem dat zich toelegt op het behouden van gezondheid en het voorkomen en beheersen van ziekte. De massage is gericht op het in evenwicht brengen van de energiebanen in het lichaam (dosha’s) via het gebruik van zachte, glijdende aanraking. Behandelingen kunnen variëren van lichte aanraking en geleide bewegingen, tot meer diepgaande strekkingen en kneedbewegingen ter stimulering van spieren, bindweefsel, aderen, meridianen en door het lichaam gestuurde eindorganen. Elk gebied van het lichaam kan worden gemasseerd, waarbij de massagetherapeut gebruik maakt van oliën, kruiden en specerijen die gebruikt worden om de spieren en het bindweefsel los te maken.`,
          },
          {
            name: 'Bindweefselmassage Gezicht',
            price: '€ 59,95',
            duration:
              `30 minuten — Een diepe gezichtsmassage dat rimpels, kraaienpootjes en littekens minder zichtbaar maakt. De behandeling bestaat uit reinigen, massage, masker en dag/nacht verzorging. Een bindweefselmassage voor het gezicht is een massagetechniek die zich richt op de diepere lagen van de huid, het bindweefsel genaamd. Deze massage stimuleert de doorbloeding en activeert de collageenproductie, waardoor de huid wordt verstevigd en rimpels en lijntjes verminderen. Ook worden afvalstoffen afgevoerd, waardoor de huid er frisser en gezonder uitziet. De massagetechniek bestaat uit het kneden en rollen van de huid, waardoor de doorbloeding gestimuleerd wordt en opgehoopte spanning en verklevingen worden losgemaakt. Dit zorgt voor een betere doorstroming van energie en een gezonde kleur en uitstraling van de huid. Daarnaast kan een bindweefselmassage ook helpen bij het verlichten van hoofdpijn, stress en spanning in het gezicht en de nek.`,
          },
          {
            name: 'Bindweefselmassage Lichaam',
            price: '€ 84,95',
            duration:
              `60 minuten — Bindweefselmassage lichaam is de 100% natuurlijke body-shape behandeling. Het helpt jou huid te verstevigen en je figuur te verbeteren zonder ingrijpende chirurgie. Deze intensieve massagetherapie werkt krachtig in op de vet- en vochthuishouding. Cellulite op armen, benen, heupen en buik verdwijnen en je verliest centimeters omvang.`,
          },
          {
            name: 'Sportmassage',
            price: '€ 49,95',
            duration:
              `30 minuten — Een half body sportmassage is een stevige massage die gericht is op het stimuleren van de doorbloeding van de spieren.\n\nMet een sportmassage zorg je ervoor dat afvalstoffen in je spieren sneller worden afgevoerd. Daarmee bevorder je het herstel van je spieren en lichaam.\n\nDeze massage is zeer geschikt voor mensen met stijve/vermoeide spieren, slechte doorbloeding, kramp, vochtvorming en verhoogde spierspanning.`,
          },
          {
            name: 'Sportmassage',
            price: '€ 84,95',
            duration:
              `60 minuten — Een Full body sportmassage is een stevige massage die gericht is op het stimuleren van de doorbloeding van de spieren.\n\nMet een sportmassage zorg je ervoor dat afvalstoffen in je spieren sneller worden afgevoerd. Daarmee bevorder je het herstel van je spieren en lichaam.\n\nDeze massage is zeer geschikt voor mensen met stijve/vermoeide spieren, slechte doorbloeding, kramp, vochtvorming en verhoogde spierspanning.`,
          },
          {
            name: 'Zwangerschapsmassage',
            price: '€ 84,95',
            duration:
              `60 minuten — Zwangerschap is een bijzondere periode waarin u zich samen voorbereidt op de komst van uw kindje. De veranderingen die de zwangerschap in het lichaam en de psyche teweegbrengt, vraagt om speciale aandacht. Als u zwanger bent neemt het gewicht toe en de ongelijkmatige verdeling van dit gewicht verplaatst zich. Dit kan klachten veroorzaken. Deze full body massage is zeer heilzaam en een genot voor moeder en kind.`,
          },
          {
            name: 'Gezichtsmassage Face Cupping',
            price: '€ 49,95',
            duration:
              `30 minuten — Facial cupping is een vereenvoudigde variant van de bindweefselmassage uit de traditionele geneeswijze. Voor het gezicht hebben wij twee soorten cups. De zachte wordt gebruikt bij iemand die net begint met facial cupping. De harde cup is pittiger, pakt meer vacuüm en wordt gebruikt op een huid die gewend is aan de techniek. Deze wijze van gezichtsmassage heeft een positief effect op je huid. Zo draagt de behandeling met siliconen vacuümcups onder meer bij tot het verminderen van rimpels en wallen, het verbeteren van littekenweefsel en het verstevigen van de huid.`,
          },
          {
            name: 'Ontspanninng Gezichts-& Hoofdmassage',
            price: '€ 49,95',
            duration:
              `30 minuten — Deze massage stimuleert de bloedsomloop en ontspant de spieren. Het heeft een positieve invloed op de ademhaling, spijsvertering, het zenuwstelsel en het geheugen. Door regelmatig te masseren krijgt het gezicht minder rimpels.`,
          },
          {
            name: 'Ontspanningsmassage Rug, Nek & Schouders',
            price: '€ 49,95',
            duration:
              `30 minuten — Dit is een rug, nek, schoudermassage om de spieren te stimuleren en te activeren het bevordert de doorbloeding en geeft een ontspannen gevoel. Deze vorm van massage werkt uitstekend bij fysieke 'problemen, zoals vastzittende spieren, pijn in de nek en rug. Tevens geeft deze behandeling een ontspannend gevoel en keert de energie weer terug.`,
          },
          {
            name: 'Handmassage',
            price: '€ 19,95',
            duration:
              `20 minuten — Deze super laagdrempelige massage van de handen is een leuke manier om kennis te maken als je nog nooit een massage gehad hebt. Bij deze de handmassage kun je je kleding aanhouden, neem je relaxt plaats op een stoel en dan kan je genieten van deze massage. Net als bij andere massages gebruik wij bij de handmassage ook speciale olie. Omdat er veel zenuwen en spieren in de hand zitten is dit een effectieve behandeling om de spanningen hier uit weg te nemen. De ontspanning werkt bovendien door naar de rest van het lichaam.`,
          },
          {
            name: 'Voetmassage',
            price: '€ 29,95',
            duration:
              `20 minuten — Deze super laagdrempelige massage van de voeten is een leuke manier om kennis te maken als je nog nooit een massage gehad hebt. Bij deze de voetmassage kun je je kleding aanhouden. Net als bij andere massages gebruik wij bij de voetmassage ook speciale olie. Voordelen van Voetmassage zijn onder andere verbeterde bloedcirculatie, minder last van angst en depressie, verlaagd bloeddruk, minder hoofdpijn en migraine.`,
          },
          {
            name: 'Hotstone Massage',
            price: '€ 84,95',
            duration:
              `60 minuten — De hotstone massage is een volledige lichaamsmassage waarbij gebruik wordt gemaakt van warme stenen. De warme stenen zorgen voor een verbeterde bloedcirculatie en verlichten spier- en zenuwpijn.`,
          },
          {
            name: 'Geheel Lichaams Ontspanningmassage',
            price: '€ 84,95',
            duration:
              `60 minuten — Ontspanningsmassage is een van de bekendste massages en is al duizenden jaren bekend. De basis van deze massage is ontspanning van lichaam en geest. De ontspanningsmassage is in de eerste plaats een zachte en rustige variant van de klassieke massage en bestemd voor diegenen die hun spieren en lichaam op een vriendelijke manier willen ontspannen. Een ontspannen lichaam zorgt tegelijk voor mentale ontspanning en stress reductie.`,
          },
          {
            name: 'Balinese Massage (Indonesische massage)',
            price: '€ 84,95',
            duration:
              `60 minuten — De Balinese massage is een massage waarbij er met verwarmde kokos olie gemasseerd wordt. Tijdens deze massage worden de afvalstoffen uit de spieren verwijderd waardoor je je weer fit voelt. De gehele achterkant van het lichaam zal worden gemasseerd. Door acupressuur en het opheffen van blokkades in de energiebanen wordt het balans tussen lichaam en geest, yin en yang, hersteld.`,
          },
          {
            name: 'Swedish Massage',
            price: '€ 84,95',
            duration:
              `60 minuten — Bij een Zweedse massage worden meerdere massagetechnieken toegepast, zoals zachte strijkbewegingen en het uitoefenen van druk op bepaalde plekken. Deze massage stimuleert de huid en bevordert de bloedsomloop.`,
          },
          {
            name: 'Cupping Massage',
            price: '€ 84,95',
            duration:
              `60 minuten — Cupping is een traditionele massage waarbij gebruik wordt gemaakt van cups. Bij cupping worden de cups op het lichaam aangebracht waardoor er op die plek een vacuüm ontstaat. Dit vacuüm zorgt voor een betere doorbloeding en een massage van het dieperliggende bindweefsel. Hierdoor ontspannen de spieren en worden eventuele energieblokkades weggenomen.`,
          },
          {
            name: 'Lymfedrainage',
            price: '€ 44,95',
            duration:
              `30 minuten — Lymfedrainage is een behandeling die het lymfestelsel stimuleert en heeft tot doel om overtollig lymfevocht beter en sneller af te voeren. Hierdoor kunnen heel wat gezondheidsproblemen worden aangepakt.`,
          },
          {
            name: 'Lymfedrainage',
            price: '€ 84,95',
            duration:
              `60 minuten — Lymfedrainage is een behandeling die het lymfestelsel stimuleert en heeft tot doel om overtollig lymfevocht beter en sneller af te voeren. Hierdoor kunnen heel wat gezondheidsproblemen worden aangepakt.`,
          },
          {
            name: 'Cavitatie + Shaping/bindweefsel massage',
            price: '€ 94,95',
            duration:
              `70 minuten — Bindweefselmassage in combinatie met cavitatie lichaam is een vorm van massage die helpt bij het verminderen van diepe spanning in het bindweefsel van het lichaam. Tijdens de behandeling wordt het bindweefsel zachtjes gemasseerd met massageoliën en worden er speciale technieken gebruikt om de diepe aderen en gewrichtsweefsels te behandelen. Cavitatie lichaam is een techniek die gebruikt wordt om vetcellen te breken door middel van een cavitatie + radio frequentie + vacuüm + diodelaser lipolyse apparaat. Deze techniek helpt bij het verminderen van behandelbare vetplooien, cellulitis en littekens. Door het gecombineerde gebruik van bindweefselmassage en cavitatie lichaam kunnen doorbloeding en stofwisseling worden verbeterd, waardoor het lichaam in staat is om vetcellen efficiënt te verbranden en littekens te verzachten.`,
          },
          {
            name: 'Voetreflex Massage',
            price: '€ 64,95',
            duration:
              `45 minuten — Een voet reflexmassage is een alternatieve massagevorm waarbij druk wordt uitgeoefend op specifieke punten op de voeten die corresponderen met verschillende organen, spieren en weefsels in het lichaam. Het doel van deze massage is om de bloedcirculatie en de energiestroom in het lichaam te verbeteren en eventuele blokkades of spanningen op te heffen. Hierdoor zou het zelfgenezend vermogen van het lichaam gestimuleerd worden en kunnen lichamelijke en/of geestelijke klachten verminderen of verdwijnen. Een voet reflexmassage kan ontspannend werken, maar ook specifieke klachten zoals hoofdpijn, rugpijn, spijsverteringsproblemen of stressklachten kunnen behandeld worden met deze massagevorm. Het is geen medische behandeling en kan niet als vervanging dienen voor reguliere medische zorg.`,
          },
        ],
      },
    ],
  },
  {
    id: 'urban-wellness',
    title: 'Urban Wellness',
    sections: [
      {
        title: 'Urban Wellness',
        items: [
          {
            name: 'Quartz Balans & Heroriëntatie',
            price: '€ 19,95',
            duration: `Toe te voegen als extra op alle massages, gezicht en of lichaamsbehandelingen`,
          },
          {
            name: 'Welnamis Stress Relief',
            price: '€ 24,95',
            duration:
              "22 minuten — Verminder Stress… ‘Hou meer energy over voor je gezin, vrienden, familie of hobby’s’. Dit programma zorgt voor een zeer prettige en diepe ontspannende ervaring, maar zal de gebruiker in staat stellen om cognitieve gedachten bewust te verwerken en volledig \"aanwezig\" te zijn. Dit programma werkt in de Alpha hersengolf categorie en richt zich op een hersengolf frequentie ergens in het 10Hz bereik. De hersenen gaan in de frequentie van 10 Hz trillen en komen daarmee in de Alpha-frequentie. Alpha-frequentie in de hersenen zorgt voor een fysieke en mentale ontspanning, vermindert angstgevoelens, vergroot zelfvertrouwen en bevordert creativiteit. Dit programma is zeer geschikt is voor beginnende gebruikers. Het is ook niet genoeg om één keer te luisteren naar binaurale frequenties om blijvend resultaat te bereiken. Het is wetenschappelijk bewezen dat Binaural geluiden een waardevolle bijdrage leveren op verschillende levensgebieden, zoals je fysieke en mentale gesteldheid, werk, relatie, sociale contacten, creativiteit en prestaties. Het vraagt wel wat training en herhaling. Hoe vaker de hersenen worden getraind om een bepaalde frequentie aan te nemen, hoe krachtiger en duurzamer de werking wordt. Voor het bereiken van beste resultaat op lange termijn adviseren wij een kuur van ongeveer 6 tot 8 sessies. Vraag om een persoonlijke advies voor beste resultaat!",
          },
          {
            name: 'Welnamis Mindfulness',
            price: '€ 24,95',
            duration:
              `22 minuten — Droomachtige en diepe meditatie 'Hou meer tijd over voor mooie dingen in het leven door slimmer en creatiever te werken' Dit Welnamis-programma neemt je mee naar een staat waarbij je jouw bewuste geest "uitschakelt", maar je onderbewustzijn actief blijft. Dit produceert droomachtige meditatieve ervaringen die normaal worden ervaren bij een zeer diepe meditatie. Dit is een van onze populairste binaurale frequenties omdat cliënten vaak levendige en wonderbaarlijke ervaringen beleven. Dit programma werkt in de Theta hersengolf categorie en richt zich op een hersengolf frequentie in het 6Hz bereik. Theta is ook de naam van de hersengolven die je produceert als je diep ontspannen bent, maar nog niet slaapt; je bent onder-bewustzijn. Dit heeft direct impact op prestaties tijdens intensieve activiteiten zoals werk, sport en geven van presentatie. Dit heeft ook een prestaties bevorderende impact voor onder andere top sporters voor de continuïteit en behoud van top conditie en prestatie. Dit programma is ook zeer geschikt voor cliënten die vaak creatief bezig zijn of moeilijk in slaap komen. Theta golven zijn vaak aanwezig wanneer je creatief bezig bent of tijdens REM slaap, de fase tijdens slaap waarin je droomt. Je hebt deze slaap fase nodig om de gebeurtenissen van de dag te verwerken. Mensen die slecht slapen hebben dan ook problemen om ervaringen van de dag te verwerken. Het is wetenschappelijk bewezen dat Theta-frequentie zorgt voor een diepe ontspanning, meditatieve staat, verhoogde creativiteit (ideeën, associaties) en scherpe focus. Het is ook niet genoeg om één keer te luisteren om blijvend resultaat te bereiken. Het vraagt wel wat training. Hoe vaker de hersenen worden getraind om een bepaalde frequentie aan te nemen, hoe krachtiger en duurzamer de werking wordt. Voor het bereiken van beste resultaat op lange termijn adviseren wij een kuur van ongeveer 6 tot 8 sessies. Vraag om een persoonlijke advies voor beste resultaat!`,
          },
          {
            name: 'Welnamis PowerNap',
            price: '€ 24,95',
            duration:
              `22 minuten — Helend & Regeneratief…'Je bent weer herboren na een diepe slaap zonder te dromen'. Dit programma bevordert diepe rust en meditatie op zeer diep niveau. In de huidige drukke wereld hebben heel veel mensen niet of nauwelijks voldoende nachtrust (Delta-hersengolven) gedurende hele nacht slapen. Het Delta-niveau is de toestand waarin ons lichaam alleen tijdens diepe slaap komt. Mensen die al jaren mediteren, kunnen ook tijdens een meditatie het Delta-niveau bereiken. De frequentie van de Binaurale frequenties in combinatie met de overeenkomende trillingsfrequentie van de verwarmde waterkussens van onze Welnamis bank brengt de hersenen snel tot rust. Dit programma werkt in een zeer diep Theta niveau (4Hz bereik), en dipt in naar het Delta niveau (2-3Hz), waar zowel de bewuste als de onderbewuste geest "uitgeschakeld" zijn. Het delta niveau is de hersengolf toestand waar ons lichaam serotonine, melatonine en endorfine vrijgeeft die verantwoordelijk zijn voor gevoelens van welzijn. Het gebruik van dit programma kan een paar kostbare minuten in diepe delta niveau hersengolf patronen, die meer dan een volledige nachtrust gelijk kan zijn, aanzetten tot een gezonde fysieke en emotionele verjonging proces. Het is ook wetenschappelijk bewezen dat Delta-frequentie werkt regeneratief en helend en zorgt voor een diepe slaap. Dit programma is geschikt voor cliënten die een lange reis/ vlucht achter de rug hebben zonder voldoende slaap te hebben gehad, cliënten die last hebben van jetlag of juist chronisch last hebben van slapeloosheid. Wat wij beloven is een volledige nachtrust in 22 minuten. Een sessie van 22 minuten kan helpen voor eenmalige herstel maar als client last heeft van chronische slapeloosheid dan is een sessie niet genoeg om blijvend resultaat te boeken. Het vraagt wel wat training en herhaling. Hoe vaker de hersenen worden getraind om een bepaalde frequentie aan te nemen, hoe krachtiger en duurzamer de werking wordt. Voor het bereiken van beste resultaat op lange termijn adviseren wij een kuur van ongeveer 6 tot 8 sessies. Vraag om een persoonlijke advies voor beste resultaat!`,
          },
          {
            name: 'Welnamis Awareness',
            price: '€ 24,95',
            duration:
              `22 minuten — Waakzaamheid & Bewustzijn 'voel en geniet van het leven met volle overtuiging'. Bij deze frequentie is er veel mentale activiteit en een hoge staat van bewustzijn. Je bent zeer waakzaam en hebt een heldere waarneming. Het Awareness-programma van Welnamis verhoogd juist de hersengolfpatronen naar het Gamma niveau (40 Hz). In plaats van het verlagen van de hersengolf niveaus verhoogt dit programma de hersengolf niveaus naar ongeveer 40Hz, in het gamma bereik. Uit wetenschappelijke onderzoek is gebleken dat gamma hersengolven de cognitieve functie en het geheugen verbeteren, en er is zelfs aangetoond dat ze dementie en de ziekte van Alzheimer verminderen in klinische studies. Gamma golven zijn ook de hersengolven die geassocieerd worden met compassie en dankbaarheid. Ook spelen deze hersengolven een belangrijke rol bij de coördinatie tussen je zintuigen en je lichaam. Daarnaast gebeurt het aanleren van nieuwe dingen ook bij deze hersengolf-frequentie. Heb je een nieuwe baan of moet je studeren voor een examen dan moeten je Gamma hersengolffrequenties aan het werk. Gamma frequenties leveren op dat je beter gefocust blijft, dat je meer ideeën of creativiteit hebt, dat je alert bent en je aandacht niet verslapt. Ook handig voor als je bijvoorbeeld een schoolopdracht moet doen, of een deadline moet halen. Een sessie is goed genoeg om eenmalig te presteren maar voor een langdurig en blijvend resultaat is het belangrijk om de hersenen te trainen en de sessies te herhalen. Hoe vaker de hersenen worden getraind om een bepaalde frequentie aan te nemen, hoe krachtiger en duurzamer de werking wordt. Voor het bereiken van beste resultaat op lange termijn adviseren wij een kuur van ongeveer 6 tot 8 sessies. Vraag om een persoonlijke advies voor beste resultaat!`,
          },
          {
            name: 'I-Dome Triple DETOX Therapie (FIR/LIGHT/PLASMA)',
            price: '€ 29,95',
            duration:
              `40 minuten — Triple Detox Infrarood verlichting & lichttherapie Deze technologie stimuleert het metabolisme door middel van langegolf infraroodstralen via de MLX-koepel. Het extra plasma- en lichttherapieapparaat, gelegen in het bovenste deel, maakt zichtbare verjonging en ontgifting van de huid mogelijk vanaf het eerste gebruik. Voordelen: › Stressreductie› Ontgifting› Bevordert fysiekherstel› Verbetert de huidkwaliteit› Verbetert de slaapkwaliteit`,
          },
        ],
      },
    ],
  },
];
