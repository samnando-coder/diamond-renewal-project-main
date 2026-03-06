import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import Behandelingen from "./pages/Behandelingen";
import BehandelingDetail from "./pages/BehandelingDetail";
import Arrangementen from "./pages/Arrangementen";
import Contact from "./pages/Contact";
import UrbanWellness from "./pages/UrbanWellness";
import Producten from "./pages/Producten";
import Login from "./pages/Login";
import Aanmelden from "./pages/Aanmelden";
import Account from "./pages/Account";
import ShopAppShell from "./pages/shop/ShopAppShell";
import ShopHome from "./pages/shop/ShopHome";
import ShopCategory from "./pages/shop/ShopCategory";
import ShopSearch from "./pages/shop/ShopSearch";
import ShopCart from "./pages/shop/ShopCart";
import ShopCheckout from "./pages/shop/ShopCheckout";
import ShopCheckoutSuccess from "./pages/shop/ShopCheckoutSuccess";
import ShopProduct from "./pages/shop/ShopProduct";
import ShopNotFound from "./pages/shop/ShopNotFound";
import Afspraak from "./pages/Afspraak";
import OverOns from "./pages/OverOns";
import Giftcard from "./pages/Giftcard";
import Prijslijst from "./pages/Prijslijst";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Vacatures from "./pages/Vacatures";
import AlgemeneVoorwaarden from "./pages/AlgemeneVoorwaarden";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import Haar from "./pages/Haar";
import LegacyBehandelingenRedirect from "./pages/LegacyBehandelingenRedirect";
import LegacyRedirect from "./pages/LegacyRedirect";
import WenkbrauwenWimpers from "./pages/WenkbrauwenWimpers";
import Gezichtsbehandelingen from "./pages/Gezichtsbehandelingen";
import LEDLichttherapie from "./pages/LEDLichttherapie";
import { SalonizedWidgetProvider } from "@/components/salonized/SalonizedWidgetProvider";
import { ScrollToTop } from "@/components/routing/ScrollToTop";
import { initCloudinaryMapping } from "@/lib/cloudinaryMapping";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const queryClient = new QueryClient();

// Initialize Cloudinary mapping early (no-op, mapping is loaded synchronously)
initCloudinaryMapping().catch(() => {
  // Ignore errors - mapping is loaded synchronously anyway
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GoogleAnalytics />
          <ScrollToTop />
          <SalonizedWidgetProvider>
            <WhatsAppFloatingButton />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/behandelingen" element={<Behandelingen />} />
              <Route path="/behandelingen/gezichtsbehandelingen" element={<Gezichtsbehandelingen />} />
              <Route path="/behandelingen/led-lichttherapie" element={<LEDLichttherapie />} />
              <Route path="/behandelingen/:slug" element={<BehandelingDetail />} />
              <Route path="/behandelingen/*" element={<LegacyBehandelingenRedirect />} />
              <Route path="/haar" element={<Haar />} />
              <Route path="/wenkbrauwen-wimpers" element={<WenkbrauwenWimpers />} />
              <Route path="/arrangementen" element={<Arrangementen />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/urban-wellness" element={<UrbanWellness />} />
              <Route path="/producten" element={<Producten />} />
              {/* Legacy redirects for old product URLs - must be before /shop routes */}
              <Route path="/producten/:slug" element={<LegacyRedirect />} />
              <Route path="/product/:slug" element={<LegacyRedirect />} />
              <Route path="/webshop" element={<LegacyRedirect />} />
              <Route path="/webshop/:slug" element={<LegacyRedirect />} />
              <Route path="/winkel" element={<LegacyRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/aanmelden" element={<Aanmelden />} />
              <Route path="/account" element={<Account />} />
              <Route path="/shop" element={<ShopAppShell />}>
                <Route index element={<ShopHome />} />
                <Route path="c/:category" element={<ShopCategory />} />
                <Route path="search" element={<ShopSearch />} />
                <Route path="p/:id" element={<ShopProduct />} />
                <Route path="cart" element={<ShopCart />} />
                <Route path="checkout" element={<ShopCheckout />} />
                <Route path="checkout/success" element={<ShopCheckoutSuccess />} />
                <Route path="*" element={<ShopNotFound />} />
              </Route>
              <Route path="/afspraak" element={<Afspraak />} />
              <Route path="/over-ons" element={<OverOns />} />
              <Route path="/giftcard" element={<Giftcard />} />
              <Route path="/prijslijst" element={<Prijslijst />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/vacatures" element={<Vacatures />} />
              <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SalonizedWidgetProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
