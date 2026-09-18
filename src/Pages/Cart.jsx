import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItems, clearCart, removeItems, deleteItem } from "../Components/utils/cartSlice";
import {
  FaOpencart,
  FaTrashAlt,
  FaMobileAlt,
  FaUniversity,
  FaMoneyBillWave,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaMotorcycle,
} from "react-icons/fa";

export const Cart = () => {
  const cartItems = useSelector((storeState) => storeState.cart.items || []);

  // Calculate prices
  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || item.defaultPrice || 0) * (item.quantity || 1),
    0
  ) / 100;

  const deliveryFee = itemsSubtotal > 300 || itemsSubtotal === 0 ? 0 : 35;
  const platformFee = itemsSubtotal > 0 ? 5 : 0;
  const grandTotal = itemsSubtotal + deliveryFee + platformFee;

  const dispatch = useDispatch();

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState("UPI"); // 'UPI' | 'Net Banking' | 'Cash on Delivery'
  const [upiApp, setUpiApp] = useState("Google Pay");
  const [customUpiId, setCustomUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // Delivery states
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "Rohit Roy",
    phone: "9876543210",
    address: "Flat 402, Green Avenue, Model Town",
  });

  const [orderStatus, setOrderStatus] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleClear = () => {
    dispatch(clearCart());
  };

  const handleRemove = (id) => {
    dispatch(removeItems(id));
  };

  const handleAdd = (item) => {
    dispatch(addItems(item));
  };

  const handleDelete = (id) => {
    dispatch(deleteItem(id));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cartItems.length) return;

    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address) {
      alert("Please enter complete delivery address details!");
      return;
    }

    setIsPlacingOrder(true);

    const formattedPaymentMethod =
      paymentMethod === "UPI"
        ? `UPI (${customUpiId.trim() ? customUpiId.trim() : upiApp})`
        : paymentMethod === "Net Banking"
        ? `Net Banking (${selectedBank})`
        : "Cash on Delivery";

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: Math.round(grandTotal * 100),
          customerInfo: { name: deliveryInfo.name, phone: deliveryInfo.phone },
          deliveryAddress: deliveryInfo.address,
          paymentMethod: formattedPaymentMethod,
          paymentDetails: {
            method: paymentMethod,
            upiApp: paymentMethod === "UPI" ? upiApp : null,
            upiId: paymentMethod === "UPI" ? customUpiId : null,
            bank: paymentMethod === "Net Banking" ? selectedBank : null,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrderStatus(data.data);
        if (data.data.orderId) {
          localStorage.setItem("lastOrderId", data.data.orderId);
        }
        dispatch(clearCart());
      } else {
        alert("Failed to place order: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Backend connection error. Placing order offline!");
      const offlineOrder = {
        orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        items: cartItems,
        totalAmount: Math.round(grandTotal * 100),
        paymentMethod: formattedPaymentMethod,
        paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending (Cash on Delivery)" : "Paid Online",
        deliveryAddress: deliveryInfo.address,
        estimatedDelivery: "25 - 35 mins",
      };
      localStorage.setItem("lastOrderId", offlineOrder.orderId);
      setOrderStatus(offlineOrder);
      dispatch(clearCart());
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const defaultFallbackImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="mt-[88px] container mx-auto px-4 py-8 max-w-7xl">
      {/* Title */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaOpencart className="text-3xl sm:text-4xl text-orange-600" />
          Your Cart
        </h1>
        {cartItems.length > 0 && (
          <button
            onClick={handleClear}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-semibold text-red-600 border border-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Order Confirmed Screen */}
      {orderStatus && (
        <div className="mb-10 p-8 bg-white border border-green-200 rounded-2xl shadow-lg text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            <FaCheckCircle />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">🎉 Order Confirmed!</h2>
          <p className="text-gray-600 text-lg">
            Your food is being prepared with love and will arrive shortly!
          </p>

          <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-bold text-gray-800">{orderStatus.orderId}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-semibold text-orange-600">{orderStatus.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Payment Status:</span>
              <span className="font-semibold text-green-600">{orderStatus.paymentStatus}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Estimated Delivery:</span>
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <FaMotorcycle className="text-orange-500" /> {orderStatus.estimatedDelivery || "25-35 mins"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Delivery Address:</span>
              <span className="font-medium text-gray-800 text-right max-w-xs">{orderStatus.deliveryAddress}</span>
            </div>
            <div className="flex justify-between pt-1 text-lg">
              <span className="font-bold text-gray-800">Total Paid:</span>
              <span className="font-extrabold text-orange-600">₹{orderStatus.totalAmount / 100}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to={`/track/${orderStatus.orderId}`}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 transition flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <FaMotorcycle className="text-xl animate-bounce" /> Track Order Live 🛵
            </Link>

            <button
              onClick={() => setOrderStatus(null)}
              className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition cursor-pointer"
            >
              Order More Food 🚀
            </button>
          </div>
        </div>
      )}

      {cartItems.length === 0 && !orderStatus ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FaOpencart className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-xl sm:text-2xl font-semibold">
            Your cart is empty.
          </p>
          <p className="text-gray-400 mt-2">
            Explore our 22+ restaurants and add your favourite dishes!
          </p>
        </div>
      ) : cartItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Selected Items ({cartItems.length})</h2>
            <ul className="space-y-4">
              {cartItems.map((item, index) => {
                const { id, name, price, defaultPrice, imageId, description, quantity = 1 } = item;
                const unitPrice = (price || defaultPrice || 0) / 100;
                const itemTotal = unitPrice * quantity;
                const uniqueKey = id ? `item_${id}` : `cart_${index}`;

                const imageUrl = imageId
                  ? imageId.startsWith("http")
                    ? imageId
                    : `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${imageId}`
                  : defaultFallbackImage;

                return (
                  <li
                    key={uniqueKey}
                    className="p-4 bg-white rounded-xl shadow-xs border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between"
                  >
                    <div className="flex gap-4 items-center w-full sm:w-auto">
                      <img
                        src={imageUrl}
                        alt={name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = defaultFallbackImage;
                        }}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{name}</h3>
                        <p className="text-sm text-gray-500">₹{unitPrice} per item</p>
                        <p className="text-xs text-orange-600 font-semibold mt-1">
                          Subtotal: ₹{itemTotal}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-1">
                        <button
                          onClick={() => handleRemove(id)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-orange-600 hover:bg-orange-200 rounded-md cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold px-3 text-sm">{quantity}</span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-green-600 hover:bg-green-200 rounded-md cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleDelete(id)}
                        className="text-gray-400 hover:text-red-600 transition p-2 cursor-pointer"
                        title="Remove dish"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Delivery Address Section */}
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-xs mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" />
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={deliveryInfo.name}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, name: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={deliveryInfo.phone}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                    placeholder="Phone number"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Complete Address / Room / Flat</label>
                  <input
                    type="text"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                    placeholder="Door / Flat No., Street, Area, City"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Methods & Bill Summary */}
          <div className="space-y-6">
            {/* Payment Method Selector */}
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-xs">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Choose Payment Method</h2>

              <div className="space-y-3">
                {/* 1. UPI */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "UPI"
                      ? "border-orange-500 bg-orange-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={() => setPaymentMethod("UPI")}
                    className="mt-1 accent-orange-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <FaMobileAlt className="text-orange-600 text-base" />
                      UPI (GPay / PhonePe / Paytm)
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pay instantly with any UPI app or UPI ID
                    </p>

                    {paymentMethod === "UPI" && (
                      <div className="mt-3 pt-3 border-t border-orange-200 space-y-3">
                        <label className="block text-xs font-semibold text-gray-700">Select App:</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Google Pay", "PhonePe", "Paytm", "CRED UPI"].map((app) => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => {
                                setUpiApp(app);
                                setCustomUpiId("");
                              }}
                              className={`p-2 text-xs font-semibold rounded-lg border transition ${
                                upiApp === app && !customUpiId
                                  ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {app}
                            </button>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Or Enter UPI ID:
                          </label>
                          <input
                            type="text"
                            value={customUpiId}
                            onChange={(e) => setCustomUpiId(e.target.value)}
                            placeholder="e.g. rohit@okhdfcbank"
                            className="w-full p-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-orange-500 bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* 2. Net Banking */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "Net Banking"
                      ? "border-orange-500 bg-orange-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Net Banking"
                    checked={paymentMethod === "Net Banking"}
                    onChange={() => setPaymentMethod("Net Banking")}
                    className="mt-1 accent-orange-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <FaUniversity className="text-blue-600 text-base" />
                      Net Banking
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      All major Indian banks supported
                    </p>

                    {paymentMethod === "Net Banking" && (
                      <div className="mt-3 pt-3 border-t border-orange-200 space-y-2">
                        <label className="block text-xs font-semibold text-gray-700">Choose Bank:</label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full p-2 text-xs border border-gray-300 rounded-lg bg-white outline-none focus:border-orange-500"
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "Cash on Delivery"
                      ? "border-orange-500 bg-orange-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={() => setPaymentMethod("Cash on Delivery")}
                    className="mt-1 accent-orange-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <FaMoneyBillWave className="text-green-600 text-base" />
                      Cash on Delivery (COD)
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pay with cash or scan QR upon delivery at your doorstep
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-xs space-y-3">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Bill Details</h2>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Item Total</span>
                <span>₹{itemsSubtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong className="text-green-600">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-gray-900 border-t pt-3">
                <span>To Pay</span>
                <span className="text-orange-600">₹{grandTotal}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isPlacingOrder}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-extrabold rounded-xl shadow-md hover:scale-[1.02] transition cursor-pointer disabled:opacity-50 text-base flex items-center justify-center gap-2"
              >
                {isPlacingOrder
                  ? "Processing Order..."
                  : paymentMethod === "Cash on Delivery"
                  ? "Place COD Order 🚀"
                  : `Pay ₹${grandTotal} via ${paymentMethod} 🚀`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
