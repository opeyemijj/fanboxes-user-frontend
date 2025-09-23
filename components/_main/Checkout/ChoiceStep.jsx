import { Package, Truck, Hexagon, RefreshCw, ArrowRight } from "lucide-react";

// Choice Step Component (Ship vs Resell)
const ChoiceStep = ({ onChoice, cart, resellValue, resellPercentage }) => {
  const itemValue = cart.items.reduce(
    (total, item) => total + (item.value || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#11F2EB] bg-opacity-10 rounded-full mb-4">
            <Package className="w-8 h-8 text-[#11F2EB]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Congratulations! 🎉
          </h2>
          <p className="text-gray-600">
            You've won an amazing prize! What would you like to do with it?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ship to Me Option */}
          <div
            onClick={() => onChoice("ship")}
            className="border-2 border-gray-200 rounded-lg p-6 hover:border-[#11F2EB] cursor-pointer transition-all group"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 group-hover:bg-[#11F2EB] group-hover:bg-opacity-10">
                <Truck className="w-6 h-6 text-blue-600 group-hover:text-[#11F2EB]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ship to Me
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Get your prize delivered to your address. You only pay for
                shipping!
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 text-sm font-medium">
                  Item Value:{" "}
                  <span className="font-bold">${itemValue.toFixed(2)}</span>
                </p>
                <p className="text-green-700 text-xs mt-1">
                  You pay only shipping costs
                </p>
              </div>
              <button className="w-full bg-gray-400 hover:bg-gray-500 text-black py-2 px-4 rounded-lg font-medium transition-colors">
                Ship My Prize
                <ArrowRight className="inline-block w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Resell Option */}
          <div
            onClick={() => onChoice("resell")}
            className="border-2 border-gray-200 rounded-lg p-6 hover:border-[#11F2EB] cursor-pointer transition-all group"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 group-hover:bg-[#11F2EB] group-hover:bg-opacity-10">
                <RefreshCw className="w-6 h-6 text-green-600 group-hover:text-[#11F2EB]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Resell for Credits
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Convert your prize to wallet credits instantly. No waiting, no
                shipping!
              </p>
              <div className="bg-[#11F2EB] bg-opacity-10 border border-[#11F2EB] rounded-lg p-3 mb-4">
                <p className="text-[#11F2EB] text-sm font-medium">
                  You'll Receive:{" "}
                  <span className="font-bold">${resellValue.toFixed(2)}</span>
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  {resellPercentage}% of item value added to your wallet
                </p>
              </div>
              <button className="w-full bg-[#11F2EB] hover:bg-[#0DD4CE] text-black py-2 px-4 rounded-lg font-medium transition-colors">
                Get Credits Now
                <Hexagon className="inline-block w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            You can change your mind later. This choice helps us prepare your
            order accordingly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChoiceStep;
