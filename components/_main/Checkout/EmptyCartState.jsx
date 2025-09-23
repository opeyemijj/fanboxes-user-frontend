import { ShoppingBag, Home } from "lucide-react";

// Empty Cart State Component
const EmptyCartState = ({ onGoHome }) => {
  return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">
          There's nothing in your cart yet. Start shopping to add some amazing
          items!
        </p>
        <button
          onClick={onGoHome}
          className="bg-[#11F2EB] hover:bg-[#0DD4CE] text-black font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default EmptyCartState;
