"use client";

import { useEffect } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReviewsProvider } from "@/contexts/ReviewsContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { OrdersProvider } from "@/contexts/OrdersContext";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <div className="antialiased">
      <AuthProvider>
        <OrdersProvider>
          <ReviewsProvider>
            <WishlistProvider>
              <ComparisonProvider>
                <CartProvider>
                  {children}
                </CartProvider>
              </ComparisonProvider>
            </WishlistProvider>
          </ReviewsProvider>
        </OrdersProvider>
      </AuthProvider>
    </div>
  );
}
