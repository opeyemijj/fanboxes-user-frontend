// components/shared/AddressManager.jsx
import React, { useState, useEffect } from "react";
import { MapPin, Edit3, Plus, Map, Navigation } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateMyShippingAddress } from "@/services/profile";
import { updateShippingAddress } from "@/redux/slices/user";
import { toastError, toastSuccess, toastInfo } from "@/lib/toast";

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

const AddressManager = ({ user, showHeader = true, compact = false }) => {
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

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }

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

      if (response.success) {
        if (response?.data) dispatch(updateShippingAddress(response.data));
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

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Please Login
          </h3>
          <p className="text-gray-500 mb-4">
            You need to be logged in to manage your shipping address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Shipping Information
          </h2>
        </div>
      )}

      {hasAddress ? (
        <div className={compact ? "" : "bg-white rounded-lg shadow-sm p-9"}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              {/* <MapPin className="text-gray-400 mt-1" size={20} /> */}
              <div className="flex items-start mb-3">
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
            </div>
            <button
              onClick={() => {
                setAddressData(user.shippingAddress);
                setShowAddModal(true);
              }}
              className="text-[#11F2EB] hover:text-[#0DD4CE] font-medium text-sm flex items-center"
            >
              <Edit3 size={16} className="mr-1" />
              Edit
            </button>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-600 mt-1">
              {user.shippingAddress.address}
              <br />
              {user.shippingAddress.city}, {user.shippingAddress.state}{" "}
              {user.shippingAddress.zip}
              <br />
              {user.shippingAddress.country}
            </p>
            {user.email && (
              <p className="text-gray-500 text-sm mt-2">{user.email}</p>
            )}
            {user.phone && (
              <p className="text-gray-500 text-sm">{user.phone}</p>
            )}
          </div>

          {!compact && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Map className="w-4 h-4 text-[#11F2EB] mr-2" />
                Location Map
                {isGeocoding && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Loading...)
                  </span>
                )}
              </h4>
              <div className="bg-gray-100 rounded-lg h-52 flex items-center justify-center overflow-hidden">
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
                    <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-4 h-4 text-[#11F2EB]" />
                    </div>
                    <p className="text-xs text-gray-600">
                      {geocodingFailed
                        ? "Could not locate address on map"
                        : "Map preview unavailable"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Add Shipping Address
          </h3>
          <p className="text-gray-500 mb-4">
            Please add your shipping address to continue
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#11F2EB] hover:bg-[#0DD4CE] text-black px-6 py-2 rounded-lg font-medium transition-colors flex items-center mx-auto"
          >
            <Plus size={20} className="mr-2" />
            Add Address
          </button>
        </div>
      )}

      {/* Add/Edit Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="relative bg-gray-50 px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {hasAddress ? "Edit Address" : "Add Address"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {hasAddress
                      ? "Update your shipping information"
                      : "Enter your shipping details"}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
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
            <div className="flex-1 overflow-y-auto p-6">
              <button
                onClick={handleUseCurrentLocation}
                disabled={isGettingLocation}
                className="mb-6 w-full inline-flex items-center justify-center gap-2
               rounded-lg border border-gray-200 bg-gray-100 px-4 py-3
               text-sm font-medium text-gray-800
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAddress}
                  disabled={isSaving || isGettingLocation}
                  className="flex-1 py-2 px-4 bg-[#11F2EB] hover:bg-[#0DD4CE] text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default AddressManager;
