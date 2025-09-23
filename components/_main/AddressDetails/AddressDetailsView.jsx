import React, { useState, useEffect } from "react";
import { MapPin, Edit3, Plus, Map, Navigation, Home } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateMyShippingAddress } from "@/services/profile";
import { updateShippingAddress } from "@/redux/slices/user";
import { toastError, toastSuccess, toastWarning, toastInfo } from "@/lib/toast";
import AddressManager from "./AddressManager";

const AddressDetailsView = ({ user }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addressData, setAddressData] = useState({
    address: "",
    city: "",
    zip: "",
    country: "",
    state: "",
  });

  const [mapCoordinates, setMapCoordinates] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [geocodingFailed, setGeocodingFailed] = useState(false);
  const dispatch = useDispatch();

  // Check if user has shipping address
  const hasAddress = user?.shippingAddress?.address;

  // Function to geocode address to coordinates using Nominatim
  const geocodeAddress = async (address) => {
    if (!address) return null;

    setIsGeocoding(true);
    setGeocodingFailed(false);
    try {
      const fullAddress = [
        address.address,
        address.city,
        address.state,
        address.zip,
        address.country,
      ]
        .filter(Boolean)
        .join(", ");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}&limit=1`
      );

      if (!response.ok) throw new Error("Geocoding failed");

      const data = await response.json();
      console.log("location:::", data);

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }

      // If no results found, set geocoding failed flag
      setGeocodingFailed(true);
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      setGeocodingFailed(true);
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  // Effect to geocode address when component mounts or address changes
  useEffect(() => {
    if (hasAddress) {
      const geocode = async () => {
        const coords = await geocodeAddress(user.shippingAddress);
        if (coords) {
          setMapCoordinates(coords);
        }
      };
      geocode();
    }
  }, [hasAddress, user?.shippingAddress]);

  // Function to handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle adding/editing address
  const handleSaveAddress = async () => {
    setIsSaving(true);
    try {
      const response = await updateMyShippingAddress(addressData);
      console.log("API Response:", response);

      if (response.success) {
        if (response?.data) dispatch(updateShippingAddress(response.data));
        // Reset map coordinates to trigger re-geocoding
        setMapCoordinates(null);
        setShowAddModal(false);
        toastSuccess(response?.message || "Address updated successfully!");
      } else {
        toastError(
          "Failed to update address: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toastError("Error saving address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle using current location
  const handleUseCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();

            if (data && data.address) {
              const address = data.address;

              const newAddressData = {
                address: `${address.house_number || ""} ${
                  address.road || data.display_name.split(",")[0]
                }`.trim(),
                city:
                  address.city ||
                  address.town ||
                  address.village ||
                  address.municipality ||
                  "",
                state: address.state || address.region || "",
                zip: address.postcode || "",
                country: address.country || "",
              };

              setAddressData(newAddressData);
              setMapCoordinates({ lat: latitude, lon: longitude });
              setGeocodingFailed(false);
              toastInfo("Location detected and address fields updated!");
            } else {
              throw new Error("Unable to get address from coordinates");
            }
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            toastError(
              "Location detected but unable to convert to address. Please enter manually."
            );
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          let errorMessage = "Unable to get your location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Location access denied by user.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "Unknown error occurred.";
          }
          toastError(errorMessage + " Please enter your address manually.");
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    } else {
      toastError("Geolocation is not supported by your browser.");
      setIsGettingLocation(false);
    }
  };

  // Show login prompt if no user data
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-[#11F2EB]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Please Login
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to be logged in to manage your shipping address.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] text-slate-800 px-6 py-3 rounded-lg hover:from-[#0ED9D3] hover:to-[#0BC5BF] transition-all duration-200 font-medium"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const InputField = ({ label, ...props }) => (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border border-gray-200 px-4 py-3
                 focus:border-[#11F2EB] focus:ring-2 focus:ring-[#11F2EB]
                 transition-colors"
      />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm sm:text-base text-gray-600">
            Manage your delivery address for orders
          </p>
        </div>

        {/* Gradient Stats Card */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-xl p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#11F2EB]/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#11F2EB]/10 to-transparent rounded-full -translate-x-8 translate-y-8"></div>

          <div className="relative z-10 max-w-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-lg flex items-center justify-center mr-3">
                <Home className="w-4 h-4 text-[#11F2EB]" />
              </div>
              <h3 className="text-white text-base font-medium">
                Address Status
              </h3>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {hasAddress ? "Active" : "Not Set"}
            </div>
            <p className="text-white/70 text-sm">
              {hasAddress
                ? "Your address is ready for deliveries"
                : "Add your address to receive orders"}
            </p>
            {!hasAddress && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 bg-[#11F2EB] text-slate-800 px-3 py-2 rounded-lg hover:bg-[#0ED9D3] transition-colors font-medium flex items-center text-sm"
              >
                <Plus className="w-3 h-3 mr-2" />
                Add Address
              </button>
            )}
          </div>
        </div>

        {/* {hasAddress ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 text-[#11F2EB] mr-2" />
                  Shipping Address
                </h2>
                <button
                  onClick={() => {
                    setAddressData(user.shippingAddress);
                    setShowAddModal(true);
                  }}
                  className="flex items-center text-sm text-slate-700 hover:text-slate-800 font-medium bg-[#11F2EB]/10 hover:bg-[#11F2EB]/20 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[#11F2EB]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#11F2EB]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">
                      {user.shippingAddress.address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium text-gray-900">
                      {user.shippingAddress.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ZIP Code</p>
                    <p className="font-medium text-gray-900">
                      {user.shippingAddress.zip}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">State</p>
                    <p className="font-medium text-gray-900">
                      {user.shippingAddress.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-medium text-gray-900">
                      {user.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

        
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Map className="w-5 h-5 text-[#11F2EB] mr-2" />
                Location Map
                {isGeocoding && (
                  <span className="ml-2 text-sm text-gray-500">
                    (Loading...)
                  </span>
                )}
              </h3>
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg h-64 flex items-center justify-center overflow-hidden relative">
                {mapCoordinates ? (
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      mapCoordinates.lon - 0.005
                    },${mapCoordinates.lat - 0.005},${
                      mapCoordinates.lon + 0.005
                    },${mapCoordinates.lat + 0.005}&layer=mapnik&marker=${
                      mapCoordinates.lat
                    },${mapCoordinates.lon}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    className="rounded-lg"
                    title="Location Map"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-[#11F2EB]" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {geocodingFailed
                        ? "Could not locate address on map"
                        : "Map preview will appear here"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {geocodingFailed
                        ? "The address couldn't be found in the mapping service"
                        : "Enter a valid address to see its location"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (

          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-[#11F2EB]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Address Added
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Add your shipping address to receive orders and manage deliveries
              efficiently.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] text-slate-800 px-6 py-3 rounded-lg hover:from-[#0ED9D3] hover:to-[#0BC5BF] transition-all duration-200 font-medium flex items-center justify-center mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Shipping Address
            </button>
          </div>
        )} */}
        <div className="mt-8">
          <AddressManager user={user} showHeader={true} compact={false} />
        </div>
      </div>

      {/* Add/Edit Address Modal - Updated to match spin history style */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header - Matching spin history modal style */}
            <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {hasAddress ? "Edit Address" : "Add Address"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {hasAddress
                      ? "Update your shipping information"
                      : "Enter your shipping details"}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/80 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}

            <div className="flex-1 overflow-y-auto p-8">
              {/* ---------- Current-location shortcut ---------- */}
              <button
                onClick={handleUseCurrentLocation}
                disabled={isGettingLocation}
                className="mb-6 w-full inline-flex items-center justify-center gap-2
               rounded-lg border border-gray-200 bg-gray-100 px-4 py-3
               text-sm font-semibold text-gray-800
               hover:bg-[#DCFDFB] hover:text-gray-800
               transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGettingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#11F2EB]"></div>
                    Detecting Location...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4" />
                    Use Current Location
                  </>
                )}
              </button>

              {/* ---------- Address form ---------- */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <InputField
                    label="Full Address"
                    name="address"
                    value={addressData.address}
                    onChange={handleAddressChange}
                    placeholder="Street address, apartment number"
                  />
                  <InputField
                    label="City"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                  />
                  <InputField
                    label="ZIP Code"
                    name="zip"
                    value={addressData.zip}
                    onChange={handleAddressChange}
                    placeholder="ZIP code"
                  />
                </div>

                <div className="space-y-4">
                  <InputField
                    label="State"
                    name="state"
                    value={addressData.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                  />
                  <InputField
                    label="Country"
                    name="country"
                    value={addressData.country}
                    onChange={handleAddressChange}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Footer - Matching spin history modal style */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 sm:py-4 px-6 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAddress}
                  disabled={isSaving || isGettingLocation}
                  className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] text-slate-800 font-semibold rounded-xl hover:from-[#0ED9D3] hover:to-[#0BC5BF] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Address"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressDetailsView;
