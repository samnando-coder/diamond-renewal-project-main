import { Navigate } from "react-router-dom";

const Producten = () => {
  // Keep /producten as a backwards-compatible entry-point.
  // The actual webshop experience now lives under /shop/* (Home/PLP/PDP/Search/Cart/Checkout).
  return <Navigate to="/shop" replace />;
};

export default Producten;
