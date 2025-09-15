import { useState, useEffect } from "react";
import { fetchWalletBalanceAndHistory } from "@/services/profile";

const HeaderWalletBalance = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const response = await fetchWalletBalanceAndHistory();
        console.log("Wallet balance response:", response);

        if (!response.success) {
          throw new Error("Failed to fetch balance data");
        }

        const data = await response.data;

        setBalanceData(data);
      } catch (err) {
        // setError(err.message);
        setError("Error fetching balance");
        console.error("Error fetching balance:", err);
      } finally {
        setLoading(false);
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

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <span className="font-semibold">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="px-2">
      <span className="font-semibold">
        {balanceData.balance.availableBalance.toLocaleString()}
      </span>
    </div>
  );
};

export default HeaderWalletBalance;
