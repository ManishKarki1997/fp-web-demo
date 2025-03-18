import { BellRing, ScrollText } from "lucide-react";
import { DashboardIcon, ViewVerticalIcon } from "@radix-ui/react-icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/mode-toggle";
import ProfileDropdown from "@/components/ProfileDropdown";
import { ScrollArea } from "@radix-ui/react-scroll-area";
// import { Logo } from "../logo";
import { useAppContext } from "@/components/hooks/useAppContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const NavLinks = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();
  const { t } = useTranslation()


  return <div className={`flex items-center gap-2 ${className}`}>
    <Button
      size="sm"
      variant='ghost'
      onClick={() => navigate("/app")}
      className="gap-2"
    >
      <DashboardIcon size={18} />
      {t("Dashboard")}
    </Button>
  </div>
}

export function Header() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()


  const { isLoggedIn } = useAppContext()

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
      <div className="container px-4 md:px-8 flex h-14 items-center">
        <div className="mr-4 hidden md:flex flex-1">
          <NavLink to="/" className="mr-6">
            <Logo />
          </NavLink>


          <nav className="ml-4 flex justify-end flex-1 space-x-4">
            {
              isLoggedIn &&
              <NavLinks />
            }
          </nav>
        </div>

        <NavLink to="/" className="mr-6 md:hidden">
          <Logo />
        </NavLink>

        {/* right */}
        <div className="flex-1 md:flex-none items-center justify-end space-x-2 md:justify-end">
          <div className="hidden">
            <LanguageSwitcher />
          </div>
          <nav className="flex items-center justify-end space-x-4">
            {/* mobile */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                  <ViewVerticalIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="px-4 sm:max-w-xs">

                <div className="flex items-center gap-2 justify-between mt-8">

                  <Logo />

                  <ProfileDropdown />
                </div>



                <ScrollArea className="mt-6">
                  <NavLinks className="flex-col justify-start !items-start" />
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <ModeToggle />

            {
              !isLoggedIn &&
              <Button onClick={() => navigate('/get-started')}>Get Started</Button>
            }

            {
              isLoggedIn &&
              <ProfileDropdown />
            }

          </nav>
        </div>
      </div>
    </header>
  )
}