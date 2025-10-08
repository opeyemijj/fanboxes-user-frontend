// "use client";
// import * as React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { handleChangeCurrency } from "@/redux/slices/settings";
// import { useEffect, useRef, useState } from "react";
// import { getCurrencies } from "@/services";
// import {
//   Dialog,
//   DialogContent,
//   IconButton,
//   Typography,
//   Grid,
//   Button,
//   Stack,
//   Skeleton,
// } from "@mui/material";
// import countries from "@/lib/countries.json";
// import { X, ChevronDown, Check, Globe2 } from "lucide-react";
// import getLocation from "@/utils/geolocation";

// export default function CurrencySelect() {
//   const dispatch = useDispatch();
//   const { currency } = useSelector(({ settings }) => settings);
//   const [open, setOpen] = React.useState(false);
//   const [currencies, setCurrencies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isMounted, setIsMounted] = useState(false);

//   const hasRunRef = useRef(false);

//   // Set mounted flag on client only
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!isMounted) return;

//     const fetchCurrencies = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await getCurrencies();
//         if (response?.success) {
//           console.log("cRes::", response.data);
//           setCurrencies(response.data || []);
//         } else {
//           throw new Error("Failed to fetch currencies");
//         }
//       } catch (err) {
//         console.error("Error fetching currencies:", err);
//         setError("Failed to load currencies");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCurrencies();
//   }, [isMounted]);

//   useEffect(() => {
//     if (!isMounted) return;
//     if (currencies?.length && !hasRunRef.current) {
//       const detectAndSetCurrency = async () => {
//         try {
//           const currency = await autoChangeCurrency();
//           dispatch(
//             handleChangeCurrency({
//               currency: currency.code,
//               rate: currency.rate || 1,
//             })
//           );
//         } catch (error) {
//           const usdCurrency = currencies.find((cur) => cur.code === "USD");
//           dispatch(
//             handleChangeCurrency({
//               currency: "USD",
//               rate: usdCurrency?.rate || 1,
//             })
//           );
//         } finally {
//           hasRunRef.current = true;
//         }
//       };

//       detectAndSetCurrency();
//     }
//   }, [dispatch, currencies, isMounted]);

//   const handleClickOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const getFlagEmoji = (countryCode) => {
//     if (!countryCode) return "🌐";
//     const codePoints = countryCode
//       .toUpperCase()
//       .split("")
//       .map((char) => 127397 + char.charCodeAt());
//     return String.fromCodePoint(...codePoints);
//   };

//   const getFlagsByCurrency = (currencyCode) => {
//     const country = countries?.find((c) => c.currency === currencyCode);
//     return country ? getFlagEmoji(country.code) : "💵";
//   };

//   const autoChangeCurrency = async () => {
//     try {
//       const currentLocation = await getLocation();
//       const selectedCurrency = currencies?.find(
//         (cur) => cur.code === currentLocation?.currency_code
//       );
//       if (selectedCurrency) return selectedCurrency;
//       return currencies?.find((cur) => cur.code === "USD");
//     } catch (error) {
//       return currencies?.find((cur) => cur.code === "USD");
//     }
//   };

//   // Show simple button until mounted
//   if (!isMounted) {
//     return (
//       <div className="currency-selector">
//         <button
//           className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 transition-all duration-200 shadow-sm"
//           aria-label="Select currency"
//         >
//           <span className="text-lg leading-none">🌐</span>
//           <span className="text-sm font-semibold text-gray-900 currency-code">
//             {currency || "USD"}
//           </span>
//           <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="currency-selector">
//       <button
//         onClick={handleClickOpen}
//         className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
//         aria-label="Select currency"
//       >
//         <span className="text-lg leading-none">
//           {getFlagsByCurrency(currency)}
//         </span>
//         <span className="text-sm font-semibold text-gray-900 currency-code">
//           {currency}
//         </span>
//         <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
//       </button>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="md"
//         fullWidth
//         sx={{
//           zIndex: 9999,
//         }}
//         PaperProps={{
//           sx: {
//             borderRadius: "16px",
//             boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
//             overflow: "hidden",
//             zIndex: 9999,
//           },
//         }}
//       >
//         <DialogContent sx={{ p: 0 }}>
//           {/* Header */}
//           <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0DD4C7] to-[#11F2EB] flex items-center justify-center shadow-md">
//                   <Globe2 className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 700,
//                       fontSize: "1.125rem",
//                       color: "#111827",
//                       letterSpacing: "-0.01em",
//                     }}
//                   >
//                     Select Currency
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{ color: "#6B7280", fontSize: "0.875rem", mt: 0.25 }}
//                   >
//                     Choose your preferred currency
//                   </Typography>
//                 </div>
//               </div>
//               <IconButton
//                 onClick={handleClose}
//                 sx={{
//                   color: "#6B7280",
//                   "&:hover": { backgroundColor: "#F3F4F6", color: "#111827" },
//                 }}
//               >
//                 <X className="h-5 w-5" />
//               </IconButton>
//             </div>
//           </div>

