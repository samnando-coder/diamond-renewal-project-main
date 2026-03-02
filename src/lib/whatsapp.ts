const WHATSAPP_NUMBER = '31702042635'; // +31 70 204 2635 (no + or 00 for wa.me)

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generalWhatsAppMessage() {
  return ['Hallo Blue Diamonds,', '', 'Ik heb een vraag en wil graag meer informatie / een afspraak maken.', '', 'Dankjewel!'].join(
    '\n',
  );
}

export function arrangementBookingWhatsAppMessage(arrangementTitle?: string) {
  const title = arrangementTitle?.trim() ? arrangementTitle.trim() : 'een arrangement';
  return ['Hallo Blue Diamonds,', '', `Ik wil graag het arrangement "${title}" boeken.`, '', 'Dankjewel!'].join('\n');
}

export function giftcardWhatsAppMessage() {
  return ['Hallo Blue Diamonds,', '', 'Ik wil graag een giftcard bestellen.', '', 'Dankjewel!'].join('\n');
}

