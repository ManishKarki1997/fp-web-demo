import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useCreateEntityMutation, useEditEntityMutation } from '../../api/tagApi'

import { Button } from '@/components/ui/button'
import { CreateEntitySchema } from '../../schema/EntitySchema'
import { EntityType } from '../../types/TagTypes'
import { Input } from '@/components/ui/input'
import React from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedEntity?: EntityType | null;
}

const ManageEntityForm = ({ isOpen, onClose, selectedEntity }: Props) => {

  const [createEntityMutation, { isLoading: isCreatingEntity }] = useCreateEntityMutation()
  const [editEntityMutation, { isLoading: isEditingEntity }] = useEditEntityMutation()
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof CreateEntitySchema>>({
    resolver: zodResolver(CreateEntitySchema),
    defaultValues: {
      name: selectedEntity?.name ?? "",
      email: selectedEntity?.email ?? "",
      phoneNumber: selectedEntity?.phoneNumber ?? "",
      address: selectedEntity?.address ?? ""
    },
  })

  const isLoadingAPI = isCreatingEntity || isEditingEntity

  const onSubmit = async (values: z.infer<typeof CreateEntitySchema>) => {
    if (isLoadingAPI) return;
    if (selectedEntity) {
      // edit mode

      const loadingId = toast.loading("Editing Entity")
      try {
        await editEntityMutation({ ...values, id: selectedEntity.id }).unwrap()
        toast.dismiss(loadingId)
        toast.success("Entity edited successfully.")
        form.reset()
        onClose()
      } catch (error) {
        const errorMessage = error?.data.message || "Something went wrong"
        toast.dismiss(loadingId)
        toast.error(errorMessage)
      }
    } else {
      // add mode

      const loadingId = toast.loading("Creating Entity")
      try {
        await createEntityMutation(values).unwrap()
        toast.dismiss(loadingId)
        toast.success("Entity created successfully.")
        form.reset()
        onClose()
      } catch (error) {
        const errorMessage = error?.data.message || "Something went wrong"
        toast.dismiss(loadingId)
        toast.error(errorMessage)
      }
    }

  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px] max-w-[500px] max-h-[90vh] overflow-auto">

        <DialogHeader>
          <DialogTitle>
            {selectedEntity ? t("Edit Entity") : t("Add Entity")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="entity-form" className='space-y-6 py-4' onSubmit={form.handleSubmit(onSubmit)}>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Name")}</FormLabel>
                  <FormControl>
                    <Input type="text"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    {t("Email")}
                  </FormLabel>
                  <FormControl>
                    <Input type="email"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Phone Number")}</FormLabel>
                  <FormControl>
                    <Input type="text"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Address")}</FormLabel>
                  <FormControl>
                    <Input type="text"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


          </form>
        </Form>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} type="button" >
            Cancel
          </Button>
          <Button form="entity-form" type="submit" >
            {selectedEntity ? t("Edit Entity") : t("Add Entity")}
          </Button>
        </DialogFooter>
      </DialogContent>

    </Dialog >
  )
}

export default ManageEntityForm