import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetEntityDetailChartsQuery, useGetEntityDetailQuery } from '../api/entityApi'

import { APP_CONFIG } from '@/config/config'
import AppHeaderPortal from '@/components/layout/AppHeaderPortal'
import { Button } from '@/components/ui/button'
import { EntityDetailType } from '../types/EntityTypes'
import EntityOverviewChart from '@/features/tags/components/charts/EntityOverviewChart'
import EntityTransactions from '../components/detail/EntityTransactions'
import { HandCoinsIcon } from 'lucide-react'
import ManageEntityForm from '../components/forms/ManageEntityForm'
import React from 'react'
import Spinner from '@/components/ui/spinner'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const EntityDetailPage = () => {

  const [isAddEntityModalOpen, setIsAddEntityModalOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("Overview")


  const params = useParams()
  const { t } = useTranslation()
  const { data: entityDetailObj = {}, isLoading: isLoadingEntityDetail } = useGetEntityDetailQuery({ id: params.id })



  const { data: entityDetail, stats } = entityDetailObj as EntityDetailType



  const cancelManageEntity = () => {
    setIsAddEntityModalOpen(false)
  }


  const finalAvatarUrl = !entityDetail?.avatarUrl ? ""
    : `${APP_CONFIG.API_STATIC_FILE_URL}/entities/${entityDetail.avatarUrl}`

  if (!entityDetail) {
    return <div>
      <h2>Entity not available</h2>
    </div>
  }

  return (
    <div>
      <AppHeaderPortal
        title={
          <div className='flex items-center gap-2'>
            {t("Entity Detail")}
            {
              isLoadingEntityDetail &&
              <Spinner size={24} />
            }
          </div>
        }
      >
        <div className="w-full flex justify-between gap-4 items-center">
          <Button size="sm" variant="default" onClick={() => setIsAddEntityModalOpen(true)}>{t("Edit Entity")}</Button>
        </div>
      </AppHeaderPortal>

      <div className="px-4 p-4">

        <div className="flex items-center gap-4">
          {/* <Input
              className={`hidden user-avatar-${row.id}`}
              type="file"
              accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
              onChange={e => onAction("UploadPicture", row, !e.target.files ? null : e.target.files[0])}
            /> */}

          <Avatar
            className="cursor-pointer h-12 w-12"
            onClick={() => {
              const element = document.querySelector(`.user-avatar-${entityDetail.id}`)
              if (element && element instanceof HTMLInputElement) {
                element?.click()
              }
            }}>
            <AvatarImage src={finalAvatarUrl} />
            <AvatarFallback>{entityDetail.name.split(" ").map(x => x[0]).join("")}</AvatarFallback>
          </Avatar>

          <div>
            <h4 className='font-medium text-lg'>{entityDetail.name}</h4>
            <p className='text-muted-foreground text-sm'>+{entityDetail.phoneNumber}</p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <div className="flex items-start gap-4 px-4 py-4 rounded-lg border hover:shadow-sm">
            <HandCoinsIcon size={24} className='mt-1' />
            <div>
              <p className='font-medium text-lg'>{t("Rs")} {!stats?.totalPurchases ? '-' : parseFloat(String(stats?.totalPurchases) ?? 0).toFixed(2)}</p>
              <h4 className='text-muted-foreground text-sm'>{t("Purchase")}</h4>
            </div>
          </div>
          <div className="flex items-start gap-4 px-4 py-4 rounded-lg border hover:shadow-sm">
            <HandCoinsIcon size={24} className='mt-1' />
            <div>
              <p className='font-medium text-lg'>{t("Rs")} {!stats?.totalSales ? '-' : parseFloat(String(stats?.totalSales)).toFixed(2)}</p>
              <h4 className='text-muted-foreground text-sm'>{t("Sale")}</h4>
            </div>
          </div>
          <div className="flex items-start gap-4 px-4 py-4 rounded-lg border hover:shadow-sm">
            <HandCoinsIcon size={24} className='mt-1' />
            <div>
              <p className='font-medium text-lg'>{t("Rs")} {!stats?.totalPayments ? '-' : parseFloat(String(stats?.totalPayments) ?? 0).toFixed(2)}</p>
              <h4 className='text-muted-foreground text-sm'>{t("Payment")}</h4>
            </div>
          </div>
          <div className="flex items-start gap-4 px-4 py-4 rounded-lg border hover:shadow-sm">
            <HandCoinsIcon size={24} className='mt-1' />
            <div>
              <p className='font-medium text-lg'>{stats?.totalTransactions}</p>
              <h4 className='text-muted-foreground text-sm'>{t("Transactions")}</h4>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-4">

        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="Overview" className="w-full">
          <TabsList>
            <TabsTrigger value="Overview">Overview</TabsTrigger>
            <TabsTrigger value="Transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent className='py-4 mt-4' value="Overview">
            {
              params?.id &&
              <EntityOverviewChart entityId={+params.id} />
            }
          </TabsContent>

          <TabsContent className='py-4 mt-4' value="Transactions">
            <EntityTransactions
              initialFilters={{ entityId: params.id }}
              manageFiltersInternally={true}
            />

          </TabsContent>
        </Tabs>

      </div>



      {
        isAddEntityModalOpen &&
        <ManageEntityForm
          onClose={cancelManageEntity}
          isOpen={isAddEntityModalOpen}
          selectedEntity={null}
        />
      }
    </div>
  )
}

export default EntityDetailPage