// RecipeApi.jsx
// Connects to our local Express backend (/api/menu/:id)

export const fetchRecipe = async (id) => {
  try {
    const res = await fetch(`/api/menu/${id}`);
    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    throw new Error("Invalid menu data from backend");
  } catch (error) {
    console.warn("Direct proxy failed, trying absolute backend URL:", error.message);
    try {
      const fallbackRes = await fetch(`http://localhost:5000/api/menu/${id}`);
      const fallbackJson = await fallbackRes.json();
      if (fallbackJson.success && fallbackJson.data) {
        return fallbackJson.data;
      }
    } catch (_) {}

    return {
      restaurantInfo: {
        id: id,
        name: "RasoiMitra Special Kitchen",
        cuisines: ["North Indian", "Biryani", "Fast Food"],
        costForTwoMessage: "₹300 for two",
        areaName: "Near You",
        avgRating: "4.4",
      },
      menuItems: [],
    };
  }
};
