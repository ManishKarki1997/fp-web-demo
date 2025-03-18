import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { CalendarIcon, Filter } from 'lucide-react'
import { InitialTransactionTableConstants, TransactionTypes } from '@/features/transactions/constants/TransactionConstants'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TransactionListColumnActionType, TransactionListFiltersType, TransactionType } from '@/features/transactions/types/TransactionTypes'
import { defaultReactSelectClassNames, defaultReactSelectStyles } from '@/lib/react-select-helpers'
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DataTable } from '@/components/ui/data-table'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { Input } from '@/components/ui/input'
import ManageTransactionForm from '@/features/transactions/components/forms/ManageTransactionForm'
import React from 'react'
import ReactSelect from 'react-select'
import { ReactSelectOption } from '@/types/ReactSelectTypes'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useListMyEntitiesMinimalQuery } from '../../api/entityApi'
import { useListMyTagsMinimalQuery } from '@/features/tags/api/tagApi'
import { useListMyTransactionsQuery } from '@/features/transactions/api/transactionApi'
import { usePagination } from '@/hooks/usePagination'
import { useTransaction } from '@/features/transactions/hooks/useTransaction'
import { useTransactionFilters } from '@/features/transactions/hooks/useTransactionFilters'
import { useTransactionListColumns } from '@/features/transactions/tables/TransactionsListColumns'
import { useTranslation } from 'react-i18next'

type Props = {
  initialFilters?: TransactionListFiltersType;
  manageFiltersInternally?: boolean;
  pagination?: {
    pageSize: number;
    pageIndex: number;
  },
  onPaginationChange?: React.Dispatch<React.SetStateAction<{
    pageSize: number;
    pageIndex: number;
  }>>
}

