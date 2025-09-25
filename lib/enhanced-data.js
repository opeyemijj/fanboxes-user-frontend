// Enhanced categories with proper structure
export const categories = [
  { id: "all", name: "ALL", slug: "all" },
  { id: "tech", name: "TECH", slug: "tech" },
  { id: "gaming", name: "GAMING", slug: "gaming" },
  { id: "beauty", name: "BEAUTY", slug: "beauty" },
  { id: "lifestyle", name: "LIFESTYLE", slug: "lifestyle" },
  { id: "fitness", name: "FITNESS & HEALTH", slug: "fitness-health" },
  { id: "food", name: "FOOD & BEVERAGE", slug: "food-beverage" },
  { id: "travel", name: "TRAVEL", slug: "travel" },
  {
    id: "collectors",
    name: "COLLECTORS / HOBBYISTS",
    slug: "collectors-hobbyists",
  },
  { id: "diy", name: "DIY / CRAFT", slug: "diy-craft" },
  { id: "family", name: "FAMILY", slug: "family" },
  { id: "books", name: "BOOKS & LITERATURE", slug: "books-literature" },
  {
    id: "entertainment",
    name: "ENTERTAINMENT & CELEBRITIES",
    slug: "entertainment-celebrities",
  },
  { id: "jewellery", name: "JEWELLERY", slug: "jewellery" },
  { id: "cars", name: "CARS & BIKES", slug: "cars-bikes" },
  { id: "sports", name: "SPORTS", slug: "sports" },
  { id: "onlyfans", name: "ONLY FANS", slug: "only-fans" },
  { id: "crypto", name: "STOCKS & CRYPTO", slug: "stocks-crypto" },
];

// Enhanced ambassadors with proper categories and relationships
export const enhancedAmbassadors = [
  {
    id: 1,
    name: "Anna & Mandi Vakili",
    slug: "anna-mandi-vakili",
    image: "/images/profile1bg.png",
    bannerImage: "/images/profile-banner.jpg",
    badge: "NEW",
    category: "entertainment",
    description:
      "Fashion and lifestyle influencers bringing you the latest trends",
    followers: "2.1M",
    totalBoxes: 12,
    isVerified: true,
    socialLinks: {
      instagram: "@annamandivakili",
      tiktok: "@annamandi",
      youtube: "AnnaMandiVakili",
    },
  },
  {
    id: 2,
    name: "TechGuru Mike",
    slug: "tech-guru-mike",
    image: "/images/profile2bg.png",
    bannerImage: "/images/profile-banner.jpg",
    badge: "POPULAR",
    category: "tech",
    description: "Tech enthusiast sharing the coolest gadgets and innovations",
    followers: "1.8M",
    totalBoxes: 15,
    isVerified: true,
    socialLinks: {
      instagram: "@techgurumike",
      youtube: "TechGuruMike",
    },
  },
  {
    id: 3,
    name: "Lifestyle Luna",
    slug: "lifestyle-luna",
    image: "/images/profile3bg.png",
    bannerImage: "/images/profile-banner.jpg",
    badge: "NEW",
    category: "lifestyle",
    description:
      "Lifestyle content creator with amazing picks for modern living",
    followers: "950K",
    totalBoxes: 8,
    isVerified: true,
    socialLinks: {
      instagram: "@lifestyleluna",
      tiktok: "@luna_lifestyle",
    },
  },
  {
    id: 4,
    name: "Ashley Powers",
    slug: "ashley-powers",
    image: "/images/profile2bg.png",
    bannerImage: "/images/profile-banner.jpg",
    badge: "NEW",
    category: "beauty",
    description: "Beauty expert and makeup artist sharing premium beauty finds",
    followers: "3.2M",
    totalBoxes: 18,
    isVerified: true,
    socialLinks: {
      instagram: "@ashleypowers",
      tiktok: "@ashleypowersbeauty",
      youtube: "AshleyPowersBeauty",
    },
  },
  {
    id: 5,
    name: "Gaming Goddess",
    slug: "gaming-goddess",
    image: "/images/profile2bg.png",
    bannerImage: "/images/profile-banner.jpg",
    badge: "POPULAR",
    category: "gaming",
    description:
      "Professional gamer curating the best gaming gear and collectibles",
    followers: "1.5M",
    totalBoxes: 22,
    isVerified: true,
    socialLinks: {
      instagram: "@gaminggoddess",
      twitch: "GamingGoddess",
      youtube: "GamingGoddessOfficial",
    },
  },
  {
    id: 6,
    name: "Fitness Frank",
    slug: "fitness-frank",
    image: "/images/profile3bg.png",
    bannerImage: "/images/profile-banner.jpg",
    badge: "NEW",
    category: "fitness",
    description:
      "Certified trainer sharing the best fitness and health products",
    followers: "800K",
    totalBoxes: 10,
    isVerified: true,
    socialLinks: {
      instagram: "@fitnessfrank",
      youtube: "FitnessFrankOfficial",
    },
  },
  {
    id: 7,
    name: "Big Narstie",
    slug: "big-narstie",
    image: "/images/profile1bg.png",
    bannerImage: "/images/profile-banner.jpg",
    badge: "VERIFIED",
    category: "entertainment",
    description: "Bringing you the hottest entertainment and lifestyle picks",
    followers: "4.1M",
    totalBoxes: 25,
    isVerified: true,
    socialLinks: {
      instagram: "@bignarstie",
      twitter: "@BigNarstie",
      youtube: "BigNarstieTV",
    },
  },
  {
    id: 8,
    name: "Sports Star Sam",
    slug: "sports-star-sam",
    image: "/images/profile2bg.png",
    bannerImage: "/images/profile-banner.jpg",
    badge: "NEW",
    category: "sports",
    description:
      "Professional athlete sharing premium sports gear and collectibles",
    followers: "1.2M",
    totalBoxes: 14,
    isVerified: true,
    socialLinks: {
      instagram: "@sportsstarsam",
      twitter: "@SportsStarSam",
    },
  },
];

