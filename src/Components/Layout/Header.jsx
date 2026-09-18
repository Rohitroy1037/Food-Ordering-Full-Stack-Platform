import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { GiCampCookingPot } from "react-icons/gi";
import { FaBars, FaTimes } from "react-icons/fa";
import Festivals from "../utils/contextApi";
import { useSelector } from "react-redux";
import { FaOpencart } from "react-icons/fa";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { festivalName } = useContext(Festivals);
  console.log(festivalName);

  // Subscribing to the store using Selector
  const cartItems = useSelector((storeState) => {
    return storeState.cart.items || [];
  });

  const totalCartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  // label and paths for all Pages
  const navLinks = [
    { label: "HOME", path: "/" },
    { label: "ABOUT", path: "/about" },
    { label: "FOODS", path: "/foods" },
    { label: `CART (${totalCartCount})`, path: "/cart" },
    { label: "CONTACT", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="mx-9 mt-0 flex flex-col items-center">
        {/* Top SignIn & SignUp */}
        <div className="p-2 px-4 flex flex-col sm:flex-row justify-between items-center w-full bg-[#393E46] text-white text-xs sm:text-sm">
          <h1 className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-center sm:text-left">
            Get the membership, 30-Day return and refund guarantee.
            {festivalName && (
              <p className="text-sm sm:text-base md:text-lg border px-3 sm:px-4 py-1 rounded-2xl bg-gradient-to-r from-[#2F3236] to-[#FF7517] whitespace-nowrap">
                {festivalName}
              </p>
            )}
          </h1>

          <div className="flex gap-4 mt-2 sm:mt-0">
            <button className="hover:text-orange-400">SIGN IN</button>
            <button className="hover:text-orange-400">SIGN UP</button>
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
              .filter(({ label }) => !label.startsWith("CART")) // remove CART text
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
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-2xl px-4"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-black/20 backdrop-blur-md flex flex-col items-center py-4 md:hidden shadow-lg z-50">
              {navLinks.map(({ label, path }) => (
                <NavLink
                  to={path}
                  key={label}
                  className="py-2 text-black hover:text-[#FF7517] transition-colors duration-300 font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
