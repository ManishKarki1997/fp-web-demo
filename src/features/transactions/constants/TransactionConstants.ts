import { TransactionListFiltersType } from "../types/TransactionTypes"

export const TransactionTypes = [
  "Purchase",
  "Sale",
  "Payment",
  "Loan",
  "Income"
]



export const TransactionTypeColorsMapCss:Record<string,string> = {
  'Sale':'text-green-500',
  'Payment':'text-green-500',
  'Loan':'text-red-500',
  'Purchase':'text-red-500',
  'Income':'text-primary',
}


export const InitialTransactionTableConstants:TransactionListFiltersType = {
  tags:[],
  entityId:"",
  from:"",
  search:"",
  to:"",
  type:""
}