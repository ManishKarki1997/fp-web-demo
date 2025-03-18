import { CalendarIcon, Filter } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { defaultReactSelectClassNames, defaultReactSelectStyles } from '@/lib/react-select-helpers'

import AppHeaderPortal from '@/components/layout/AppHeaderPortal'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import EntityTransactions from '@/features/entities/components/detail/EntityTransactions'
import { Input } from '@/components/ui/input'
import ManageTransactionForm from '../components/forms/ManageTransactionForm'
import React from 'react'
import ReactSelect from 'react-select'
import { ReactSelectOption } from '@/types/ReactSelectTypes'
import Spinner from '@/components/ui/spinner'
import { TransactionType } from '../types/TransactionTypes'
import { TransactionTypes } from '../constants/TransactionConstants'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
// import { TransactionsListColumns } from '../tables/TransactionsListColumns'
import { useListMyEntitiesMinimalQuery } from '@/features/entities/api/entityApi'
import { useListMyTagsMinimalQuery } from '@/features/tags/api/tagApi'
import { useListMyTransactionsQuery } from '../api/transactionApi'
import { usePagination } from '@/hooks/usePagination'
import { useTransactionFilters } from '../hooks/useTransactionFilters'
import { useTranslation } from 'react-i18next'

const TransactionsDashboard = () => {

  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = React.useState(false)
  const [selectedTransaction, setSelectedTransaction] = React.useState<null | TransactionType>(null)


  const {
    selectedTags,
    setSelectedTags,
    filters,
    setFilters,
    debouncedFilters
  } = useTransactionFilters({})

  const { t } = useTranslation()
  const { onPaginationChange, pagination } = usePagination();


  const { isFetching: isFetchingTransactions, } = useListMyTransactionsQuery(debouncedFilters)
  const { data: minimalEntities } = useListMyEntitiesMinimalQuery({})
  const { data: tagsData, isLoading: isLoadingtags } = useListMyTagsMinimalQuery({})

  const minimalEntitiesArr = minimalEntities?.data ?? []
  const tagsArray = tagsData?.data ? tagsData?.data?.map((tag: any) => ({
    label: tag.name,
    value: tag.id
  })) : []


  const cancelManageTransaction = () => {
    setIsAddTransactionModalOpen(false)
    setSelectedTransaction(null)
  }





  return (
    <div>
      <AppHeaderPortal
        title={
          <div className='flex items-center gap-2'>
            {t("Transactions")}
            {
              isFetchingTransactions &&
              <Spinner size={24} />
            }
          </div>
        }
      >
        <div className="w-full flex justify-between gap-4 items-center">
          <Button size="sm" variant="default" onClick={() => setIsAddTransactionModalOpen(true)}>
            {t("Add Transaction")}
          </Button>
        </div>
      </AppHeaderPortal>

      <EntityTransactions
        initialFilters={{ ...debouncedFilters }}
      />

      {
        isAddTransactionModalOpen &&
        <ManageTransactionForm
          onClose={cancelManageTransaction}
          isOpen={isAddTransactionModalOpen}
          selectedTransaction={selectedTransaction}
        />
      }

    </div>
  )
}

export default TransactionsDashboard