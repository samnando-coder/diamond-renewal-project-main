import { OPENING_HOURS, type OpeningHour } from '@/data/openingHours';
import { cn } from '@/lib/utils';

type Props = {
  items?: OpeningHour[];
  className?: string;
  dayClassName?: string;
  hoursClassName?: string;
};

export function OpeningHoursList({
  items = OPENING_HOURS,
  className,
  dayClassName,
  hoursClassName,
}: Props) {
  return (
    <ul className={cn('space-y-2', className)}>
      {items.map((item) => (
        <li
          key={item.day}
          className="grid grid-cols-[1fr_auto] items-center gap-x-6 text-sm leading-6"
        >
          <span className={cn('min-w-0', dayClassName)}>{item.day}</span>
          <span
            className={cn(
              'whitespace-nowrap text-right tabular-nums',
              hoursClassName
            )}
          >
            {item.hours}
          </span>
        </li>
      ))}
    </ul>
  );
}

