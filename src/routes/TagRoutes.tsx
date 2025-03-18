import EntityDetailPage from "@/features/entities/pages/EntityDetailPage";
import TagsDashboard from "@/features/tags/pages/TagsDashboard";

export const TagRoutes = [
  {
    path: "",
    element: <TagsDashboard />
  },
  {
    path: "detail/:id",
    element: <EntityDetailPage />
  },
]