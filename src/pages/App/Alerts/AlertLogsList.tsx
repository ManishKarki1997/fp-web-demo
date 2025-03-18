import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AlertLogsListColumnActionType, IAlert, IAlertLog } from "@/types/AlertTypes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, PlusCircle, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { useDeleteAlertMutation, useLazyListMyAlertLogsQuery, useTestAlertMutation } from "@/store/api/alertApi"

import { AlertLogsColumns } from "./Table/AlertLogsColumns"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DataTablePagination } from "@/components/ui/data-table-pagination"
import Spinner from "@/components/ui/spinner"
import TestAlertModal from "./Modals/TestAlertModal"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { usePagination } from "@/hooks/usePagination"

export default function AlertLogsList() {

  const navigate = useNavigate()
  const [fetchMyAlertLogs, { isFetching: isFetchingAlertLogs, data: myAlertLogsObj }] = useLazyListMyAlertLogsQuery()

  const myAlerts = myAlertLogsObj?.data ?? []
  const apiPagination = myAlertLogsObj?.pagination ?? {}

  const { onPaginationChange, pagination } = usePagination();

  const [isTestAlertResultsModalOpen, setIsTestAlertResultsModalOpen] = React.useState(false)
  const [selectedAlert, setSelectedAlert] = React.useState<IAlert | null>(null)

  const cancelTestAlert = () => {
    setIsTestAlertResultsModalOpen(false)
    setSelectedAlert(null)
  }

  const onColumnAction = React.useCallback((action: AlertLogsListColumnActionType, alert: IAlertLog) => {
    if (action === "Test") {
      setSelectedAlert(alert.alert as IAlert)
      setIsTestAlertResultsModalOpen(true)
    }
  }, [navigate])


  const table = useReactTable({
    data: myAlerts,
    columns: AlertLogsColumns({
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
    fetchMyAlertLogs({ pageSize: pagination.pageSize, page: pagination.pageIndex + 1 }, true)
  }, [fetchMyAlertLogs, pagination])


  return (
    <div>
      <Card className="w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>
              <div className="flex items-center gap-2">
                Manga Alert Logs
                {
                  isFetchingAlertLogs && <Spinner />
                }
              </div>
            </CardTitle>
            <CardDescription>View your past alert logs.</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="py-8">

          <DataTable
            table={table}

            columns={AlertLogsColumns({
              onAction: onColumnAction
            })}


          />
          <div className="w-full h-8"></div>
          <DataTablePagination table={table} />

        </CardContent>
      </Card>


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