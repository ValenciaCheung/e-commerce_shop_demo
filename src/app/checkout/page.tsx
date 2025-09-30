"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrdersContext";
import { ShippingAddress, PaymentMethod } from "@/lib/types";
import Header from "@/components/Header";
import BannerNotification, {
  useBannerNotification,
} from "@/components/BannerNotification";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Truck,
  ShieldCheck,
  Loader2,
  User,
  ShoppingCart,
} from "lucide-react";

type CheckoutStep = "shipping" | "payment" | "review" | "confirmation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { createOrder, calculateTotals, isLoading, currentOrder } = useOrders();
  const { notification, showError, hideNotification } = useBannerNotification();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
  });
  const [billingAddress, setBillingAddress] = useState<ShippingAddress>({
    ...shippingAddress,
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "card",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nameOnCard: "",
  });
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscountCode, setAppliedDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState(""); // Success or error message for discount code
  const [discountMessageType, setDiscountMessageType] = useState<"success" | "error" | "">(""); // Message type
  const [orderTotals, setOrderTotals] = useState(calculateTotals(items));



  // Remove the useEffect that opens auth modal to prevent conflicts with conditional rendering
  // The page already handles unauthenticated users with conditional rendering below

  useEffect(() => {
    setOrderTotals(
      calculateTotals(items, shippingAddress, appliedDiscountCode)
    );
  }, [items, shippingAddress, appliedDiscountCode, calculateTotals]);

  useEffect(() => {
    if (sameAsBilling) {
      setBillingAddress({ ...shippingAddress });
    }
  }, [shippingAddress, sameAsBilling]);

  const steps: { key: CheckoutStep; title: string; icon: React.ReactNode }[] = [
    { key: "shipping", title: "Shipping", icon: <Truck size={20} /> },
    { key: "payment", title: "Payment", icon: <CreditCard size={20} /> },
    { key: "review", title: "Review", icon: <ShieldCheck size={20} /> },
    { key: "confirmation", title: "Confirmation", icon: <Check size={20} /> },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  const validateShipping = () => {
    return (
      shippingAddress.firstName &&
      shippingAddress.lastName &&
      shippingAddress.address1 &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.zipCode
    );
  };

  const validatePayment = () => {
    if (paymentMethod.type === "cash") {
      return true; // Cash on delivery doesn't require card details
    }
    return (
      paymentMethod.cardNumber &&
      paymentMethod.expiryMonth &&
      paymentMethod.expiryYear &&
      paymentMethod.cvv &&
      paymentMethod.nameOnCard
    );
  };

  const handleNext = () => {
    if (currentStep === "shipping" && !validateShipping()) {
      showError("Please fill in all required shipping fields");
      return;
    }
    if (currentStep === "payment" && !validatePayment()) {
      showError("Please fill in all required payment fields");
      return;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleApplyDiscount = () => {
    const code = discountCode.trim();
    
    // Validate if the discount code is exactly 6 digits
    if (!/^\d{6}$/.test(code)) {
      setDiscountMessage("Invalid discount code. Please enter a 6-digit code.");
      setDiscountMessageType("error");
      return;
    }
    
    // Apply the discount code (assuming it's valid for demo purposes)
    setAppliedDiscountCode(code);
    setDiscountMessage("Discount code applied successfully! You saved $10.");
    setDiscountMessageType("success");
    
    // Clear the message after 3 seconds
    setTimeout(() => {
      setDiscountMessage("");
      setDiscountMessageType("");
    }, 3000);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscountCode("");
    setDiscountCode("");
    setDiscountMessage("");
    setDiscountMessageType("");
  };

  const handlePlaceOrder = async () => {
    try {
      // Validate all required fields before placing order
      if (!validateShipping()) {
        showError("Please complete all required shipping information");
        return;
      }
      if (!validatePayment()) {
        showError("Please complete all required payment information");
        return;
      }

      // Use billing address same as shipping if checkbox is checked
      const finalBillingAddress = sameAsBilling
        ? shippingAddress
        : billingAddress;

      const order = await createOrder(
        items,
        shippingAddress,
        finalBillingAddress,
        paymentMethod,
        user?.id
      );
      
      clearCart();

      // Since createOrder already updates currentOrder in the context,
      // we can set the step immediately
      setCurrentStep("confirmation");

      // Order confirmation will be shown in the confirmation step
    } catch (error) {
      console.error("Order placement error:", error);
      showError("Failed to place order. Please try again.");
    }
  };

  // Handle unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Please Sign In
              </h2>
              <p className="text-gray-600">
                You need to sign in to access the checkout page.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty cart (but not when showing order confirmation)
  if (items.length === 0 && currentStep !== "confirmation") {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Cart is Empty
              </h2>
              <p className="text-gray-600">
                Add some items to your cart before proceeding to checkout.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/products")}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse Products
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <BannerNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.key}>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    index <= currentStepIndex
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.icon}
                  <span className="font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight
                    size={20}
                    className={`mx-2 ${
                      index < currentStepIndex
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Conditional layout: full width for confirmation, grid for other steps */}
        {currentStep === "confirmation" && currentOrder ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Confirmation Step - Full Width Layout */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Order Confirmed!
              </h2>
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been confirmed.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4 max-w-md mx-auto">
                <p className="text-lg font-semibold text-green-800">
                  Order #{currentOrder.id || "N/A"}
                </p>
              </div>
            </div>

            {/* Order Details Grid - Responsive Layout */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Contact Information
                </h3>
                <hr className="border-gray-200 mb-4" />
                <div className="p-4">
                  <p className="font-medium">
                    {currentOrder.shippingAddress?.firstName}{" "}
                    {currentOrder.shippingAddress?.lastName}
                  </p>
                  <p className="text-gray-600">zhangtongdesi@gmail.com</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Shipping Address
                </h3>
                <hr className="border-gray-200 mb-4" />
                <div className="p-4">
                  <p className="font-medium">
                    {currentOrder.shippingAddress?.firstName}{" "}
                    {currentOrder.shippingAddress?.lastName}
                  </p>
                  {currentOrder.shippingAddress?.company && (
                    <p>{currentOrder.shippingAddress.company}</p>
                  )}
                  <p>{currentOrder.shippingAddress?.address1}</p>
                  {currentOrder.shippingAddress?.address2 && (
                    <p>{currentOrder.shippingAddress.address2}</p>
                  )}
                  <p>
                    {currentOrder.shippingAddress?.zipCode},{" "}
                    {currentOrder.shippingAddress?.city}
                  </p>
                  <p>
                    {currentOrder.shippingAddress?.state}, United States
                  </p>
                  {currentOrder.shippingAddress?.phone && (
                    <p>{currentOrder.shippingAddress.phone}</p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Payment Method
                </h3>
                <hr className="border-gray-200 mb-4" />
                <div className="p-4">
                  <p className="flex items-center gap-2">
                    <CreditCard size={20} />
                    {currentOrder.paymentMethod?.type === "cash"
                      ? "Cash On Delivery"
                      : `**** **** **** ${
                          currentOrder.paymentMethod?.cardNumber?.slice(-4) || "N/A"
                        }`}
                  </p>
                  {currentOrder.paymentMethod?.type !== "cash" && (
                    <>
                      <p>{currentOrder.paymentMethod?.nameOnCard}</p>
                      <p>
                        Expires {currentOrder.paymentMethod?.expiryMonth}/
                        {currentOrder.paymentMethod?.expiryYear}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Billing Address */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Billing Address
                </h3>
                <hr className="border-gray-200 mb-4" />
                <div className="p-4">
                  <p className="font-medium">
                    {currentOrder.billingAddress?.firstName}{" "}
                    {currentOrder.billingAddress?.lastName}
                  </p>
                  {currentOrder.billingAddress?.company && (
                    <p>{currentOrder.billingAddress.company}</p>
                  )}
                  <p>{currentOrder.billingAddress?.address1}</p>
                  {currentOrder.billingAddress?.address2 && (
                    <p>{currentOrder.billingAddress.address2}</p>
                  )}
                  <p>
                    {currentOrder.billingAddress?.zipCode},{" "}
                    {currentOrder.billingAddress?.city}
                  </p>
                  <p>
                    {currentOrder.billingAddress?.state}, United States
                  </p>
                  {currentOrder.billingAddress?.phone && (
                    <p>{currentOrder.billingAddress.phone}</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Order Summary
                </h3>
                <hr className="border-gray-200 mb-4" />
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${currentOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping:</span>
                    <span>${currentOrder.shipping?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax:</span>
                    <span>${currentOrder.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${currentOrder.total?.toFixed(2)}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p>
                      <strong>Estimated Delivery:</strong>{" "}
                      {currentOrder.estimatedDelivery?.toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Tracking Number:</strong>{" "}
                      {currentOrder.trackingNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center max-w-md mx-auto">
              <button
                onClick={() => router.push("/")}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Shipping Step */}
                {currentStep === "shipping" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Shipping Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.firstName}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.lastName}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.company}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            company: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.address1}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            address1: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, suite, etc. (Optional)
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.address2}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            address2: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <select
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            state: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="WA">Washington</option>
                        <option value="OR">Oregon</option>
                        <option value="NV">Nevada</option>
                        <option value="AZ">Arizona</option>
                        <option value="CO">Colorado</option>
                        <option value="UT">Utah</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            zipCode: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === "payment" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Payment Information
                  </h2>

                  {/* Billing Address */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={sameAsBilling}
                        onChange={(e) => setSameAsBilling(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">
                        Billing address is the same as shipping address
                      </span>
                    </label>

                    {!sameAsBilling && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={billingAddress.firstName}
                            onChange={(e) =>
                              setBillingAddress({
                                ...billingAddress,
                                firstName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={billingAddress.lastName}
                            onChange={(e) =>
                              setBillingAddress({
                                ...billingAddress,
                                lastName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {/* Add more billing address fields as needed */}
                      </div>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Payment Method
                    </h3>

                    {/* Payment Type Selection */}
                    <div className="mb-6">
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="paymentType"
                            value="card"
                            checked={paymentMethod.type === "card"}
                            onChange={(e) =>
                              setPaymentMethod({
                                ...paymentMethod,
                                type: e.target.value as "card" | "cash",
                              })
                            }
                            className="text-blue-600"
                          />
                          <CreditCard size={20} />
                          <span>Credit/Debit Card</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="paymentType"
                            value="cash"
                            checked={paymentMethod.type === "cash"}
                            onChange={(e) =>
                              setPaymentMethod({
                                ...paymentMethod,
                                type: e.target.value as "card" | "cash",
                              })
                            }
                            className="text-blue-600"
                          />
                          <span>💵</span>
                          <span>Cash On Delivery</span>
                        </label>
                      </div>
                    </div>

                    {/* Card Details - Only show if card is selected */}
                    {paymentMethod.type === "card" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={paymentMethod.cardNumber}
                            onChange={(e) =>
                              setPaymentMethod({
                                ...paymentMethod,
                                cardNumber: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name on Card *
                          </label>
                          <input
                            type="text"
                            value={paymentMethod.nameOnCard}
                            onChange={(e) =>
                              setPaymentMethod({
                                ...paymentMethod,
                                nameOnCard: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Month *
                            </label>
                            <select
                              value={paymentMethod.expiryMonth}
                              onChange={(e) =>
                                setPaymentMethod({
                                  ...paymentMethod,
                                  expiryMonth: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Month</option>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option
                                  key={i + 1}
                                  value={String(i + 1).padStart(2, "0")}
                                >
                                  {String(i + 1).padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Year *
                            </label>
                            <select
                              value={paymentMethod.expiryYear}
                              onChange={(e) =>
                                setPaymentMethod({
                                  ...paymentMethod,
                                  expiryYear: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Year</option>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() + i;
                                return (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVV *
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              maxLength={4}
                              value={paymentMethod.cvv}
                              onChange={(e) =>
                                setPaymentMethod({
                                  ...paymentMethod,
                                  cvv: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Review Step */}
              {currentStep === "review" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>

                  <div className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {items.map((item, index) => (
                          <div
                            key={index}
                            className="flex gap-4 p-4 border rounded-lg"
                          >
                            {item.product.images?.[0] &&
                            item.product.images[0].trim() !== "" ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <Image
                                src="/placeholder-image.svg"
                                alt={item.product.name}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold">
                                {item.product.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Size: {item.size} | Color: {item.color}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Shipping Address
                      </h3>
                      <div className="p-4 border rounded-lg">
                        <p>
                          {shippingAddress.firstName} {shippingAddress.lastName}
                        </p>
                        {shippingAddress.company && (
                          <p>{shippingAddress.company}</p>
                        )}
                        <p>{shippingAddress.address1}</p>
                        {shippingAddress.address2 && (
                          <p>{shippingAddress.address2}</p>
                        )}
                        <p>
                          {shippingAddress.city}, {shippingAddress.state}{" "}
                          {shippingAddress.zipCode}
                        </p>
                        {shippingAddress.phone && (
                          <p>{shippingAddress.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Payment Method
                      </h3>
                      <div className="p-4 border rounded-lg">
                        <p className="flex items-center gap-2">
                          <CreditCard size={20} />
                          {paymentMethod.type === "cash"
                            ? "Cash On Delivery"
                            : `**** **** **** ${paymentMethod.cardNumber.slice(
                                -4
                              )}`}
                        </p>
                        {paymentMethod.type !== "cash" && (
                          <>
                            <p>{paymentMethod.nameOnCard}</p>
                            <p>
                              Expires {paymentMethod.expiryMonth}/
                              {paymentMethod.expiryYear}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmation Step - moved outside to full width layout */}

              {/* Navigation Buttons */}
              {currentStep !== "confirmation" && (
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>

                  {currentStep === "review" ? (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading && (
                        <Loader2 size={20} className="animate-spin" />
                      )}
                      {isLoading ? "Processing..." : "Place Order"}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            {currentStep !== "confirmation" && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${orderTotals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Method: Standard Delivery</span>
                      <span>${orderTotals.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${orderTotals.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>-${orderTotals.discount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${orderTotals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Discount Code Section */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3">Discount Code</h4>
                    {appliedDiscountCode ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Code: {appliedDiscountCode}
                          </p>
                          <p className="text-xs text-green-600">
                            Discount applied: ${orderTotals.discount.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={handleRemoveDiscount}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Enter 6-digit discount code"
                            maxLength={6}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                          />
                          <button
                            onClick={handleApplyDiscount}
                            disabled={!discountCode.trim()}
                            className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Apply
                          </button>
                        </div>
                        {/* Display success or error message */}
                        {discountMessage && (
                          <div className={`p-2 rounded-lg text-sm ${
                            discountMessageType === "success" 
                              ? "bg-green-50 text-green-700 border border-green-200" 
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {discountMessage}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={16} />
                      <span>Free shipping on orders over $100</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={16} />
                      <span>30-day return policy</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
