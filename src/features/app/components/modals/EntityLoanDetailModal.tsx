import { AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { APP_CONFIG } from '@/config/config';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { EntityLoanType } from '../../types/AppTypes';
import React from 'react'
import Spinner from '@/components/ui/spinner';
import { useEntityLoansDetailQuery } from '../../api/appApi';
import { useTranslation } from 'react-i18next';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedEntity: EntityLoanType;
}

const EntityLoanDetailModal = ({
  isOpen,
  onClose,
  selectedEntity
}: Props) => {

  const { t } = useTranslation()
  const { data: entityLoanDetailObj, isFetching: isFetchingEntityLoanDetail } = useEntityLoansDetailQuery({ id: selectedEntity.id })


  const entitiesArray = entityLoanDetailObj?.repayments ?? []

  const Columns: ColumnDef<EntityLoanType>[] = [
    {
      accessorKey: "note",
      header: "Note"
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <p className='font-medium'>Rs. {row.original.amount}</p>
      )
    },
    // {
    //   accessorKey: "remainingBalance",
    //   header: "Remaining Balance"
    // },
    {
      accessorKey: "attachments",
      header: "Attachments",
      cell: ({ row }) => {
        return <div className="flex flex-wrap items-center gap-2">
          {
            row.original.attachments?.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2 rounded" onClick={() => {
                window.open(APP_CONFIG.getStaticFileUrl(attachment.url), '_blank')
              }}>
                <img src={APP_CONFIG.getStaticFileUrl(attachment.url)} alt="Attachment" className="h-10 w-10" />
              </div>
            ))
          }
        </div>
      }
    },
  ]

  const table = useReactTable({
    data: entitiesArray,
    columns: Columns,
    // manualPagination: true,
    // pageCount: apiPagination?.totalPages || 1,
    // rowCount: apiPagination?.totalEntities || 1,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // onPaginationChange,
    // autoResetPageIndex: false, //turn off auto reset of pageIndex
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[900px] max-w-[900px]">

        <AlertDialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {selectedEntity?.entity.name}

            {
              isFetchingEntityLoanDetail &&
              <Spinner size={20} />
            }
          </DialogTitle>
        </AlertDialogHeader>

        <div className="py-4 overflow-auto h-full">

          <div className='flex flex-wrap gap-8 items-center mb-8'>
            <div className='rounded px-6 py-2 border border-input'>
              <p className='text-muted-foreground'>Original Amount</p>
              <h2 className='font-medium'>Rs. {selectedEntity.amount}</h2>
            </div>
            <div className='rounded px-6 py-2 border border-input'>
              <p className='text-muted-foreground'>Current Remaining Amount</p>
              <h2>Rs. {selectedEntity.remainingBalance}</h2>
            </div>
            <div className='rounded px-6 py-2 border border-input'>
              <p className='text-muted-foreground'>Total Repayments</p>
              <h2>{entityLoanDetailObj?._count?.repayments}</h2>
            </div>
          </div>

          <DataTable
            table={table}
            columns={Columns}
            onRowClick={row => {
              // setSelectedEntity(row)
              // setIsEntityDetailModalActive(true)
            }}
          />

          <div className="w-full h-8"></div>
          <DataTablePagination table={table} />


          {/* <pre>
            {JSON.stringify(entityLoanDetailObj, null, 2)}
          </pre> */}
        </div>
      </DialogContent>

      <AlertDialogFooter>
        <Button variant="ghost" onClick={onClose} type="button" >
          {t("Close")}
        </Button>
      </AlertDialogFooter>
    </Dialog>
  )
}

export default EntityLoanDetailModal