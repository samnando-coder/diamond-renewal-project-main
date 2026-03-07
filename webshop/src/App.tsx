import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ShopAppShell from "./pages/ShopAppShell";
import ShopHome from "./pages/ShopHome";
import ShopCategory from "./pages/ShopCategory";
import ShopSearch from "./pages/ShopSearch";
import ShopCart from "./pages/ShopCart";
import ShopCheckout from "./pages/ShopCheckout";
import ShopCheckoutSuccess from "./pages/ShopCheckoutSuccess";
import ShopProduct from "./pages/ShopProduct";
import ShopNotFound from "./pages/ShopNotFound";
import ShopLanding from "./pages/ShopLanding";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ScrollToTop } from "@/components/routing/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GoogleAnalytics />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<ShopAppShell />}>
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
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
