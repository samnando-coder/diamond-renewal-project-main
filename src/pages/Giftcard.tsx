import { SimpleContentPage } from './_SimpleContentPage';
import { Button } from '@/components/ui/button';
import { SALONIZED_VOUCHER_URL, useSalonizedWidget } from '@/components/salonized/SalonizedWidgetProvider';

const Giftcard = () => {
  const { openWidget } = useSalonizedWidget();
  return (
    <SimpleContentPage eyebrow="Shop" title="Giftcard">
      <div className="space-y-10">
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <iframe
            title="Salonized giftcard widget"
            src={SALONIZED_VOUCHER_URL}
            style={{ border: 0, width: '100%', height: '80vh' }}
            loading="lazy"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-card border border-border rounded-sm">
            <h2 className="text-heading text-foreground mb-3">Hoe werkt het?</h2>
            <ol className="space-y-2 text-body list-decimal pl-5">
              <li>Kies een bedrag (of een arrangement) voor de giftcard.</li>
              <li>Vul je voorkeuren in (naam, boodschap, datum).</li>
              <li>Wij bevestigen en sturen je de betaal- en afhaal/leveropties.</li>
            </ol>
          </div>
          <div className="p-6 bg-card border border-border rounded-sm">
            <h2 className="text-heading text-foreground mb-3">Wat komt hier straks te staan?</h2>
            <ul className="space-y-2 text-body list-disc pl-5">
              <li>Beschikbare bedragen / opties</li>
              <li>Geldigheid & voorwaarden</li>
              <li>Levertijd (digitaal/fysiek) en afhalen</li>
              <li>Veelgestelde vragen</li>
            </ul>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-sm">
          <h2 className="text-heading text-foreground mb-3">Cadeaubon</h2>
          <p className="text-body mb-6">
            Koop direct een cadeaubon via onze widget.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button type="button" variant="gold" className="tracking-wider uppercase" onClick={() => openWidget('voucher')}>
                Cadeaubon kopen (pop-up)
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted rounded-sm">
          <p className="text-small">
            Placeholder: zodra jij de definitieve teksten/voorwaarden aanlevert, zet ik ze hier netjes om naar de juiste secties.
          </p>
        </div>
      </div>
    </SimpleContentPage>
  );
};

export default Giftcard;

