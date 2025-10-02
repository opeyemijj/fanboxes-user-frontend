// "use client";
// import Header from "@/components/_main/Header";
// import AmbassadorProfile from "@/components/_main/AmbassadorProfile";
// import AmbassadorBoxes from "@/components/_main/AmbassadorBoxes";
// import AmbassadorTopSidebar from "@/components/_main/AmbassadorTopSidebar";
// import YouMightLike from "@/components/_main/YouMightLike";
// import Footer from "@/components/_main/Footer";
// import { filterBoxesByCreator } from "@/lib/enhanced-data";
// import { notFound } from "next/navigation";
// import { useSelector, useDispatch } from "react-redux";
// import { useState, useEffect } from "react";
// import { incrementVisitCount } from "@/services/influencer/index";
// import { fetchShops } from "@/redux/slices/shops";
// import { fetchCategories } from "@/redux/slices/categories";
// import { fetchProducts } from "@/redux/slices/product";

// export default function AmbassadorProfilePage({ params }) {
//   const dispatch = useDispatch();
//   const [isClient, setIsClient] = useState(false);

//   const {
//     shops,
//     loading: shopsLoading,
//     error: shopsError,
//   } = useSelector((state) => state.shops);

//   const user = useSelector((state) => state?.user?.user || null);

//   const {
//     products,
//     loading: productsLoading,
//     error: productsError,
//   } = useSelector((state) => state.product);

//   // Ensure we only render client-specific content after hydration
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Fetch data on component mount
//   useEffect(() => {
//     dispatch(fetchShops());
//     dispatch(fetchCategories());
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   const ambassador = shops?.find((amb) => amb?.slug === params?.slug);

//   // Call the API when the component mounts and ambassador is available
//   useEffect(() => {
//     if (ambassador && params?.slug) {
//       try {
//         incrementVisitCount(params.slug);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   }, [ambassador, params?.slug]);

//   // Show loading during SSR and initial client render
//   if (!isClient || (!shops?.length && shopsLoading)) {
//     return (
//       <div className="bg-white text-black min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div
//             className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
//             style={{ borderColor: "#11F2EB" }}
//           ></div>
//           <p className="text-gray-600">Please wait...</p>
//         </div>
//       </div>
//     );
//   }

//   // If we have shops data but ambassador is not found, call notFound
//   if (shops?.length && !ambassador) {
//     notFound();
//   }

//   // If no shops data and not loading, show loading
//   if (!shops?.length && !shopsLoading) {
//     return (
//       <div className="bg-white text-black min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div
//             className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
//             style={{ borderColor: "#11F2EB" }}
//           ></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // If we still don't have an ambassador at this point, show loading
//   if (!ambassador) {
//     return (
//       <div className="bg-white text-black min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div
//             className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
//             style={{ borderColor: "#11F2EB" }}
//           ></div>
//           <p className="text-gray-600">Please wait...</p>
//         </div>
//       </div>
//     );
//   }

//   // Get ambassador's boxes - will update automatically when products state changes
//   const ambassadorBoxes = filterBoxesByCreator(products, ambassador);

//   return (
//     <div className="bg-white text-black">
//       <Header />
//       <main className="pt-20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="relative w-full h-[300px] bg-gradient-to-r from-yellow-400 to-orange-400 overflow-hidden rounded-lg">
//             <div
//               className="absolute inset-0 bg-cover bg-center"
//               style={{
//                 backgroundImage: `url(${ambassador?.cover?.url})`,
//               }}
//             />
//             <div className="absolute inset-0 bg-black/20" />
//           </div>
//         </div>
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
//           <div className="flex flex-col lg:flex-row gap-8 relative z-10">
//             <div className="w-full lg:w-2/3 xl:w-3/4">
//               <AmbassadorProfile ambassador={ambassador} userId={user._id} />
//               {ambassador && ambassadorBoxes?.length > 0 && (
//                 <AmbassadorBoxes
//                   ambassador={ambassador}
//                   boxes={ambassadorBoxes}
//                 />
//               )}
//             </div>
//             <div className="w-full lg:w-1/3 xl:w-1/4">
//               {ambassador && ambassadorBoxes?.length > 0 && (
//                 <AmbassadorTopSidebar
//                   ambassador={ambassador}
//                   boxes={ambassadorBoxes}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//         <YouMightLike />
//       </main>
//       <Footer />
//     </div>
//   );
// }

// app/ambassador/[slug]/page.js (Server Component - NO "use client")
import AmbassadorPageClient from "./AmbassadorPageClient";
import { notFound } from "next/navigation";

// Helper function to fetch ambassador data on server
async function getAmbassadorData(slug) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

    // Remove trailing slash if present
    const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;

    console.log(`Fetching ambassador from: ${baseUrl}/shops/${slug}`);

    const response = await fetch(`${baseUrl}/shops/${slug}`, {
      cache: "no-store", // Always fetch fresh data for dynamic content
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Handle different API response structures
    // If your API returns { success: true, data: {...} }
    if (data.success && data.data) {
      return data.data;
    }

    // If your API returns { shop: {...} }
    if (data.shop) {
      return data.shop;
    }

    // If your API returns the shop object directly
    return data;
  } catch (error) {
    console.error("Error fetching ambassador:", error);
    return null;
  }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }) {
  const ambassador = await getAmbassadorData(params.slug);

  if (!ambassador) {
    return {
      title: "Ambassador Not Found | FanBox",
      description: "The ambassador profile you're looking for doesn't exist.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fanbox.com";
  const pageUrl = `${baseUrl}/ambassador/${params.slug}`;

  return {
    title: `${ambassador.title}'s Profile | FanBox | nw`,
    description:
      ambassador.description ||
      `Check out ${ambassador.title}'s exclusive boxes and profile on FanBox`,
    keywords: `${ambassador.title}, FanBox, mystery boxes, influencer`,
    authors: [{ name: ambassador.title }],
    openGraph: {
      title: `${ambassador.title}'s Profile | FanBox`,
      description:
        ambassador.description ||
        `Check out ${ambassador.title}'s exclusive boxes and profile on FanBox`,
      images: [
        {
          url: ambassador.logo?.url || `${baseUrl}/default-share-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${ambassador.title}'s profile picture`,
        },
        // Add cover image as second option
        ...(ambassador.cover?.url
          ? [
              {
                url: ambassador.cover.url,
                width: 1200,
                height: 630,
                alt: `${ambassador.title}'s cover image`,
              },
            ]
          : []),
      ],
      url: pageUrl,
      type: "profile",
      siteName: "FanBox",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${ambassador.title}'s Profile | FanBox`,
      description:
        ambassador.description ||
        `Check out ${ambassador.title}'s exclusive boxes and profile on FanBox`,
      images: [ambassador.logo?.url || `${baseUrl}/default-share-image.jpg`],
      creator: ambassador.twitterHandle || "@FanBox",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

// Main Server Component
export default async function AmbassadorPage({ params }) {
  // Fetch ambassador data on the server
  const ambassador = await getAmbassadorData(params.slug);

  // If ambassador not found, show 404
  if (!ambassador) {
    notFound();
  }

  // Pass the ambassador data to client component
  // Client component will handle Redux and other client-side operations
  return (
    <AmbassadorPageClient params={params} initialAmbassador={ambassador} />
  );
}
