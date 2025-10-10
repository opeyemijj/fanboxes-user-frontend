"use client";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const UserProfileHeader = () => {
  const user = useSelector((state) => state.user.user);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse mr-4"></div>
          <div>
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Get user initials from first and last name
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get user's full name
  const getFullName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email;
    }
    return "User";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center">
        {/* User Avatar */}
        <div className="flex-shrink-0 mr-4">
          {user?.cover?.url ? (
            <img
              src={user?.cover?.url}
              alt={getFullName()}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#0A3432]/10"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-900 via-[#0ED9D3] to-slate-800 flex items-center justify-center text-white text-lg font-semibold shadow-sm">
              {getInitials()}
            </div>
          )}
        </div>

        {/* User Info */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">{getFullName()}</h1>
          {user.email && (
            <p className="text-gray-600 mt-1 text-sm">{user.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
