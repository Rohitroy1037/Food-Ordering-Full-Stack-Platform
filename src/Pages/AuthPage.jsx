import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../Components/utils/userSlice";
import {
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
  FaArrowLeft,
} from "react-icons/fa";
import { GiCampCookingPot } from "react-icons/gi";

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const initialMode = location.pathname.includes("signup") ? "signup" : "signin";
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser) {
      navigate(-1);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    setMode(location.pathname.includes("signup") ? "signup" : "signin");
    setError(null);
  }, [location.pathname]);

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
        dispatch(loginSuccess(data.data));
        setTimeout(() => {
          navigate("/foods");
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
        dispatch(loginSuccess(data.data));
        setTimeout(() => {
          navigate("/foods");
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

  const handleDemoLogin = () => {
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
          dispatch(loginSuccess(data.data));
          setTimeout(() => navigate("/foods"), 600);
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError("Server connection error"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-[88px] min-h-[calc(100vh-88px)] bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/20 py-12 px-4 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#222831] p-8 text-white text-center relative">
          <Link
            to="/"
            className="absolute left-6 top-6 text-gray-400 hover:text-white transition flex items-center gap-1.5 text-xs"
          >
            <FaArrowLeft /> Back to Home
          </Link>

          <div className="w-14 h-14 bg-gradient-to-tr from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-md">
            <GiCampCookingPot className="text-white" />
          </div>

          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
            RasoiMitra Account
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {mode === "signin"
              ? "Sign in to access your orders, track food & faster checkout"
              : "Register to enjoy authentic home-style food across 22+ restaurants"}
          </p>

          {/* Mode Switcher */}
          <div className="flex mt-6 bg-gray-900/80 p-1 rounded-xl">
            <button
              onClick={() => {
                setMode("signin");
                navigate("/signin", { replace: true });
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                mode === "signin"
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("signup");
                navigate("/signup", { replace: true });
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                mode === "signup"
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8">
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

          {/* Quick Demo */}
          {mode === "signin" && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                  <FaMagic className="text-orange-500" /> Fast Demo Login
                </p>
                <p className="text-[11px] text-gray-500">Rohit Roy (rohit@example.com)</p>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                1-Click ✨
              </button>
            </div>
          )}

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
                    placeholder="rohit@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white"
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
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white"
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
            </form>
          ) : (
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
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white"
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
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white"
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
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white"
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
                      className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white"
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
                    placeholder="Flat 402, Green Avenue, Model Town"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 focus:bg-white"
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
