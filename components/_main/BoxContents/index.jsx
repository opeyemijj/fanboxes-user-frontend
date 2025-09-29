import Image from "next/image";
import { Button } from "@/components/Button";
import BoxContentsSkeleton from "@/components/ui/skeletons/BoxContentsSkeleton";
import { useState, useEffect } from "react";
import { X, ShoppingCart, Hexagon, ChevronDown, ChevronUp } from "lucide-react";
import { useGameContext } from "@/contexts/gameContext";
import ClientSeedModal from "@/components/_main/BoxSpinner/ClientSeedModal";
import { useDispatch } from "react-redux";
import { addItemToCart2 } from "@/redux/slices/cartOrder";
import { useRouter } from "next/navigation";

export default function BoxContents({ box, loading = false }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [spinRecordId, setSpinRecordId] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [spinResultData, setSpinResultData] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    // States
    gameState,
    clientSeed,
    createSpinApiError,

    // Setters
    setCreateSpinApiError,

    // Functions
    handleSpin,
    generateAndSetClientSeed,
  } = useGameContext();

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showPopup]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
    setShowFullDescription(false); // Reset description state when opening new item
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
    setShowFullDescription(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  const handleSpinForBtnClicked = async () => {
    // setShowPopup(false);
    // // Show seed verification modal
    // setShowSeedModal(true);
    // // Call handleSpin with true to get the spin result data
    // const result = await handleSpin(true);
    // if (result && result._id) {
    //   setSpinRecordId(result._id);
    // }
    // setSpinResultData(result);

    setShowPopup(false);
    scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Function to truncate description
  const truncateDescription = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (loading) {
    return <BoxContentsSkeleton />;
  }

  function handleAddToCart(item) {
    console.log("add to cart...");
    const payload = { item, quantity: 1 };
    dispatch(addItemToCart2(payload));
    router.push("/cart");
  }

  return (
    <>
      <div className="container mx-auto mb-4 px-5">
        <section className="bg-[#EFEFEF] py-8 rounded-lg">
          <div className="px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">What's in the box...</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {box?.prizeItems
                ?.slice()
                .sort((a, b) => (b.value || 0) - (a.value || 0))
                ?.map((item) => (
                  <div
                    key={item._id}
                    className="group cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm aspect-[4/3] relative flex">
                      <div className="relative bg-white p-4 flex-1 flex items-center justify-center">
                        {!box?.isItemOddsHidden && item.odd && (
                          <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out md:opacity-0 md:group-hover:opacity-100 z-50">
                            {item.odd}
                          </div>
                        )}
                        <Image
                          src={item?.images[0]?.url || "/placeholder.svg"}
                          alt={item.name}
                          width={200}
                          height={150}
                          className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
                        />
                        <div className="absolute top-2 left-2 bg-gray-900/50 text-white text-xs font-semibold px-2 py-1 rounded-full transition-all duration-300 ease-in-out group-hover:bg-gray-900/70">
                          ${item.value?.toLocaleString() || "0"}
                        </div>
                        <Button className="absolute bottom-4 right-4 bg-black/80 text-white rounded-full h-6 w-20 text-xs transition-all duration-300 ease-in-out flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 group-hover:bg-black">
                          VIEW →
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm transition-colors duration-300">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-700">
                          {item.brand}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>

      {/* Item Detail Popup - Optimized for mobile */}
      {showPopup && selectedItem && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-70"
          onClick={handleBackdropClick}
        >
          <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Mobile Layout (stacked) */}
            <div className="lg:hidden">
              {/* Image at top */}
              <div className="relative h-56 bg-gray-50 p-6">
                <Image
                  src={selectedItem?.images[0]?.url || "/placeholder.svg"}
                  alt={selectedItem.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Content below image */}
              <div className="p-6">
                {/* Product Title and Brand */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedItem.name}
                  </h2>
                  {selectedItem.brand && (
                    <p className="text-gray-600 text-md">
                      {selectedItem.brand}
                    </p>
                  )}
                </div>

                {/* Price and Status in a row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <p className="text-xl font-bold text-gray-900">
                    ${selectedItem.value?.toLocaleString() || "0"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
                      100% AUTHENTIC
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-full">
                      IN STOCK
                    </span>
                    {!box?.isItemOddsHidden && selectedItem.odd && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1.5 rounded-full">
                        {selectedItem.odd} ODDS
                      </span>
                    )}
                  </div>
                </div>

                {/* Description with See More */}
                {selectedItem.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      Description
                    </h3>
                    <div className="relative">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {showFullDescription
                          ? selectedItem.description
                          : truncateDescription(selectedItem.description)}
                      </p>
                      {selectedItem.description.length > 150 && (
                        <button
                          onClick={toggleDescription}
                          className="text-[#11F2EB] font-medium text-sm mt-2 flex items-center gap-1 hover:underline"
                        >
                          {showFullDescription ? "See Less" : "See More"}
                          {showFullDescription ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-3.5 text-base rounded-lg flex items-center justify-center gap-2"
                    onClick={() => handleAddToCart(selectedItem)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    ADD TO CART
                  </Button>
                  {selectedItem?.value >= box?.priceSale && (
                    <Button
                      className="w-full bg-[#11F2EB] hover:bg-[#0EDFD9] text-black font-semibold py-3.5 text-base rounded-lg flex items-center justify-center gap-2"
                      onClick={handleSpinForBtnClicked}
                    >
                      <Hexagon className="h-5 w-5" />
                      SPIN FOR ×{box?.priceSale?.toLocaleString() || "0"}
                    </Button>
                  )}
                  <button
                    onClick={closePopup}
                    className="w-full text-gray-600 font-medium py-2.5 text-base hover:text-gray-800 transition-colors"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout (side by side) */}
            <div className="hidden lg:flex">
              {/* Content Section - Left Side */}
              <div className="flex-1 p-8">
                {/* Product Title and Brand */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedItem.name}
                  </h2>
                  {selectedItem.brand && (
                    <p className="text-gray-600 text-lg">
                      {selectedItem.brand}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="mb-5">
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedItem.value?.toLocaleString() || "0"}
                  </p>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
                    100% AUTHENTIC
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-full">
                    IN STOCK
                  </span>
                  {!box?.isItemOddsHidden && selectedItem.odd && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1.5 rounded-full">
                      {selectedItem.odd} ODDS
                    </span>
                  )}
                </div>

                {/* Description with See More */}
                {selectedItem.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      Description
                    </h3>
                    <div className="relative">
                      <div
                        className={`text-gray-600 text-sm leading-relaxed ${
                          !showFullDescription ? "max-h-24 overflow-hidden" : ""
                        }`}
                      >
                        {selectedItem.description}
                      </div>
                      {selectedItem.description.length > 200 && (
                        <button
                          onClick={toggleDescription}
                          className="text-[#11F2EB] font-medium text-sm mt-2 flex items-center gap-1 hover:underline"
                        >
                          {showFullDescription ? "See Less" : "See More"}
                          {showFullDescription ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-3.5 text-base rounded-lg flex items-center justify-center gap-2"
                    onClick={() => handleAddToCart(selectedItem)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    ADD TO CART
                  </Button>
                  {selectedItem?.value >= box?.priceSale && (
                    <Button
                      className="w-full bg-[#11F2EB] hover:bg-[#0EDFD9] text-black font-semibold py-3.5 text-base rounded-lg flex items-center justify-center gap-2"
                      onClick={handleSpinForBtnClicked}
                    >
                      <Hexagon className="h-5 w-5" />
                      SPIN FOR ×{box?.priceSale?.toLocaleString() || "0"}
                    </Button>
                  )}
                  {/* <button
                    onClick={closePopup}
                    className="w-full text-gray-600 font-medium py-2.5 text-base hover:text-gray-800 transition-colors"
                  >
                    CLOSE
                  </button> */}
                </div>
              </div>

              {/* Image Section - Right Side */}
              <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center">
                <div className="relative w-full h-80">
                  <Image
                    src={selectedItem?.images[0]?.url || "/placeholder.svg"}
                    alt={selectedItem.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ClientSeedModal
        onSpin={handleSpin}
        isWaitingForResult={gameState === "waiting"}
        createSpinApiError={createSpinApiError}
        setCreateSpinApiError={setCreateSpinApiError}
        generateAndSetClientSeed={generateAndSetClientSeed}
        clientSeed={clientSeed}
        showSeedModal={showSeedModal}
        setShowSeedModal={setShowSeedModal}
        spinResultData={spinResultData}
        setSpinResultData={setSpinResultData}
        setCopiedField={setCopiedField}
        copiedField={copiedField}
        spinRecordId={spinRecordId}
      />
    </>
  );
}
