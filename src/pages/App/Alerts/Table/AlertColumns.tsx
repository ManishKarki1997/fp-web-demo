import { AlertListColumnActionType, IAlert } from "@/types/AlertTypes"
import { Pencil, Rocket, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"

type AlertColumnsProps = {
  onAction: (action: AlertListColumnActionType, row: IAlert) => void;
}


export const AlertColumns = ({
  onAction
}: AlertColumnsProps): ColumnDef<IAlert>[] => [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "keyword",
      header: "Keyword",
    },
    {
      accessorKey: "website",
      header: "Website",
    },
    {
      accessorKey: "notifyEmail",
      header: "Notify Email",
    },
    {
      accessorKey: "sendAttachment",
      header: () => <div className="text-right">Send Attachment</div>,
      cell: ({ row }) => {

        return <div className="text-right font-medium">
          <Badge variant={row?.original?.sendAttachment ? "default" : "destructive"}>{row?.original?.sendAttachment ? 'Yes' : 'No'}</Badge>
        </div>
      },
    }, {
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
              Edit Alert
            </TooltipContent>

          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon" onClick={() => onAction('Delete', row.original)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              Delete Alert
            </TooltipContent>

          </Tooltip>

          <Tooltip>
            <TooltipTrigger>

              <Button variant="outline" size="icon" onClick={() => onAction('Test', row.original)}>
                <Rocket className="h-4 w-4" />
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              Run this alert in a test mode
            </TooltipContent>
          </Tooltip>
        </div>
      },
    }
  ]