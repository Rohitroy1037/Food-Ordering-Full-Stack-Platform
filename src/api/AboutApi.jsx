// AboutApi.jsx
// Connects to our local Express backend (/api/about)

export const fetchData = async () => {
  try {
    const res = await fetch("/api/about");
    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn("Direct proxy failed, trying absolute backend URL:", error.message);
    try {
      const fallbackRes = await fetch("http://localhost:5000/api/about");
      const fallbackJson = await fallbackRes.json();
      return fallbackJson.data;
    } catch (_) {
      return {
        name: "RasoiMitra Creator",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        bio: "Full Stack Developer passionate about crafting intuitive food apps and resilient digital architectures.",
        followers: 128,
        following: 42,
        public_repos: 24,
        html_url: "https://github.com",
      };
    }
  }
};
