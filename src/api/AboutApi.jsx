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
        name: "Rohit Roy",
        avatar_url: "https://github.com/Rohitroy1037.png",
        bio: "Full Stack Web Developer & Creator of RasoiMitra. Passionate about building seamless user experiences, modern UI/UX, and robust scalable backends.",
        followers: 15,
        following: 18,
        public_repos: 12,
        html_url: "https://github.com/Rohitroy1037",
      };
    }
  }
};
