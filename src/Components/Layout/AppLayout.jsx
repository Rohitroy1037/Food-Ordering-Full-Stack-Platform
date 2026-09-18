import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import Festivals from "../utils/contextApi";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "../../Store";
import { AuthModal } from "../UI/AuthModal";

export const AppLayout = () => {
  const [festival, setFestival] = useState("");

  useEffect(() => {
    const data = {
      festivalName: "",
    };

    setFestival(festival);
  }, [festival]);

  return (
    <Provider store={store}>
      <Festivals.Provider value={{ festivalName: festival, setFestival }}>
        <div className="flex flex-col min-h-screen bg-[#D3DAD9]">
          {/* Header */}
          <Header />

          {/* Global Auth Modal */}
          <AuthModal />

          {/* Main Content */}
          <main className="flex-grow container mx-auto px-4 py-6">
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Festivals.Provider>
    </Provider>
  );
};
