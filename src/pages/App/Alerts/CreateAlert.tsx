import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useCreateAlertMutation, useLazyGetAlertDetailQuery, useUpdateAlertDetailMutation } from "@/store/api/alertApi"
import { useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { CreateAlertSchema } from "@/schema/AlertSchema"
import { IAlert } from "@/types/AlertTypes"
import { Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Spinner from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useMyInfoQuery } from "@/store/api/authApi"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export default function CreateAlert() {


  const navigate = useNavigate()
  const params = useParams()
  const [createAlertMutation, { isLoading: isCreatingAlert }] = useCreateAlertMutation()
  const [updateAlertMutation, { isLoading: isUpdatingAlert }] = useUpdateAlertDetailMutation()
  const [fetchAlertDetail, { isLoading: isFetchingAlert }] = useLazyGetAlertDetailQuery()

  const { alertId } = params

  const alertForm = useForm<z.infer<typeof CreateAlertSchema>>({
    resolver: zodResolver(CreateAlertSchema),
    defaultValues: {
      notifyEmail: "",
      name: "",
      keyword: "",
      website: "tcbscans.me",
      sendAttachment: true
    },
  })

  const { data: profileInfo } = useMyInfoQuery({})

  const onSubmit = async (values: z.infer<typeof CreateAlertSchema>) => {
    if (alertId) {
      // edit alert

      if (isUpdatingAlert) return;

      const loadingId = toast.loading("Updating Alert...")

      try {
        await updateAlertMutation({ ...values, id: Number(alertId) }).unwrap()
        toast.dismiss(loadingId)
        toast.success("Alert updated successfully.")
        alertForm.reset()
        navigate("/app/alerts")
      } catch (error) {
        const errorMessage = error?.data.message || "Something went wrong"
        toast.dismiss(loadingId)
        toast.error(errorMessage)
      }

    } else {
      // create alert
      if (isCreatingAlert) return;

      const loadingId = toast.loading("Creating Alert...")

      try {
        await createAlertMutation(values).unwrap()
        toast.dismiss(loadingId)
        toast.success("Alert created successfully.")
        alertForm.reset()
        navigate("/app/alerts")
      } catch (error) {
        const errorMessage = error?.data.message || "Something went wrong"
        toast.dismiss(loadingId)
        toast.error(errorMessage)
      }
    }
  }

  const handleSetAlertDetail = React.useCallback(async () => {
    try {
      const alertDetail: IAlert = await fetchAlertDetail({ id: alertId }, false).unwrap()
      alertForm.reset({
        notifyEmail: alertDetail?.notifyEmail ?? "",
        name: alertDetail?.name ?? "",
        keyword: alertDetail?.keyword ?? "",
        website: alertDetail?.website ?? "tcbscans.me",
        sendAttachment: alertDetail?.sendAttachment ?? true
      })
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't fetch alert details")

    }
  }, [alertForm, alertId, fetchAlertDetail])

  React.useEffect(() => {
    if (!profileInfo?.email) return

    alertForm.setValue("notifyEmail", profileInfo?.email ?? "")
  }, [profileInfo, alertForm])

  React.useEffect(() => {
    if (!alertId) return;
    handleSetAlertDetail()
  }, [alertId, handleSetAlertDetail])


  return (
    <Card className="shadow-none border-none w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            {alertId ? "Update" : "Set Up"} Manga Alert
            {isFetchingAlert && <Spinner />}
          </div>
        </CardTitle>
        <CardDescription>Configure alerts for your favorite manga.</CardDescription>
      </CardHeader>
      <Form {...alertForm}>
        <form onSubmit={alertForm.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <FormField
              control={alertForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={alertForm.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Keyword
                    <Tooltip>
                      <TooltipTrigger>
                        <Button type="button" variant="ghost" size="sm">
                          <Info size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Find a manga at tcbscans.me. Type the title as is, but replace the chapter number with <strong>{"<"}number{">"} placeholder</strong>
                        </p>
                        <p >
                          Correct: <strong className="text-green-500">One Piece Chapter {"<number>"}</strong>
                        </p>
                        <p>
                          Inorrect: <strong className="text-red-500">One Piece Chapter 1121</strong>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input type="text"  {...field} placeholder="e.g. One Piece Chapter <number>" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={alertForm.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Select defaultValue="tcbscans.me" {...field}>
                      <SelectTrigger >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcbscans.me">TCB Scans</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={alertForm.control}
              name="notifyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email for alerts</FormLabel>
                  <FormControl>
                    <Input type="email"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <FormField
                control={alertForm.control}
                name="sendAttachment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-2">Send chapters as attachment</FormLabel>
                    <FormControl>
                      <Switch
                        onCheckedChange={field.onChange}
                        checked={!!field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isCreatingAlert}>
              {
                alertId ? "Update Alert" : "Setup Alert"
              }
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}