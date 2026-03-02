import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const SALONIZED_BOOKING_URL =
  'https://widget.salonized.com/widget?color=%23cea527&language=nl&company=kR28FWHdJXS2PRP38KMUSALg';

export const SALONIZED_VOUCHER_URL =
  'https://widget.salonized.com/widget?color=%23cea527&language=nl&company=kR28FWHdJXS2PRP38KMUSALg&voucher=true';

type WidgetType = 'booking' | 'voucher';

type Ctx = {
  /**
   * Open the Salonized widget.
   * - `type`: booking (default) or voucher.
   * - `services`: optional preselected service variation IDs, forwarded as `services[]` query params.
   */
  openWidget: (type?: WidgetType, services?: Array<number | string>) => void;
  closeWidget: () => void;
};

const SalonizedWidgetContext = createContext<Ctx | null>(null);

export function useSalonizedWidget() {
  const ctx = useContext(SalonizedWidgetContext);
  if (!ctx) throw new Error('useSalonizedWidget must be used within SalonizedWidgetProvider');
  return ctx;
}

export function SalonizedWidgetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [widgetType, setWidgetType] = useState<WidgetType>('booking');
  const [services, setServices] = useState<Array<number | string>>([]);

  const openWidget = useCallback((type: WidgetType = 'booking', svc: Array<number | string> = []) => {
    setWidgetType(type);
    setServices(svc);
    setOpen(true);
  }, []);
  const closeWidget = useCallback(() => setOpen(false), []);

  const value = useMemo<Ctx>(() => ({ openWidget, closeWidget }), [openWidget, closeWidget]);

  const widgetUrlBase = widgetType === 'voucher' ? SALONIZED_VOUCHER_URL : SALONIZED_BOOKING_URL;
  const widgetUrl = useMemo(() => {
    const u = new URL(widgetUrlBase);
    for (const s of services) u.searchParams.append('services[]', String(s));
    return u.toString();
  }, [widgetUrlBase, services]);
  const widgetTitle = widgetType === 'voucher' ? 'Cadeaubon bestellen' : 'Afspraak inplannen';

  return (
    <SalonizedWidgetContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pr-14 border-b">
            <DialogTitle>{widgetTitle}</DialogTitle>
          </DialogHeader>
          <div className="h-[calc(85vh-73px)]">
            <iframe
              title={widgetTitle}
              src={widgetUrl}
              style={{ border: 0, width: '100%', height: '100%' }}
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>
    </SalonizedWidgetContext.Provider>
  );
}

