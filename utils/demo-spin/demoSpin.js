import { ProvablyFair } from "./provably-fair"; // Adjust import path as needed

export const createDemoSpinFrontend = async (
  boxDetails,
  user = null,
  requestData = {}
) => {
  try {
    const boxId = requestData.boxId || boxDetails?._id;
    const clientSeed =
      requestData.clientSeed || ProvablyFair.generateClientSeed();

    if (!boxDetails) {
      throw new Error("We couldn't find the box you're looking for.");
    }

    if (!boxDetails?.items || boxDetails?.items.length === 0) {
      throw new Error("This box is currently empty.");
    }

    // Generate fake server seed & nonce
    const serverSeed = ProvablyFair.generateServerSeed();
    const nonce = 1; // always 1 in demo, since no persistent spins

    // Use demo generator
    const result = await ProvablyFair.generateDemoSpinResult(
      serverSeed,
      clientSeed,
      nonce,
      boxDetails.items
    );

    console.log("🎰 Demo spin result:", result);
    if (!result.winningItem) {
      throw new Error("Failed to generate demo spin. Please try again.");
    }

    const demoSpinData = {
      boxId,
      boxDetails: {
        _id: boxDetails._id,
        name: boxDetails.name,
        slug: boxDetails.slug,
        images: boxDetails.images,
        items: boxDetails?.items,
        priceSale: boxDetails?.priceSale,
      },
      userId: user?._id || null,
      userDetails: {
        _id: user?._id || null,
        firstName: user?.firstName || null,
        lastName: user?.lastName || null,
        gender: user?.gender || null,
      },
      shopDetails: boxDetails.shopDetails,
      winningItem: result.winningItem,
      nonce,
      clientSeed,
      serverSeed,
      serverSeedHash: ProvablyFair.hashServerSeed(serverSeed),
      normalized: result.normalized,
      hash: result.hash,
      oddsMap: result.oddsMap,
    };

    return {
      success: true,
      data: demoSpinData,
      availableBalance: null, // no debit in demo
    };
  } catch (error) {
    console.error("Error in createDemoSpinFrontend:", error);

    return {
      success: false,
      message: error.message,
      errorCode: "DEMO_SPIN_ERROR",
    };
  }
};

// Usage example:
/*
const demoSpinResult = await createDemoSpinFrontend(
  boxDetails, // Pass the box details you already have
  currentUser, // Optional: user object
  {
    boxId: "someBoxId", // Optional
    clientSeed: "customClientSeed" // Optional
  }
);
*/
