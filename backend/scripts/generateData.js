import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verified, high-resolution food image catalog from Unsplash
const IMAGES = {
  biryani: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
  butterChicken: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80",
  paneer: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
  pizzaMargherita: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  burgerChicken: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
  fries: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
  dalMakhani: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
  naan: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80",
  dosa: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
  idli: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
  noodles: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
  manchurian: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80",
  momos: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80",
  pasta: "https://images.unsplash.com/photo-1621996346565-e3d5d6281698?auto=format&fit=crop&w=600&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
  wrap: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
  dessert: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
  iceCream: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=600&q=80",
  waffle: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80",
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
  coffee: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
  shake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
  tea: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
  chaat: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
  thali: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80",
  kebab: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
  pavBhaji: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80"
};

const RESTAURANTS_DATA = [
  // 1. RasoiMitra Royal Kitchen
  {
    id: "148987",
    name: "RasoiMitra Royal Kitchen",
    image: IMAGES.thali,
    locality: "Model Town",
    areaName: "Central Hub",
    costForTwo: "₹350 for two",
    cuisines: ["North Indian", "Biryani", "Mughlai", "Fast Food"],
    avgRating: 4.6,
    veg: false,
    deliveryTime: 25,
    discount: { header: "50% OFF", subHeader: "UPTO ₹100" },
    menu: [
      {
        category: "Chef's Recommendations 🔥",
        items: [
          { id: "rm_1", name: "Special Dum Handi Biryani", price: 32000, desc: "Aromatic long-grain basmati rice layered with tender marinated chicken pieces, slow-cooked in a sealed clay pot with saffron & authentic spices.", image: IMAGES.biryani, isVeg: 0 },
          { id: "rm_2", name: "Shahi Paneer Butter Masala", price: 28000, desc: "Fresh cottage cheese cubes simmered in a rich, buttery and creamy tomato-cashew gravy with hint of fenugreek.", image: IMAGES.paneer, isVeg: 1 },
          { id: "rm_3", name: "Crispy Farmhouse Cheese Pizza", price: 34900, desc: "Fresh hand-stretched crust topped with herb tomato sauce, mozzarella cheese, bell peppers, onions, and sweet corn.", image: IMAGES.pizza, isVeg: 1 }
        ]
      },
      {
        category: "Main Course Curries 🍛",
        items: [
          { id: "rm_4", name: "Dal Makhani Slow-Cooked", price: 24000, desc: "Whole black lentils and kidney beans simmered overnight with butter, cream, and slow wood-fire smoke.", image: IMAGES.dalMakhani, isVeg: 1 },
          { id: "rm_5", name: "Butter Garlic Naan (2 Pcs)", price: 9000, desc: "Traditional tandoor-baked leavened bread brushed generously with garlic butter and fresh coriander.", image: IMAGES.naan, isVeg: 1 },
          { id: "rm_6", name: "Murgh Makhani Butter Chicken", price: 34000, desc: "Tandoori chicken pieces cooked in a creamy spiced tomato gravy with rich butter and fenugreek.", image: IMAGES.butterChicken, isVeg: 0 }
        ]
      }
    ]
  },

  // 2. Pizza Wings & Crusts
  {
    id: "148988",
    name: "Pizza Wings & Crusts",
    image: IMAGES.pizza,
    locality: "GT Road",
    areaName: "University Gate",
    costForTwo: "₹300 for two",
    cuisines: ["Pizzas", "Italian", "Pastas", "Beverages"],
    avgRating: 4.3,
    veg: true,
    deliveryTime: 30,
    discount: { header: "ITEMS", subHeader: "AT ₹129" },
    menu: [
      {
        category: "Gourmet Pizzas 🍕",
        items: [
          { id: "piz_1", name: "Classic Margherita Pizza", price: 19900, desc: "Authentic Italian tomato sauce, mozzarella cheese, fresh basil leaves, and extra virgin olive oil drizzle.", image: IMAGES.pizzaMargherita, isVeg: 1 },
          { id: "piz_2", name: "Peppy Paneer Supreme Pizza", price: 27900, desc: "Spicy paneer cubes, crisp capsicum, red paprika, and stretchy mozzarella.", image: IMAGES.pizza, isVeg: 1 },
          { id: "piz_3", name: "Creamy White Sauce Alfredo Pasta", price: 21900, desc: "Penne pasta tossed in rich parmesan cream sauce with sautéed mushrooms and sweet corn.", image: IMAGES.pasta, isVeg: 1 }
        ]
      }
    ]
  },

  // 3. Burger Haven
  {
    id: "148989",
    name: "Burger Haven",
    image: IMAGES.burger,
    locality: "City Center",
    areaName: "Main Market",
    costForTwo: "₹250 for two",
    cuisines: ["Burgers", "Snacks", "American", "Beverages"],
    avgRating: 4.4,
    veg: false,
    deliveryTime: 20,
    discount: { header: "40% OFF", subHeader: "UPTO ₹80" },
    menu: [
      {
        category: "Signature Burgers & Fries 🍔",
        items: [
          { id: "bur_1", name: "Loaded Crispy Veg Burger", price: 14900, desc: "Golden crisp herb patty, lettuce, cheese slice, gherkins and secret chipotle sauce.", image: IMAGES.burger, isVeg: 1 },
          { id: "bur_2", name: "Double Cheese Chicken Burger", price: 22900, desc: "Grilled juicy chicken patty with melted cheddar, caramelised onions, and barbecue sauce.", image: IMAGES.burgerChicken, isVeg: 0 },
          { id: "bur_3", name: "Peri Peri French Fries", price: 11900, desc: "Crispy golden french fries tossed with African peri-peri spice mix.", image: IMAGES.fries, isVeg: 1 }
        ]
      }
    ]
  },

  // 4. Dum Biryani Palace
  {
    id: "148990",
    name: "Dum Biryani Palace",
    image: IMAGES.biryani,
    locality: "Defence Colony",
    areaName: "South Avenue",
    costForTwo: "₹400 for two",
    cuisines: ["Biryani", "Hyderabadi", "Mughlai"],
    avgRating: 4.7,
    veg: false,
    deliveryTime: 35,
    discount: { header: "FLAT DEAL", subHeader: "₹125 OFF" },
    menu: [
      {
        category: "Specialty Biryanis 🥘",
        items: [
          { id: "bir_1", name: "Hyderabadi Chicken Biryani", price: 29900, desc: "Authentic Hyderabadi kacchi dum chicken biryani cooked with fragrant basmati rice, tender chicken, and whole spices.", image: IMAGES.biryani, isVeg: 0 },
          { id: "bir_2", name: "Chicken Dum Biryani (Full)", price: 34900, desc: "Generous serving of slow-cooked spiced chicken biryani with boiled egg, mirchi salan, and onion raita.", image: IMAGES.biryani, isVeg: 0 },
          { id: "bir_3", name: "Royal Mutton Dum Biryani", price: 42000, desc: "Tender pieces of mutton marinated in curd and secret spices, layered with saffron rice and fried onions.", image: IMAGES.biryani, isVeg: 0 },
          { id: "bir_4", name: "Paneer Tikka Biryani", price: 26000, desc: "Smoky char-grilled paneer cubes layered with aromatic spiced basmati rice.", image: IMAGES.paneer, isVeg: 1 }
        ]
      }
    ]
  },

  // 5. Shahi Dawat Punjabi Dhaba
  {
    id: "148991",
    name: "Shahi Dawat Punjabi Dhaba",
    image: IMAGES.dalMakhani,
    locality: "Highway Plaza",
    areaName: "GT Road",
    costForTwo: "₹280 for two",
    cuisines: ["Punjabi", "Thalis", "Tandoor", "Desserts"],
    avgRating: 4.3,
    veg: true,
    deliveryTime: 28,
    discount: { header: "60% OFF", subHeader: "UPTO ₹120" },
    menu: [
      {
        category: "Punjabi Thalis & Curries 🍲",
        items: [
          { id: "pun_1", name: "Special Amritsari Chole Bhature", price: 17900, desc: "Two fluffy deep-fried bhaturas served with spicy dark Amritsari pindi chole and tangy pickle.", image: IMAGES.chaat, isVeg: 1 },
          { id: "pun_2", name: "Dal Makhani Desi Ghee", price: 23000, desc: "Slow-cooked black lentils prepared with pure desi ghee and fresh churned butter.", image: IMAGES.dalMakhani, isVeg: 1 },
          { id: "pun_3", name: "Paneer Butter Masala", price: 26000, desc: "Cottage cheese cubes tossed in velvet tomato gravy with kasuri methi.", image: IMAGES.paneer, isVeg: 1 }
        ]
      }
    ]
  },

  // 6. Dragon Wok Indo-Chinese
  {
    id: "148992",
    name: "Dragon Wok Indo-Chinese",
    image: IMAGES.noodles,
    locality: "Urban Estate",
    areaName: "Phase 1",
    costForTwo: "₹290 for two",
    cuisines: ["Chinese", "Asian", "Noodles", "Momos"],
    avgRating: 4.2,
    veg: true,
    deliveryTime: 22,
    discount: { header: "20% OFF", subHeader: "ABOVE ₹249" },
    menu: [
      {
        category: "Wok Specials & Momos 🍜",
        items: [
          { id: "chi_1", name: "Chilli Garlic Hakka Noodles", price: 21000, desc: "Wok-tossed noodles with shredded vegetables, roasted garlic, and spicy red chilli sauce.", image: IMAGES.noodles, isVeg: 1 },
          { id: "chi_2", name: "Veg Manchurian Gravy", price: 22000, desc: "Crispy vegetable balls simmered in a dark, savoury, tangy soya and ginger garlic gravy.", image: IMAGES.manchurian, isVeg: 1 },
          { id: "chi_3", name: "Steamed Veg Momos (8 Pcs)", price: 14900, desc: "Delicate thin-wrapper dumplings filled with seasoned vegetables, served with fiery red chutney.", image: IMAGES.momos, isVeg: 1 }
        ]
      }
    ]
  },

  // 7. Sagar Ratna South Indian
  {
    id: "148993",
    name: "Sagar Ratna",
    image: IMAGES.dosa,
    locality: "Civil Lines",
    areaName: "Mall Road",
    costForTwo: "₹250 for two",
    cuisines: ["South Indian", "Dosa", "Idli", "Vada", "Beverages"],
    avgRating: 4.5,
    veg: true,
    deliveryTime: 25,
    discount: { header: "25% OFF", subHeader: "ON ALL ORDERS" },
    menu: [
      {
        category: "Authentic South Indian 🥞",
        items: [
          { id: "sr_1", name: "Mysore Masala Dosa", price: 18000, desc: "Golden crisp crepe smeared with fiery red garlic-chilli chutney and filled with spiced potato mash.", image: IMAGES.dosa, isVeg: 1 },
          { id: "sr_2", name: "Ghee Podi Button Idli", price: 14000, desc: "Mini steamed rice cakes tossed in melted cow ghee and gunpowder lentil spice mix.", image: IMAGES.idli, isVeg: 1 },
          { id: "sr_3", name: "Crispy Medu Vada Sambar", price: 13000, desc: "Crispy fried lentil donuts served with piping hot vegetable sambar and fresh coconut chutney.", image: IMAGES.chaat, isVeg: 1 }
        ]
      }
    ]
  },

  // 8. Behrouz Biryani - The Royal Feast
  {
    id: "148994",
    name: "Behrouz Biryani",
    image: IMAGES.biryani,
    locality: "Green Park",
    areaName: "Sector 14",
    costForTwo: "₹500 for two",
    cuisines: ["Biryani", "Mughlai", "North Indian", "Kebab"],
    avgRating: 4.6,
    veg: false,
    deliveryTime: 30,
    discount: { header: "₹100 OFF", subHeader: "USE BEHROUZ100" },
    menu: [
      {
        category: "Royal Biryani Handis 👑",
        items: [
          { id: "bb_1", name: "Dum Gosht Mutton Biryani", price: 46000, desc: "Tender meat pieces slow-cooked with royal whole spices, layered with saffron basmati rice.", image: IMAGES.biryani, isVeg: 0 },
          { id: "bb_2", name: "Murgh Makhani Biryani", price: 39000, desc: "Boneless chicken tikka tossed in makhani gravy layered with spiced basmati and garnished with dried nuts.", image: IMAGES.biryani, isVeg: 0 },
          { id: "bb_3", name: "Subz-e-Biryani", price: 29000, desc: "Assorted garden vegetables and fresh paneer slow-cooked with aromatic royal spices.", image: IMAGES.paneer, isVeg: 1 }
        ]
      }
    ]
  },

  // 9. La Pino'z Gourmet Pizza
  {
    id: "148995",
    name: "La Pino'z Pizza",
    image: IMAGES.pizza,
    locality: "Model Town",
    areaName: "Near Fountain",
    costForTwo: "₹350 for two",
    cuisines: ["Pizzas", "Italian", "Fast Food", "Garlic Bread"],
    avgRating: 4.4,
    veg: true,
    deliveryTime: 25,
    discount: { header: "BOGO FREE", subHeader: "ON WEDNESDAYS" },
    menu: [
      {
        category: "Monster & Gourmet Pizzas 🍕",
        items: [
          { id: "lp_1", name: "Cheesy-7 Pizza", price: 29900, desc: "Heavenly combination of 7 exquisite cheeses including Mozzarella, Gouda, Cheddar, and Monterey Jack.", image: IMAGES.pizza, isVeg: 1 },
          { id: "lp_2", name: "English Retreat Pizza", price: 28900, desc: "Olives, red paprika, sweet corn, jalapeños, and capsicum with signature sauce.", image: IMAGES.pizzaMargherita, isVeg: 1 },
          { id: "lp_3", name: "Stuffed Garlic Breadsticks", price: 15900, desc: "Crispy freshly baked bread brushed with herb butter and stuffed with sweet corn & jalapeño cheese.", image: IMAGES.naan, isVeg: 1 }
        ]
      }
    ]
  },

  // 10. Wow! Momo & Tibetan Delights
  {
    id: "148996",
    name: "Wow! Momo & Tibetan Kitchen",
    image: IMAGES.momos,
    locality: "University Mall",
    areaName: "Food Court",
    costForTwo: "₹220 for two",
    cuisines: ["Tibetan", "Momos", "Asian", "Chinese"],
    avgRating: 4.3,
    veg: false,
    deliveryTime: 20,
    discount: { header: "FREE PEPSI", subHeader: "ON COMBOS" },
    menu: [
      {
        category: "Steamed, Fried & Pan Fried Momos 🥟",
        items: [
          { id: "wm_1", name: "Darjeeling Chicken Momos (8 Pcs)", price: 17900, desc: "Authentic Himalayan minced chicken dumplings flavoured with spring onions and coriander.", image: IMAGES.momos, isVeg: 0 },
          { id: "wm_2", name: "Pan Fried Schezwan Veg Momos", price: 16900, desc: "Pan-crisped vegetable momos tossed in hot, zesty Schezwan sauce.", image: IMAGES.momos, isVeg: 1 },
          { id: "wm_3", name: "Cheese & Corn Fried Momos", price: 18900, desc: "Crunchy fried momos oozing with melted cheese and sweet corn.", image: IMAGES.momos, isVeg: 1 }
        ]
      }
    ]
  },

  // 11. Haldiram's Sweets, Chaat & Snacks
  {
    id: "148997",
    name: "Haldiram's Sweets & Snacks",
    image: IMAGES.chaat,
    locality: "Market Plaza",
    areaName: "Commercial Complex",
    costForTwo: "₹300 for two",
    cuisines: ["Street Food", "Chaat", "North Indian", "Sweets"],
    avgRating: 4.5,
    veg: true,
    deliveryTime: 25,
    discount: { header: "20% OFF", subHeader: "ON SWEETS" },
    menu: [
      {
        category: "Famous Dilli Ki Chaat & Snacks 🥙",
        items: [
          { id: "hd_1", name: "Special Raj Kachori", price: 14000, desc: "Crispy hollow shell stuffed with potatoes, sprouted lentils, sweetened yoghurt, tamarind and mint chutneys.", image: IMAGES.chaat, isVeg: 1 },
          { id: "hd_2", name: "Chole Bhature Delite", price: 18000, desc: "Golden fried fluffy bhaturas served with robust spicy chickpeas and onion rings.", image: IMAGES.chaat, isVeg: 1 },
          { id: "hd_3", name: "Kaju Katli (250g Box)", price: 29900, desc: "Diamond-shaped cashew nut fudge coated in pure edible silver leaf.", image: IMAGES.dessert, isVeg: 1 }
        ]
      }
    ]
  },

  // 12. Faasos Signature Wraps & Rolls
  {
    id: "148998",
    name: "Faasos Signature Wraps",
    image: IMAGES.wrap,
    locality: "Metro Station Road",
    areaName: "Sector 3",
    costForTwo: "₹280 for two",
    cuisines: ["Wraps", "Rolls", "Fast Food", "North Indian"],
    avgRating: 4.2,
    veg: false,
    deliveryTime: 20,
    discount: { header: "BUY 1 GET 1", subHeader: "ON SELECT WRAPS" },
    menu: [
      {
        category: "Loaded Paratha Wraps 🌯",
        items: [
          { id: "fs_1", name: "Smokey Chicken Tikka Wrap", price: 21900, desc: "Char-grilled smoky chicken tikka wrapped in a flakey paratha with mint mayo and pickled onions.", image: IMAGES.wrap, isVeg: 0 },
          { id: "fs_2", name: "Paneer Signature Melt Wrap", price: 19900, desc: "Soft paneer tossed in chipotle sauce with melted cheese slice inside a handmade paratha.", image: IMAGES.wrap, isVeg: 1 },
          { id: "fs_3", name: "Double Egg Double Cheese Roll", price: 16900, desc: "Fluffy two-egg omelette layered on paratha with melted cheese and spicy green relish.", image: IMAGES.wrap, isVeg: 0 }
        ]
      }
    ]
  },

  // 13. The Belgian Waffle Co.
  {
    id: "148999",
    name: "The Belgian Waffle Co.",
    image: IMAGES.waffle,
    locality: "City Square",
    areaName: "High Street",
    costForTwo: "₹200 for two",
    cuisines: ["Waffles", "Desserts", "Bakery", "Ice Cream"],
    avgRating: 4.6,
    veg: true,
    deliveryTime: 18,
    discount: { header: "FLAT 30% OFF", subHeader: "SWEET DEALS" },
    menu: [
      {
        category: "Warm Crispy Waffle-wiches 🧇",
        items: [
          { id: "bw_1", name: "Nutella Overload Waffle", price: 17500, desc: "Warm crispy European waffle loaded with premium Nutella hazelnut cocoa spread.", image: IMAGES.waffle, isVeg: 1 },
          { id: "bw_2", name: "Red Velvet Cream Cheese Waffle", price: 16500, desc: "Signature red velvet batter waffle filled with sweet vanilla cream cheese and white chocolate.", image: IMAGES.waffle, isVeg: 1 },
          { id: "bw_3", name: "Death By Chocolate Waffle", price: 18500, desc: "Dark chocolate waffle filled with melted dark chocolate and topped with chocolate curls.", image: IMAGES.cake, isVeg: 1 }
        ]
      }
    ]
  },

  // 14. Bombay Chowpatty Pav Bhaji & Vada Pav
  {
    id: "149000",
    name: "Bombay Chowpatty Pav Bhaji",
    image: IMAGES.pavBhaji,
    locality: "Old Town Market",
    areaName: "Station Area",
    costForTwo: "₹180 for two",
    cuisines: ["Street Food", "Mumbai Fast Food", "Pav Bhaji", "Snacks"],
    avgRating: 4.4,
    veg: true,
    deliveryTime: 18,
    discount: { header: "EXTRA BUTTER", subHeader: "FREE ON BHANJI" },
    menu: [
      {
        category: "Mumbai Street Specials 🍞",
        items: [
          { id: "bc_1", name: "Special Amul Butter Pav Bhaji", price: 14000, desc: "Spiced mashed vegetable curry slow-simmered on a tawa with copious melted Amul butter and toasted pavs.", image: IMAGES.pavBhaji, isVeg: 1 },
          { id: "bc_2", name: "Cheese Burst Pav Bhaji", price: 17000, desc: "Signature spicy bhaji topped with a thick blanket of grated processed cheese.", image: IMAGES.pavBhaji, isVeg: 1 },
          { id: "bc_3", name: "Mumbai Batata Vada Pav (2 Pcs)", price: 9000, desc: "Golden spiced potato fritters served inside pavs with dry garlic chutney and fried green chilli.", image: IMAGES.chaat, isVeg: 1 }
        ]
      }
    ]
  },

  // 15. Cafe Coffee Day & Brews
  {
    id: "149001",
    name: "Cafe Coffee Day",
    image: IMAGES.coffee,
    locality: "Campus Road",
    areaName: "Near Library",
    costForTwo: "₹250 for two",
    cuisines: ["Cafe", "Coffee", "Sandwiches", "Desserts"],
    avgRating: 4.3,
    veg: true,
    deliveryTime: 20,
    discount: { header: "BUY 1 GET 1", subHeader: "ON ICED COFFEE" },
    menu: [
      {
        category: "Cold Coffees & Bites ☕",
        items: [
          { id: "ccd_1", name: "Devil's Own Cold Frappe", price: 19900, desc: "Rich espresso blended with vanilla ice cream, thick chocolate fudge, and whipped cream.", image: IMAGES.coffee, isVeg: 1 },
          { id: "ccd_2", name: "Classic Cappuccino", price: 13900, desc: "Balanced dark roast espresso topped with steamed milk and thick velvety microfoam.", image: IMAGES.coffee, isVeg: 1 },
          { id: "ccd_3", name: "Crispy Veg Club Sandwich", price: 15900, desc: "Triple-layer toasted sandwich stuffed with cucumber, tomato, herb potato mash, and cheese.", image: IMAGES.sandwich, isVeg: 1 }
        ]
      }
    ]
  },

  // 16. Keventers - The Original Milkshake
  {
    id: "149002",
    name: "Keventers Milkshakes",
    image: IMAGES.shake,
    locality: "Expressway Mall",
    areaName: "Level 2",
    costForTwo: "₹250 for two",
    cuisines: ["Beverages", "Milkshakes", "Desserts", "Ice Cream"],
    avgRating: 4.5,
    veg: true,
    deliveryTime: 15,
    discount: { header: "20% OFF", subHeader: "ON BOTTLES" },
    menu: [
      {
        category: "Iconic Thick Milkshakes 🥤",
        items: [
          { id: "kv_1", name: "Chocolate Oreo Thick Shake", price: 18900, desc: "Crushed crunchy Oreo cookies blended with dairy ice cream and dark cocoa sauce in a signature glass bottle.", image: IMAGES.shake, isVeg: 1 },
          { id: "kv_2", name: "Alfonso Mango Milkshake", price: 17900, desc: "Made with genuine Ratnagiri Alfonso mango pulp and chilled full-cream milk.", image: IMAGES.shake, isVeg: 1 },
          { id: "kv_3", name: "Classic Strawberry Shake", price: 15900, desc: "Fresh sweet strawberries whipped into thick creamy chilled milk.", image: IMAGES.shake, isVeg: 1 }
        ]
      }
    ]
  },

  // 17. Karim's Old Delhi Mughlai
  {
    id: "149003",
    name: "Karim's Old Delhi Mughlai",
    image: IMAGES.kebab,
    locality: "Heritage Lane",
    areaName: "Old Quarter",
    costForTwo: "₹450 for two",
    cuisines: ["Mughlai", "Kebabs", "Biryani", "North Indian"],
    avgRating: 4.7,
    veg: false,
    deliveryTime: 35,
    discount: { header: "ROYAL DEAL", subHeader: "15% OFF ORDERS" },
    menu: [
      {
        category: "Royal Mughlai Specials 🍖",
        items: [
          { id: "km_1", name: "Mutton Seekh Kebab (4 Pcs)", price: 34000, desc: "Finely minced spiced mutton skewers grilled over live glowing charcoal embers.", image: IMAGES.kebab, isVeg: 0 },
          { id: "km_2", name: "Shahi Mutton Korma", price: 41000, desc: "Slow-cooked mutton pieces in a thick, opulent brown onion and curd gravy with royal essences.", image: IMAGES.butterChicken, isVeg: 0 },
          { id: "km_3", name: "Tandoori Chicken Full", price: 45000, desc: "Whole tender chicken marinated in Kashmiri red chilli, curd, and tandoori spices, char-grilled to perfection.", image: IMAGES.kebab, isVeg: 0 }
        ]
      }
    ]
  },

  // 18. Subway Fresh Subs & Salads
  {
    id: "149004",
    name: "Subway Fresh Subs",
    image: IMAGES.sandwich,
    locality: "Metro Plaza",
    areaName: "Ground Floor",
    costForTwo: "₹300 for two",
    cuisines: ["Healthy Food", "Sandwiches", "Salads", "Fast Food"],
    avgRating: 4.3,
    veg: false,
    deliveryTime: 20,
    discount: { header: "FREE COOKIE", subHeader: "ON ANY SUB" },
    menu: [
      {
        category: "Fresh Subs & Wraps 🥪",
        items: [
          { id: "sub_1", name: "Paneer Tikka 6-Inch Sub", price: 21900, desc: "Tandoori spiced paneer cubes with your choice of freshly baked bread, garden veggies, and creamy sauces.", image: IMAGES.sandwich, isVeg: 1 },
          { id: "sub_2", name: "Roasted Chicken Strip Sub", price: 24900, desc: "Tender roasted chicken strips topped with lettuce, cucumbers, jalapeños, and sweet onion sauce.", image: IMAGES.sandwich, isVeg: 0 },
          { id: "sub_3", name: "Double Chocolate Chip Cookie", price: 5900, desc: "Soft-baked American cookie packed with gooey chocolate chips.", image: IMAGES.cake, isVeg: 1 }
        ]
      }
    ]
  },

  // 19. Naturals Artisan Ice Cream
  {
    id: "149005",
    name: "Naturals Ice Cream",
    image: IMAGES.iceCream,
    locality: "Boulevard Road",
    areaName: "West End",
    costForTwo: "₹180 for two",
    cuisines: ["Ice Cream", "Desserts", "Natural Fruits"],
    avgRating: 4.8,
    veg: true,
    deliveryTime: 15,
    discount: { header: "20% OFF", subHeader: "FAMILY PACKS" },
    menu: [
      {
        category: "Real Fruit Scoops 🍨",
        items: [
          { id: "nat_1", name: "Tender Coconut Ice Cream (Double Scoop)", price: 16000, desc: "Made with genuine tender coconut water, tender malai pieces, milk, and sugar.", image: IMAGES.iceCream, isVeg: 1 },
          { id: "nat_2", name: "Alphonso Mango Scoop", price: 15000, desc: "Pure mango sweetness without any artificial colors or preservatives.", image: IMAGES.iceCream, isVeg: 1 },
          { id: "nat_3", name: "Roasted Almond Scoop", price: 17000, desc: "Creamy milk ice cream loaded with crunchy roasted California almonds.", image: IMAGES.iceCream, isVeg: 1 }
        ]
      }
    ]
  },

  // 20. Chai Point & Nashta
  {
    id: "149006",
    name: "Chai Point & Snacks",
    image: IMAGES.tea,
    locality: "IT Park",
    areaName: "Tower B Gate",
    costForTwo: "₹150 for two",
    cuisines: ["Tea", "Chai", "Snacks", "Bakery"],
    avgRating: 4.4,
    veg: true,
    deliveryTime: 15,
    discount: { header: "FREE SAMOSA", subHeader: "ON CHAI FLASK" },
    menu: [
      {
        category: "Hot Brews & Quick Bites ☕",
        items: [
          { id: "cp_1", name: "Adrak Elaichi Chai (500ml Flask)", price: 13900, desc: "Fresh hand-pounded ginger and cardamom brewed with premium Assam tea leaves and cow milk.", image: IMAGES.tea, isVeg: 1 },
          { id: "cp_2", name: "Mumbaiya Bun Maska", price: 6900, desc: "Soft sweet bun sliced and generously slathered with salted butter.", image: IMAGES.sandwich, isVeg: 1 },
          { id: "cp_3", name: "Crispy Samosa with Mint Chutney (2 Pcs)", price: 7900, desc: "Golden fried pyramid pastry filled with spiced potatoes and peas.", image: IMAGES.chaat, isVeg: 1 }
        ]
      }
    ]
  },

  // 21. EatFit Healthy Food & Bowls
  {
    id: "149007",
    name: "EatFit Healthy Kitchen",
    image: IMAGES.salad,
    locality: "Eco Park",
    areaName: "Green Sector",
    costForTwo: "₹350 for two",
    cuisines: ["Healthy Food", "Salads", "Bowls", "North Indian"],
    avgRating: 4.5,
    veg: false,
    deliveryTime: 22,
    discount: { header: "FLAT ₹75 OFF", subHeader: "EAT CLEAN" },
    menu: [
      {
        category: "Wholesome Balanced Bowls 🥗",
        items: [
          { id: "ef_1", name: "High-Protein Grilled Chicken Salad", price: 27900, desc: "Herb-grilled chicken breast cubes with crisp greens, cherry tomatoes, cucumbers, and olive oil vinaigrette.", image: IMAGES.salad, isVeg: 0 },
          { id: "ef_2", name: "Moong Dal & Quinoa Khichdi", price: 21900, desc: "Easily digestible wholesome superfood khichdi prepared with ghee and roasted cumin.", image: IMAGES.dalMakhani, isVeg: 1 },
          { id: "ef_3", name: "Fruit & Nut Protein Yogurt Bowl", price: 18900, desc: "Greek yogurt topped with fresh seasonal berries, sliced bananas, chia seeds, and honey.", image: IMAGES.salad, isVeg: 1 }
        ]
      }
    ]
  },

  // 22. Theobroma Patisserie & Bakery
  {
    id: "149008",
    name: "Theobroma Patisserie",
    image: IMAGES.cake,
    locality: "Civil Center",
    areaName: "Arcade Block",
    costForTwo: "₹300 for two",
    cuisines: ["Bakery", "Desserts", "Cakes", "Pastries"],
    avgRating: 4.8,
    veg: true,
    deliveryTime: 20,
    discount: { header: "SWEET TREATS", subHeader: "20% OFF" },
    menu: [
      {
        category: "Decadent Brownies & Pastries 🍰",
        items: [
          { id: "tb_1", name: "Signature Overload Brownie", price: 12500, desc: "Dense, gooey chocolate brownie made with 55% pure Belgian dark chocolate.", image: IMAGES.cake, isVeg: 1 },
          { id: "tb_2", name: "New York Baked Cheesecake Slice", price: 18000, desc: "Creamy baked Philadelphia cheesecake on a crunchy digestive biscuit crust.", image: IMAGES.cake, isVeg: 1 },
          { id: "tb_3", name: "Red Velvet Pastry with Cream Cheese", price: 14000, desc: "Velvety sponge layered with tangy vanilla cream cheese frosting.", image: IMAGES.cake, isVeg: 1 }
        ]
      }
    ]
  }
];

