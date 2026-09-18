// RestaurantApi.jsx
// Connects to our local Express backend (/api/restaurants)

export const fetchRestroData = async () => {
  try {
    const res = await fetch("/api/restaurants");
    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.warn("Backend unavailable or returned error. Checking fallback:", error.message);
    // Fallback if backend server is not running
    try {
      const fallbackRes = await fetch("http://localhost:5000/api/restaurants");
      const fallbackJson = await fallbackRes.json();
      if (fallbackJson.success && Array.isArray(fallbackJson.data)) {
        return fallbackJson.data;
      }
    } catch (_) {}
    return [];
  }
};
