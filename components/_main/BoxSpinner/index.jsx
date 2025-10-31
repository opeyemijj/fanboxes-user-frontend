"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import Link from "next/link";
import PrizePopup from "../PrizePopup";

import FanboxGame from "./FanboxGame";
// import boxConfig from "../data/box-config.json";
import { followShop, getInfluencer } from "../../../services/index";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import LoadingSpinner from "../../ui/LoadingSpinner";
function SpinGame({ boxConfig }) {
  // console.log("boxConfig", boxConfig);
  return <FanboxGame boxConfig={boxConfig} />;
}

export default function BoxSpinner({ box }) {
  box.prizeItems = box?.items || [];
  console.log({ box });
  const [isFollowing, setIsFollowing] = useState(false);
  const [showPrizePopup, setShowPrizePopup] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [ambassador, setAmbassador] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state?.user?.user || null);

  // Get ambasaador
  const getAmbassadorData = async () => {
    const response = await getInfluencer(box.shop);

    if (!response?.data) return setIsLoading(false);;

    let _ambassadorFollowers = response?.data?.followers || [];

    setIsFollowing(_ambassadorFollowers.includes(user?._id) ? true : false);
    setAmbassador(response?.data);
    setIsLoading(false);

  };

  useEffect(() => {
    getAmbassadorData();
  }, [box, user]);

  const closePrizePopup = () => {
    setShowPrizePopup(false);
    setSelectedPrize(null);
  };

  //@  Hit the follwo button
  const onFollowHandler = async () => {
    setIsLoading(true);
    await followShop(box.shop);
    getAmbassadorData();
  };

  console.log("isFollowing", isFollowing);

  return (
    <>
      <div className="container mx-auto px-5">
        {/* Ambassador Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 px-3 sm:px-4 lg:px-8 mt-4 sm:py-0 mb-8 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#11F2EB] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src={box?.shopDetails?.logo?.url || "/favicon.png"}
                alt={box?.name}
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              {box?.name}
              </h1>
              {box?.name && (
                <p className="text-gray-500 text-sm sm:text-base mt-1">
                  

                  {box?.shopDetails?.title ? (
                  <>{box?.shopDetails?.title}</>
                ) : (
                  "Fanboxes box"
                )}
                </p>
              )}
            </div>
          </div>
          {box?.shopDetails && (
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
              <Button
                onClick={onFollowHandler}
                variant="outline"
                className="bg-gray-100 border-gray-200 rounded-full text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {!isFollowing ? (
                      <>
                        <span className="mr-1 sm:mr-2 text-xs">🔔</span>
                        {"GET UPDATES"}
                      </>
                    ) : (
                      <>{"Following"}</>
                    )}
                  </>
                )}
              </Button>
              <Link href={`/ambassadors/${box?.shopDetails?.slug}`}>
                <Button
                  variant="outline"
                  className="bg-gray-100 border-gray-200 rounded-full text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                >
                  VIEW PROFILE
                  <span className="ml-1 sm:ml-2 text-xs">→</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Spinning Area */}

        <SpinGame boxConfig={box} />
      </div>

      {/* Prize Popup */}
      <PrizePopup
        isOpen={showPrizePopup}
        onClose={closePrizePopup}
        prize={selectedPrize}
        spinCost={box?.spinCost}
      />
    </>
  );
}
