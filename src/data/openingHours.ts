export type OpeningHour = {
  day: string;
  hours: string;
};

export const OPENING_HOURS: OpeningHour[] = [
  { day: 'Maandag', hours: '10:00 - 18:00' },
  { day: 'Dinsdag', hours: '10:00 - 18:00' },
  { day: 'Woensdag', hours: '10:00 - 18:00' },
  { day: 'Donderdag', hours: '09:00 - 20:00' },
  { day: 'Vrijdag', hours: '09:00 - 19:00' },
  { day: 'Zaterdag', hours: '09:00 - 19:00' },
  { day: 'Zondag', hours: '09:00 - 19:00' },
];

