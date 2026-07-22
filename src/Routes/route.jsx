import { createBrowserRouter } from "react-router";


import NotFound from "../pages/NotFound";

import AdminLayout from "../Admin/layout/AdminLayout";
import RootLayout from "../layouts/RootLayout";


export const route = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />
  },
  {
    path: "/admin",
    element: <AdminLayout />
  },
]);
