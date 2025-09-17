// "use client";
// import { useState, useEffect, useCallback, useRef } from "react";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import {
//   FileText,
//   User,
//   MapPin,
//   RotateCcw,
//   CreditCard,
//   ShoppingBag,
//   Settings,
// } from "lucide-react";
// import UserProfileHeader from "@/components/_main/Account/UserProfileHeader";

// const ModernTabs = ({ tabList }) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const [activeTab, setActiveTab] = useState("");

//   // Ref for the tab container and individual tab buttons
//   const tabContainerRef = useRef(null);
//   const tabRefs = useRef({});

//   // Get the first tab's identifier as default
//   const defaultTab = tabList[0]?.queryId || "";

//   // Get tab icons
//   const getTabIcon = useCallback((tabName) => {
//     const iconMap = {
//       Profile: <User className="w-4 h-4" />,
//       "Address Details": <MapPin className="w-4 h-4" />,
//       "My Orders": <ShoppingBag className="w-4 h-4" />,
//       "Spin History": <RotateCcw className="w-4 h-4" />,
//       "Transaction History": <CreditCard className="w-4 h-4" />,
//       "Account Settings": <Settings className="w-4 h-4" />,
//     };
//     return iconMap[tabName] || <FileText className="w-4 h-4" />;
//   }, []);

//   // Function to scroll active tab into view
//   const scrollActiveTabIntoView = useCallback((tabQueryId) => {
//     const activeTabElement = tabRefs.current[tabQueryId];
//     const container = tabContainerRef.current;

//     if (activeTabElement && container) {
//       // Use a small delay to ensure the DOM has updated
//       setTimeout(() => {
//         const containerRect = container.getBoundingClientRect();
//         const tabRect = activeTabElement.getBoundingClientRect();

//         // Calculate if the tab is outside the visible area
//         const isTabVisible =
//           tabRect.left >= containerRect.left &&
//           tabRect.right <= containerRect.right;

//         if (!isTabVisible) {
//           // Calculate scroll position to center the active tab
//           const containerScrollLeft = container.scrollLeft;
//           const tabOffsetLeft = activeTabElement.offsetLeft;
//           const tabWidth = activeTabElement.offsetWidth;
//           const containerWidth = container.offsetWidth;

//           // Center the tab in the container
//           const targetScrollLeft =
//             tabOffsetLeft - containerWidth / 2 + tabWidth / 2;

//           container.scrollTo({
//             left: Math.max(0, targetScrollLeft),
//             behavior: "smooth",
//           });
//         }
//       }, 50);
//     }
//   }, []);

//   // Determine active tab based on query parameter
//   useEffect(() => {
//     const tabQueryParam = searchParams.get("tab");
//     const isValidTab = tabList.some((tab) => tab.queryId === tabQueryParam);

//     if (isValidTab) {
//       setActiveTab(tabQueryParam);
//       // Scroll the active tab into view
//       scrollActiveTabIntoView(tabQueryParam);
//     } else {
//       // Set default tab and update URL if no valid tab is found
//       setActiveTab(defaultTab);

//       // Only update URL if we're not already on the default tab
//       if (tabQueryParam !== defaultTab) {
//         const params = new URLSearchParams(searchParams.toString());
//         params.set("tab", defaultTab);
//         router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//       }

//       // Scroll the default tab into view
//       scrollActiveTabIntoView(defaultTab);
//     }
//   }, [
//     searchParams,
//     tabList,
//     defaultTab,
//     pathname,
//     router,
//     scrollActiveTabIntoView,
//   ]);

//   // Handle tab click - Update query string
//   const handleTabClick = useCallback(
//     (tab) => {
//       const params = new URLSearchParams(searchParams.toString());
//       params.set("tab", tab.queryId);

//       // Use replace instead of push to avoid adding to browser history
//       router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//       setActiveTab(tab.queryId);

//       // Scroll the clicked tab into view
//       scrollActiveTabIntoView(tab.queryId);
//     },
//     [searchParams, pathname, router, scrollActiveTabIntoView]
//   );

//   // Get active tab component
//   const activeTabData = tabList.find((tab) => tab.queryId === activeTab);

