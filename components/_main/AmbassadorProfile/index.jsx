"use client";
import Image from "next/image";
import { Button } from "@/components/Button";
import {
  Bell,
  Instagram,
  Music,
  Loader2,
  Share2,
  MessageCircle,
  Copy,
} from "lucide-react";
import { followInfluencer } from "@/services/influencer/index";
import { toastSuccess, toastError } from "@/lib/toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AmbassadorProfile({ ambassador, userId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update isFollowing state when ambassador or userId changes
  useEffect(() => {
    setIsFollowing(userId && ambassador?.followers?.includes(userId));
  }, [ambassador, userId]);

  const handleSocialClick = (link) => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  const handleFollowClick = async () => {
    if (!userId) {
      toastError("Please log in to follow this ambassador");
      // Redirect to login with current path as destination
      const currentPath = window.location.pathname;
      router.push(`/login?dest=${encodeURIComponent(currentPath)}`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await followInfluencer(ambassador._id);

      if (response.success) {
        setIsFollowing(response.message === "Followed");
        toastSuccess(response.message);
      } else {
        toastError(response.message || "Failed to follow ambassador");
      }
    } catch (error) {
      console.error("Error following ambassador:", error);
      toastError("An error occurred while following the ambassador");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (platform) => {
    const currentUrl = window.location.href;
    const caption = `Check out ${ambassador.title}'s profile on FanBox! ${
      ambassador.description || ""
    }`;

    // Use native share on mobile ONLY if available
    if (isMobile && platform !== "copy" && navigator.share) {
      try {
        await navigator.share({
          title: `${ambassador.title}'s Profile | FanBox`,
          text: caption,
          url: currentUrl,
        });
        setShowShareDropdown(false);
        return;
      } catch (error) {
        // User cancelled or share failed, fall back to platform-specific URLs
        if (error.name === "AbortError") {
          setShowShareDropdown(false);
          return;
        }
      }
    }

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          caption + " " + currentUrl
        )}`;
        break;
      case "facebook":
        // Facebook Share Dialog only accepts URL, no pre-filled text
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      case "x":
        shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
          caption
        )}&url=${encodeURIComponent(currentUrl)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(`${caption} ${currentUrl}`);
        toastSuccess("Profile link copied to clipboard!");
        setShowShareDropdown(false);
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=500");
    setShowShareDropdown(false);
  };

  const TikTokIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
    </svg>
  );

  const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  const FacebookIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-blue-600"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const ShareDropdown = () => (
    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-10 overflow-hidden backdrop-blur-sm bg-white/95">
      <div className="p-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">
          Share this profile
        </h3>
      </div>
      <div className="p-2">
        <button
          onClick={() => handleShare("whatsapp")}
          className="w-full px-3 py-3 text-left hover:bg-green-50 rounded-lg flex items-center space-x-3 text-sm transition-all duration-200 group"
        >
          <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
            <MessageCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">WhatsApp</span>
            <span className="text-xs text-gray-500">Share via WhatsApp</span>
          </div>
        </button>

        <button
          onClick={() => handleShare("facebook")}
          className="w-full px-3 py-3 text-left hover:bg-blue-50 rounded-lg flex items-center space-x-3 text-sm transition-all duration-200 group mt-1"
        >
          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
            <FacebookIcon />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">Facebook</span>
            <span className="text-xs text-gray-500">Share on Facebook</span>
          </div>
        </button>

        <button
          onClick={() => handleShare("x")}
          className="w-full px-3 py-3 text-left hover:bg-black/5 rounded-lg flex items-center space-x-3 text-sm transition-all duration-200 group mt-1"
        >
          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
            <XIcon />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">X</span>
            <span className="text-xs text-gray-500">Post on X</span>
          </div>
        </button>

        <button
          onClick={() => handleShare("copy")}
          className="w-full px-3 py-3 text-left hover:bg-gray-50 rounded-lg flex items-center space-x-3 text-sm transition-all duration-200 group mt-1"
        >
          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
            <Copy className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">Copy Link</span>
            <span className="text-xs text-gray-500">Copy to clipboard</span>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
      <div className="md:flex items-start space-x-0 md:space-x-6">
        <div className="relative mb-4 md:mb-0 flex justify-center md:justify-start">
          <Image
            src={ambassador?.logo?.url || "/placeholder.svg"}
            alt={ambassador?.title}
            width={120}
            height={120}
            className="rounded-full border-4 border-white shadow-lg aspect-square object-cover"
            style={{ backgroundColor: "#11F2EB" }}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{ambassador.title}</h1>
          <p className="text-gray-600 mb-4">
            {ambassador.description || "New box opening coming soon"}
          </p>

          {/* Button Container with responsive layout */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Get Updates Button - Full width on mobile */}
            <Button
              className={`rounded-full px-6 w-full sm:w-auto ${
                isFollowing ? "bg-gray-600 text-white" : "bg-black text-white"
              }`}
              onClick={handleFollowClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  UPDATING...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  {isFollowing ? "FOLLOWING" : "GET UPDATES"}
                </>
              )}
            </Button>

            {/* Social Icons - Stack below on mobile, inline on desktop */}
            <div className="flex items-center space-x-3 justify-center sm:justify-start">
              {/* Instagram Button */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent"
                onClick={() => handleSocialClick(ambassador?.instagramLink)}
                disabled={!ambassador?.instagramLink}
              >
                <Instagram className="h-4 w-4" />
              </Button>

              {/* TikTok Button */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent"
                onClick={() => handleSocialClick(ambassador?.tiktokLink)}
                disabled={!ambassador?.tiktokLink}
              >
                <TikTokIcon />
              </Button>

              {/* Facebook Button */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent"
                onClick={() => handleSocialClick(ambassador?.facebookLink)}
                disabled={!ambassador?.facebookLink}
              >
                <span className="text-sm font-bold">f</span>
              </Button>

              {/* Share Button with Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-transparent hover:bg-gray-50 transition-colors"
                  onClick={() => setShowShareDropdown(!showShareDropdown)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                {showShareDropdown && <ShareDropdown />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {showShareDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowShareDropdown(false)}
        />
      )}
    </div>
  );
}
