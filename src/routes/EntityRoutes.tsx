import EntitiesDashboard from "@/features/entities/pages/EntitiesDashboard";
import EntityDetailPage from "@/features/entities/pages/EntityDetailPage";

export const EntityRoutes = [
  {
    path: "",
    element: <EntitiesDashboard />
  },
  {
    path: "detail/:id",
    element: <EntityDetailPage />
  },
]