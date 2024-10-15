import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import MapPage from "./MapPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/map/:id",
    element: <MapPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
