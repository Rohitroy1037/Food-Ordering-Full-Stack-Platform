import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRecipe } from "../../api/RecipeApi";
import { NavLink } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Accordions } from "./Accordions";

export const Recipe = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]); // Array of Object
  const [restaurantInfo, setRestaurantInfo] = useState(null); // Top Details
  const [isLoading, setIsLoading] = useState(true);
  const [showIndex, setShowIndex] = useState(0);

  useEffect(() => {
    const getRecipeData = async () => {
      setIsLoading(true);
      try {
        const { restaurantInfo, menuItems } = await fetchRecipe(id);
        setRestaurantInfo(restaurantInfo);

        const requireData = (menuItems || []).filter(
          (recipe) =>
            recipe?.card?.card?.["@type"] ===
            "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory"
        );
        setMenuItems(requireData);
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getRecipeData();
  }, [id]);

  // console.log("Menu Items: ", menuItems);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-2xl sm:text-4xl font-bold text-gray-600">
        Loading...
      </div>
    );
  }

  const { name, cuisines, costForTwoMessage, areaName } = restaurantInfo || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
      {/* Go Back Button */}
      <NavLink
        to="/foods"
        className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full 
          bg-gradient-to-r from-gray-100 to-gray-200 
          text-gray-700 font-medium shadow-md border border-gray-300
          hover:from-orange-500 hover:to-yellow-400 hover:text-white
          hover:shadow-lg hover:scale-105 transition-all duration-300"
      >
        <FaLongArrowAltLeft className="text-lg" />
        Go Back
      </NavLink>

      {/* Restaurant Info */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
          {name || "Restaurant Menu"}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mb-3">
          {cuisines?.join(", ") || "Delicious Food & Beverages"}
        </p>
        <div className="flex flex-wrap items-center text-sm text-gray-600 gap-3 border-t pt-3">
          <span>{costForTwoMessage || "₹300 for two"}</span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>{areaName || "Near You"}</span>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700">Menu</h2>
        <span className="flex-1 h-px bg-gray-200"></span>
      </div>

      <ul className="space-y-4">
        {menuItems.length > 0 ? (
          menuItems.map((item, index) => {
            const key =
              item?.card?.card?.categoryId ||
              item?.card?.card?.title ||
              `cat_${index}`;
            return (
              <Accordions
                key={key}
                item={item}
                showRecipe={index === showIndex ? true : false}
                setShowIndex={() =>
                  setShowIndex(index === showIndex ? null : index)
                }
              />
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-10 text-3xl">
            No menu items available at the moment 🍽️
          </p>
        )}
      </ul>
    </div>
  );
};
