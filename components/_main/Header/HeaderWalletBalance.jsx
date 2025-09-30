"use client";
import { useState, useEffect } from "react";
import { fetchWalletBalanceAndHistory } from "@/services/profile";
import { useRouter } from "next/navigation";
import { toastError, toastWarning } from "@/lib/toast";
import { useSelector, useDispatch } from "react-redux";
import { updateUserAvailableBalance } from "@/redux/slices/user";

const HeaderWalletBalance = ({ handleLogout, availableBalance }) => {
  const [balanceData, setBalanceData] = useState(availableBalance || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetchWalletBalanceAndHistory();
        // console.log("Wallet balance response:", response);

        if (!response.success) {
          throw new Error("Failed to fetch balance data");
        }

        const data = await response.data;
        dispatch(updateUserAvailableBalance(data?.balance?.availableBalance));

        // setBalanceData(data);
      } catch (err) {
        // setError("Error fetching balance");
        console.error("Error fetching balance:", err.response);
        if (
          err?.response &&
          err.response.status === 401 &&
          err.response.statusText === "Unauthorized"
        ) {
          // toastWarning("Session Expired, please login");
          handleLogout();
        }
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#11F2EB]"></div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="pr-1 text-red-500">
  //       <span className="font-medium">{error}</span>
  //     </div>
  //   );
  // }

  return (
    <div className="pr-1">
      <span className="font-semibold">
        {availableBalance?.toLocaleString()}
      </span>
    </div>
  );
};

export default HeaderWalletBalance;
