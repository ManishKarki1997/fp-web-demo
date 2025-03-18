import { Navigate, Outlet } from "react-router-dom";

import { Footer } from "./Footer";
import { Header } from "./Header";

export function HomeLayout() {

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <div className="flex-grow flex flex-col">
        {/* <div className="container px-4 md:px-8 flex-grow flex flex-col"> */}
        <div className="container !px-0 flex-grow flex flex-col py-4">
          <Outlet />
        </div>
      </div>
      {/* <div className="container px-4 md:px-8">
        <Footer />
      </div> */}
    </div>
  )
}
