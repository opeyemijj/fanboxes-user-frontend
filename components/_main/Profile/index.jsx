"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { User, Edit3, Mail, Phone, Camera, Upload, X } from "lucide-react";
import { updateProfile } from "@/services/profile";
import { toastError, toastSuccess } from "@/lib/toast";
import { updateUserData } from "@/redux/slices/user";

const InputField = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      )}
      <input
        {...props}
        className={`w-full rounded-lg border border-gray-200 px-4 py-3
                   focus:border-[#11F2EB] focus:ring-2 focus:ring-[#11F2EB]
                   transition-colors ${Icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
);

const Profile = ({ user }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const dispatch = useDispatch();

  async function handleUpdateProfile() {
    try {
      setIsUpdatingProfile(true);
      const res = await updateProfile(profileData);

      if (res.success) {
        toastSuccess(res?.message || "Profile updated successfully!");
        setShowEditModal(false);

        dispatch(updateUserData(res.data));
      } else {
        toastError(res?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toastError(error?.response?.data?.message || "Error updating profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        // Simulate API upload
        simulateImageUpload();
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file (JPG, PNG, WebP)");
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Simulate API upload
  const simulateImageUpload = () => {
    setIsUploading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsUploading(false);
      //   setShowImageUpload(false);
      // In real implementation, you would update the user's profile picture here
      console.log("Image uploaded successfully");
    }, 1500);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  // Show login prompt if no user data
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#11F2EB]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Please Login
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to be logged in to view and edit your profile.
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

  return (
    <div className="bg-gray-50 min-h-screen p-0 sm:p-0">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1> */}
          <p className="text-sm sm:text-base text-gray-600">
            Manage your personal information and account details
          </p>
        </div>

        {/* Responsive Gradient Stats Card */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-xl p-4 sm:p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#11F2EB]/20 to-transparent rounded-full -translate-y-8 translate-x-8 sm:-translate-y-12 sm:translate-x-12"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-[#11F2EB]/10 to-transparent rounded-full -translate-x-4 translate-y-4 sm:-translate-x-8 sm:translate-y-8"></div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              {/* Profile Picture Section - Clickable */}
              <div
                className="relative group cursor-pointer"
                onClick={() => setShowImageUpload(true)}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mr-4 relative overflow-hidden">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#11F2EB]" />
                  )}
                  {/* Edit overlay that's always visible */}
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white text-lg sm:text-xl font-semibold truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-white/70 text-sm truncate">{user.email}</p>
                <p className="text-white/50 text-xs mt-1 truncate">
                  {user.role || "User"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowEditModal(true)}
              className="bg-[#11F2EB] text-slate-800 px-4 py-2 rounded-lg hover:bg-[#0ED9D3] transition-colors font-medium flex items-center justify-center sm:justify-start w-full sm:w-auto"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 text-[#11F2EB] mr-2" />
              Personal Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  First Name
                </span>
                <span className="text-gray-900 text-sm sm:text-base">
                  {user.firstName}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  Last Name
                </span>
                <span className="text-gray-900 text-sm sm:text-base">
                  {user.lastName}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Email</span>
                <span className="text-gray-900 text-sm sm:text-base">
                  {user.email}
                </span>
              </div>
              {user.phone && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">
                    Phone
                  </span>
                  <span className="text-gray-900 text-sm sm:text-base">
                    {user.phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Account Information Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 text-[#11F2EB] mr-2" />
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Role</span>
                <span className="text-gray-900 text-sm sm:text-base capitalize">
                  {user.role || "User"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  Balance
                </span>
                <span className="text-gray-900 font-semibold text-sm sm:text-base">
                  ${user.availableBalance?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-600">
                  Status
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 px-6 sm:px-8 py-6 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Edit Profile
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update your personal information
                  </p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-white/80 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <InputField
                  label="First Name"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  icon={User}
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  icon={User}
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  icon={Mail}
                  disabled
                />
                <InputField
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  icon={Phone}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-6 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 sm:py-4 px-6 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile}
                  className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] text-slate-800 font-semibold rounded-xl hover:from-[#0ED9D3] hover:to-[#0BC5BF] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 px-6 sm:px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Update Profile Picture
                  </h2>
                  <p className="text-sm text-gray-500">
                    Upload a new profile photo
                  </p>
                </div>
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="p-2 hover:bg-white/80 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {isUploading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11F2EB] mx-auto mb-4"></div>
                  <p className="text-gray-600">Uploading your photo...</p>
                </div>
              ) : uploadedImage ? (
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Photo ready to upload
                  </p>
                  <button
                    onClick={simulateImageUpload}
                    className="bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] text-slate-800 px-6 py-2 rounded-lg font-semibold hover:from-[#0ED9D3] hover:to-[#0BC5BF] transition-all duration-200"
                    disabled
                  >
                    Confirm Upload
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-6 sm:p-8 text-center cursor-pointer hover:border-[#11F2EB] transition-colors group"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() =>
                    document.getElementById("profile-image-upload").click()
                  }
                >
                  <div className="w-16 h-16 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#11F2EB]/30 transition-colors">
                    <Upload className="w-8 h-8 text-[#11F2EB]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Profile Photo
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Drag and drop your image here or click to browse
                  </p>
                  <p className="text-gray-400 text-xs">
                    JPG, PNG, WebP up to 5MB
                  </p>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            {!isUploading && !uploadedImage && (
              <div className="px-6 sm:px-8 py-6 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() =>
                    document.getElementById("profile-image-upload").click()
                  }
                  className="w-full py-3 bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] text-slate-800 font-semibold rounded-xl hover:from-[#0ED9D3] hover:to-[#0BC5BF] transition-all duration-200 shadow-sm"
                >
                  Choose File
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
