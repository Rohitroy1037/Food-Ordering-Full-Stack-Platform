import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const restaurantsFilePath = path.join(__dirname, "../data/restaurants.json");
const menusFilePath = path.join(__dirname, "../data/menus.json");

const getRestaurants = () => {
  try {
    const raw = fs.readFileSync(restaurantsFilePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const getMenus = () => {
  try {
    const raw = fs.readFileSync(menusFilePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
};

const normalize = (t) =>
  (t || "")
    .toLowerCase()
    .replace(/briyani/g, "biryani")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();

// GET /api/restaurants
router.get("/", (req, res) => {
  try {
    const list = getRestaurants();
    const menus = getMenus();

    // Attach all dishes available at each restaurant
    const listWithDishes = list.map((r) => {
      const restroMenu = menus[r.info.id] || menus["148987"];
      const dishes = [];
      if (restroMenu?.menuItems) {
        restroMenu.menuItems.forEach((cat) => {
          cat.card?.card?.itemCards?.forEach((item) => {
            if (item.card?.info?.name) {
              dishes.push(item.card.info.name);
            }
          });
        });
      }
      return {
        ...r,
        dishes: Array.from(new Set(dishes)),
      };
    });

    let result = listWithDishes;
    const { search, minRating } = req.query;

    if (search) {
      const q = normalize(search);
      const queryTokens = q.split(/\s+/).filter(Boolean);

      result = result.filter((r) => {
        const nameNorm = normalize(r.info.name);
        const cuisinesNorm = (r.info.cuisines || []).map(normalize);
        const dishesNorm = (r.dishes || []).map(normalize);

        // Direct full phrase match
        if (
          nameNorm.includes(q) ||
          cuisinesNorm.some((c) => c.includes(q)) ||
          dishesNorm.some((d) => d.includes(q))
        ) {
          return true;
        }

        // Token-level match (e.g. "chicken" and "biryani")
        return queryTokens.every((token) =>
          nameNorm.includes(token) ||
          cuisinesNorm.some((c) => c.includes(token)) ||
          dishesNorm.some((d) => d.includes(token))
        );
      });
    }

    if (minRating) {
      result = result.filter((r) => r.info.avgRating >= parseFloat(minRating));
    }

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/restaurants/:id
router.get("/:id", (req, res) => {
  try {
    const list = getRestaurants();
    const item = list.find((r) => r.info.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    res.json({ success: true, data: item.info });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
export { getRestaurants, getMenus };
