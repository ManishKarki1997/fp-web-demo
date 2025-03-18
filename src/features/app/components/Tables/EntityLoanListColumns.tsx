import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EntityLoanListColumnActionType, EntityLoanType } from "../../types/AppTypes"
import { EyeIcon, Pencil, RecycleIcon, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { APP_CONFIG } from "@/config/config"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"

type EntityLoanColumnsProps = {
  onAction: (action: EntityLoanListColumnActionType, row: EntityLoanType, extra?: any) => void;
}


export const useEntityLoanListColumns = () => {
  const { t } = useTranslation()


  const EntityLoanColumns = ({
    onAction
  }: EntityLoanColumnsProps): ColumnDef<EntityLoanType>[] => [
      {
        accessorKey: "name",
        header: t("Name"),
        cell: ({ row }) => {

          const finalAvatarUrl = !row?.original.entity?.avatarUrl ? ""
            : `${APP_CONFIG.API_STATIC_FILE_URL}/entities/${row.original.entity.avatarUrl}`


          return <div
            className="flex items-center gap-2">
            <Avatar
              className="cursor-pointer h-8 w-8"
            >
              <AvatarImage src={finalAvatarUrl} />
              <AvatarFallback>{row.original?.entity?.name?.split(" ").map(x => x[0]).join("")}</AvatarFallback>
            </Avatar>
            <p>{row.original?.entity.name}</p>
          </div>
        }
      },
      {
        accessorKey: "note",
        header: t("Note"),
      },
      {
        accessorKey: "amount",
        header: t("Amount"),
      },
      {
        accessorKey: "remainingBalance",
        header: t("Remaining Balance"),
      },
      {
        accessorKey: "totalRepayments",
        header: t("Total Repayments"),
        cell: ({ row }) => (
          <p>{row.original._count.repayments}</p>
        )
      },
    ]

  return {
    EntityLoanColumns
  }

}
