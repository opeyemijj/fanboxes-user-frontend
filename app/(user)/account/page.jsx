"use client";
import TransactionsListing from "@/components/_main/Transactions/TransactionsListing";
import ModernTabs from "@/components/modern-tabs";
import Footer from "@/components/_main/Footer";
import Header from "@/components/_main/Header";
import SpinListing from "@/components/_main/SpinHistory/SpinListing";
import AddressDetailsView from "@/components/_main/AddressDetails/AddressDetailsView";
import OrderListing from "@/components/_main/OrderHistory/OrderListing";
import Profile from "@/components/_main/Profile";
import AccountSettings from "@/components/_main/AccountSettings";
import { useSelector } from "react-redux";
import { GameProvider, useGameContext } from "@/contexts/gameContext";

const SpinListingGameWrapper = () => {
  const { resellRule, cashToCreditConvRate } = useGameContext();
  return (
    <SpinListing
      resellRule={resellRule}
      cashToCreditConvRate={cashToCreditConvRate}
    />
  );
};

const Account = () => {
  const user = useSelector((state) => state?.user?.user || null);
  const tabList = [
    {
      tabName: "Profile",
      queryId: "profile",
      activeUrlElement: "/profile",
      component: <Profile user={user} />,
    },
    {
      tabName: "Address Details",
      queryId: "address",
      activeUrlElement: "/address-details",
      component: <AddressDetailsView user={user} />,
    },
    {
      tabName: "My Orders",
      queryId: "orders",
      activeUrlElement: "/orders",
      component: <OrderListing />,
    },
    {
      tabName: "Spin History",
      queryId: "spins",
      activeUrlElement: "/spins",
      component: <SpinListingGameWrapper />,
    },
    {
      tabName: "Transaction History",
      queryId: "transactions",
      activeUrlElement: "/transactions",
      component: <TransactionsListing />,
    },
    {
      tabName: "Account Settings",
      queryId: "settings",
      activeUrlElement: "/settings",
      component: <AccountSettings user={user} />,
    },
  ];

  return (
    <GameProvider>
      <div>
        <Header />
        <div className="bg-gray-50 min-h-screen mt-10 py-10">
          <div className="container mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-16">
            <ModernTabs tabList={tabList} />
          </div>
        </div>
        <Footer />
      </div>
    </GameProvider>
  );
};

export default Account;
