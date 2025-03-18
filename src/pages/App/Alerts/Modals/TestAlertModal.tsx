import { Columns, Columns2, Columns3, Columns4, Square } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { IAlert } from "@/types/AlertTypes";
import React from 'react'
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useTestAlertMutation } from "@/store/api/alertApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  alert: IAlert;
}

const TestAlertModal = ({ isOpen, onClose, alert }: Props) => {

  const [gridViewCols, setGridViewCols] = React.useState(2)

  const [testAlertMutation, { isLoading: isTestingAlert, data: alertResults }] = useTestAlertMutation()


  const gridColsMap: Record<number, string> = {
    4: "grid-cols-4",
    3: "grid-cols-3",
    2: "grid-cols-2",
    1: "grid-cols-1"
  }

  const formattedChapterImages = React.useMemo(() => {
    return alertResults?.alertResults?.chapterImages
      ?.filter((manga: any) => manga.length > 0)
      ?.map((manga: any) => {
        const mangaName = manga[0]?.name

        return {
          mangaName,
          chapterImages: manga
        }
      })
  }, [alertResults])


  const handleTestAlert = async () => {
    if (!alert) return

    if (isTestingAlert) return;

    // const loadingId = toast.loading("Scheduling Alert Job...")

    try {
      await testAlertMutation({ id: (alert.id) }).unwrap()
      // toast.dismiss(loadingId)
      // toast.success("Alert job scheduled successfully.")
    } catch (error) {
      const errorMessage = error?.data.message || "Something went wrong"
      // toast.dismiss(loadingId)
      toast.error(errorMessage)
    }
  }

  React.useEffect(() => {
    handleTestAlert()
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[900px] max-w-[900px] max-h-[90vh] overflow-auto">

        <div className="flex items-center justify-between gap-4">
          <DialogHeader>
            <DialogTitle>Test Result for {alert?.name}</DialogTitle>
            <DialogDescription>
              {!isTestingAlert && <>
                {
                  formattedChapterImages?.length > 0 ?
                    "These are the chapter images which will be zipped and mailed to you"
                    : "Could not find any chapter images. Maybe there's a mistake in the keyword?"
                }
              </>
              }
            </DialogDescription>
          </DialogHeader>

          <DropdownMenu>
            <DropdownMenuTrigger className="mr-8 -mt-8">
              {
                gridViewCols === 1 ?
                  <Square />
                  : gridViewCols === 2 ?
                    <Columns2 />
                    : gridViewCols === 3 ?
                      <Columns3 />
                      : <Columns4 />
              }
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setGridViewCols(4)}>
                <Columns4 />
                <span className="ml-1">4 grid columns</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGridViewCols(3)}>
                <Columns3 />
                <span className="ml-1">3 grid columns</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGridViewCols(2)}>
                <Columns2 />
                <span className="ml-1">2 grid columns</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGridViewCols(1)}>
                <Square />
                <span className="ml-1">1 grid column</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 
        <div className={`${gridColsMap[gridViewCols]} grid gap-8`}>
          <div className="w-full h-[250px] rounded bg-gray-200"></div>
          <div className="w-full h-[250px] rounded bg-gray-200"></div>
          <div className="w-full h-[250px] rounded bg-gray-200"></div>
          <div className="w-full h-[250px] rounded bg-gray-200"></div>
          <div className="w-full h-[250px] rounded bg-gray-200"></div>
          <div className="w-full h-[250px] rounded bg-gray-200"></div>
          <div className="w-full h-[250px] rounded bg-gray-200"></div>
          <div className="w-full h-[250px] rounded bg-gray-200"></div>
        </div> */}

        <div className={`${gridColsMap[gridViewCols]} grid gap-8`}>

          {
            isTestingAlert && <>
              <div>
                <Skeleton className="w-full h-[250px] rounded" />
                <Skeleton className="w-full h-[40px] rounded mt-2" />
              </div>
              <div>
                <Skeleton className="w-full h-[250px] rounded" />
                <Skeleton className="w-full h-[40px] rounded mt-2" />
              </div>
              <div>
                <Skeleton className="w-full h-[250px] rounded" />
                <Skeleton className="w-full h-[40px] rounded mt-2" />
              </div>
              <div>
                <Skeleton className="w-full h-[250px] rounded" />
                <Skeleton className="w-full h-[40px] rounded mt-2" />
              </div>

            </>
          }


        </div>

        <div>
          {
            !isTestingAlert && <>
              {
                formattedChapterImages?.map((manga: any) =>
                  <div key={manga.mangaName}>

                    <div className="mb-2">
                      <h2 className="font-medium">{manga.mangaName}</h2>
                    </div>

                    <hr />

                    <div className={`${gridColsMap[gridViewCols]} grid gap-8`}>
                      {
                        manga.chapterImages?.map((chapterImage: any) => {
                          return <div
                            className="cursor-pointer w-full"
                            key={chapterImage.page}
                            onClick={() => window.open(chapterImage.link, "_blank")}
                          >
                            <img
                              src={chapterImage.link}
                              alt={chapterImage.name}
                              className={`w-full h-auto rounded ${gridViewCols === 4 ? "object-contain" : "object-cover"}`}
                            />
                            <p className="mt-2 text-center">
                              Page <span className="font-medium">{chapterImage.page}</span>
                            </p>
                          </div>
                        })
                      }
                    </div>
                  </div>)
              }
            </>
          }
        </div>


      </DialogContent>
    </Dialog>
  )
}

export default TestAlertModal