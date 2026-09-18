import express from "express";
import { getRestaurants, getMenus } from "./restaurantRoutes.js";

const router = express.Router();

// GET /api/menu/:id
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const menus = getMenus();
    const restaurants = getRestaurants();

    // If predefined in menus.json
    if (menus[id]) {
      return res.json({
        success: true,
        data: menus[id],
      });
    }

    // Find restaurant info to generate customized menu
    const targetRestro = restaurants.find((r) => r.info.id === id);
    const restroInfo = targetRestro?.info || {
      id: id,
      name: "RasoiMitra Food Hub",
      cuisines: ["North Indian", "Fast Food"],
      costForTwoMessage: "₹300 for two",
      areaName: "Main City",
      avgRating: "4.3",
    };

    // Use default menu template with restaurant details
    const defaultTemplate = menus["148987"];
    const customizedMenu = {
      restaurantInfo: {
        id: id,
        name: restroInfo.name,
        cuisines: restroInfo.cuisines,
        costForTwoMessage: restroInfo.costForTwo || restroInfo.costForTwoMessage || "₹300 for two",
        areaName: restroInfo.locality || restroInfo.areaName || "Near You",
        avgRating: restroInfo.avgRating ? String(restroInfo.avgRating) : "4.3",
      },
      menuItems: defaultTemplate ? defaultTemplate.menuItems : [],
    };

    res.json({
      success: true,
      data: customizedMenu,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
