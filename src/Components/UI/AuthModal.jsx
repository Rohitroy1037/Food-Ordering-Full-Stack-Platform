import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAuthModal,
  setAuthModalMode,
  loginSuccess,
} from "../utils/userSlice";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMagic,
} from "react-icons/fa";
import { GiCampCookingPot } from "react-icons/gi";

export const AuthModal = () => {
  const dispatch = useDispatch();
  const { isAuthModalOpen, authModalMode } = useSelector((state) => state.user);

  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
    setError(null);
    setSuccessMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        dispatch(closeAuthModal());
      }
    };
    if (isAuthModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, dispatch]);

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || "Signed in successfully!");
        setTimeout(() => {
          dispatch(loginSuccess(data.data));
        }, 600);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || "Account created successfully!");
        setTimeout(() => {
          dispatch(loginSuccess(data.data));
        }, 700);
      } else {
        setError(data.message || "Failed to create account");
      }
    } catch (err) {
      setError("Failed to connect to registration server.");
    } finally {
      setLoading(false);
    }
  };

  // Demo user fast login
  const handleDemoLogin = () => {
    setFormData({
      ...formData,
      email: "rohit@example.com",
      password: "password123",
    });
    setMode("signin");
    setError(null);

    // Trigger immediate signin
    setLoading(true);
    fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "rohit@example.com",
        password: "password123",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccessMsg("Logged in as Demo User (Rohit Roy)!");
          setTimeout(() => {
            dispatch(loginSuccess(data.data));
          }, 600);
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError("Server connection error"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#222831] via-[#2d333b] to-[#393E46] p-6 text-white relative">
          <button
            onClick={() => dispatch(closeAuthModal())}
            className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <FaTimes className="text-lg" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <GiCampCookingPot className="text-3xl text-orange-500" />
            <span className="font-extrabold text-xl bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
              RasoiMitra
            </span>
          </div>

          <h2 className="text-xl font-bold">
            {mode === "signin" ? "Welcome Back!" : "Create Your Account"}
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            {mode === "signin"
              ? "Sign in to track orders, save delivery addresses & checkout faster."
              : "Join RasoiMitra to explore authentic flavours & seamless dining."}
          </p>

          {/* Mode Tabs */}
          <div className="flex mt-4 bg-black/30 p-1 rounded-xl">
            <button
              onClick={() => {
                setMode("signin");
                dispatch(setAuthModalMode("signin"));
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                mode === "signin"
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-md"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("signup");
                dispatch(setAuthModalMode("signup"));
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                mode === "signup"
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-md"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <FaCheckCircle className="text-green-500 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Login Bar */}
          {mode === "signin" && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
              <div className="text-xs">
                <p className="font-bold text-gray-800 flex items-center gap-1">
                  <FaMagic className="text-orange-500" /> Fast Demo Login
                </p>
                <p className="text-gray-500 text-[11px]">Rohit Roy (Pre-configured)</p>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg shadow-xs transition cursor-pointer"
              >
                1-Click Login ✨
              </button>
            </div>
          )}

          {/* Sign In Form */}
          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. rohit@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-700">Password</label>
                  <span className="text-[11px] text-orange-600 hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-extrabold text-sm rounded-xl shadow-md hover:scale-[1.02] transition cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? "Signing In..." : "Sign In to RasoiMitra 🚀"}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                    }}
                    className="text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rohit Roy"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. rohit@example.com"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 chars"
                      className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Default Delivery Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Green Avenue, Model Town"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-extrabold text-sm rounded-xl shadow-md hover:scale-[1.02] transition cursor-pointer disabled:opacity-50 mt-3"
              >
                {loading ? "Creating Account..." : "Create Account & Sign In 🚀"}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                    }}
                    className="text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