// Enhanced mystery boxes with proper categorization and ambassador relationships
export const enhancedMysteryBoxes = [
  {
    id: 1,
    title: "Ultimate Tech Bundle",
    slug: "ultimate-tech-bundle",
    creator: "TechGuru Mike",
    creatorId: 2,
    category: "tech",
    image: "/images/box1.png",
    price: 150,
    originalPrice: 200,
    isNew: true,
    isTrending: true,
    creatorAvatar: "/images/profile2bg.png",
    description:
      "Latest tech gadgets and accessories curated by tech expert Mike",
    totalValue: 500,
    itemCount: 8,
    rarity: "rare",
  },
  {
    id: 2,
    title: "Gaming Legends Box",
    slug: "gaming-legends-box",
    creator: "Gaming Goddess",
    creatorId: 5,
    category: "gaming",
    image: "/images/box1.png",
    price: 125,
    originalPrice: 175,
    isNew: true,
    isTrending: true,
    creatorAvatar: "/images/profile2bg.png",
    description: "Exclusive gaming collectibles and gear for true gamers",
    totalValue: 400,
    itemCount: 6,
    rarity: "epic",
  },
  {
    id: 3,
    title: "Beauty Essentials Pro",
    slug: "beauty-essentials-pro",
    creator: "Ashley Powers",
    creatorId: 4,
    category: "beauty",
    image: "/images/box1.png",
    price: 100,
    originalPrice: 140,
    isNew: true,
    isTrending: false,
    creatorAvatar: "/images/profile1bg.png",
    description: "Premium beauty products handpicked by makeup artist Ashley",
    totalValue: 350,
    itemCount: 10,
    rarity: "rare",
  },
  {
    id: 4,
    title: "Lifestyle Luxury",
    slug: "lifestyle-luxury",
    creator: "Lifestyle Luna",
    creatorId: 3,
    category: "lifestyle",
    image: "/images/box1.png",
    price: 200,
    originalPrice: 250,
    isNew: false,
    isTrending: true,
    creatorAvatar: "/images/profile3bg.png",
    description: "Curated luxury items for the modern lifestyle enthusiast",
    totalValue: 600,
    itemCount: 7,
    rarity: "legendary",
  },
  {
    id: 5,
    title: "Fitness Power Pack",
    slug: "fitness-power-pack",
    creator: "Fitness Frank",
    creatorId: 6,
    category: "fitness",
    image: "/images/box1.png",
    price: 80,
    originalPrice: 120,
    isNew: true,
    isTrending: false,
    creatorAvatar: "/images/profile3bg.png",
    description:
      "Essential fitness gear and supplements for your workout routine",
    totalValue: 250,
    itemCount: 9,
    rarity: "common",
  },
  {
    id: 6,
    title: "Entertainment Exclusive",
    slug: "entertainment-exclusive",
    creator: "Big Narstie",
    creatorId: 7,
    category: "entertainment",
    image: "/images/box1.png",
    price: 175,
    originalPrice: 225,
    isNew: false,
    isTrending: true,
    creatorAvatar: "/images/profile1bg.png",
    description: "Exclusive entertainment memorabilia and collectibles",
    totalValue: 550,
    itemCount: 5,
    rarity: "epic",
  },
  {
    id: 7,
    title: "Sports Champions Box",
    slug: "sports-champions-box",
    creator: "Sports Star Sam",
    creatorId: 8,
    category: "sports",
    image: "/images/box1.png",
    price: 120,
    originalPrice: 160,
    isNew: true,
    isTrending: false,
    creatorAvatar: "/images/profile2bg.png",
    description:
      "Premium sports gear and memorabilia from professional athletes",
    totalValue: 400,
    itemCount: 8,
    rarity: "rare",
  },
  {
    id: 8,
    title: "Celebrity Style Box",
    slug: "celebrity-style-box",
    creator: "Anna & Mandi Vakili",
    creatorId: 1,
    category: "entertainment",
    image: "/images/box1.png",
    price: 160,
    originalPrice: 200,
    isNew: false,
    isTrending: true,
    creatorAvatar: "/images/profile1bg.png",
    description: "Fashion and style items inspired by celebrity trends",
    totalValue: 480,
    itemCount: 6,
    rarity: "epic",
  },
  {
    id: 9,
    title: "Travel Essentials Pro",
    slug: "travel-essentials-pro",
    creator: "Lifestyle Luna",
    creatorId: 3,
    category: "travel",
    image: "/images/box1.png",
    price: 90,
    originalPrice: 130,
    isNew: true,
    isTrending: false,
    creatorAvatar: "/images/profile3bg.png",
    description: "Must-have travel accessories for the modern explorer",
    totalValue: 300,
    itemCount: 12,
    rarity: "common",
  },
  {
    id: 10,
    title: "Crypto Collector's Box",
    slug: "crypto-collectors-box",
    creator: "TechGuru Mike",
    creatorId: 2,
    category: "crypto",
    image: "/images/box1.png",
    price: 250,
    originalPrice: 300,
    isNew: false,
    isTrending: true,
    creatorAvatar: "/images/profile2bg.png",
    description: "Exclusive crypto-themed collectibles and hardware wallets",
    totalValue: 750,
    itemCount: 4,
    rarity: "legendary",
  },
];

