import { SimpleContentPage } from './_SimpleContentPage';
import type { ReactNode } from 'react';

const TEAM_PHOTOS: Record<string, string> = {
  Babs: "/Blue Diamonds Foto's/Babs.jpg",
  Cathleen: "/Blue Diamonds Foto's/Cathleen.jpg",
  Valentina: "/Blue Diamonds Foto's/Valentina.jpg",
  Mihaela: "/Blue Diamonds Foto's/Mihaela.jpg",
  Nathaly: "/Blue Diamonds Foto's/Nathaly.jpg",
  Susanne: "/Blue Diamonds Foto's/Susanne.jpg",
  Ester: "/Blue Diamonds Foto's/Ester.jpg",
  Wan: "", // no photo found
  Rachel: "/Blue Diamonds Foto's/Rachel.jpg",
  Andrea: "/Blue Diamonds Foto's/Andrea.jpg",
  Emma: "", // no photo found
  Andreea: "", // no photo found
  Gaby: "", // no photo found
};

function TeamMember(props: { name: string; role: string; children: ReactNode }) {
  const src = TEAM_PHOTOS[props.name];
  const hasPhoto = typeof src === 'string' && src.trim().length > 0;

  return (
    <div
      className={[
        'grid gap-6',
        hasPhoto ? 'md:grid-cols-[260px_1fr] items-start' : 'grid-cols-1',
      ].join(' ')}
    >
      {hasPhoto ? (
        <div className="w-full">
          <div className="aspect-[3/4] rounded-sm overflow-hidden border border-border bg-muted">
            <img src={getCloudinaryImageUrl(src)} alt={props.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-heading text-2xl text-foreground">{props.name}</h3>
          <p className="text-body">{props.role}</p>
        </div>
        <div className="space-y-4">{props.children}</div>
      </div>
    </div>
  );
}

const OverOns = () => {
  return (
    <SimpleContentPage eyebrow="Over Ons" title="Blue Diamonds Health & Beauty Club">
      <div className="space-y-12">
        <div className="space-y-5">
          <p className="text-lead">
            Een High-End beauty &amp; wellness salon in hartje Den Haag
          </p>
          <h2 className="text-heading text-foreground">Over Ons</h2>
          <p className="text-body">
            Blue Diamonds Health &amp; Beauty Club, gelegen in het hart van Den Haag, biedt een luxe, high-end ervaring
            voor klanten. Stap binnen in onze beautysalon en de buitenwereld verdwijnt naar de achtergrond. Hier draait
            het om jou. Of je nu komt voor een gezichtsbehandelingen, ontharing of voor een voetbehandeling: onze experts
            luisteren naar al je wensen en zorgen dat jij je thuis voelt bij Blue Diamonds Health &amp; Beauty Club. Of
            nee bij ons voel je je béter dan thuis.
          </p>
        </div>

        <div className="space-y-5">
          <h2 className="text-heading text-foreground">Ons unieke concept &amp; een breed scala aan diensten</h2>
          <p className="text-body">
            Bij Blue Diamonds bieden wij een breed scala aan schoonheidsdiensten, van gezichtsbehandelingen tot ontharing
            en pedicure. Ons team bestaat uit enkele van de meest getalenteerde professionals in Den Haag die experts
            zijn in alle aspecten van schoonheidsverzorging, van huidverzorging tot het aanbrengen van make-up. Wij
            gebruiken alleen producten van de hoogste kwaliteit om onze klanten de best mogelijke resultaten te
            garanderen.
          </p>
        </div>

        <div className="space-y-5">
          <h2 className="text-heading text-foreground">Urban wellness in Den Haag</h2>
          <p className="text-body">
            Deze oase in het hart van de stad biedt alles wat u nodig hebt om te ontspannen, te verjongen en uw algehele
            welzijn te verbeteren. Naast onze schoonheidsbehandelingen beschikken wij ook over een aantal super
            efficiënte en geavanceerde wellness bedden voor het verbeteren van uw algehele gezondheid. Het beauty en
            wellness team van Blue Diamonds is gepassioneerd om mensen te helpen hun beste leven te leiden. Wij geloven
            dat urban wellness essentieel is voor stedelingen die gezond en gelukkig willen blijven. Er zijn veel
            voordelen verbonden aan het nemen van tijd voor uzelf en het focussen op uw welzijn:
          </p>
          <ul className="space-y-2 text-body">
            <li>– verbeterde geestelijke gezondheid</li>
            <li>– meer energie</li>
            <li>– betere slaap</li>
            <li>– minder stress</li>
            <li>– verbeterde huidgezondheid</li>
            <li>– en verbeterde conditie</li>
          </ul>
        </div>

        <div className="space-y-5">
          <h2 className="text-heading text-foreground">Een ontspannen sfeer</h2>
          <p className="text-body">
            Wanneer u Blue Diamonds binnenstapt, is het alsof u een andere wereld binnenstapt. Onze rustige sfeer zorgt
            ervoor dat u kunt ontspannen en genieten van uw tijd bij ons terwijl wij zorgen voor al uw
            schoonheidsbehoeften. Ons doel is dat elke gast er verfrist en op zijn best uitziet! Wij verstrekken ook
            gratis drankjes (van koffie, thee tot wijn en bubbels) tijdens elke bezoek, zodat u achterover kunt leunen
            en ontspannen terwijl wij onze magie doen.
          </p>
        </div>

        <div className="space-y-5">
          <h2 className="text-heading text-foreground">Wij nemen uw veiligheid serieus</h2>
          <p className="text-body">
            Bij Blue Diamonds is veiligheid altijd onze hoogste prioriteit. Wij zorgen ervoor dat elke dienst wordt
            uitgevoerd met strikte veiligheidsrichtlijnen om zowel onze klanten als onze medewerkers te beschermen. Al
            het gereedschap wordt na elk gebruik gesteriliseerd en alle oppervlakken worden gedurende de dag regelmatig
            gedesinfecteerd.
          </p>
        </div>

        <div className="space-y-5">
          <h2 className="text-heading text-foreground">Onvergetelijke ervaring</h2>
          <p className="text-body">
            Blue Diamonds Health &amp; Beauty Club in Den Haag biedt een ongeëvenaarde ervaring als het gaat om luxe
            schoonheidsbehandelingen. Of u nu een gezichtsbehandeling of een voetbehandeling nodig hebt, ons deskundige
            team zal ervoor zorgen dat u de hoogste kwaliteit service krijgt met de nadruk op veiligheid en comfort te
            allen tijde. Als u op zoek bent naar een onvergetelijke schoonheidservaring, kijk dan niet verder dan Blue
            Diamonds!
          </p>
        </div>

        <div className="space-y-8">
          <h2 className="text-heading text-foreground">Onze Diamanten</h2>

          <TeamMember name="Babs" role="Eigenaresse & Allround Beauty expert">
            <p className="text-body">
              Babs is een ondernemer die haar droom heeft waargemaakt. Ze is samen met haar dochter Cathleen de trotse
              eigenaresse van de grootste en meest luxe health en beauty salon in Den Haag.
            </p>
            <p className="text-body">
              Babs begon haar carrière als stewardess, maar later werkte ze in de financiële dienstverlening en daarna
              in mode en beauty. Ze heeft vele jaren ervaring in het beauty branche en begon haar carrière als
              schoonheidsspecialiste in een klein salonnetje. Ze heeft haar passie voor beauty en fashion gebruikt om
              haar salon te creëren.
            </p>
            <p className="text-body">
              Babs is een vriendelijke, inspirerende en betrokken persoon. Babs staat bekend om haar professionele en
              vriendelijke service, en biedt haar klanten een rustige en comfortabele omgeving om te genieten van een
              van haar vele behandelingen. Haar salon is een gezellige en luxe plek waar klanten zich thuis voelen.
            </p>
          </TeamMember>

          <TeamMember name="Cathleen" role="Schoonheidsspecialiste - PMU expert & lashes">
            <p className="text-body">
              Cathleen is een jonge ambitieuze ondernemer die samen met haar moeder de grootste en meest luxe health en
              beauty salon in Den Haag runt.
            </p>
            <p className="text-body">
              Cathleen heeft altijd in de beauty branche gewerkt en is een gepassioneerde professional. Zij is jaren
              geleden samen met haar moeder Babs begonnen met een klein beauty salon, maar hebben het samen uitgebouwd
              tot een grote, volledig uitgeruste salon met modernste faciliteiten.
            </p>
            <p className="text-body">
              Cathleen is o.a. gespecialiseerd in permanent make-up, huidverzorging, biab, wenkbrauwen en wimpers. Ze
              heeft een grote klantenkring opgebouwd en kan zelfs met kleinste aanpassingen een verbluffende
              transformatie realiseren.
            </p>
            <p className="text-body">
              Cathleen is een spontane, zorgzame en vrolijke persoon. In haar vrije tijd houdt ze ervan om te shoppen,
              muziek te luisteren en piano te spelen. Ze is een creatieve duizendpoot, die altijd op zoek is naar nieuwe
              uitdagingen.
            </p>
          </TeamMember>

          <TeamMember name="Valentina" role="Schoonheidsspecialiste - Manicure & Pedicure expert">
            <p className="text-body">
              Valentina is een professionele schoonheidsspecialiste uit Italië. Ze heeft haar eigen salon gehad in Italië
              waar ze gespecialiseerd was in het aanbieden van verschillende schoonheidsbehandelingen, zoals
              gezichtsbehandelingen, manicure en pedicure, waxen en make–up. Zij is vooral gespecialiseerd in manicure
              en (medisch) pedicure, maar heeft ook een uitgebreide kennis van huidverbetering, waxen, haarstylen en
              make–up. Zij is een perfectionist die altijd op zoek is naar manieren om haar klanten een betere service
              te bieden.
            </p>
            <p className="text-body">
              Valentina is een gepassioneerde Italiaanse vrouw die na jaren in Italië te hebben gewoond, verhuisde een
              jaar geleden naar Nederland vanwege het werk van haar man als chef-kok. Ze is zeer geschikt voor onze
              Italiaanse expats aangezien zij vloeiend Italiaans spreekt.
            </p>
            <p className="text-body">
              Valentina is een heel meedenkend, lief en grappig persoon. In haar vrije tijd houdt ze ervan te sporten om
              fit en gezond te blijven. Ze heeft ook een passie voor koken en geniet ervan om nieuwe gerechten te maken.
            </p>
          </TeamMember>

          <TeamMember name="Mihaela" role="Schoonheidsspecialiste - Massage expert">
            <p className="text-body">
              Mihaela is onze ervaren Roemeense masseuse en een ware professional op het gebied van diverse
              massagetechnieken. Door intensieve training beheerst zij alle soorten massages, maar haar specialiteit
              ligt bij krachtige massages zoals de sport– en bindweefselmassage. Dankzij haar sterke armen kan zij de
              spieren effectief activeren en verlichten waar nodig.
            </p>
            <p className="text-body">
              Dankzij Mihaela‘s kennis en positieve energie kan zij specifieke doelen bereiken en klanten helpen bij
              pijnbestrijding, herstel en het verbeteren van hun algehele welzijn. Haar positieve instelling en glimlach
              zijn haar kracht, waardoor zij met vertrouwen en vol energie in het leven staat en haar werk met passie
              uitvoert.
            </p>
          </TeamMember>

          <TeamMember name="Nathaly" role="Schoonheidsspecialist - Manicure & Pedicure">
            <p className="text-body">
              Nathaly is onze gepassioneerde schoonheidsspecialiste uit Venezuela. Met haar specialisaties in manicure,
              pedicure, make-up en huidverzorging zorgt ze ervoor dat haar klanten er prachtig uitzien en zich goed
              voelen.
            </p>
            <p className="text-body">
              Nathaly is een sociale en ambitieuze vrouw die voldoening haalt uit het geven van een positieve boost aan
              anderen. Ze is trots wanneer ze haar klanten ziet stralen na haar professionele behandeling van hun nagels,
              make-up of huid. Ze streeft naar perfectie en blijft up-to-date over de laatste trends en technieken om
              haar klanten de beste service te kunnen bieden.
            </p>
            <p className="text-body">
              Naast haar werk, heeft Nathaly een liefde voor kunst en creativiteit. In haar vrije tijd schildert ze graag
              of luistert ze naar muziek. Ze houdt ook van wandelen en ontspannen op het strand. Regelmatig bezoekt ze
              de sportschool om fit en actief te blijven. Nathaly staat bekend om haar spontane persoonlijkheid en haar
              altijd aanwezige vrolijke humeur.
            </p>
          </TeamMember>

          <TeamMember name="Susanne" role="Schoonheidsspecialist - Massages">
            <p className="text-body">Start 1 jan 2024. Info volgt!</p>
          </TeamMember>

          <TeamMember name="Gaby" role="Schoonheidsspecialist - Manicure & Pedicure">
            <p className="text-body">Start 1 okt 2023. Info volgt!</p>
          </TeamMember>

          <TeamMember name="Ester" role="Masseuse - Massage expert">
            <p className="text-body">
              Onze ervaren masseuse Ester is van Nederlandse afkomst en een echte professional op het gebied van diverse
              massage technieken. Ze heeft uitgebreide trainingen gevolgd en is daardoor bedreven in alle soorten
              massages. Haar specialiteit ligt echter bij het geven van holistische en relaxation massages. Met haar
              rustige werkwijze weet ze zelfs de meest gestreste lichamen weer tot rust te brengen.
            </p>
            <p className="text-body">
              Naast haar spirituele achtergrond is Ester ook een leuke collega. Ze toont veel initiatief en denkt altijd
              mee voor verbeteringen. Met haar positieve instelling staat ze altijd klaar met een glimlach en voegt ze
              een extra spirituele dimensie toe aan ons team.
            </p>
          </TeamMember>

          <TeamMember name="Wan" role="Masseuse / Thaise massage expert">
            <p className="text-body">
              Onze Thaise masseuse, Wan heeft al meer dan 10 jaar ervaring in het vak massage. Zij heeft de afgelopen
              jaren op verschillende plekken gewerkt, en is naar ons toe gekomen met veel kennis en bagage. Wan heeft
              veel verschillende massage technieken geleerd, maar is vooral gespecialiseerd in de Thaise massage.
            </p>
            <p className="text-body">
              Door de jaren heen heeft ze veel klanten en tevredenheid gegenereerd. Ze heeft een scherp oog voor detail,
              een goede kennis van menselijk lichaam en een diepe kennis van massage technieken. Dat maakt dat ons team
              er als geen ander op vooruitgaat als het gaat om massage technieken. Wij zijn dan ook bijzonder blij dat
              Masseuse Wan een deel uitmaakt van ons team.
            </p>
          </TeamMember>

          <TeamMember name="Rachel" role="Schoonheidsspecialiste - gezicht & lichaam expert">
            <p className="text-body">
              Rachel is al van jonge leeftijd gepassioneerd door beauty en wellness. Ze heeft verschillende opleidingen
              gevolgd om meer te weten te komen over schoonheid en gezondheid, zoals cosmetica, gezichtsverzorging en
              wellness behandelingen. Rachel is een zeer geliefde schoonheidsspecialist bij haar klanten. Ze heeft een
              grote kennis van verschillende producten en behandeltechnieken. Ze deelt ook haar kennis en ervaringen
              graag met haar klanten en collega’s.
            </p>
            <p className="text-body">
              Ze is gespecialiseerd in verschillende gezichts- en lichaamsbehandelingen. Met haar deskundige kennis weet
              ze precies wat haar klanten nodig hebben om volledig te ontspannen en er zo goed mogelijk uit te zien. Ze
              vindt het heerlijk om klanten te zien lachen en stralen na een behandeling.
            </p>
            <p className="text-body">
              Rachel is een vrolijke, liefhebbende persoon die altijd lacht. In haar vrije tijd houdt ze ervan om met
              haar vriendinnen op stap te gaan, maar ook houdt ze ervan om naar warme landen te reizen om te genieten van
              de zon en de cultuur.
            </p>
          </TeamMember>

          <TeamMember name="Andrea" role="Schoonheidsspecialiste - massage expert">
            <p className="text-body">
              Andrea is onze massage therapist met spaanse roots en ze is gespecialiseerd in het geven van een scala aan
              massages. Ze is geschoold in alle vormen van massages, maar haar favoriete massages zijn sportmassages en
              zwangerschapsmassages. Met sportmassages helpt ze mensen spieren te ontspannen en te versterken, terwijl
              zwangerschapsmassages worden gebruikt om te helpen om te ontspannen en om het lichaam voor te bereiden op
              de zwangerschap.
            </p>
            <p className="text-body">
              Ze is gepassioneerd over het helpen van haar cliënten bij het verlichten van stress, pijn of spanning.
              Andrea staat erom bekend dat ze een warm en comfortabel omgeving creëert voor haar cliënten waardoor ze
              zich op hun gemak voelen. Met haar kennis en vaardigheden kan ze specifieke doelen bereiken en klanten
              helpen met pijnbestrijding, herstel en het verbeteren van de algehele gezondheid.
            </p>
            <p className="text-body">
              Andrea is een zeer sociale, energieke en vriendelijke persoon. Zij is een sportfanaat die graag
              verschillende sporten beoefent. Haar favoriete sport is fitness, waar ze veel tijd aan besteedt.
            </p>
          </TeamMember>

          <TeamMember name="Emma" role="Schoonheidsspecialiste">
            <p className="text-body">
              Emma is onze nieuwe schoonheidsspecialiste bij de salon. Ze is een gedreven en talentvolle professional
              met een passie voor schoonheidsverzorging. Ze heeft een uitgebreide ervaring met alle soorten
              schoonheidsbehandelingen en technieken. Ze neemt de tijd om met de klant te praten, luistert aandachtig en
              bespreekt zorgvuldig de beste opties voor hen. Vervolgens gaat ze naar werk en combineert haar kennis met
              creativiteit om de meest natuurlijke, stralende uitstraling te bereiken.
            </p>
            <p className="text-body">
              Naast haar vakkennis is Emma ook vriendelijk en respectvol. Ze is altijd vriendelijk en behulpzaam en zal
              elke klant met open armen verwelkomen.
            </p>
          </TeamMember>

          <TeamMember name="Andreea" role="Nail artist">
            <p className="text-body">Start 1 december 2023</p>
          </TeamMember>
        </div>

        <div className="space-y-4">
          <h2 className="text-heading text-foreground">Onze club</h2>
          <p className="text-body">Blue Diamonds Health &amp; Beauty Club</p>
        </div>
      </div>
    </SimpleContentPage>
  );
};

export default OverOns;

