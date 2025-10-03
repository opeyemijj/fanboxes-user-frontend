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
