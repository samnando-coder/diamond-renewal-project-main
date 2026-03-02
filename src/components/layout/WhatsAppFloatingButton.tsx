import { Button } from '@/components/ui/button';
import { buildWhatsAppLink, generalWhatsAppMessage } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export function WhatsAppFloatingButton() {
  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <Button asChild variant="gold" size="icon" className="h-12 w-12 rounded-full shadow-lg hover-glow">
        <a
          href={buildWhatsAppLink(generalWhatsAppMessage())}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open WhatsApp"
          title="WhatsApp"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
}

