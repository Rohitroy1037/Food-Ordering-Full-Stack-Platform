import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./Components/Layout/AppLayout";
import { Home } from "./Pages/Home";
import { Foods } from "./Pages/Foods";
import { Contact } from "./Pages/Contact";
import { About } from "./Pages/About";

import './App.css'
import { Recipe } from "./Components/UI/Recipe";
import { Cart } from "./Pages/Cart";
import { TrackOrder } from "./Pages/TrackOrder";
import { AuthPage } from "./Pages/AuthPage";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/track",
          element: <TrackOrder />,
        },
        {
          path: "/track/:orderId",
          element: <TrackOrder />,
        },
        {
          path: "/signin",
          element: <AuthPage />,
        },
        {
          path: "/signup",
          element: <AuthPage />,
        },
        {
          path: "/foods",
          element: <Foods />,
        },
        {
          path: "/foods/:id",
          element: <Recipe />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
