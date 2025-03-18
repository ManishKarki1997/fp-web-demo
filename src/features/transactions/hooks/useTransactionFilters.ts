import { InitialTransactionTableConstants } from "../constants/TransactionConstants"
import React from "react"
import { ReactSelectOption } from "@/types/ReactSelectTypes"
import { TransactionListFiltersType } from "../types/TransactionTypes"
import { useDebounce } from "@/hooks/useDebounce"

export const useTransactionFilters = ({initialFilters = InitialTransactionTableConstants, debounceInMs= 500}:{initialFilters?: TransactionListFiltersType, debounceInMs?:number}) => {
  const [selectedTags, setSelectedTags] = React.useState<ReactSelectOption[]>([])

  const [filters, setFilters] = React.useState<TransactionListFiltersType>({
  ...initialFilters,
    tags: initialFilters?.tags ?? selectedTags ? selectedTags?.map(t => t.value) : []
  })

  const debouncedFilters = useDebounce(filters, debounceInMs)

  return {
    selectedTags,
    setSelectedTags,
    filters,
    setFilters,
    debouncedFilters
  }

}