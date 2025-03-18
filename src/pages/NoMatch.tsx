import { NavLink } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export default function NoMatch() {
  return (
    <div className="bg-background text-foreground flex-grow flex items-center justify-center h-screen">
      <div className="space-y-4">
        <h2 className="text-8xl mb-4">404</h2>
        <h1 className="text-3xl font-semibold">Oops! Page not found</h1>
        <p className="text-sm text-muted-foreground">We are sorry, but the page you requested was not found</p>
        <NavLink to="/" className={buttonVariants()}>Back to Home</NavLink>
      </div>
    </div>
  )
}
