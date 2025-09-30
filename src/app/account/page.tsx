"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrdersContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useComparison } from "@/contexts/ComparisonContext";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import CartSidebar from "@/components/CartSidebar";
import AuthModal from "@/components/AuthModal";
import {
  User,
  Package,
  Heart,
  Settings,
  Edit,
  Save,
  X,
  LogOut,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";

type DashboardTab = "profile" | "orders" | "wishlist" | "settings";

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { getUserOrders } = useOrders();
  const { items: wishlistItems } = useWishlist();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Address management state
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  });

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'orders', 'wishlist', 'settings'].includes(tab)) {
      setActiveTab(tab as DashboardTab);
    }
  }, [searchParams]);

  // Sync editForm with user data when user changes
  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // All hooks must be called before any conditional logic
  const handleSaveProfile = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Form validation
      if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
        throw new Error("First name and last name are required");
      }

      if (!editForm.email.trim()) {
        throw new Error("Email is required");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate potential API errors (10% chance)
      if (Math.random() < 0.1) {
        throw new Error("Failed to update profile. Please try again.");
      }

      // In a real app, this would update the user via API
      console.log("Profile updated:", editForm);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSaving(false);
    }
  }, [editForm]);

  // Address management functions
  const handleAddAddress = useCallback(() => {
    if (addresses.length >= 5) {
      setError("You can only save up to 5 addresses");
      return;
    }

    // Validate required fields
    if (!addressForm.firstName.trim() || !addressForm.lastName.trim() || 
        !addressForm.address1.trim() || !addressForm.city.trim() || 
        !addressForm.state.trim() || !addressForm.zipCode.trim()) {
      setError("Please fill in all required address fields");
      return;
    }

    setAddresses(prev => [...prev, { ...addressForm }]);
    setAddressForm({
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
    });
    setIsAddingAddress(false);
    setError(null);
    setSuccess("Address added successfully!");
    setTimeout(() => setSuccess(null), 3000);
  }, [addressForm, addresses.length]);

  const handleEditAddress = useCallback((index: number) => {
    setEditingAddressIndex(index);
    setAddressForm({ ...addresses[index] });
    setIsAddingAddress(true);
  }, [addresses]);

  const handleUpdateAddress = useCallback(() => {
    if (editingAddressIndex === null) return;

    // Validate required fields
    if (!addressForm.firstName.trim() || !addressForm.lastName.trim() || 
        !addressForm.address1.trim() || !addressForm.city.trim() || 
        !addressForm.state.trim() || !addressForm.zipCode.trim()) {
      setError("Please fill in all required address fields");
      return;
    }

    setAddresses(prev => {
      const updated = [...prev];
      updated[editingAddressIndex] = { ...addressForm };
      return updated;
    });
    setEditingAddressIndex(null);
    setIsAddingAddress(false);
    setAddressForm({
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
    });
    setError(null);
    setSuccess("Address updated successfully!");
    setTimeout(() => setSuccess(null), 3000);
  }, [addressForm, editingAddressIndex]);

  const handleDeleteAddress = useCallback((index: number) => {
    setAddresses(prev => prev.filter((_, i) => i !== index));
    setSuccess("Address deleted successfully!");
    setTimeout(() => setSuccess(null), 3000);
  }, []);

  const handleCancelAddressEdit = useCallback(() => {
    setIsAddingAddress(false);
    setEditingAddressIndex(null);
    setAddressForm({
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
    });
    setError(null);
  }, []);

  const getOrderStatusColor = useCallback((status: string) => {
    switch (status) {
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "shipped":
        return "text-purple-600 bg-purple-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  }, []);

  const getOrderStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={16} />;
      case "processing":
        return <Clock size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "delivered":
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    // Reset form to original user data
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">
            You need to be signed in to view your account.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
        <AuthModal />
      </div>
    );
  }

  const userOrders = getUserOrders(user?.id ?? "");

  const tabs = [
    {
      key: "profile" as DashboardTab,
      label: "Profile",
      icon: <User size={20} />,
    },
    {
      key: "orders" as DashboardTab,
      label: "Orders",
      icon: <Package size={20} />,
      count: userOrders.length,
    },
    {
      key: "wishlist" as DashboardTab,
      label: "Wishlist",
      icon: <Heart size={20} />,
      count: wishlistItems.length,
    },
    {
      key: "settings" as DashboardTab,
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Breadcrumb items={[{ label: "Account details" }]} />
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-gray-600">
            Manage your account and view your orders
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                {user?.avatar && user.avatar.trim() !== "" ? (
                  <Image
                    src={user.avatar}
                    alt={`${user.firstName || "User"} avatar`}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={24} className="text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">
                    {user?.firstName || ""} {user?.lastName || ""}
                  </h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Save size={16} />
                          {isSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Error and Success Messages */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                      <AlertCircle
                        size={20}
                        className="text-red-600 flex-shrink-0"
                      />
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                      <CheckCircle
                        size={20}
                        className="text-green-600 flex-shrink-0"
                      />
                      <p className="text-green-700">{success}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter first name"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user?.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter last name"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user?.lastName}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter email address"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user?.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Address Book Module */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <MapPin size={20} className="text-gray-600" />
                        Address Book
                      </h3>
                      {addresses.length < 5 && (
                        <button
                          onClick={() => setIsAddingAddress(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Plus size={16} />
                          Add new address
                        </button>
                      )}
                    </div>

                    {addresses.length === 0 && !isAddingAddress ? (
                      <div className="text-center py-8">
                        <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-600">You have no addresses saved</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {addresses.map((address, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            {editingAddressIndex === index ? (
                              <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      First Name *
                                    </label>
                                    <input
                                      type="text"
                                      value={addressForm.firstName}
                                      onChange={(e) =>
                                        setAddressForm((prev) => ({
                                          ...prev,
                                          firstName: e.target.value,
                                        }))
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Enter first name"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Last Name *
                                    </label>
                                    <input
                                      type="text"
                                      value={addressForm.lastName}
                                      onChange={(e) =>
                                        setAddressForm((prev) => ({
                                          ...prev,
                                          lastName: e.target.value,
                                        }))
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Enter last name"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Street Address *
                                    </label>
                                    <input
                                      type="text"
                                      value={addressForm.address1}
                                      onChange={(e) =>
                                        setAddressForm((prev) => ({
                                          ...prev,
                                          address1: e.target.value,
                                        }))
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Enter street address"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      City *
                                    </label>
                                    <input
                                      type="text"
                                      value={addressForm.city}
                                      onChange={(e) =>
                                        setAddressForm((prev) => ({
                                          ...prev,
                                          city: e.target.value,
                                        }))
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Enter city"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      State *
                                    </label>
                                    <input
                                      type="text"
                                      value={addressForm.state}
                                      onChange={(e) =>
                                        setAddressForm((prev) => ({
                                          ...prev,
                                          state: e.target.value,
                                        }))
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Enter state"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      ZIP Code *
                                    </label>
                                    <input
                                      type="text"
                                      value={addressForm.zipCode}
                                      onChange={(e) =>
                                        setAddressForm((prev) => ({
                                          ...prev,
                                          zipCode: e.target.value,
                                        }))
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Enter ZIP code"
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Country *
                                    </label>
                                    <input
                                      type="text"
                                      value={addressForm.country}
                                      onChange={(e) =>
                                        setAddressForm((prev) => ({
                                          ...prev,
                                          country: e.target.value,
                                        }))
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Enter country"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <button
                                    onClick={handleUpdateAddress}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    Save Changes
                                  </button>
                                  <button
                                    onClick={handleCancelAddressEdit}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{address.address1}</p>
                                  <p className="text-gray-600">
                                    {address.city}, {address.state} {address.zipCode}
                                  </p>
                                  <p className="text-gray-600">{address.country}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditAddress(index)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAddress(index)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Add New Address Form */}
                        {isAddingAddress && (
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <h4 className="font-medium mb-4">Add New Address</h4>
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={addressForm.firstName}
                                    onChange={(e) =>
                                      setAddressForm((prev) => ({
                                        ...prev,
                                        firstName: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter first name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={addressForm.lastName}
                                    onChange={(e) =>
                                      setAddressForm((prev) => ({
                                        ...prev,
                                        lastName: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter last name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Street Address *
                                  </label>
                                  <input
                                    type="text"
                                    value={addressForm.address1}
                                    onChange={(e) =>
                                      setAddressForm((prev) => ({
                                        ...prev,
                                        address1: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter street address"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City *
                                  </label>
                                  <input
                                    type="text"
                                    value={addressForm.city}
                                    onChange={(e) =>
                                      setAddressForm((prev) => ({
                                        ...prev,
                                        city: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter city"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State *
                                  </label>
                                  <input
                                    type="text"
                                    value={addressForm.state}
                                    onChange={(e) =>
                                      setAddressForm((prev) => ({
                                        ...prev,
                                        state: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter state"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ZIP Code *
                                  </label>
                                  <input
                                    type="text"
                                    value={addressForm.zipCode}
                                    onChange={(e) =>
                                      setAddressForm((prev) => ({
                                        ...prev,
                                        zipCode: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter ZIP code"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country *
                                  </label>
                                  <input
                                    type="text"
                                    value={addressForm.country}
                                    onChange={(e) =>
                                      setAddressForm((prev) => ({
                                        ...prev,
                                        country: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter country"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={handleAddAddress}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Add Address
                                </button>
                                <button
                                  onClick={handleCancelAddressEdit}
                                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Order History</h2>

                  {userOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package
                        size={48}
                        className="mx-auto text-gray-300 mb-4"
                      />
                      <h3 className="text-lg font-semibold mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        You haven't placed any orders yet.
                      </p>
                      <Link
                        href="/"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex flex-wrap items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">
                                Order #{order.id}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Placed on {order.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getOrderStatusColor(
                                  order.status
                                )}`}
                              >
                                {getOrderStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                              <span className="font-semibold">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium mb-2">
                                Items ({order.items.length})
                              </h4>
                              <div className="space-y-2">
                                {order.items.slice(0, 2).map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3"
                                  >
                                    <Image
                                      src={item.product.images[0]}
                                      alt={item.product.name}
                                      width={40}
                                      height={40}
                                      className="rounded object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {item.product.name}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Qty: {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                                {order.items.length > 2 && (
                                  <p className="text-sm text-gray-600">
                                    +{order.items.length - 2} more items
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Delivery</h4>
                              <p className="text-sm text-gray-600">
                                {order.shippingAddress.address1},{" "}
                                {order.shippingAddress.city}
                              </p>
                              {order.estimatedDelivery && (
                                <p className="text-sm text-gray-600">
                                  Est. delivery:{" "}
                                  {order.estimatedDelivery.toLocaleDateString()}
                                </p>
                              )}
                              {order.trackingNumber && (
                                <p className="text-sm text-blue-600">
                                  Tracking: {order.trackingNumber}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            {order.status === "delivered" && (
                              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                Reorder
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Save items you love for later.
                      </p>
                      <Link
                        href="/"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Explore Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <Link href={`/product/${item.product.id}`}>
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              width={200}
                              height={200}
                              className="w-full aspect-square object-cover rounded-lg mb-3"
                            />
                          </Link>
                          <h3 className="font-semibold mb-2">
                            {item.product.name}
                          </h3>
                          <p className="text-lg font-bold text-blue-600 mb-3">
                            ${item.product.price.toFixed(2)}
                          </p>
                          <div className="flex gap-2">
                            <Link
                              href={`/product/${item.product.id}`}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                            >
                              View Product
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Notifications
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span>Email notifications</span>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span>Order updates</span>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span>Marketing emails</span>
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="border-b pb-6">
                      <h3 className="text-lg font-semibold mb-4">Privacy</h3>
                      <div className="space-y-3">
                        <button className="text-blue-600 hover:text-blue-700">
                          Download my data
                        </button>
                        <br />
                        <button className="text-red-600 hover:text-red-700">
                          Delete my account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CartSidebar />
      <AuthModal />
    </div>
  );
}