//           {/* Currency List */}
//           <div className="p-6 max-h-[32rem] overflow-y-auto bg-white">
//             {loading ? (
//               <Grid container spacing={2}>
//                 {Array.from(new Array(8)).map((_, index) => (
//                   <Grid key={index} item xs={12} sm={6} md={4}>
//                     <div className="p-4 rounded-xl border border-gray-100">
//                       <div className="flex items-center gap-3">
//                         <Skeleton variant="circular" width={36} height={36} />
//                         <div className="flex-1">
//                           <Skeleton width="70%" height={20} />
//                           <Skeleton width="90%" height={16} sx={{ mt: 0.5 }} />
//                         </div>
//                       </div>
//                     </div>
//                   </Grid>
//                 ))}
//               </Grid>
//             ) : error ? (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <X className="h-8 w-8 text-red-500" />
//                 </div>
//                 <Typography
//                   variant="h6"
//                   sx={{ fontWeight: 600, color: "#111827", mb: 1 }}
//                 >
//                   Unable to load currencies
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: "#6B7280", mb: 3 }}>
//                   {error}
//                 </Typography>
//                 <Button
//                   onClick={() => window.location.reload()}
//                   sx={{
//                     bgcolor: "#111827",
//                     color: "white",
//                     fontWeight: 600,
//                     px: 4,
//                     py: 1.25,
//                     borderRadius: "8px",
//                     textTransform: "none",
//                     "&:hover": { bgcolor: "#1F2937" },
//                   }}
//                 >
//                   Retry
//                 </Button>
//               </div>
//             ) : (
//               <Grid container spacing={2}>
//                 {currencies?.map((cur) => {
//                   const isSelected = currency === cur.code;
//                   return (
//                     <Grid key={cur.code} item xs={12} sm={6} md={4}>
//                       <Button
//                         onClick={() => {
//                           dispatch(
//                             handleChangeCurrency({
//                               currency: cur.code,
//                               rate: cur.rate,
//                             })
//                           );
//                           handleClose();
//                         }}
//                         fullWidth
//                         sx={{
//                           p: 2,
//                           borderRadius: "12px",
//                           border: isSelected
//                             ? "2px solid #11F2EB"
//                             : "1px solid #E5E7EB",
//                           bgcolor: isSelected ? "#E6FFFE" : "white",
//                           textTransform: "none",
//                           transition: "all 0.2s",
//                           "&:hover": {
//                             bgcolor: isSelected ? "#E6FFFE" : "#F9FAFB",
//                             borderColor: isSelected ? "#11F2EB" : "#D1D5DB",
//                             transform: "translateY(-2px)",
//                             boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//                           },
//                         }}
//                       >
//                         <Stack
//                           direction="row"
//                           spacing={2}
//                           alignItems="center"
//                           sx={{ width: "100%" }}
//                         >
//                           <div className="text-2xl leading-none flex-shrink-0">
//                             {getFlagsByCurrency(cur.code)}
//                           </div>
//                           <Stack
//                             alignItems="flex-start"
//                             sx={{ flex: 1, minWidth: 0 }}
//                           >
//                             <Typography
//                               variant="subtitle2"
//                               noWrap
//                               sx={{
//                                 fontWeight: 700,
//                                 color: isSelected ? "#0B7A74" : "#111827",
//                                 fontSize: "0.9375rem",
//                                 letterSpacing: "-0.01em",
//                               }}
//                             >
//                               {cur.code}
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               noWrap
//                               sx={{
//                                 color: isSelected ? "#0DD4C7" : "#6B7280",
//                                 fontSize: "0.75rem",
//                                 fontWeight: isSelected ? 500 : 400,
//                               }}
//                             >
//                               {cur.name}
//                             </Typography>
//                           </Stack>
//                           {isSelected && (
//                             <div className="w-6 h-6 bg-[#11F2EB] rounded-full flex items-center justify-center flex-shrink-0">
//                               <Check className="h-4 w-4 text-gray-900 stroke-[3]" />
//                             </div>
//                           )}
//                         </Stack>
//                       </Button>
//                     </Grid>
//                   );
//                 })}
//               </Grid>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
//             <Typography
//               variant="caption"
//               sx={{
//                 color: "#6B7280",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 1,
//                 fontSize: "0.8125rem",
//               }}
//             >
//               <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
//               Live exchange rates • Updated automatically
//             </Typography>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <style jsx>{`
//         @media (max-width: 640px) {
//           .currency-code {
//             display: none;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleChangeCurrency,
  setUserCurrencyPreference,
} from "@/redux/slices/settings";
import { useEffect, useRef, useState } from "react";
import { getCurrencies } from "@/services";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Button,
  Stack,
  Skeleton,
} from "@mui/material";
import countries from "@/lib/countries.json";
import { X, ChevronDown, Check, Globe2 } from "lucide-react";
import getLocation from "@/utils/geolocation";

