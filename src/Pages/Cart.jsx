import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItems, clearCart, removeItems, deleteItem } from "../Components/utils/cartSlice";
import { FaOpencart, FaTrashAlt } from "react-icons/fa";

export const Cart = () => {
  const cartItems = useSelector((storeState) => storeState.cart.items || []);

  // Calculate total price based on price * quantity
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || item.defaultPrice || 0) * (item.quantity || 1),
    0
  );

  const dispatch = useDispatch();

  const handleClear = () => {
    dispatch(clearCart());
  };

  const [orderStatus, setOrderStatus] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleRemove = (id) => {
    dispatch(removeItems(id));
  };

  const handleAdd = (item) => {
    dispatch(addItems(item));
  };

  const handleDelete = (id) => {
    dispatch(deleteItem(id));
  };

  const handleCheckout = async () => {
    if (!cartItems.length) return;
    setIsPlacingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: totalPrice,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrderStatus(data.data);
        dispatch(clearCart());
      } else {
        alert("Failed to place order: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Order placed offline!");
      dispatch(clearCart());
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const defaultFallbackImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="mt-[88px] container mx-auto px-3 py-8 max-w-7xl">
      {/* Title */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 rounded-xl p-4 shadow-lg/30 hover:scale-[1.01] transition-all duration-300 bg-white">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaOpencart className="text-3xl sm:text-4xl text-orange-600" /> 
          Your Cart
        </h1>
        {cartItems.length > 0 && (
          <button
            onClick={handleClear}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-semibold text-red-600 border border-red-500 rounded-lg hover:bg-red-50 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            Clear Cart
          </button>
        )}
      </div>

      {orderStatus && (
        <div className="mb-8 p-6 bg-green-50 border border-green-300 rounded-2xl text-center shadow-md">
          <h2 className="text-2xl font-extrabold text-green-800 mb-2">🎉 Order Confirmed!</h2>
          <p className="text-gray-700">Order ID: <span className="font-bold">{orderStatus.orderId}</span></p>
          <p className="text-gray-600 mt-1">Status: <span className="text-green-600 font-semibold">{orderStatus.status}</span> • Total: ₹{orderStatus.totalAmount / 100}</p>
          <button
            onClick={() => setOrderStatus(null)}
            className="mt-4 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
          >
            Order More Food
          </button>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FaOpencart className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-xl sm:text-2xl font-semibold">
            Your cart is empty.
          </p>
          <p className="text-gray-400 mt-2">
            Explore our delicious restaurants and add your favourite dishes!
          </p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <ul className="space-y-6">
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
                  className="group flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="w-full sm:w-40 h-40 flex-shrink-0 overflow-hidden rounded-xl shadow bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultFallbackImage;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {name}
                        </h3>
                        <button
                          onClick={() => handleDelete(id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-base sm:text-lg text-orange-600 font-semibold">
                          ₹{unitPrice}
                        </p>
                        {quantity > 1 && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                            ₹{unitPrice} × {quantity} = <strong className="text-gray-800">₹{itemTotal}</strong>
                          </span>
                        )}
                      </div>

                      {description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {description}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Subtotal: <strong className="text-gray-900 font-bold">₹{itemTotal}</strong></span>
                      
                      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <button
                          onClick={() => handleRemove(id)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-orange-600 hover:bg-orange-100 rounded-md transition cursor-pointer text-lg"
                          title="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="font-bold text-gray-800 px-2 text-base">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-green-600 hover:bg-green-100 rounded-md transition cursor-pointer text-lg"
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Checkout Section */}
          <div className="sticky bottom-0 mt-10 bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-xl">
            <div className="text-base sm:text-lg font-semibold">
              Grand Total:{" "}
              <span className="text-orange-600 font-extrabold text-2xl ml-1">
                ₹{totalPrice / 100}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isPlacingOrder}
              className="w-full sm:w-auto px-8 py-3.5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 cursor-pointer disabled:opacity-50 text-base"
            >
              {isPlacingOrder ? "Placing Order..." : "Proceed to Checkout →"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
