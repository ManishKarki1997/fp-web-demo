import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AlertListColumnActionType, IAlert } from "@/types/AlertTypes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { useDeleteAlertMutation, useLazyListMyAlertsQuery, useTestAlertMutation } from "@/store/api/alertApi"

import { AlertColumns } from "./Table/AlertColumns"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { PlusCircle } from 'lucide-react'
import React from 'react'
import Spinner from "@/components/ui/spinner"
import TestAlertModal from "./Modals/TestAlertModal"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { usePagination } from "@/hooks/usePagination"

export default function AlertsList() {

  const navigate = useNavigate()
  const [fetchMyAlerts, { isFetching: isFetchingAlerts, data: myAlertsObj }] = useLazyListMyAlertsQuery()
  const [deleteAlertMutation, { isLoading: isDeletingAlert }] = useDeleteAlertMutation()


  const myAlerts = myAlertsObj?.data ?? []
  const apiPagination = myAlertsObj?.pagination ?? {}

  const { onPaginationChange, pagination } = usePagination();


  const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = React.useState(false)
  const [selectedAlert, setSelectedAlert] = React.useState<IAlert | null>(null)
  const [isTestAlertResultsModalOpen, setIsTestAlertResultsModalOpen] = React.useState(false)

  const cancelDeleteAlert = () => {
    setIsDeleteAlertDialogOpen(false)
    setSelectedAlert(null)
  }

  const cancelTestAlert = () => {
    setIsTestAlertResultsModalOpen(false)
    setSelectedAlert(null)
  }

  const handleDeleteAlert = async () => {
    if (!selectedAlert) return

    if (isDeletingAlert) return;

    const loadingId = toast.loading("Updating Alert...")

    try {
      await deleteAlertMutation({ id: (selectedAlert.id) }).unwrap()
      toast.dismiss(loadingId)
      toast.success("Alert deleted successfully.")
    } catch (error) {
      const errorMessage = error?.data.message || "Something went wrong"
      toast.dismiss(loadingId)
      toast.error(errorMessage)
    }
  }


  const onColumnAction = React.useCallback((action: AlertListColumnActionType, alert: IAlert) => {
    if (action === "Edit") {
      navigate(`/app/alerts/edit/${alert.id}`)
    } else if (action === "Delete") {
      setSelectedAlert(alert)
      setIsDeleteAlertDialogOpen(true)
    } else if (action === "Test") {
      setSelectedAlert(alert)
      setIsTestAlertResultsModalOpen(true)
    }
  }, [navigate])


  const table = useReactTable({
    data: myAlerts,
    columns: AlertColumns({
      onAction: onColumnAction
    }),
    manualPagination: true,
    pageCount: apiPagination?.totalPages || 1,
    rowCount: apiPagination?.totalAlerts || 1,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange,
    // autoResetPageIndex: false, //turn off auto reset of pageIndex

    state: {
      pagination,
    }
  })


  React.useEffect(() => {
    fetchMyAlerts({ pageSize: pagination.pageSize, page: pagination.pageIndex + 1 }, true)
  }, [fetchMyAlerts, pagination])


  return (
    <div>
      <Card className="w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>
              <div className="flex items-center gap-2">
                Manga Alerts
                {
                  isFetchingAlerts && <Spinner />
                }
              </div>
            </CardTitle>
            <CardDescription>Manage your current manga alerts.</CardDescription>
          </div>
          <Button variant="default" size="sm" onClick={() => navigate("/app/alerts/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Alert
          </Button>
        </CardHeader>
        <CardContent className="py-8">

          <DataTable
            table={table}

            columns={AlertColumns({
              onAction: onColumnAction
            })}


          />
          <div className="w-full h-8"></div>
          <DataTablePagination table={table} />

        </CardContent>
      </Card>

      {
        isDeleteAlertDialogOpen &&
        selectedAlert &&
        <AlertDialog open={isDeleteAlertDialogOpen} onOpenChange={cancelDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Alert?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you absolutely sure? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDeleteAlert}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAlert}>Yes, Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }


      {
        isTestAlertResultsModalOpen &&
        selectedAlert &&
        <TestAlertModal
          alert={selectedAlert}
          isOpen={isTestAlertResultsModalOpen}
          onClose={cancelTestAlert} />
      }
    </div>
  )
}