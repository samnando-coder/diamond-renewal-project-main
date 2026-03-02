import { Link } from 'react-router-dom';
import { SimpleContentPage } from './_SimpleContentPage';
import { Button } from '@/components/ui/button';
import { buildWhatsAppLink, generalWhatsAppMessage } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { PRICE_LIST } from '@/data/priceList';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Prijslijst = () => {
  return (
    <SimpleContentPage eyebrow="Info" title="Prijslijst">
      <div className="space-y-10">
        <p className="text-body">Prijzen Blue Diamonds Health &amp; Beauty Club Den Haag.</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="gold" className="tracking-wider uppercase">
            <a href={buildWhatsAppLink(generalWhatsAppMessage())} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="w-4 h-4" />
              Vraag prijs via WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="tracking-wider uppercase">
            <Link to="/contact">Contactformulier</Link>
          </Button>
        </div>

        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <Accordion type="multiple" className="w-full">
            {PRICE_LIST.map((cat) => (
              <AccordionItem key={cat.id} value={cat.id}>
                <AccordionTrigger className="px-6">{cat.title}</AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6">
                    {cat.sections.map((sec) => (
                      <div key={sec.title} className="p-5 bg-muted rounded-sm">
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">{sec.title}</p>
                        <div className="space-y-3">
                          {sec.items.map((it) => (
                            <div
                              key={`${sec.title}:${it.name}`}
                              className="flex items-start justify-between gap-6 flex-wrap"
                            >
                              <div className="min-w-[240px]">
                                <p className="text-sm text-foreground leading-relaxed">{it.name}</p>
                                {it.duration ? (
                                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed whitespace-pre-line">{it.duration}</p>
                                ) : null}
                                {it.note ? <p className="text-xs text-muted-foreground mt-1">{it.note}</p> : null}
                              </div>
                              <p className="text-sm font-semibold text-accent">{it.price}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </SimpleContentPage>
  );
};

export default Prijslijst;

