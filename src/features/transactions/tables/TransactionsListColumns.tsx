import { CheckIcon, EyeIcon, Pencil, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TransactionListColumnActionType, TransactionType } from "../types/TransactionTypes"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { TransactionTypeColorsMapCss } from "../constants/TransactionConstants"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

type TransactionsListColumnsProps = {
  onAction: (action: TransactionListColumnActionType, row: TransactionType) => void;
}

export const useTransactionListColumns = () => {
  const { t } = useTranslation()

  const TransactionsListColumns = ({ onAction }: TransactionsListColumnsProps): ColumnDef<TransactionType>[] => [
    {
      accessorKey: "note",
      header: t("Note"),
    },
    {
      accessorKey: "entity.name",
      header: t("Entity"),
    },
    {
      accessorKey: "type",
      header: t("Type"),
      cell: ({ row }) => (
        <div>
          <Badge variant="outline">
            <span className={cn("text-[14px]", TransactionTypeColorsMapCss[row.original?.type || "Payment"] ?? undefined)}>
              {t(row.original?.type)}
            </span>
          </Badge>
        </div>
      )
    },
    {
      accessorKey: "tags",
      header: t("Tags"),
      cell: ({ row }) => (
        <div>
          {/* @ts-ignore */}
          {row.original.tags?.map((tag: { name: string; id: number }) => (
            <Badge key={tag.id} variant="outline" className="font-normal">
              {tag.name}
            </Badge>
          ))}
        </div>
      )
    },
    {
      accessorKey: "amount",
      header: t("Amount"),
      cell: ({ row }) => (
        <div>
          <p className={cn(row.original?.type === "Loan" ? "line-through" : "")}>
            {t("Rs")}.
            {parseFloat(row.original.amount).toFixed(2)}
          </p>
          {
            row.original.type === 'Loan' ?
              <>
                {
                  row.original.status === 'Ongoing' &&
                    row.original?.remainingBalance ?
                    <p className="mt-1 text-red-500">
                      {t("Rs")}.
                      {parseFloat(row.original?.remainingBalance ?? 0).toFixed(2)}
                    </p>
                    : <p className="text-primary">Completed</p>
                }
              </> : null
          }
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: t("Date"),
      cell: ({ row }) => (
        <div>{new Date(row.original.date).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("Action"),
      cell: ({ row }) => (
        <div className="flex space-x-2">

          {/* <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon" onClick={() => onAction('View', row.original)}>
                <EyeIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Transaction</TooltipContent>
          </Tooltip> */}
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon" onClick={() => onAction('Edit', row.original)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Transaction</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon" onClick={() => onAction('Delete', row.original)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Transaction</TooltipContent>
          </Tooltip>

          {
            row.original.type === "Loan" && row.original?.remainingBalance && row.original.status !== 'Completed' ?
              <Tooltip>
                <TooltipTrigger>
                  <Button className="text-primary " variant="outline" size="icon" onClick={() => onAction('Complete', row.original)}>
                    <CheckIcon className="h-4 w-4 " />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Complete Loan Transaction</TooltipContent>
              </Tooltip>
              : null
          }
        </div>
      ),
    }
  ]

  return { TransactionsListColumns }
}
