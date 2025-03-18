import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import AppHeaderPortal from '@/components/layout/AppHeaderPortal'
import BestPerformingTagsChart from "../components/Charts/BestPerformingTagsChart"
import DebtsVsRepaymentsChart from '../components/Charts/DebtsVsRepaymentsChart'
import EntityLoansTable from "../components/Tables/EntityLoansTable"
import EntityRankChart from '../components/Charts/EntityRankChart'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Dashboard = () => {

  const { t } = useTranslation()

  return (
    <div>

      <AppHeaderPortal
        title={
          <div className='flex items-center gap-2'>
            {t("Dashboard")}
          </div>
        }
      >
      </AppHeaderPortal>

      <div className="grid grid-cols-12 gap-12">

        <div className="mt-8 col-span-12">
          <EntityLoansTable />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <DebtsVsRepaymentsChart />

        </div>
        <div className="col-span-12 xl:col-span-6">

          <EntityRankChart />
        </div>
        {/* <ResizablePanelGroup direction="horizontal" className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[700px] w-full bg-green-500 col-span-12">
          <ResizablePanel className=" bg-blue-500">
            <DebtsVsRepaymentsChart />
          </ResizablePanel>

          <ResizableHandle className="w-1" />

          <ResizablePanel className="">
            <EntityRankChart />
          </ResizablePanel>
        </ResizablePanelGroup> */}


        <div className="mt-8 col-span-12">
          <BestPerformingTagsChart />
        </div>


      </div>

    </div>
  )
}

export default Dashboard