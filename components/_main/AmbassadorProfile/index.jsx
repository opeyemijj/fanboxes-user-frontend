import Image from "next/image";
import { Button } from "@/components/Button";
import { Bell, Instagram, Music } from "lucide-react";

export default function AmbassadorProfile({ ambassador }) {
  const handleSocialClick = (link) => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
      <div className="md:flex items-start space-x-6">
        <div className="relative">
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
          <div className="flex items-center space-x-3">
            <Button className="bg-black text-white rounded-full px-6">
              <Bell className="h-4 w-4 mr-2" />
              GET UPDATES
            </Button>

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
              <Music className="h-4 w-4" />
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
          </div>
        </div>
      </div>
    </div>
  );
}
