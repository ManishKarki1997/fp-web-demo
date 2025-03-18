import AlertsDashboardPage from "./pages/App/Alerts/AlertsDashboardPage";
import { Applayout } from "./layout/AppLayout";
import CreateAlert from "./pages/App/Alerts/CreateAlert";
import Dashboard from "./features/app/pages/Dashboard";
import { EntityRoutes } from "./routes/EntityRoutes";
import GetStarted from "./pages/GetStarted";
import Home from "./pages/Home/Home";
import { HomeLayout } from "./layout/HomeLayout";
import NoMatch from "./pages/NoMatch";
import ProfilePage from "./pages/App/ProfilePage";
import { ReportRoutes } from "./routes/ReportRoutes";
import { TagRoutes } from "./routes/TagRoutes";
import { TransactionRoutes } from "./routes/TransactionRoutes";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "get-started",
        element: <GetStarted />,
      },
    ],
  },
  {
    path: "/app",
    element: <Applayout />,
    children: [
      {
        path: "",
        element: <Dashboard />
      },
      {
        path: "entities",
        children: EntityRoutes
      },
      {
        path: "reports",
        children: ReportRoutes
      },
      {
        path: "transactions",
        children: TransactionRoutes
      },
      {
        path: "tags",
        children: TagRoutes
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "alerts",
        children: [
          {
            path: "",
            // element: <AlertsList />
            element: <AlertsDashboardPage />,
          },
          {
            path: "create",
            element: <CreateAlert />
          },
          {
            path: "edit/:alertId",
            element: <CreateAlert />
          },
        ]
      },
    ]
  },
  {
    path: "*",
    element: <NoMatch />,
  },
],)
