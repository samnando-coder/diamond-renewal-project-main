import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Phone, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useSalonizedWidget } from '@/components/salonized/SalonizedWidgetProvider';
import { BRAND } from '@/lib/brand';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Behandelingen', href: '/behandelingen' },
  { name: 'Arrangementen', href: '/arrangementen' },
  { name: 'Webshop', href: '/shop' },
  { name: 'Urban Wellness', href: '/urban-wellness' },
  { name: 'Giftcard', href: '/giftcard' },
  { name: 'Contact', href: '/contact' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoBroken, setIsLogoBroken] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { openWidget } = useSalonizedWidget();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-8'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center">
          {/* Left: Logo + Desktop Navigation (closer together) */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/" className="flex items-center">
              {!isLogoBroken ? (
                <img
                  src={BRAND.logoSrc}
                  alt={`${BRAND.name} logo`}
                  className="h-20 md:h-24 lg:h-28 w-auto object-contain"
                  loading="eager"
                  decoding="async"
                  onError={() => setIsLogoBroken(true)}
                />
              ) : (
                <div className="flex items-center leading-none">
                  <span
                    className={`font-heading text-2xl md:text-3xl font-semibold tracking-wide ${
                      isScrolled ? 'text-primary' : 'text-cream'
                    }`}
                  >
                    Blue Diamonds
                  </span>
                </div>
              )}
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`nav-link ${isScrolled ? 'text-foreground' : 'nav-link-light'}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex">
              <Button
                type="button"
                variant="gold"
                className="text-xs tracking-wider uppercase px-6"
                onClick={() => openWidget()}
              >
                <Phone className="w-4 h-4" />
                Afspraak
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`hidden md:flex p-2 rounded transition-colors ${
                    isScrolled ? 'hover:bg-muted' : 'hover:bg-white/10'
                  }`}
                  aria-label="Account"
                >
                  <User className={`w-5 h-5 ${isScrolled ? 'text-foreground' : 'text-cream'}`} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem disabled className="opacity-80">
                      {user?.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account">Mijn account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Uitloggen
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Inloggen</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/aanmelden">Aanmelden</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/producten"
              className={`hidden md:flex p-2 rounded transition-colors ${
                isScrolled ? 'hover:bg-muted' : 'hover:bg-white/10'
              }`}
              aria-label="Webshop"
            >
              <ShoppingBag className={`w-5 h-5 ${isScrolled ? 'text-foreground' : 'text-cream'}`} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded transition-colors ${
                isScrolled ? 'hover:bg-muted' : 'hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-cream'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-cream'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg animate-fade-in">
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="nav-link text-foreground py-2 border-b border-border/50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4">
                <Button
                  type="button"
                  className="w-full bg-accent text-accent-foreground hover:bg-gold-dark text-xs tracking-wider uppercase"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openWidget();
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Afspraak Maken
                </Button>
              </div>

              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-xs tracking-wider uppercase">
                      Inloggen
                    </Button>
                  </Link>
                  <Link to="/aanmelden" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-navy-light text-xs tracking-wider uppercase">
                      Aanmelden
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full mt-2 text-xs tracking-wider uppercase"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Uitloggen
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
