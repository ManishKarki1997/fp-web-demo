import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  BookOpen,
  Bot,
  ChartArea,
  ChevronsUpDown,
  Command,
  HandCoins,
  LogOut,
  Settings2,
  SquareTerminal,
  TagsIcon,
  Users
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { useLogoutMutation, useMyInfoQuery } from "@/store/api/authApi"

import LanguageSwitcher from "@/components/LanguageSwitcher"
import Logo from "@/components/Logo"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAppContext } from "@/components/hooks/useAppContext"
import { useTranslation } from "react-i18next"

const AppSidebar = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const { data: profileInfo } = useMyInfoQuery({})
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation()
  const { localLogout } = useAppContext()
  const { t } = useTranslation()



  const data = {
    user: {
      name: "Manish Karki",
      email: "blackfeather247@gmail.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Playground",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    // navSecondary: [
    //   {
    //     title: "Support",
    //     url: "#",
    //     icon: LifeBuoy,
    //   },
    //   {
    //     title: "Feedback",
    //     url: "#",
    //     icon: Send,
    //   },
    // ],
    links: [
      {
        name: t("Dashboard"),
        url: "/app",
        exact: true,
        icon: Users,
      },
      {
        name: t("Entities"),
        url: "/app/entities",
        icon: Users,
      },
      {
        name: t("Transactions"),
        url: "/app/transactions",
        icon: HandCoins,
      },
      // {
      //   name: t("Report"),
      //   url: "/app/reports",
      //   icon: ChartArea,
      // },
      {
        name: t("Tags"),
        url: "/app/tags",
        icon: TagsIcon,
      },
    ],
  }

  const handleLogout = async () => {
    if (isLoggingOut) return;

    const loadingId = toast.loading("Logging out")
    try {
      await logoutMutation({}).unwrap()
      toast.dismiss(loadingId)
      toast.success("Logged out successfully.")
      localLogout()
      navigate("/")
    } catch (error) {
      const errorMessage = error?.data.message || t("Something went wrong")
      toast.dismiss(loadingId)
      toast.error(errorMessage)
    }

  }




  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center justify-between">
                <Logo />
                <ModeToggle />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup> */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden mt-4">
          <SidebarMenu>
            {data.links.map((item) => {

              const isLinkActive = item.exact ? location.pathname === item.url : location.pathname.startsWith(item.url)

              return (
                <SidebarMenuItem key={item.name}
                >
                  <SidebarMenuButton asChild className={cn("rounded h-10", isLinkActive && "bg-primary/40 hover:bg-primary/50 ")}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {
          profileInfo?.name &&
          <SidebarFooter className="mt-auto">
            <SidebarMenu>
              <SidebarMenuItem className="mb-4">
                <LanguageSwitcher />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={profileInfo?.name}
                          alt={profileInfo?.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {profileInfo?.name?.split(" ").map(x => x[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {profileInfo?.name}
                        </span>
                        <span className="truncate text-xs">
                          {profileInfo?.email}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={data.user.avatar}
                            alt={data.user.name}
                          />
                          <AvatarFallback className="rounded-lg">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {data.user.name}
                          </span>
                          <span className="truncate text-xs">
                            {data.user.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="gap-2" onClick={handleLogout}>
                      <LogOut size={18} />
                      {t("Log Out")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        }
      </SidebarContent>



    </Sidebar>
  )
}

export default AppSidebar