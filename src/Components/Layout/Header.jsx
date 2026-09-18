import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { GiCampCookingPot } from "react-icons/gi";
import {
  FaBars,
  FaTimes,
  FaOpencart,
  FaUserCircle,
  FaSignOutAlt,
  FaMotorcycle,
  FaChevronDown,
} from "react-icons/fa";
import Festivals from "../utils/contextApi";
import { useSelector, useDispatch } from "react-redux";
import { openAuthModal, logout } from "../utils/userSlice";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const { festivalName } = useContext(Festivals);

  // Subscribing to Redux store
  const cartItems = useSelector((storeState) => storeState.cart?.items || []);
  const currentUser = useSelector((storeState) => storeState.user?.currentUser);

  const totalCartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  // label and paths for all Pages
  const navLinks = [
    { label: "HOME", path: "/" },
    { label: "ABOUT", path: "/about" },
    { label: "FOODS", path: "/foods" },
    { label: "TRACK ORDER", path: "/track" },
    { label: `CART (${totalCartCount})`, path: "/cart" },
    { label: "CONTACT", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="mx-9 mt-0 flex flex-col items-center">
        {/* Top SignIn & SignUp / User Greeting Bar */}
        <div className="p-2 px-4 flex flex-col sm:flex-row justify-between items-center w-full bg-[#393E46] text-white text-xs sm:text-sm">
          <h1 className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-center sm:text-left">
            Get the membership, 30-Day return and refund guarantee.
            {festivalName && (
              <p className="text-sm sm:text-base md:text-lg border px-3 sm:px-4 py-1 rounded-2xl bg-gradient-to-r from-[#2F3236] to-[#FF7517] whitespace-nowrap">
                {festivalName}
              </p>
            )}
          </h1>

          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-orange-300 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                  Hi, {currentUser.name}!
                </span>
                <button
                  onClick={() => dispatch(logout())}
                  className="text-gray-300 hover:text-white underline cursor-pointer text-xs"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => dispatch(openAuthModal({ mode: "signin" }))}
                  className="hover:text-orange-400 font-semibold cursor-pointer transition"
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => dispatch(openAuthModal({ mode: "signup" }))}
                  className="hover:text-orange-400 font-semibold cursor-pointer transition"
                >
                  SIGN UP
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Navbar */}
        <div className="flex justify-between items-center w-full bg-[#222831] text-white px-6 py-4 shadow-md relative">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#F2F2F2] to-[#FF7517] bg-clip-text text-transparent">
              RasoiMitra
            </h1>
            <GiCampCookingPot className="text-3xl sm:text-4xl text-[#B87C4C]" />
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 px-4 items-center">
            {navLinks
              .filter(({ label }) => !label.startsWith("CART"))
              .map(({ label, path }) => (
                <NavLink
                  to={path}
                  key={label}
                  className={({ isActive }) =>
                    `relative group cursor-pointer transition-colors duration-300 ${
                      isActive ? "text-[#FF7517]" : "text-white"
                    }`
                  }
                >
                  <span className="transition-colors duration-300 group-hover:text-[#FF7517] cursor-pointer">
                    {label}
                  </span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF7517] transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              ))}

            {/* Cart Icon with Badge */}
            <NavLink to="/cart" className="relative hover:scale-105 duration-300">
              <FaOpencart className="text-3xl sm:text-4xl text-orange-500" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                  {totalCartCount}
                </span>
              )}
            </NavLink>

            {/* Auth Profile / Sign In Pill */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 transition cursor-pointer text-xs font-bold"
                >
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover bg-orange-500"
                  />
                  <span className="text-white truncate max-w-[100px]">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <FaChevronDown className="text-[10px] text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#222831] border border-gray-700 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-800">
                      <p className="text-xs font-bold text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{currentUser.email}</p>
                      {currentUser.address && (
                        <p className="text-[10px] text-gray-400 mt-1 truncate">
                          📍 {currentUser.address}
                        </p>
                      )}
                    </div>

                    <NavLink
                      to="/track"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-orange-400 hover:bg-white/5 transition"
                    >
                      <FaMotorcycle className="text-orange-500" />
                      Track Active Orders
                    </NavLink>

                    <button
                      onClick={() => {
                        dispatch(logout());
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-white/5 transition text-left cursor-pointer border-t border-gray-800 mt-1"
                    >
                      <FaSignOutAlt />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => dispatch(openAuthModal({ mode: "signin" }))}
                className="px-3.5 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-extrabold text-xs rounded-xl shadow hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
              >
                <FaUserCircle className="text-sm" /> Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            {currentUser ? (
              <div className="flex items-center gap-1 text-xs text-orange-400 font-bold">
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.name}`}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full bg-orange-500"
                />
                <span className="truncate max-w-[70px]">{currentUser.name.split(" ")[0]}</span>
              </div>
            ) : (
              <button
                onClick={() => dispatch(openAuthModal({ mode: "signin" }))}
                className="px-2.5 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold"
              >
                Sign In
              </button>
            )}

            <button
              className="text-2xl px-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-[#222831] border-t border-gray-800 flex flex-col items-center py-4 md:hidden shadow-2xl z-50">
              {navLinks.map(({ label, path }) => (
                <NavLink
                  to={path}
                  key={label}
                  className="py-2.5 text-white hover:text-[#FF7517] transition-colors duration-300 font-semibold text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}

              {currentUser && (
                <button
                  onClick={() => {
                    dispatch(logout());
                    setMenuOpen(false);
                  }}
                  className="mt-3 py-2 px-6 text-xs text-red-400 border border-red-500/40 rounded-xl"
                >
                  Sign Out ({currentUser.name})
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
