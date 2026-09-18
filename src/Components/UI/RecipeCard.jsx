import { useDispatch } from "react-redux";
import { addItems } from "../utils/cartSlice";

export const RecipeCard = ({ recipeItem }) => {
  const { id, name, price, defaultPrice, imageId, description } =
    recipeItem?.card?.info || {};
  const defaultFallbackImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

  const imageUrl = imageId
    ? imageId.startsWith("http")
      ? imageId
      : `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${imageId}`
    : defaultFallbackImage;

  const dispatch = useDispatch();

  const handleAdd = (itemInfo) => {
    // Dispatch an Action
    dispatch(addItems(itemInfo));
  };

  return (
    <li
      className="group flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 transition-all duration-300"
    >
      {/* Image */}
      <div className="w-full sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultFallbackImage;
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-base sm:text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-gray-600 font-semibold mt-1">
          ₹{(price || defaultPrice) / 100}
        </p>
        {description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 sm:line-clamp-none">
            {description}
          </p>
        )}
        {/* ADD Button */}
        <div className="mt-3 sm:mt-auto pt-2 flex justify-end">
          <button
            onClick={() => handleAdd(recipeItem?.card?.info)}
            className="px-4 sm:px-6 py-2 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            ADD +
          </button>
        </div>
      </div>
    </li>
  );
};
