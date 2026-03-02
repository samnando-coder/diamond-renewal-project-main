import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, MapPin } from 'lucide-react';
import { SimpleContentPage } from './_SimpleContentPage';
import { Button } from '@/components/ui/button';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

const VACATURES = [
  {
    id: 'haarstylist-kapster',
    title: 'Top Haarstylist / Kapster',
    categories: ['Haarstyliste', 'Kapster'],
    location: 'Den Haag, Noordeinde 35 Den Haag, Randstad',
    type: 'In overleg',
  },
  {
    id: 'manicure-pedicure',
    title: 'Manicure & Pedicure',
    categories: ['hand en voet specialist', 'manicure', 'nagel', 'pedicure'],
    location: 'Noordeinde 35 Den Haag',
    type: 'In overleg',
  },
  {
    id: 'massage-therapist',
    title: 'Massage therapist',
    categories: ['massage therapist', 'Masseuse'],
    location: 'Noordeinde 35 Den Haag',
    type: 'In overleg',
  },
  {
    id: 'allround-schoonheidsspecialiste',
    title: 'Allround schoonheidsspecialiste',
    categories: ['allround schoonheidsspecialiste', 'beauty specialist', 'health & beauty', 'schoonheidssalon'],
    location: 'Noordeinde 35 Den Haag',
    type: 'In overleg',
  },
] as const;

function buildApplicationMessage(jobTitle: string): string {
  return `Hallo, ik ben geïnteresseerd in de vacature: ${jobTitle}. Ik zou graag meer informatie willen ontvangen.`;
}

const Vacatures = () => {
  return (
    <SimpleContentPage eyebrow="Werken bij" title="Vacatures">
      <div className="space-y-10">
        <p className="text-lead-dark">
          Bij Blue Diamonds Health & Beauty Club zijn we altijd op zoek naar getalenteerde professionals die passie hebben voor
          beauty en wellness. Ontdek onze openstaande vacatures en word onderdeel van ons team in Den Haag.
        </p>

        <div className="grid gap-6">
          {VACATURES.map((job) => (
            <div
              key={job.id}
              className="bg-card border border-border rounded-sm p-6 lg:p-8 hover:shadow-xl transition-all duration-500 hover-glow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {job.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="text-xs tracking-[0.2em] uppercase text-muted-foreground bg-muted px-3 py-1 rounded-sm"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-heading text-2xl lg:text-3xl text-foreground mb-3">{job.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <span className="text-accent font-medium">{job.type}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    asChild
                    variant="gold"
                    className="tracking-wider uppercase whitespace-nowrap"
                  >
                    <a
                      href={buildWhatsAppLink(buildApplicationMessage(job.title))}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      Simpel Solliciteren
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-card border border-border rounded-sm">
            <h2 className="text-heading text-foreground mb-3">Wat wij bieden</h2>
            <ul className="space-y-2 text-body list-disc pl-5">
              <li>Professionele werkomgeving in het hart van Den Haag</li>
              <li>Groei en training mogelijkheden</li>
              <li>Gezellig en ondersteunend team</li>
              <li>Moderne faciliteiten en hoogwaardige producten</li>
              <li>Flexibele werktijden in overleg</li>
            </ul>
          </div>
          <div className="p-6 bg-card border border-border rounded-sm">
            <h2 className="text-heading text-foreground mb-3">Interesse?</h2>
            <p className="text-body mb-5">
              Stuur ons een bericht met je naam, functie waar je interesse in hebt en je beschikbaarheid. We nemen zo snel mogelijk
              contact met je op.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="gold" className="tracking-wider uppercase">
                <a href={buildWhatsAppLink('Hallo, ik ben geïnteresseerd in werken bij Blue Diamonds.')} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="w-4 h-4" />
                  WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="tracking-wider uppercase">
                <Link to="/contact">
                  <Briefcase className="w-4 h-4" />
                  Contact
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SimpleContentPage>
  );
};

export default Vacatures;

