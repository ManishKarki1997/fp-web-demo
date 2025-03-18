import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import React, { useState } from 'react'
import { useMyInfoQuery, useUpdateProfileMutation } from "@/store/api/authApi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UpdateUserSchema } from "@/schema/UserSchema"
import { toast } from 'sonner'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)


  const { data: profileInfo } = useMyInfoQuery({})

  const [updateProfileMutation, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation()

  const updateForm = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: profileInfo?.name ?? "",
      email: profileInfo?.email ?? "",
      password: "",
    },
  })


  const handleSubmit = async (values: z.infer<typeof UpdateUserSchema>) => {
    if (isUpdatingProfile) return;

    const loadingId = toast.loading("Updating profile...")

    try {
      await updateProfileMutation({ ...values, id: profileInfo?.id }).unwrap()
      toast.dismiss(loadingId)
      toast.success("Profile updated successfully.")
    } catch (error) {
      const errorMessage = error?.data.message || "Something went wrong"
      toast.dismiss(loadingId)
      toast.error(errorMessage)
    }
  }

  React.useEffect(() => {
    if (!profileInfo) return;

    updateForm.reset({
      name: profileInfo?.name ?? "",
      email: profileInfo?.email ?? "",
    })
  }, [profileInfo])

  return (
    <div>
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>View and edit your profile information.</CardDescription>
        </CardHeader>

        <Form {...updateForm}>
          <form onSubmit={updateForm.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="name"  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email"  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password"  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}