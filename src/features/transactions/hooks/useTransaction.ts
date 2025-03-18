import { useDeleteTransactionMutation, useMarkTransactionLoanAsCompletedMutation } from "../api/transactionApi";

import { TransactionType } from "../types/TransactionTypes";
import { toast } from "sonner";

type HandleDeleteTransactionProps = {
  transaction: TransactionType;
  callbackFn: () => void;
}


export const useTransaction = () => {

  const [deleteTransactionMutation, { isLoading: isDeletingTransaction }] = useDeleteTransactionMutation()
  const [markTransactionLoanCompleteMutation, { isLoading: isCompletingTransaction }] = useMarkTransactionLoanAsCompletedMutation()


  const handleDeleteTransaction = async ({transaction, callbackFn = () => {}}:HandleDeleteTransactionProps) => { 
    if (isDeletingTransaction) return;
    if (!transaction) return;

    const loadingId = toast.loading("Deleting Transaction")
    try {
      await deleteTransactionMutation({ id: transaction.id }).unwrap()
      toast.dismiss(loadingId)
      toast.success("Transaction created successfully.")
      callbackFn()
    } catch (error) {
      const errorMessage = error?.data.message || "Something went wrong"
      toast.dismiss(loadingId)
      toast.error(errorMessage)
    }
  }


  const handleMarkTransactionLoadAsCompleted = async ({transaction, callbackFn = () => {}}:HandleDeleteTransactionProps) => { 
    if (isCompletingTransaction) return;
    if (!transaction) return;

    const loadingId = toast.loading("Completing Transaction")
    try {
      await markTransactionLoanCompleteMutation({ id: transaction.id }).unwrap()
      toast.dismiss(loadingId)
      toast.success("Transaction completed successfully.")
      callbackFn()
    } catch (error) {
      const errorMessage = error?.data.message || "Something went wrong"
      toast.dismiss(loadingId)
      toast.error(errorMessage)
    }
  }



  return {
    handleDeleteTransaction,    
    isDeletingTransaction,
    handleMarkTransactionLoadAsCompleted,
    isCompletingTransaction
  }

}