// Helper functions for data filtering and searching
export const filterBoxesByCategory = (boxes, categoryId) => {
  if (categoryId === "all") return boxes;
  return boxes.filter((box) => box.category === categoryId);
};

export const filterBoxesByCreator = (boxes, shop) => {
  if (!Array.isArray(boxes) || !shop?.products) return [];

  // Extract product IDs from shop.products
  const productIds = shop.products;
  // console.log(productIds, "Ambassador Prodcut Ids");

  // Filter boxes whose _id is in shop's productIds
  const matchBoxes = boxes.filter((box, id) => {
    // console.log(box._id, id);
    if (productIds.includes(box._id)) {
      // console.log(box._id, "Check when it comes");
      return box;
    }
  });
  return matchBoxes;
};

export const searchBoxes = (boxes, searchTerm) => {
  if (!searchTerm) return boxes;
  const term = searchTerm.toLowerCase();
  return boxes.filter(
    (box) =>
      box.title.toLowerCase().includes(term) ||
      box.creator.toLowerCase().includes(term) ||
      box.description.toLowerCase().includes(term)
  );
};

export const sortBoxes = (boxes, sortBy) => {
  switch (sortBy) {
    case "newest":
      return [...boxes].sort((a, b) => b.id - a.id);
    case "price-low-high":
      return [...boxes].sort((a, b) => a.price - b.price);
    case "price-high-low":
      return [...boxes].sort((a, b) => b.price - a.price);
    case "most-popular":
    default:
      return [...boxes].sort(
        (a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0)
      );
  }
};

export const filterAmbassadorsByCategory = (ambassadors, categoryId) => {
  if (categoryId === "all") return ambassadors;
  return ambassadors.filter((ambassador) => ambassador.category === categoryId);
};

export const searchAmbassadors = (ambassadors, searchTerm) => {
  if (!searchTerm) return ambassadors;
  const term = searchTerm.toLowerCase();
  return ambassadors.filter(
    (ambassador) =>
      ambassador.name.toLowerCase().includes(term) ||
      ambassador.description.toLowerCase().includes(term)
  );
};
