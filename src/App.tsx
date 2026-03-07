import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { SalonizedWidgetProvider } from "@/components/salonized/SalonizedWidgetProvider";
import { ScrollToTop } from "@/components/routing/ScrollToTop";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { initCloudinaryMapping } from "@/lib/cloudinaryMapping";

// Critical components - load immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all other pages for better code splitting
const Behandelingen = lazy(() => import("./pages/Behandelingen"));
const BehandelingDetail = lazy(() => import("./pages/BehandelingDetail"));
const Arrangementen = lazy(() => import("./pages/Arrangementen"));
const Contact = lazy(() => import("./pages/Contact"));
const UrbanWellness = lazy(() => import("./pages/UrbanWellness"));
const Producten = lazy(() => import("./pages/Producten"));
const Login = lazy(() => import("./pages/Login"));
const Aanmelden = lazy(() => import("./pages/Aanmelden"));
const Account = lazy(() => import("./pages/Account"));
const ShopAppShell = lazy(() => import("./pages/shop/ShopAppShell"));
const ShopHome = lazy(() => import("./pages/shop/ShopHome"));
const ShopCategory = lazy(() => import("./pages/shop/ShopCategory"));
const ShopSearch = lazy(() => import("./pages/shop/ShopSearch"));
const ShopCart = lazy(() => import("./pages/shop/ShopCart"));
const ShopCheckout = lazy(() => import("./pages/shop/ShopCheckout"));
const ShopCheckoutSuccess = lazy(() => import("./pages/shop/ShopCheckoutSuccess"));
const ShopProduct = lazy(() => import("./pages/shop/ShopProduct"));
const ShopNotFound = lazy(() => import("./pages/shop/ShopNotFound"));
const ShopLanding = lazy(() => import("./pages/shop/ShopLanding"));
const Afspraak = lazy(() => import("./pages/Afspraak"));
const OverOns = lazy(() => import("./pages/OverOns"));
const Giftcard = lazy(() => import("./pages/Giftcard"));
const Prijslijst = lazy(() => import("./pages/Prijslijst"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Vacatures = lazy(() => import("./pages/Vacatures"));
const AlgemeneVoorwaarden = lazy(() => import("./pages/AlgemeneVoorwaarden"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Haar = lazy(() => import("./pages/Haar"));
const LegacyBehandelingenRedirect = lazy(() => import("./pages/LegacyBehandelingenRedirect"));
const LegacyRedirect = lazy(() => import("./pages/LegacyRedirect"));
const WenkbrauwenWimpers = lazy(() => import("./pages/WenkbrauwenWimpers"));
const Gezichtsbehandelingen = lazy(() => import("./pages/Gezichtsbehandelingen"));
const LEDLichttherapie = lazy(() => import("./pages/LEDLichttherapie"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
  </div>
);

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
            <Suspense fallback={<PageLoader />}>
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
                  <Route index element={<ShopLanding />} />
                  <Route path="home" element={<ShopHome />} />
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
            </Suspense>
          </SalonizedWidgetProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