export default function CurrencySelect() {
  const dispatch = useDispatch();
  const { currency, userCurrencyPreference } = useSelector(
    ({ settings }) => settings
  );
  const [open, setOpen] = React.useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const hasRunRef = useRef(false);

  // Set mounted flag on client only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCurrencies();
        if (response?.success) {
          console.log("cRes::", response.data);
          setCurrencies(response.data || []);
        } else {
          throw new Error("Failed to fetch currencies");
        }
      } catch (err) {
        console.error("Error fetching currencies:", err);
        setError("Failed to load currencies");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (currencies?.length && !hasRunRef.current) {
      const detectAndSetCurrency = async () => {
        try {
          // Check if user has manually selected a currency before
          if (userCurrencyPreference) {
            console.log(
              "Using user's preferred currency:",
              userCurrencyPreference
            );
            const preferredCurrency = currencies.find(
              (cur) => cur.code === userCurrencyPreference
            );
            if (preferredCurrency) {
              dispatch(
                handleChangeCurrency({
                  currency: preferredCurrency.code,
                  rate: preferredCurrency.rate || 1,
                })
              );
              return;
            } else {
              console.warn(
                "User's preferred currency not found in available currencies, falling back to auto-detection"
              );
              // Clear the invalid preference
              dispatch(clearUserCurrencyPreference());
            }
          }

          // Auto-detect only if no user preference exists
          console.log("No user preference found, auto-detecting currency...");
          const autoDetectedCurrency = await autoChangeCurrency();
          dispatch(
            handleChangeCurrency({
              currency: autoDetectedCurrency.code,
              rate: autoDetectedCurrency.rate || 1,
            })
          );
        } catch (error) {
          console.error("Error in currency detection:", error);
          const usdCurrency = currencies.find((cur) => cur.code === "USD");
          dispatch(
            handleChangeCurrency({
              currency: "USD",
              rate: usdCurrency?.rate || 1,
            })
          );
        } finally {
          hasRunRef.current = true;
        }
      };

      detectAndSetCurrency();
    }
  }, [dispatch, currencies, isMounted, userCurrencyPreference]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getFlagEmoji = (countryCode) => {
    if (!countryCode) return "🌐";
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };

  const getFlagsByCurrency = (currencyCode) => {
    const country = countries?.find((c) => c.currency === currencyCode);
    return country ? getFlagEmoji(country.code) : "💵";
  };

  const autoChangeCurrency = async () => {
    try {
      const currentLocation = await getLocation();
      const selectedCurrency = currencies?.find(
        (cur) => cur.code === currentLocation?.currency_code
      );
      if (selectedCurrency) return selectedCurrency;
      return currencies?.find((cur) => cur.code === "USD");
    } catch (error) {
      return currencies?.find((cur) => cur.code === "USD");
    }
  };

  // Handler for manual currency selection
  const handleManualCurrencySelect = (cur) => {
    // Save user's preference in Redux
    dispatch(setUserCurrencyPreference(cur.code));

    // Dispatch the currency change
    dispatch(
      handleChangeCurrency({
        currency: cur.code,
        rate: cur.rate,
      })
    );
    handleClose();
  };

  // Show simple button until mounted
  if (!isMounted) {
    return (
      <div className="currency-selector">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 transition-all duration-200 shadow-sm"
          aria-label="Select currency"
        >
          <span className="text-lg leading-none">🌐</span>
          <span className="text-sm font-semibold text-gray-900 currency-code">
            {currency || "USD"}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="currency-selector">
      <button
        onClick={handleClickOpen}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
        aria-label="Select currency"
      >
        <span className="text-lg leading-none">
          {getFlagsByCurrency(currency)}
        </span>
        <span className="text-sm font-semibold text-gray-900 currency-code">
          {currency}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          zIndex: 9999,
        }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
            overflow: "hidden",
            zIndex: 9999,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0DD4C7] to-[#11F2EB] flex items-center justify-center shadow-md">
                  <Globe2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      color: "#111827",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Select Currency
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", fontSize: "0.875rem", mt: 0.25 }}
                  >
                    {userCurrencyPreference
                      ? "Your preference is saved in this session"
                      : "Choose your preferred currency"}
                  </Typography>
                </div>
              </div>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: "#6B7280",
                  "&:hover": { backgroundColor: "#F3F4F6", color: "#111827" },
                }}
              >
                <X className="h-5 w-5" />
              </IconButton>
            </div>
          </div>

          {/* Currency List */}
          <div className="p-6 max-h-[32rem] overflow-y-auto bg-white">
            {loading ? (
              <Grid container spacing={2}>
                {Array.from(new Array(8)).map((_, index) => (
                  <Grid key={index} item xs={12} sm={6} md={4}>
                    <div className="p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Skeleton variant="circular" width={36} height={36} />
                        <div className="flex-1">
                          <Skeleton width="70%" height={20} />
                          <Skeleton width="90%" height={16} sx={{ mt: 0.5 }} />
                        </div>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-500" />
                </div>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#111827", mb: 1 }}
                >
                  Unable to load currencies
                </Typography>
                <Typography variant="body2" sx={{ color: "#6B7280", mb: 3 }}>
                  {error}
                </Typography>
                <Button
                  onClick={() => window.location.reload()}
                  sx={{
                    bgcolor: "#111827",
                    color: "white",
                    fontWeight: 600,
                    px: 4,
                    py: 1.25,
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#1F2937" },
                  }}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <Grid container spacing={2}>
                {currencies?.map((cur) => {
                  const isSelected = currency === cur.code;
                  return (
                    <Grid key={cur.code} item xs={12} sm={6} md={4}>
                      <Button
                        onClick={() => handleManualCurrencySelect(cur)}
                        fullWidth
                        sx={{
                          p: 2,
                          borderRadius: "12px",
                          border: isSelected
                            ? "2px solid #11F2EB"
                            : "1px solid #E5E7EB",
                          bgcolor: isSelected ? "#E6FFFE" : "white",
                          textTransform: "none",
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: isSelected ? "#E6FFFE" : "#F9FAFB",
                            borderColor: isSelected ? "#11F2EB" : "#D1D5DB",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          sx={{ width: "100%" }}
                        >
                          <div className="text-2xl leading-none flex-shrink-0">
                            {getFlagsByCurrency(cur.code)}
                          </div>
                          <Stack
                            alignItems="flex-start"
                            sx={{ flex: 1, minWidth: 0 }}
                          >
                            <Typography
                              variant="subtitle2"
                              noWrap
                              sx={{
                                fontWeight: 700,
                                color: isSelected ? "#0B7A74" : "#111827",
                                fontSize: "0.9375rem",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {cur.code}
                            </Typography>
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{
                                color: isSelected ? "#0DD4C7" : "#6B7280",
                                fontSize: "0.75rem",
                                fontWeight: isSelected ? 500 : 400,
                              }}
                            >
                              {cur.name}
                            </Typography>
                          </Stack>
                          {isSelected && (
                            <div className="w-6 h-6 bg-[#11F2EB] rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="h-4 w-4 text-gray-900 stroke-[3]" />
                            </div>
                          )}
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <Typography
              variant="caption"
              sx={{
                color: "#6B7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                fontSize: "0.8125rem",
              }}
            >
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {userCurrencyPreference
                ? "Using your preferred currency • Auto-detection disabled for this session"
                : "Live exchange rates • Updated automatically"}
            </Typography>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @media (max-width: 640px) {
          .currency-code {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
