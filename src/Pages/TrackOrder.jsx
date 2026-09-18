import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaMotorcycle,
  FaCheckCircle,
  FaUtensils,
  FaHome,
  FaPhoneAlt,
  FaCommentDots,
  FaShieldAlt,
  FaArrowLeft,
  FaClock,
  FaMapMarkerAlt,
  FaStore,
  FaSyncAlt,
} from "react-icons/fa";

export const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMessageModal, setActiveMessageModal] = useState(false);
  const [quickMessageSent, setQuickMessageSent] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Fetch order tracking data
  const fetchOrder = async (isManual = false) => {
    if (isManual) setLoading(true);
    try {
      let targetId = orderId;
      if (!targetId) {
        targetId = localStorage.getItem("lastOrderId");
      }

      const url = targetId ? `/api/orders/${targetId}` : `/api/orders/latest`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setOrder(data.data);
        setError(null);
      } else {
        setError(data.message || "Order not found. Please place an order first.");
      }
    } catch (err) {
      setError("Unable to connect to RasoiMitra tracking service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll for live GPS and status updates every 5 seconds
    const interval = setInterval(() => {
      fetchOrder(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Demo switch order stage
  const handleSimulateStage = async (stageNumber) => {
    if (!order) return;
    setIsSimulating(true);
    try {
      const res = await fetch(`/api/orders/${order.orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: stageNumber }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrder(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  if (loading && !order) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800">Connecting to RasoiMitra Live GPS...</h2>
        <p className="text-gray-500 text-sm mt-1">Locating your delivery partner & kitchen status</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 text-center max-w-md w-full">
          <FaMapMarkerAlt className="text-5xl text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Order Found</h2>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <Link
              to="/foods"
              className="py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl shadow hover:scale-105 transition"
            >
              Browse 70+ Dishes & Order
            </Link>
            <Link
              to="/cart"
              className="py-2.5 px-6 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tracking = order.tracking || {};
  const currentStage = tracking.stage || 1;
  const progressPercent = tracking.progressPercent || 20;
  const rider = order.rider || {
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    vehicle: "Honda Activa (PB 08 AB 1234)",
    rating: "4.9 ⭐",
    trips: "1,420+ deliveries",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    vaccinated: true,
  };

  const restaurant = order.restaurant || {
    name: "Rasoi Mitra Partner Kitchen",
    address: "Block C, Metro Junction, Central Market",
  };

  // Map route points: Start (120, 280), Control1 (350, 90), Control2 (620, 330), End (880, 110)
  const pathD = "M 120 280 C 350 90, 620 330, 880 110";

  // Approximate coordinate interpolation along the path for vehicle
  const t = Math.max(0.05, Math.min(0.95, progressPercent / 100));
  const p0 = { x: 120, y: 280 };
  const p1 = { x: 350, y: 90 };
  const p2 = { x: 620, y: 330 };
  const p3 = { x: 880, y: 110 };

  const bikeX =
    Math.pow(1 - t, 3) * p0.x +
    3 * Math.pow(1 - t, 2) * t * p1.x +
    3 * (1 - t) * Math.pow(t, 2) * p2.x +
    Math.pow(t, 3) * p3.x;

  const bikeY =
    Math.pow(1 - t, 3) * p0.y +
    3 * Math.pow(1 - t, 2) * t * p1.y +
    3 * (1 - t) * Math.pow(t, 2) * p2.y +
    Math.pow(t, 3) * p3.y;

  const stages = [
    {
      id: 1,
      title: "Order Confirmed",
      desc: "Kitchen verified & preparing raw ingredients",
      icon: FaCheckCircle,
    },
    {
      id: 2,
      title: "Cooking in Kitchen",
      desc: "Fresh aromatic dishes being prepared by chef",
      icon: FaUtensils,
    },
    {
      id: 3,
      title: "Out for Delivery",
      desc: "Delivery partner riding with your hot fresh food",
      icon: FaMotorcycle,
    },
    {
      id: 4,
      title: "Delivered",
      desc: "Delivered at your doorstep. Bon appétit!",
      icon: FaHome,
    },
  ];

  return (
    <div className="mt-[88px] min-h-screen bg-[#F8F9FA] pb-16">
      {/* Simulation Controls Banner for Testing */}
      <div className="bg-gradient-to-r from-gray-900 via-orange-950 to-gray-900 text-white px-4 py-2.5 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></span>
            <span className="font-bold text-orange-300">Live GPS Simulator:</span>
            <span className="text-gray-300 hidden md:inline">
              Click any stage below to test real-time location & status changes:
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { num: 1, label: "1. Confirmed" },
              { num: 2, label: "2. Cooking 🍳" },
              { num: 3, label: "3. On The Way 🛵" },
              { num: 4, label: "4. Delivered 🎉" },
            ].map((btn) => (
              <button
                key={btn.num}
                onClick={() => handleSimulateStage(btn.num)}
                disabled={isSimulating}
                className={`px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer ${
                  currentStage === btn.num
                    ? "bg-orange-500 text-white shadow-md scale-105"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {btn.label}
              </button>
            ))}
            <button
              onClick={() => fetchOrder(true)}
              title="Refresh GPS"
              className="p-1.5 text-gray-300 hover:text-white bg-gray-800 rounded-md ml-1 cursor-pointer"
            >
              <FaSyncAlt className={isSimulating ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-300 transition shadow-xs cursor-pointer"
              title="Back"
            >
              <FaArrowLeft />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Live Food Tracking
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-orange-100 text-orange-700 border border-orange-200">
                  Live GPS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Order <span className="font-bold text-gray-800">#{order.orderId}</span> • Placed at{" "}
                {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          <div className="bg-white border border-orange-200 px-5 py-3 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl flex-shrink-0">
              <FaClock className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Estimated Delivery
              </p>
              <p className="text-xl font-black text-gray-900">
                {tracking.remainingMins > 0 ? `${tracking.remainingMins} mins` : "Delivered"}
              </p>
            </div>
          </div>
        </div>

        {/* Status Stage Stepper */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Progress line for desktop */}
            <div className="hidden md:block absolute top-7 left-12 right-12 h-1 bg-gray-200 -z-0">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-green-500 transition-all duration-700"
                style={{
                  width:
                    currentStage === 1
                      ? "12%"
                      : currentStage === 2
                      ? "45%"
                      : currentStage === 3
                      ? "78%"
                      : "100%",
                }}
              ></div>
            </div>

            {stages.map((stage) => {
              const Icon = stage.icon;
              const isCompleted = stage.id < currentStage || currentStage === 4;
              const isCurrent = stage.id === currentStage && currentStage !== 4;

              return (
                <div key={stage.id} className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 flex-shrink-0 ${
                      isCompleted
                        ? "bg-green-500 text-white shadow-md shadow-green-200"
                        : isCurrent
                        ? "bg-orange-500 text-white ring-4 ring-orange-200 shadow-lg scale-110"
                        : "bg-gray-100 text-gray-400 border border-gray-300"
                    }`}
                  >
                    <Icon className={isCurrent ? "animate-bounce" : ""} />
                  </div>
                  <div>
                    <h4
                      className={`font-bold text-sm ${
                        isCurrent
                          ? "text-orange-600"
                          : isCompleted
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {stage.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 max-w-xs">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Interactive Map (Left) & Delivery Partner / Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Animated GPS Map View */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Map Title Bar */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="font-bold text-gray-800 text-sm">
                    Live Route GPS Navigation
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Kitchen
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Rider
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span> Home
                  </span>
                </div>
              </div>

              {/* Interactive Vector Map Canvas */}
              <div className="relative w-full h-80 sm:h-96 bg-[#242f3e] overflow-hidden select-none">
                {/* Stylized Road Network Pattern (SVG) */}
                <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FB923C" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>

                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Background City Road Grid */}
                  <g stroke="#2c3848" strokeWidth="2">
                    <line x1="0" y1="80" x2="1000" y2="80" />
                    <line x1="0" y1="160" x2="1000" y2="160" />
                    <line x1="0" y1="240" x2="1000" y2="240" />
                    <line x1="0" y1="320" x2="1000" y2="320" />

                    <line x1="150" y1="0" x2="150" y2="400" />
                    <line x1="320" y1="0" x2="320" y2="400" />
                    <line x1="500" y1="0" x2="500" y2="400" />
                    <line x1="680" y1="0" x2="680" y2="400" />
                    <line x1="850" y1="0" x2="850" y2="400" />
                  </g>

                  {/* City Blocks (Buildings) */}
                  <g fill="#1d2632" opacity="0.6">
                    <rect x="30" y="20" width="80" height="45" rx="4" />
                    <rect x="180" y="20" width="110" height="45" rx="4" />
                    <rect x="350" y="20" width="120" height="45" rx="4" />
                    <rect x="530" y="20" width="120" height="45" rx="4" />
                    <rect x="710" y="20" width="110" height="45" rx="4" />

                    <rect x="30" y="100" width="90" height="45" rx="4" />
                    <rect x="180" y="180" width="110" height="45" rx="4" />
                    <rect x="350" y="180" width="120" height="45" rx="4" />
                    <rect x="530" y="260" width="120" height="45" rx="4" />
                    <rect x="710" y="180" width="110" height="45" rx="4" />

                    <rect x="180" y="260" width="110" height="45" rx="4" />
                    <rect x="350" y="260" width="120" height="45" rx="4" />
                    <rect x="710" y="260" width="110" height="45" rx="4" />
                    <rect x="870" y="200" width="100" height="80" rx="4" />
                  </g>

                  {/* Major Expressways */}
                  <path
                    d="M 0 350 Q 400 370 1000 350"
                    stroke="#37475a"
                    strokeWidth="12"
                    fill="none"
                  />
                  <path
                    d="M 50 0 Q 70 200 50 400"
                    stroke="#37475a"
                    strokeWidth="10"
                    fill="none"
                  />

                  {/* Street Labels */}
                  <text x="210" y="175" fill="#58677c" fontSize="11" fontWeight="bold">
                    MG ROAD EXPRESSWAY
                  </text>
                  <text x="540" y="255" fill="#58677c" fontSize="11" fontWeight="bold">
                    METRO BLVD
                  </text>
                  <text x="360" y="95" fill="#58677c" fontSize="11" fontWeight="bold">
                    RASOI MARG
                  </text>

                  {/* Active Delivery Route Line (Glow + Dashed Animation) */}
                  <path
                    d={pathD}
                    stroke="#ffffff"
                    strokeWidth="8"
                    strokeOpacity="0.2"
                    fill="none"
                  />
                  <path
                    d={pathD}
                    stroke="url(#routeGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="10, 6"
                    fill="none"
                    filter="url(#glow)"
                  />

                  {/* 1. Restaurant Origin Marker (120, 280) */}
                  <g transform="translate(120, 280)">
                    <circle r="22" fill="#EA580C" opacity="0.3" />
                    <circle r="14" fill="#EA580C" />
                    <circle r="6" fill="#ffffff" />
                  </g>

                  {/* 2. Customer Destination Marker (880, 110) */}
                  <g transform="translate(880, 110)">
                    <circle r="28" fill="#10B981" opacity="0.25">
                      <animate
                        attributeName="r"
                        values="18;34;18"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.4;0.05;0.4"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="16" fill="#10B981" />
                    <circle r="6" fill="#ffffff" />
                  </g>
                </svg>

                {/* HTML Floating Tooltips & Badges over Map */}
                {/* Restaurant Tooltip */}
                <div className="absolute left-[8%] bottom-[22%] -translate-x-1/2 bg-gray-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-orange-500/50 shadow-xl flex items-center gap-1.5 backdrop-blur-sm pointer-events-none">
                  <FaStore className="text-orange-400" />
                  <span className="truncate max-w-[120px]">{restaurant.name}</span>
                </div>

                {/* Destination Tooltip */}
                <div className="absolute right-[6%] top-[18%] translate-x-1/4 bg-gray-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-green-500/50 shadow-xl flex items-center gap-1.5 backdrop-blur-sm pointer-events-none">
                  <FaHome className="text-green-400" />
                  <span>Your Doorstep</span>
                </div>

                {/* Dynamic Delivery Bike on Map */}
                <div
                  className="absolute transition-all duration-1000 ease-out -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${(bikeX / 1000) * 100}%`,
                    top: `${(bikeY / 400) * 100}%`,
                  }}
                >
                  {/* Pulse radar wave behind rider */}
                  <div className="w-14 h-14 -ml-2 -mt-2 rounded-full bg-blue-500/20 animate-ping absolute"></div>

                  {/* Rider Marker Pin */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/80 text-lg hover:scale-110 transition">
                      <FaMotorcycle className="animate-pulse" />
                    </div>

                    {/* Rider label chip */}
                    <div className="mt-1 bg-gray-950/95 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-blue-400 shadow-md whitespace-nowrap flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      {rider.name} • {currentStage === 3 ? "24 km/h" : tracking.statusText}
                    </div>
                  </div>
                </div>

                {/* Map Bottom Status Strip */}
                <div className="absolute bottom-3 left-3 right-3 bg-gray-950/80 backdrop-blur-md border border-gray-700/60 rounded-xl p-3 flex flex-wrap items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-orange-400 text-sm" />
                    <span>
                      <strong className="text-white">Delivery to:</strong>{" "}
                      <span className="text-gray-300 truncate inline-block max-w-[220px] sm:max-w-xs align-bottom">
                        {order.deliveryAddress}
                      </span>
                    </span>
                  </div>

                  <div className="text-right font-semibold text-orange-400">
                    {currentStage === 4
                      ? "Arrived at destination!"
                      : currentStage === 3
                      ? "1.2 km away • Riding safely"
                      : "Cooking in kitchen"}
                  </div>
                </div>
              </div>

              {/* Status explanation bar under map */}
              <div className="p-4 bg-orange-50/50 border-t border-orange-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{tracking.statusText}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">{tracking.statusDetail}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                    {progressPercent}% Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>Items in this Order ({order.items?.length || 0})</span>
                <span className="text-xs text-gray-500 font-normal">
                  Paid via: <strong className="text-gray-800">{order.paymentMethod}</strong>
                </span>
              </h3>

              <div className="divide-y divide-gray-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center">
                        {item.quantity || 1}x
                      </span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          ₹{((item.price || item.defaultPrice || 0) / 100)} each
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">
                      ₹{(((item.price || item.defaultPrice || 0) / 100) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-700">Total Paid Amount:</span>
                <span className="text-xl font-extrabold text-orange-600">
                  ₹{order.totalAmount ? (order.totalAmount / 100).toFixed(0) : "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery Partner Profile & Live Help */}
          <div className="space-y-6">
            {/* Delivery Partner Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-base">Your Delivery Partner</h3>
                <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <FaShieldAlt /> Verified Rider
                </span>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <img
                  src={rider.avatar}
                  alt={rider.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-400 flex-shrink-0 shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-gray-900 text-lg leading-tight">
                    {rider.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{rider.vehicle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      {rider.rating}
                    </span>
                    <span className="text-xs text-gray-400">• {rider.trips}</span>
                  </div>
                </div>
              </div>

              {/* Safety & Hygiene Tags */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Vaccinated against COVID-19</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Daily thermal screening passed (98.2°F)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Sanitized thermal delivery bag</span>
                </div>
              </div>

              {/* Action Buttons: Call & Chat */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <a
                  href={`tel:${rider.phone}`}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <FaPhoneAlt className="text-xs" /> Call Rider
                </a>

                <button
                  onClick={() => {
                    setActiveMessageModal(true);
                    setQuickMessageSent(false);
                  }}
                  className="py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <FaCommentDots className="text-sm" /> Message
                </button>
              </div>
            </div>

            {/* Quick Delivery Instructions */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h4 className="font-bold text-gray-900 text-sm mb-3">Delivery Preferences</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => alert("Instruction sent to rider: Leave food at doorstep!")}
                  className="p-2.5 rounded-lg border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700 transition text-center cursor-pointer font-medium"
                >
                  🚪 Leave at doorstep
                </button>
                <button
                  onClick={() => alert("Instruction sent to rider: Please do not ring doorbell!")}
                  className="p-2.5 rounded-lg border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700 transition text-center cursor-pointer font-medium"
                >
                  🔕 Do not ring bell
                </button>
                <button
                  onClick={() => alert("Instruction sent to rider: Please leave with building security guard.")}
                  className="p-2.5 rounded-lg border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700 transition text-center cursor-pointer font-medium"
                >
                  👮 Leave at security
                </button>
                <button
                  onClick={() => alert("Instruction sent to rider: Please call when you arrive at gate.")}
                  className="p-2.5 rounded-lg border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700 transition text-center cursor-pointer font-medium"
                >
                  📞 Call at gate
                </button>
              </div>
            </div>

            {/* Help & Support Card */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200/70 p-5 text-center">
              <h4 className="font-bold text-gray-800 text-sm">Need help with this order?</h4>
              <p className="text-xs text-gray-500 mt-1 mb-3">
                Our 24/7 kitchen & delivery support team is ready to assist you.
              </p>
              <Link
                to="/contact"
                className="inline-block py-2 px-5 bg-white border border-orange-300 text-orange-600 font-bold rounded-lg text-xs shadow-xs hover:bg-orange-50 transition"
              >
                Chat with Rasoi Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Message Modal */}
      {activeMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in duration-200">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Message {rider.name}</h3>
            <p className="text-xs text-gray-500 mb-4">
              Send instant instructions or notes to your delivery partner.
            </p>

            {quickMessageSent ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center text-green-700 font-semibold text-sm">
                ✓ Message received by {rider.name}!
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  "I am waiting downstairs at the main gate.",
                  "Please give me a call once you reach.",
                  "Keep the food package upright carefully.",
                  "Payment is already completed online, thank you!",
                ].map((msg, i) => (
                  <button
                    key={i}
                    onClick={() => setQuickMessageSent(true)}
                    className="w-full text-left p-2.5 text-xs rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50 text-gray-700 transition cursor-pointer font-medium"
                  >
                    "{msg}"
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setActiveMessageModal(false)}
              className="mt-5 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-sm transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
