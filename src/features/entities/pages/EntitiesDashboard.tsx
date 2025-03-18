import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { EntityListColumnActionType, EntityType } from '../types/EntityTypes'
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { useLazyListMyEntitiesQuery, useListMyEntitiesQuery, useUpdateAvatarMutation, } from '../api/entityApi'

import AppHeaderPortal from '@/components/layout/AppHeaderPortal'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ManageEntityForm from '../components/forms/ManageEntityForm'
import React from 'react'
import Spinner from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import { useEntity } from '../hooks/useEntity'
import { useEntityListColumns } from '../components/tables/EntitiesListColumns'
import { useNavigate } from 'react-router-dom'
import { usePagination } from '@/hooks/usePagination'
import { useTranslation } from 'react-i18next'

const EntitiesDashboard = () => {

  const [isAddEntityModalOpen, setIsAddEntityModalOpen] = React.useState(false)
  const [selectedEntity, setSelectedEntity] = React.useState<null | EntityType>(null)

  const [isDeleteEntityDialogOpen, setIsDeleteEntityDialogOpen] = React.useState(false)
  const [isRestoreEntityDialogOpen, setIsRestoreEntityDialogOpen] = React.useState(false)


  const [filters, setFilters] = React.useState<{ search: string; }>({
    search: "",
  })

  const debouncedFilters = useDebounce(filters, 0)

  const { t } = useTranslation()

  const {
    handleRestoreEntity,
    handleDeleteEntity,
    isRestoring,
    isSoftDeleting
  } = useEntity()

  const [updateAvatarMutation, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation()

  // const [fetchMyEntities, { isFetching: isFetchingEntities, data: myEntitiesObj }] = useLazyListMyEntitiesQuery()

  const { onPaginationChange, pagination } = usePagination();
  const { EntityColumns } = useEntityListColumns()
  const navigate = useNavigate()


  const { isFetching: isFetchingEntities, data: myEntitiesObj } = useListMyEntitiesQuery({
    ...debouncedFilters,
    pageSize: pagination.pageSize, page: pagination.pageIndex + 1
  })

  const entitiesArray = myEntitiesObj?.data ?? []
  const apiPagination = myEntitiesObj?.pagination ?? {}


  const cancelManageEntity = () => {
    setIsAddEntityModalOpen(false)
    setSelectedEntity(null)
  }

  const cancelDeleteEntity = () => {
    setIsDeleteEntityDialogOpen(false)
    setSelectedEntity(null)
  }

  const cancelRestoreEntity = () => {
    setIsRestoreEntityDialogOpen(false)
    setSelectedEntity(null)
  }

  const handleUpdateAvatar = async ({ avatar, entityId }: { avatar: Blob | null, entityId: number }) => {
    if (isUpdatingAvatar) return

    const loadingId = toast.loading(t("Updating Avatar"))

    try {
      const formData = new FormData()
      formData.append("id", String(entityId))
      formData.append("file", avatar)
      await updateAvatarMutation({ id: entityId, formData }).unwrap()
      toast.dismiss(loadingId)
      toast.success(t("Avatar updated successfully."))
    } catch (error) {
      toast.dismiss(loadingId)
      const errorMessage = error?.data.message || t("Something went wrong")
      toast.error(errorMessage)
    }

  }

  const onRowClick = (row: EntityType) => {
    navigate(`/app/entities/detail/${row.id}`)
  }

  const onColumnAction = React.useCallback((action: EntityListColumnActionType, entity: EntityType, extra: any) => {
    if (action === "View") {
      onRowClick(entity)
    } else if (action === "Edit") {
      setSelectedEntity(entity)
      setIsAddEntityModalOpen(true)
    } else if (action === "Delete") {
      setSelectedEntity(entity)
      setIsDeleteEntityDialogOpen(true)
    } else if (action === "Restore") {
      setSelectedEntity(entity)
      setIsRestoreEntityDialogOpen(true)
    } else if (action === "UploadPicture") {

      handleUpdateAvatar({ avatar: extra, entityId: entity.id })
    }
  }, [])



  const table = useReactTable({
    data: entitiesArray,
    columns: EntityColumns({
      onAction: onColumnAction
    }),
    manualPagination: true,
    pageCount: apiPagination?.totalPages || 1,
    rowCount: apiPagination?.totalEntities || 1,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange,
    // autoResetPageIndex: false, //turn off auto reset of pageIndex

    state: {
      pagination,
    }
  })



  // React.useEffect(() => {
  //   fetchMyEntities({ pageSize: pagination.pageSize, page: pagination.pageIndex + 1, ...debouncedFilters }, true)
  // }, [fetchMyEntities, pagination, debouncedFilters])


  return (
    <div>
      <AppHeaderPortal
        title={
          <div className='flex items-center gap-2'>
            {t("Entities")}
            {
              isFetchingEntities &&
              <Spinner size={24} />
            }
          </div>
        }
      >
        <div className="w-full flex justify-between gap-4 items-center">
          <Button size="sm" variant="default" onClick={() => setIsAddEntityModalOpen(true)}>{t("Add Entity")}</Button>
        </div>
      </AppHeaderPortal>


      <div className='mb-6 flex items-center justify-end gap-2'>
        <div className="flex items-center gap-2 mb-2">
          <Input className='max-w-[300px]' placeholder={t('Search')} value={filters.search} onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))} />
        </div>
      </div>
      <DataTable
        table={table}
        columns={EntityColumns({
          onAction: onColumnAction
        })}
        onRowClick={onRowClick}
      />

      <div className="w-full h-8"></div>
      <DataTablePagination table={table} />

      {
        isAddEntityModalOpen &&
        <ManageEntityForm
          onClose={cancelManageEntity}
          isOpen={isAddEntityModalOpen}
          selectedEntity={selectedEntity}
        />
      }

      {
        isDeleteEntityDialogOpen &&
        selectedEntity &&
        <AlertDialog open={isDeleteEntityDialogOpen} onOpenChange={cancelDeleteEntity}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("Delete Entity")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("Delete Entity Confirmation Message")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDeleteEntity}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={isSoftDeleting} onClick={() => handleDeleteEntity({ entity: selectedEntity, callbackFn: cancelDeleteEntity })}>Yes, Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }

      {
        isRestoreEntityDialogOpen &&
        selectedEntity &&
        <AlertDialog open={isRestoreEntityDialogOpen} onOpenChange={cancelRestoreEntity}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restore Entity?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelRestoreEntity}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={isRestoring} onClick={() => handleRestoreEntity({ entity: selectedEntity, callbackFn: cancelRestoreEntity })}>Yes, Restore</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
    </div>
  )
}

export default EntitiesDashboard