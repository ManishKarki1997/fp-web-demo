import { AlertLogsListColumnActionType, IAlertLog } from "@/types/AlertTypes"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Rocket } from "lucide-react"

type AlertLogsColumnsProps = {
  onAction: (action: AlertLogsListColumnActionType, row: IAlertLog) => void;
}


export const AlertLogsColumns = ({
  onAction
}: AlertLogsColumnsProps): ColumnDef<IAlertLog>[] => [
    {
      accessorKey: "alert.name",
      header: "Name",
      size: 100,
      maxSize: 100,
      cell: ({ row }) => {
        return <div>
          <h2> {row.original?.alert?.name}</h2 >
          <p className="text-muted-foreground">{row.original?.alert?.website}</p>
        </div >
      }
    },
    {
      accessorKey: "alert.keyword",
      header: "Keyword",
      size: 80,
      maxSize: 80,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      size: 40,
      maxSize: 40,
      cell: ({ row }) => {
        return <div >
          {new Date(row?.original?.createdAt).toLocaleDateString()}
        </div>
      },
    },
    {
      accessorKey: "chapterNumber",
      header: "Chapter Number",
      size: 40,
      maxSize: 40,
    },
    {
      accessorKey: "testMode",
      size: 40,
      maxSize: 40,
      header: () => <div className="">Test Mode</div>,
      cell: ({ row }) => {

        return <div className="font-medium">
          <Badge variant={row?.original?.testMode ? "default" : "destructive"}>{row?.original?.testMode ? 'Yes' : 'No'}</Badge>
        </div>
      },
    }, {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        return <div className="flex space-x-2">
        <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon" onClick={() => onAction('Test', row.original)}>
                <Rocket className="h-4 w-4" />
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              Rerun this alert
            </TooltipContent>

          </Tooltip>
        </div>
      },
    }
  ]