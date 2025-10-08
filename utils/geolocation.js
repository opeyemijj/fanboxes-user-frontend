import countries from "@/lib/countries.json";

export default async function getLocation() {
  const googleMapsApiKey = "AIzaSyCMz6guXd2jaA6G37b0ejsUrMl88r0cB5Y";
  try {
    // Using Google's Geolocation API (requires device location permissions)
    const res = await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${googleMapsApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          considerIp: true, // Fallback to IP-based location if device location unavailable
        }),
      }
    );

    const locationData = await res.json();
    // Now get address details using the coordinates
    const geocodeRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationData.location.lat},${locationData.location.lng}&key=${googleMapsApiKey}`
    );

    const geocodeData = await geocodeRes.json();

    // Find country information from the geocode results
    const countryComponent = geocodeData.results[0]?.address_components.find(
      (component) => component.types.includes("country")
    );

    const currentCountry = countries.find(
      (c) => c.code === countryComponent?.short_name
    );

    return {
      country_code: currentCountry?.code || "US",
      name:
        currentCountry?.name ||
        countryComponent?.long_name ||
        "United States of America",
      dial_code: currentCountry?.dial_code || "+1",
      ip: locationData?.ip || "unknown",
      currency_code: currentCountry?.currency || "USD",
    };
  } catch (error) {
    console.error("Google Cloud location fetch failed:", error);
    return {
      country_code: "US",
      name: "United States of America",
      dial_code: "+1",
      ip: "unknown",
      currency_code: "USD",
    };
  }
}