// Generate JSON files
const restaurants = [];
const menus = {};

RESTAURANTS_DATA.forEach((r) => {
  restaurants.push({
    info: {
      id: r.id,
      name: r.name,
      cloudinaryImageId: r.image,
      locality: r.locality,
      areaName: r.areaName,
      costForTwo: r.costForTwo,
      cuisines: r.cuisines,
      avgRating: r.avgRating,
      veg: r.veg,
      sla: {
        deliveryTime: r.deliveryTime
      },
      aggregatedDiscountInfoV3: r.discount
    }
  });

  menus[r.id] = {
    restaurantInfo: {
      id: r.id,
      name: r.name,
      cuisines: r.cuisines,
      costForTwoMessage: r.costForTwo,
      areaName: r.areaName,
      avgRating: String(r.avgRating)
    },
    menuItems: r.menu.map((cat, idx) => ({
      card: {
        card: {
          "@type": "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory",
          title: cat.category,
          categoryId: `cat_${r.id}_${idx}`,
          itemCards: cat.items.map((item) => ({
            card: {
              info: {
                id: item.id,
                name: item.name,
                price: item.price,
                defaultPrice: item.price,
                description: item.desc,
                imageId: item.image,
                isVeg: item.isVeg
              }
            }
          }))
        }
      }
    }))
  };
});

// Write to files
const restPath = path.join(__dirname, "../data/restaurants.json");
const menuPath = path.join(__dirname, "../data/menus.json");

fs.writeFileSync(restPath, JSON.stringify(restaurants, null, 2));
fs.writeFileSync(menuPath, JSON.stringify(menus, null, 2));

console.log(`✅ Successfully generated ${restaurants.length} restaurants and menus!`);