//   // Empty state component
//   const EmptyState = useCallback(
//     ({ tabName }) => (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12">
//         <div className="text-center max-w-md mx-auto">
//           <div className="w-16 h-16 bg-gradient-to-br from-[#11F2EB]/10 to-[#11F2EB]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
//             {getTabIcon(tabName)}
//           </div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-3">
//             {tabName} Coming Soon
//           </h3>
//           <p className="text-gray-600 leading-relaxed">
//             We're working hard to bring you the {tabName.toLowerCase()} section.
//             Stay tuned for updates!
//           </p>
//           <div className="mt-6 inline-flex items-center px-4 py-2 bg-[#11F2EB]/10 text-[#11F2EB] rounded-lg text-sm font-medium">
//             <div className="w-2 h-2 bg-[#11F2EB] rounded-full mr-2 animate-pulse"></div>
//             In Development
//           </div>
//         </div>
//       </div>
//     ),
//     [getTabIcon]
//   );

//   return (
//     <div className="w-full">
//       {/* User Profile Header */}
//       <UserProfileHeader />

//       {/* Tab Navigation */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
//         <div className="relative">
//           {/* Tab List */}
//           <div
//             ref={tabContainerRef}
//             className="flex overflow-x-auto scrollbar-hide"
//           >
//             {tabList.map((tab, index) => {
//               const isActive = activeTab === tab.queryId;
//               return (
//                 <button
//                   key={index}
//                   ref={(el) => {
//                     tabRefs.current[tab.queryId] = el;
//                   }}
//                   onClick={() => handleTabClick(tab)}
//                   className={`
//                     relative flex items-center space-x-2 px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap
//                     transition-all duration-200 ease-in-out min-w-0 flex-shrink-0
//                     ${
//                       isActive
//                         ? "text-[#11F2EB] bg-[#11F2EB]/5"
//                         : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                     }
//                   `}
//                 >
//                   <span
//                     className={`transition-colors duration-200 ${
//                       isActive ? "text-[#11F2EB]" : "text-gray-400"
//                     }`}
//                   >
//                     {getTabIcon(tab.tabName)}
//                   </span>
//                   <span className="truncate">{tab.tabName}</span>

//                   {/* Active indicator line */}
//                   {isActive && (
//                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] rounded-full"></div>
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Bottom border for inactive tabs */}
//           <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
//         </div>
//       </div>

//       {/* Tab Content */}
//       <div className="min-h-[400px]">
//         {activeTabData?.component ? (
//           <div className="animate-in fade-in-50 duration-200">
//             {activeTabData.component}
//           </div>
//         ) : (
//           <div className="animate-in fade-in-50 duration-200">
//             <EmptyState tabName={activeTabData?.tabName || "Content"} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ModernTabs;

"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  FileText,
  User,
  MapPin,
  RotateCcw,
  CreditCard,
  ShoppingBag,
  Settings,
} from "lucide-react";
import UserProfileHeader from "@/components/_main/Account/UserProfileHeader";

// Loading component for the suspense fallback
const TabsLoading = () => (
  <div className="w-full">
    <UserProfileHeader />
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
      <div className="flex space-x-1 p-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-12 bg-gray-200 rounded animate-pulse flex-1"
          />
        ))}
      </div>
    </div>
    <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
  </div>
);

