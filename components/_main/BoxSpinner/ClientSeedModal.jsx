"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";
import {
  Hexagon,
  Target,
  Key,
  Hash,
  Clock,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Loader,
  X,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./GameDialogues";

const ClientSeedModal = ({
  onSpin,
  isWaitingForResult,
  createSpinApiError,
  setCreateSpinApiError,
  generateAndSetClientSeed,
  clientSeed,
  setShowSeedModal,
  showSeedModal,
  showClientSeedModal,
  setShowClientSeedModal,
  spinResultData,
  setCopiedField,
  copiedField,
  spinRecordId,
  // serverSeedHash,
  // nonce,
}) => {
  const [showServerSeed, setShowServerSeed] = useState(false);

  const serverSeed = spinResultData?.serverSeed || "";
  const serverSeedHash = spinResultData?.serverSeedHash || "";
  const nonce = spinResultData?.nonce || 0;
  const createdAt = spinResultData?.createdAt || "";
  const hash = spinResultData?.hash || "";

  const handleContinueToSpin = () => {
    // Close seed modal and start the actual spin with the result data
    setShowSeedModal(false);
    setCreateSpinApiError(null); // Clear any previous errors
    onSpin(false, spinResultData);
  };

  // Function to delete spin record (to be implemented)
  const deleteSpinRecord = async (spinId) => {
    console.log("Deleting spin record with ID:", spinId);
    // TODO: Implement API call to delete spin record
    // Example:
    // try {
    //   const response = await fetch(`/api/spins/${spinId}`, {
    //     method: 'DELETE',
    //   });
    //   if (!response.ok) {
    //     throw new Error('Failed to delete spin record');
    //   }
    //   console.log('Spin record deleted successfully');
    // } catch (error) {
    //   console.error('Error deleting spin record:', error);
    // }
  };

  const handleCancelSpin = () => {
    if (isWaitingForResult) return;
    // Close the modal
    setShowSeedModal(false);

    // If we have a spin record ID, delete the spin record
    if (spinRecordId) {
      deleteSpinRecord(spinRecordId);
    }

    // Clear any error messages
    setCreateSpinApiError(null);
  };

  const handleRegenerateClientSeed = () => {
    generateAndSetClientSeed();
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle modal close with page refresh
  const handleModalClose = () => {
    setShowModal(false);
    // Refresh the page after modal closes
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div>
      {/* Client Seed Modal - MODIFIED SECTION */}
      <AnimatePresence>
        {showClientSeedModal && (
          <Dialog
            open={showClientSeedModal}
            onOpenChange={setShowClientSeedModal}
          >
            <DialogContent className="sm:max-w-[450px] max-w-[90vw] bg-white border border-gray-200 rounded-lg z-[9999] fixed">
              <DialogHeader className="pt-6">
                <DialogTitle className="text-xl text-center text-gray-800 font-semibold">
                  <Key className="inline-block w-5 h-5 mr-2 text-[#11F2EB]" />
                  Client Seed
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600 text-sm">
                  Your current seed for verification
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 px-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Key className="w-4 h-4 mr-2 text-[#11F2EB]" />
                      <span className="font-medium text-sm text-gray-700">
                        Current Seed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          copyToClipboard(clientSeed, "clientSeedModal")
                        }
                        className="p-1 text-gray-400 hover:text-[#11F2EB] transition-colors"
                        title="Copy seed"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={generateAndSetClientSeed}
                        className="p-1 text-gray-400 hover:text-[#11F2EB] transition-colors"
                        title="Regenerate seed"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="font-mono text-sm break-all text-gray-800 max-h-24 overflow-y-auto">
                      {clientSeed}
                    </div>
                  </div>

                  {copiedField === "clientSeedModal" && (
                    <div className="text-xs text-green-600 mt-2 text-center">
                      Copied to clipboard!
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3">
                    This seed is used for cryptographic verification of spin
                    outcomes.
                  </p>
                </div>
              </div>

              {/* Removed the bottom close button as requested */}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Seed Verification Modal (UNCHANGED) */}
      <AnimatePresence>
        {showSeedModal && (
          <Dialog open={showSeedModal} onOpenChange={() => {}}>
            <DialogContent
              className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] bg-gradient-to-br from-purple-50 to-blue-50 z-[9999] fixed"
              onInteractOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              useCustomClose={true}
              onCustomClose={handleCancelSpin}
            >
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl text-center bg-gradient-to-r from-[#11F2EB] via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                  <Shield className="inline-block w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  {createSpinApiError ? "Error" : "Fairness Verification"}
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600 text-sm sm:text-base">
                  {createSpinApiError
                    ? "An error occurred while trying to process your spin"
                    : "You can verify the integrity of this spin using the cryptographic seeds below"}
                </DialogDescription>
              </DialogHeader>

              {isWaitingForResult ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <Loader className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-cyan-500 mb-4" />
                  <p className="text-gray-600 text-sm sm:text-base">
                    Loading spin data...
                  </p>
                </div>
              ) : createSpinApiError ? (
                // Display error message instead of seed data
                <div className="py-4 space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                  <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
                    <div className="flex items-center mb-2">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-500" />
                      <span className="font-semibold text-red-700 text-sm sm:text-base">
                        Error
                      </span>
                    </div>
                    <div className="text-red-600 p-2 rounded text-sm sm:text-base">
                      {createSpinApiError}
                    </div>
                    <p className="text-xs text-red-500 mt-1">
                      Please try again or contact support if the problem
                      persists.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="py-4 space-y-4 max-h-64 sm:max-h-96 overflow-y-auto px-1">
                    {/* Client Seed */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-2">
                        <Key className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-semibold text-sm sm:text-base">
                          Client Seed
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(clientSeed, "clientSeed")
                          }
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {copiedField === "clientSeed" && (
                          <span className="ml-2 text-xs text-green-500">
                            Copied!
                          </span>
                        )}
                      </div>
                      <div className="bg-gray-100 p-2 rounded font-mono text-xs sm:text-sm break-all">
                        {clientSeed}
                      </div>
                    </div>

                    {/* Server Seed Hash */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-2">
                        <Hash className="w-4 h-4 mr-2 text-purple-500" />
                        <span className="font-semibold text-sm sm:text-base">
                          Server Seed Hash
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(serverSeedHash, "serverSeedHash")
                          }
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {copiedField === "serverSeedHash" && (
                          <span className="ml-2 text-xs text-green-500">
                            Copied!
                          </span>
                        )}
                      </div>
                      <div className="bg-gray-100 p-2 rounded font-mono text-xs sm:text-sm break-all">
                        {serverSeedHash}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This is the hash of the server seed that was committed
                        before the spin
                      </p>
                    </div>

                    {/* Server Seed */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-2">
                        <Shield className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-semibold text-sm sm:text-base">
                          Server Seed
                        </span>
                        <button
                          onClick={() => setShowServerSeed(!showServerSeed)}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                          {showServerSeed ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            copyToClipboard(serverSeed, "serverSeed")
                          }
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {copiedField === "serverSeed" && (
                          <span className="ml-2 text-xs text-green-500">
                            Copied!
                          </span>
                        )}
                      </div>
                      <div className="bg-gray-100 p-2 rounded font-mono text-xs sm:text-sm break-all">
                        {showServerSeed
                          ? serverSeed
                          : "••••••••••••••••••••••••••••••••"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This seed is revealed after the spin to verify fairness
                      </p>
                    </div>

                    {/* Nonce */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-2">
                        <Hash className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="font-semibold text-sm sm:text-base">
                          Nonce
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(nonce.toString(), "nonce")
                          }
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {copiedField === "nonce" && (
                          <span className="ml-2 text-xs text-green-500">
                            Copied!
                          </span>
                        )}
                      </div>
                      <div className="bg-gray-100 p-2 rounded font-mono text-xs sm:text-sm">
                        {nonce}
                      </div>
                    </div>

                    {/* Hash */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-2">
                        <Hash className="w-4 h-4 mr-2 text-red-500" />
                        <span className="font-semibold text-sm sm:text-base">
                          Result Hash
                        </span>
                        <button
                          onClick={() => copyToClipboard(hash, "hash")}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {copiedField === "hash" && (
                          <span className="ml-2 text-xs text-green-500">
                            Copied!
                          </span>
                        )}
                      </div>
                      <div className="bg-gray-100 p-2 rounded font-mono text-xs sm:text-sm break-all">
                        {hash}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        HMAC_SHA256(server_seed, client_seed:nonce)
                      </p>
                    </div>

                    {/* Created At */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-2">
                        <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                        <span className="font-semibold text-sm sm:text-base">
                          Time Created
                        </span>
                      </div>
                      <div className="bg-gray-100 p-2 rounded font-mono text-xs sm:text-sm">
                        {formatDate(createdAt)}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
                {createSpinApiError ? (
                  <Button
                    className="h-10 sm:h-12 text-sm sm:text-lg bg-gradient-to-r from-red-500 to-red-600 
                      hover:from-red-400 hover:to-red-700 w-full"
                    onClick={handleCancelSpin}
                  >
                    Close
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="h-10 sm:h-12 text-sm sm:text-lg border-2 border-gray-300 
                        hover:border-gray-400 hover:text-black hover:bg-gray-50 w-full sm:w-1/3"
                      onClick={handleCancelSpin}
                      disabled={isWaitingForResult}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="h-10 sm:h-12 text-sm sm:text-lg bg-gradient-to-r from-[#11F2EB] via-cyan-500 to-cyan-600 
                        hover:from-cyan-400 hover:via-[#11F2EB] hover:to-blue-700 w-full sm:w-2/3"
                      onClick={handleContinueToSpin}
                      disabled={isWaitingForResult}
                    >
                      Continue to Spin
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientSeedModal;