const EntityTransactions = ({ initialFilters = InitialTransactionTableConstants, manageFiltersInternally = true, onPaginationChange, pagination }: Props) => {

  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = React.useState(false)
  const [selectedTransaction, setSelectedTransaction] = React.useState<null | TransactionType>(null)
  const [isDeleteTranscationDialogOpen, setIsDeleteTranscationDialogOpen] = React.useState(false)
  const [isCompleteTranscationDialogOpen, setIsCompleteTranscationDialogOpen] = React.useState(false)


  const {
    handleDeleteTransaction,
    isDeletingTransaction,
    handleMarkTransactionLoadAsCompleted,
    isCompletingTransactio
  } = useTransaction()

  const { t } = useTranslation()


  const {
    selectedTags,
    setSelectedTags,
    filters,
    setFilters,
    debouncedFilters
  } = useTransactionFilters({
    initialFilters
  })

  const { onPaginationChange: _onPaginationChange, pagination: _pagination } = usePagination();
  const paginationToUse = !manageFiltersInternally && pagination ? pagination : _pagination
  const filtersToUse = !manageFiltersInternally ? initialFilters : { pageSize: paginationToUse?.pageSize, page: paginationToUse?.pageIndex + 1, ...debouncedFilters }

  const paginationOnChangeToUse = !manageFiltersInternally ? onPaginationChange : _onPaginationChange

  // console.log("filtersToUse", filtersToUse, manageFiltersInternally, debouncedFilters)
  const { data: transactionsObj } = useListMyTransactionsQuery(filtersToUse)
  // const { data: transactionsObj } = useListMyTransactionsQuery(debouncedFilters)
  const { data: minimalEntities } = useListMyEntitiesMinimalQuery({})
  const { data: tagsData, isLoading: isLoadingtags } = useListMyTagsMinimalQuery({})

  const minimalEntitiesArr = minimalEntities?.data ?? []
  const tagsArray = tagsData?.data ? tagsData?.data?.map((tag: any) => ({
    label: tag.name,
    value: tag.id
  })) : []


  const transactionsArray = transactionsObj?.data ?? []
  const apiPagination = transactionsObj?.pagination ?? {}

  const { TransactionsListColumns } = useTransactionListColumns()

  const onColumnAction = React.useCallback((action: TransactionListColumnActionType, transaction: TransactionType) => {
    if (action === "View") {
      // TODO
      // setSelectedTransaction(transaction)
      // setIsAddTransactionModalOpen(true)
    } else if (action === "Edit") {
      setSelectedTransaction(transaction)
      setIsAddTransactionModalOpen(true)
    } else if (action === "Delete") {
      setSelectedTransaction(transaction)
      setIsDeleteTranscationDialogOpen(true)
    } else if (action === "Complete") {
      setSelectedTransaction(transaction)
      setIsCompleteTranscationDialogOpen(true)
    }
  }, [])


  const cancelManageTransaction = () => {
    setIsAddTransactionModalOpen(false)
    setSelectedTransaction(null)
  }

  const cancelDeleteTransaction = () => {
    setIsDeleteTranscationDialogOpen(false)
    setSelectedTransaction(null)
  }

  const cancelCompleteTransaction = () => {
    setIsCompleteTranscationDialogOpen(false)
    setSelectedTransaction(null)
  }

  const table = useReactTable({
    data: transactionsArray,
    columns: TransactionsListColumns({
      onAction: onColumnAction
    }),
    manualPagination: true,
    pageCount: apiPagination?.totalPages || 1,
    rowCount: apiPagination?.totalEntities || 1,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: paginationOnChangeToUse,
    // autoResetPageIndex: false, //turn off auto reset of pageIndex

    state: {
      pagination: paginationToUse,
    }
  })


  return (
    <div>


      <div className='mb-6 flex items-center justify-end gap-2'>
        <Input className='w-full max-w-[300px]' placeholder={t('Search')} value={filters.search} onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))} />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "gap-2 min-w-max"
              )}
            >
              <Filter size={16} />
              {t("Filters")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-4">
            <div className="space-y-4">
              <Select
                value={filters.entityId}
                onValueChange={_entityId => {
                  setFilters(prev => ({
                    ...prev,
                    entityId: _entityId === "ALL" ? "" : _entityId
                  }))
                }}
              >
                <SelectTrigger className="w-full max-w-full">
                  <SelectValue placeholder={t("Select Entity")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"ALL"}>{t("All")}</SelectItem>
                  {
                    minimalEntitiesArr?.map((entity: { id: number, name: string }) => (
                      <SelectItem key={entity.id} value={String(entity.id)}>{entity.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>

              <Select
                value={filters.type}
                onValueChange={(_type: string) => {
                  setFilters(prev => ({
                    ...prev,
                    type: _type === "ALL" ? "" : _type
                  }))
                }}
              >
                <SelectTrigger className="w-full max-w-full">
                  <SelectValue placeholder={t("Select Type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"ALL"}>{t("All")}</SelectItem>
                  {
                    TransactionTypes?.map((type) => (
                      <SelectItem key={type} value={type}>{t(type)}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>

              <ReactSelect
                classNames={defaultReactSelectClassNames}
                styles={defaultReactSelectStyles}
                isLoading={isLoadingtags}
                isMulti
                placeholder={t("Select Tags")}
                className='w-full max-w-full'
                options={tagsArray}
                value={selectedTags}
                onChange={(_tags: any) => {
                  setSelectedTags(_tags as ReactSelectOption[])
                  setFilters(prev => ({
                    ...prev,
                    tags: _tags.map((t: ReactSelectOption) => t.value)
                  }))
                }}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.from ? format(filters.from, "PPP") : <span>{t("From Date")}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.from ? new Date(filters.from) : new Date()}
                    onSelect={date => {
                      setFilters(prev => ({
                        ...prev,
                        from: date?.toString()
                      }))
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>


              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.to ? format(filters.to, "PPP") : <span>{t("To Date")}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.to ? new Date(filters.to) : new Date()}
                    onSelect={date => {
                      setFilters(prev => ({
                        ...prev,
                        to: date?.toString()
                      }))
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

            </div>
          </PopoverContent>
        </Popover>


      </div>

      <DataTable
        table={table}
        columns={TransactionsListColumns({
          onAction: onColumnAction
        })}
      />

      <div className="w-full h-8"></div>

      <DataTablePagination table={table} />



      {
        isAddTransactionModalOpen &&
        <ManageTransactionForm
          onClose={cancelManageTransaction}
          isOpen={isAddTransactionModalOpen}
          selectedTransaction={selectedTransaction}
        />
      }

      {
        isDeleteTranscationDialogOpen &&
        selectedTransaction &&
        <AlertDialog open={isDeleteTranscationDialogOpen} onOpenChange={cancelDeleteTransaction}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("Delete Transaction")}?</AlertDialogTitle>
              <AlertDialogDescription>
                {t("Delete Transaction Confirmation Message")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDeleteTransaction}>{t("Cancel")}</AlertDialogCancel>
              <AlertDialogAction disabled={isDeletingTransaction} onClick={() => handleDeleteTransaction({ transaction: selectedTransaction, callbackFn: cancelDeleteTransaction })}>{t("Delete")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
      {
        isCompleteTranscationDialogOpen &&
        selectedTransaction &&
        <AlertDialog open={isCompleteTranscationDialogOpen} onOpenChange={cancelDeleteTransaction}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("Complete Transaction")}?</AlertDialogTitle>
              <AlertDialogDescription>
                {t("Complete Transaction Confirmation Message")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelCompleteTransaction}>{t("Cancel")}</AlertDialogCancel>
              <AlertDialogAction disabled={isCompletingTransactio} onClick={() => handleMarkTransactionLoadAsCompleted({ transaction: selectedTransaction, callbackFn: cancelCompleteTransaction })}>{t("Complete")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }

    </div>
  )
}

export default EntityTransactions