// The actual tabs component (unchanged logic)
const ModernTabsContent = ({ tabList }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("");

  // Ref for the tab container and individual tab buttons
  const tabContainerRef = useRef(null);
  const tabRefs = useRef({});

  // Get the first tab's identifier as default
  const defaultTab = tabList[0]?.queryId || "";

  // Get tab icons
  const getTabIcon = useCallback((tabName) => {
    const iconMap = {
      Profile: <User className="w-4 h-4" />,
      "Address Details": <MapPin className="w-4 h-4" />,
      "My Orders": <ShoppingBag className="w-4 h-4" />,
      "Spin History": <RotateCcw className="w-4 h-4" />,
      "Transaction History": <CreditCard className="w-4 h-4" />,
      "Account Settings": <Settings className="w-4 h-4" />,
    };
    return iconMap[tabName] || <FileText className="w-4 h-4" />;
  }, []);

  // Function to scroll active tab into view
  const scrollActiveTabIntoView = useCallback((tabQueryId) => {
    const activeTabElement = tabRefs.current[tabQueryId];
    const container = tabContainerRef.current;

    if (activeTabElement && container) {
      // Use a small delay to ensure the DOM has updated
      setTimeout(() => {
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeTabElement.getBoundingClientRect();

        // Calculate if the tab is outside the visible area
        const isTabVisible =
          tabRect.left >= containerRect.left &&
          tabRect.right <= containerRect.right;

        if (!isTabVisible) {
          // Calculate scroll position to center the active tab
          const containerScrollLeft = container.scrollLeft;
          const tabOffsetLeft = activeTabElement.offsetLeft;
          const tabWidth = activeTabElement.offsetWidth;
          const containerWidth = container.offsetWidth;

          // Center the tab in the container
          const targetScrollLeft =
            tabOffsetLeft - containerWidth / 2 + tabWidth / 2;

          container.scrollTo({
            left: Math.max(0, targetScrollLeft),
            behavior: "smooth",
          });
        }
      }, 50);
    }
  }, []);

  // Determine active tab based on query parameter
  useEffect(() => {
    const tabQueryParam = searchParams.get("tab");
    const isValidTab = tabList.some((tab) => tab.queryId === tabQueryParam);

    if (isValidTab) {
      setActiveTab(tabQueryParam);
      // Scroll the active tab into view
      scrollActiveTabIntoView(tabQueryParam);
    } else {
      // Set default tab and update URL if no valid tab is found
      setActiveTab(defaultTab);

      // Only update URL if we're not already on the default tab
      if (tabQueryParam !== defaultTab) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", defaultTab);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }

      // Scroll the default tab into view
      scrollActiveTabIntoView(defaultTab);
    }
  }, [
    searchParams,
    tabList,
    defaultTab,
    pathname,
    router,
    scrollActiveTabIntoView,
  ]);

  // Handle tab click - Update query string
  const handleTabClick = useCallback(
    (tab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab.queryId);

      // Use replace instead of push to avoid adding to browser history
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setActiveTab(tab.queryId);

      // Scroll the clicked tab into view
      scrollActiveTabIntoView(tab.queryId);
    },
    [searchParams, pathname, router, scrollActiveTabIntoView]
  );

  // Get active tab component
  const activeTabData = tabList.find((tab) => tab.queryId === activeTab);

  // Empty state component
  const EmptyState = useCallback(
    ({ tabName }) => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-[#11F2EB]/10 to-[#11F2EB]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
            {getTabIcon(tabName)}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {tabName} Coming Soon
          </h3>
          <p className="text-gray-600 leading-relaxed">
            We're working hard to bring you the {tabName.toLowerCase()} section.
            Stay tuned for updates!
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-[#11F2EB]/10 text-[#11F2EB] rounded-lg text-sm font-medium">
            <div className="w-2 h-2 bg-[#11F2EB] rounded-full mr-2 animate-pulse"></div>
            In Development
          </div>
        </div>
      </div>
    ),
    [getTabIcon]
  );

  return (
    <div className="w-full">
      {/* User Profile Header */}
      <UserProfileHeader />

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden px-3">
        <div className="relative">
          {/* Tab List */}
          <div
            ref={tabContainerRef}
            className="flex overflow-x-auto scrollbar-hide"
          >
            {tabList.map((tab, index) => {
              const isActive = activeTab === tab.queryId;
              return (
                <button
                  key={index}
                  ref={(el) => {
                    tabRefs.current[tab.queryId] = el;
                  }}
                  onClick={() => handleTabClick(tab)}
                  className={`
                    relative flex items-center space-x-2 px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap
                    transition-all duration-200 ease-in-out min-w-0 flex-shrink-0
                    ${
                      isActive
                        ? "text-[#11F2EB] bg-[#11F2EB]/5"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  <span
                    className={`transition-colors duration-200 ${
                      isActive ? "text-[#11F2EB]" : "text-gray-400"
                    }`}
                  >
                    {getTabIcon(tab.tabName)}
                  </span>
                  <span className="truncate">{tab.tabName}</span>

                  {/* Active indicator line */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom border for inactive tabs */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTabData?.component ? (
          <div className="animate-in fade-in-50 duration-200">
            {activeTabData.component}
          </div>
        ) : (
          <div className="animate-in fade-in-50 duration-200">
            <EmptyState tabName={activeTabData?.tabName || "Content"} />
          </div>
        )}
      </div>
    </div>
  );
};

// Main component with Suspense wrapper
const ModernTabs = ({ tabList }) => {
  return (
    <Suspense fallback={<TabsLoading />}>
      <ModernTabsContent tabList={tabList} />
    </Suspense>
  );
};

export default ModernTabs;
