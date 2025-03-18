import { BellRing, Rocket, ScrollText } from 'lucide-react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import React, { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Skeleton } from '@/components/ui/skeleton'

const AlertLogsList = React.lazy(() => import('./AlertLogsList'))
const AlertsList = React.lazy(() => import('./AlertsList'))

const AlertsDashboardPage = () => {

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") ?? "alerts"

  const onTabsChange = (value: string) => {
    navigate(`/app/alerts/?tab=${value}`)
    setSearchParams({
      tab: value
    })
  }

  return (
    <div className='container'>
      <Suspense fallback={
        <div>
          <Skeleton className="w-[200px] h-[50px] rounded" />
          <Skeleton className="w-100% h-[500px] rounded mt-4" />
        </div>
      }>


        <Tabs value={activeTab} className="w-full" onValueChange={onTabsChange}>
          <TabsList className='justify-start sticky top-14 left-0 !py-6 px-1 z-10 shadow'>
            <TabsTrigger value="alerts" className='w-32 h-10 py-1 flex items-center gap-2'>
              <BellRing size={18} />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="logs" className='w-32 h-10 py-1 flex items-center gap-2'>
              <ScrollText size={18} />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts">
            <AlertsList />
          </TabsContent>

          <TabsContent value="logs">
            <AlertLogsList />
          </TabsContent>

        </Tabs>
      </Suspense>
    </div>
  )
}

export default AlertsDashboardPage