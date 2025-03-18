import { EntityLoanListColumnActionType, EntityLoanType, EntityLoansTableFilterType } from '../../types/AppTypes'
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'

import { DataTable } from '@/components/ui/data-table'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import EntityLoanDetailModal from '../modals/EntityLoanDetailModal'
import React from 'react'
import Spinner from '@/components/ui/spinner'
import { useDebounce } from '@/hooks/useDebounce'
import { useEntityLoanListColumns } from './EntityLoanListColumns'
import { useEntityLoansTableDataQuery } from '../../api/appApi'
import { usePagination } from '@/hooks/usePagination'

const EntityLoansTable = () => {

  const [selectedEntity, setSelectedEntity] = React.useState<null | EntityLoanType>(null)
  const [isEntityDetailModalActive, setIsEntityDetailModalActive] = React.useState(false)

  const [filters, setFilters] = React.useState<EntityLoansTableFilterType>({
    search: "",
    fromDate: "",
    toDate: "",
  })

  const debouncedFilters = useDebounce(filters, 0)
  const { onPaginationChange, pagination } = usePagination();
  const { EntityLoanColumns } = useEntityLoanListColumns()

  const { data: entityLoansObj, isFetching: isFetchingLoans } = useEntityLoansTableDataQuery({
    ...debouncedFilters,
    pageSize: pagination.pageSize, page: pagination.pageIndex + 1
  })

  const entitiesArray = entityLoansObj?.data ?? []
  const apiPagination = entityLoansObj?.pagination ?? {}

  const onColumnAction = React.useCallback((action: EntityLoanListColumnActionType, entity: EntityLoanType, extra: any) => {
    if (action === "View") {
      setSelectedEntity(entity)
      setIsEntityDetailModalActive(true)
    }
  }, [])

  const cancelEntityDetailModal = () => {
    setIsEntityDetailModalActive(false)
    setSelectedEntity(null)
  }

  const table = useReactTable({
    data: entitiesArray,
    columns: EntityLoanColumns({
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


  return (
    <div>

      <div className='flex items-center justify-between gap-2'>
        <div className=" bg-sidebar text-primary border border-input w-full px-6 py-2 rounded">

          <h2 className='font-medium'>Entity Loans</h2>
          {
            isFetchingLoans &&
            <Spinner size={24} />
          }
        </div>

      </div>
      <DataTable
        table={table}
        columns={EntityLoanColumns({
          onAction: onColumnAction
        })}
        onRowClick={row => {
          setSelectedEntity(row)
          setIsEntityDetailModalActive(true)
        }}
      />

      <div className="w-full h-8"></div>
      <DataTablePagination table={table} />

      {
        isEntityDetailModalActive &&
        selectedEntity &&
        <EntityLoanDetailModal selectedEntity={selectedEntity} isOpen={isEntityDetailModalActive} onClose={cancelEntityDetailModal} />
      }

    </div>
  )
}

export default EntityLoansTable