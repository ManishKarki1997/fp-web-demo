import { Separator } from '../ui/separator'
import {
  SidebarTrigger
} from "@/components/ui/sidebar"

const AppHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 left-0 z-10 w-full bg-background">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div id="app-header-portal" className='flex-1 w-full'></div>

        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
      </div>
    </header>
  )
}

export default AppHeader