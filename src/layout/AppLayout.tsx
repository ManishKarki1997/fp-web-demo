import { Navigate, Outlet } from "react-router-dom";

import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "./AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { useAppContext } from "@/components/hooks/useAppContext";

export function Applayout() {


  const { isLoggedIn } = useAppContext()


  if (!isLoggedIn) {
    return <Navigate to="/get-started" />
  }

  return (
    <div className="w-full flex">
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </div>
  )
}
