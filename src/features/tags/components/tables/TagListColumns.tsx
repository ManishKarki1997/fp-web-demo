import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EntityListColumnActionType, EntityType } from "../../types/TagTypes"
import { Pencil, RecycleIcon, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"

type TagColumnsProps = {
  onAction: (action: EntityListColumnActionType, row: EntityType) => void;
}


export const TagColumns = ({
  onAction
}: TagColumnsProps): ColumnDef<EntityType>[] => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return <div>
          <Avatar>
            <AvatarImage src={row.original?.avatarUrl ?? ''} />
            <AvatarFallback>{row.original.name.split(" ").map(x => x[0]).join()}</AvatarFallback>
          </Avatar>
          <p>{row.original.name}</p>
        </div>
      }
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => (
        <div>
          <Badge
            className={row.original.balance > 0 ? "bg-green-500" : row.original.balance < 0 ? "bg-red-500" : "bg-secondary"}
          >
            <p className="!text-white">
              {row.original.balance}
            </p>
          </Badge>
        </div>
      )
    },
    {
      accessorKey: "isActive",
      header: () => <div className="text-right">Active</div>,
      cell: ({ row }) => {

        return <div className="text-right font-medium">
          <Badge variant={row?.original?.isActive ? "default" : "destructive"}>{row?.original?.isActive ? 'Yes' : 'No'}</Badge>
        </div>
      },
    },
    {
      accessorKey: "createdAt",
      header: "Action",
      cell: ({ row }) => {
        return <div className="flex space-x-2">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon" onClick={() => onAction('Edit', row.original)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              Edit Entity
            </TooltipContent>

          </Tooltip>

          {
            row.original.isActive ?
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" size="icon" onClick={() => onAction('Delete', row.original)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  Delete Entity
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
                  Restore Entity
                </TooltipContent>

              </Tooltip>
          }

        </div>
      },
    }
  ]