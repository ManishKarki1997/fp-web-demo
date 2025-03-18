import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EntityListColumnActionType, EntityType } from "../../types/EntityTypes"
import { EyeIcon, Pencil, RecycleIcon, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { APP_CONFIG } from "@/config/config"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"

type EntityColumnsProps = {
  onAction: (action: EntityListColumnActionType, row: EntityType, extra?: any) => void;
}


export const useEntityListColumns = () => {
  const { t } = useTranslation()


  const EntityColumns = ({
    onAction
  }: EntityColumnsProps): ColumnDef<EntityType>[] => [
      {
        accessorKey: "name",
        header: t("Name"),
        cell: ({ row }) => {

          const finalAvatarUrl = !row?.original?.avatarUrl ? ""
            : `${APP_CONFIG.API_STATIC_FILE_URL}/entities/${row.original.avatarUrl}`


          return <div onClick={e => e.stopPropagation()} className="flex items-center gap-2">
            <Input
              className={`hidden user-avatar-${row.original.id}`}
              type="file"
              accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
              onChange={e => {
                e.stopPropagation();
                onAction("UploadPicture", row.original, !e.target.files ? null : e.target.files[0])
              }}
            />

            <Avatar
              className="cursor-pointer h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                const element = document.querySelector(`.user-avatar-${row.original.id}`)
                if (element && element instanceof HTMLInputElement) {
                  element?.click()
                }
              }}>
              <AvatarImage src={finalAvatarUrl} />
              <AvatarFallback>{row.original.name.split(" ").map(x => x[0]).join("")}</AvatarFallback>
            </Avatar>
            <p>{row.original.name}</p>
          </div>
        }
      },
      {
        accessorKey: "phoneNumber",
        header: t("Phone Number"),
      },
      {
        accessorKey: "address",
        header: t("Address"),
      },
      {
        accessorKey: "balance",
        header: t("Balance"),
        cell: ({ row }) => (
          <div>
            <Badge
              className={row.original.balance > 0 ? "bg-primary text-white" : row.original.balance < 0 ? "bg-red-500 hover:bg-red-600 text-white" : "bg-accent text-primary hover:text-gray-700 dark:hover:text-gray-700"}
            >
              {Math.abs(row.original.balance).toFixed(2)}
            </Badge>
          </div>
        )
      },
      {
        accessorKey: "isActive",
        header: () => <div className="text-right">{t("Active")}</div>,
        cell: ({ row }) => {

          return <div className="text-right font-medium">
            <Badge variant={row?.original?.isActive ? "default" : "destructive"}>{row?.original?.isActive ? t('Yes') : t('No')}</Badge>
          </div>
        },
      },
      {
        accessorKey: "createdAt",
        header: t("Action"),
        cell: ({ row }) => {
          return <div className="flex space-x-2">

            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon" onClick={() => onAction('View', row.original)}>
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Entity</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon" onClick={(e) => {
                  e.stopPropagation();
                  onAction('Edit', row.original)
                }}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                {t("Edit Entity")}
              </TooltipContent>

            </Tooltip>

            {
              row.original.isActive ?
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" size="icon" onClick={(e) => {
                      e.stopPropagation();
                      onAction('Delete', row.original)
                    }}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    {t("Delete Entity")}
                  </TooltipContent>

                </Tooltip>

                :
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" size="icon" onClick={() => onAction('Restore', row.original)}>
                      <RecycleIcon className="h-4 w-4 text-green-700" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    {t("Restore Entity")}
                  </TooltipContent>

                </Tooltip>
            }

          </div>
        },
      }
    ]

  return {
    EntityColumns
  }

}
