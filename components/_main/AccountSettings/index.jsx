"use client";
import React, { useState } from "react";
import {
  Settings,
  Trash2,
  AlertTriangle,
  X,
  Lock,
  Download,
  Database,
  UserX,
} from "lucide-react";
import { toastError, toastInfo, toastSuccess, toastWarning } from "@/lib/toast";
import { deleteMyAccount } from "@/services/profile";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

const AccountSettings = ({ user }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE MY ACCOUNT") {
      toastError("Please type 'DELETE MY ACCOUNT' to confirm");
      return;
    }

    if (!password) {
      toastError("Please enter your password to confirm account deletion");
      return;
    }

    if (!isConfirmed) {
      toastError("Please confirm that you understand this action is permanent");
      return;
    }

    try {
      setIsDeleting(true);

      // Call the actual delete account API
      const response = await deleteMyAccount({ password });

      if (response.success) {
        toastSuccess(response.message || "Account deleted successfully");
        setShowDeleteModal(false);

        // Logout user
        await logout();

        // Redirect to home page
        router.push("/");
      } else {
        toastError(
          response.message || "Failed to delete account. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      toastError(
        error?.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset modal state when closed
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setConfirmText("");
    setPassword("");
    setIsConfirmed(false);
  };

  // Handle data export
  const handleExportData = () => {
    toastWarning("Data export feature coming soon!");
  };

  // Show login prompt if no user data
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-[#11F2EB]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Please Login
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You need to be logged in to manage your account settings.
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
            Account Settings
          </h1> */}
          <p className="text-sm sm:text-base text-gray-600">
            Manage your account preferences and data
          </p>
        </div>

        {/* Gradient Stats Card - With Delete Button Restored */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-xl p-4 sm:p-6 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#11F2EB]/20 to-transparent rounded-full -translate-y-8 translate-x-8 sm:-translate-y-12 sm:translate-x-12"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-[#11F2EB]/10 to-transparent rounded-full -translate-x-4 translate-y-4 sm:-translate-x-8 sm:translate-y-8"></div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mr-4">
                <Settings className="w-6 h-6 sm:w-10 sm:h-10 text-[#11F2EB]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white text-lg sm:text-xl font-semibold truncate">
                  Account Management
                </h3>
                <p className="text-white/70 text-sm truncate">
                  Manage your account data and preferences
                </p>
                <p className="text-white/50 text-xs mt-1 truncate">
                  Member since {new Date().getFullYear()}
                </p>
              </div>
            </div>

            {/* Delete Account Button Restored */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Account Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Data Export Card - Using Brand Colors */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="bg-gradient-to-r from-slate-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#11F2EB]/20 rounded-lg flex items-center justify-center mr-3">
                  <Database className="w-5 h-5 text-[#11F2EB]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Export Data
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Download your personal information
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                Download a complete copy of your personal data including order
                history, profile information, and account activity.
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                  Order history and receipts
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                  Personal profile information
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                  Account activity logs
                </div>
              </div>

              <button
                onClick={handleExportData}
                className="w-full mt-6 bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] hover:from-[#0ED9D3] hover:to-[#0BC5BF] text-slate-800 py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-sm flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </button>
            </div>
          </div>

          {/* Delete Account Card - Keep Red Colors */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <UserX className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">
                    Delete Account
                  </h3>
                  <p className="text-red-700 text-sm">
                    Permanent account deletion
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                Permanently delete your account and all associated data. This
                action cannot be undone and will remove all your information
                from our systems.
              </p>
              <div className="space-y-2 text-xs text-red-500">
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                  All personal data will be erased
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                  Order history will be deleted
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                  Account cannot be recovered
                </div>
              </div>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-sm flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 text-[#11F2EB] mr-2" />
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-4 h-4 text-[#11F2EB]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="font-medium text-gray-900">FAQ</p>
              <p className="text-gray-600 text-xs mt-1">
                Find answers to common questions
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-4 h-4 text-[#11F2EB]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Support</p>
              <p className="text-gray-600 text-xs mt-1">
                Contact our support team
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-4 h-4 text-[#11F2EB]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Privacy</p>
              <p className="text-gray-600 text-xs mt-1">
                Learn about data protection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 px-6 sm:px-8 py-6 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Delete Account
                  </h2>
                  <p className="text-sm text-gray-500">
                    This action is permanent and cannot be undone
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/80 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {/* Warning Box */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 text-sm font-medium mb-2">
                      Warning: This will permanently delete your account
                    </p>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• All your personal data will be erased</li>
                      <li>• Your order history will be deleted</li>
                      <li>• Any remaining balance will be forfeited</li>
                      <li>• This action cannot be reversed</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Confirmation Text Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type{" "}
                    <span className="font-mono text-red-600">
                      DELETE MY ACCOUNT
                    </span>{" "}
                    to confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE MY ACCOUNT"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors font-mono"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your password to confirm:
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 pl-10 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
                    />
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <div className="flex items-start text-sm text-gray-600">
                  <input
                    type="checkbox"
                    id="understand-checkbox"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="mr-3 rounded border-gray-300 accent-red-600 text-red-600 focus:ring-red-500 mt-0.5"
                  />
                  <label
                    htmlFor="understand-checkbox"
                    className="cursor-pointer"
                  >
                    I understand that this action is permanent and cannot be
                    undone
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-6 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCloseModal}
                  disabled={isDeleting}
                  className="flex-1 py-3 sm:py-4 px-6 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={
                    isDeleting ||
                    confirmText !== "DELETE MY ACCOUNT" ||
                    !password ||
                    !isConfirmed
                  }
                  className="flex-1 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    "Permanently Delete Account"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
