import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { OpeningHoursList } from '@/components/shared/OpeningHoursList';

const footerLinks = {
  menu: [
    { name: 'Home', href: '/' },
    { name: 'Over ons', href: '/over-ons' },
    { name: 'Giftcard', href: '/giftcard' },
    { name: 'Behandelingen', href: '/behandelingen' },
    { name: 'Prijslijst', href: '/prijslijst' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Vacatures', href: '/vacatures' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Algemene Voorwaarden', href: '/algemene-voorwaarden' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="font-heading text-3xl font-semibold mb-2">Blue Diamonds</h3>
            <p className="text-[10px] tracking-[0.3em] uppercase text-cream/70 mb-6">
              Health & Beauty Club
            </p>
            <p className="text-cream/80 text-sm leading-relaxed mb-6">
              Jouw premium bestemming voor beauty en wellness in het hart van Den Haag.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/BlueDiamondshealthbeautyclub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:bg-cream/10 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/bluediamondsclub/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:bg-cream/10 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Menu Links */}
          <div>
            <h4 className="font-heading text-lg mb-6">Menu</h4>
            <ul className="space-y-3">
              {footerLinks.menu.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-cream/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-1 shrink-0" />
                <span className="text-cream/80 text-sm">
                  Noordeinde 35<br />
                  2514 GC Den Haag
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a
                  href="tel:0031702042635"
                  className="text-cream/80 hover:text-accent transition-colors text-sm"
                >
                  070 - 20 42 635
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a
                  href="mailto:info@bluediamonds.club"
                  className="text-cream/80 hover:text-accent transition-colors text-sm"
                >
                  info@bluediamonds.club
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-heading text-lg mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Openingstijden
            </h4>
            <OpeningHoursList
              className="space-y-2"
              dayClassName="text-cream/70 whitespace-nowrap"
              hoursClassName="text-cream/90"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream/50 text-xs">
              © {new Date().getFullYear()} Blue Diamonds Health & Beauty Club. Alle rechten voorbehouden.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-cream/50 hover:text-cream/80 transition-colors text-xs"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
