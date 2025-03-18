import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { defaultReactSelectClassNames, defaultReactSelectStyles } from '@/lib/react-select-helpers'
import { useCreateTagMutation, useLazyListMyTagsMinimalQuery, useListMyTagsMinimalQuery } from '@/features/tags/api/tagApi'
import { useCreateTransactionMutation, useEditTransactionMutation, useLazyListLoanTransactionsMinimalQuery } from '../../api/transactionApi'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import CreatableSelect from 'react-select/creatable';
import { CreateTransactionSchema } from '../../schema/TransactionSchema'
import { Input } from '@/components/ui/input'
import React from 'react'
import Spinner from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { TransactionType } from '../../types/TransactionTypes'
import { TransactionTypes } from '../../constants/TransactionConstants'
import UploadedImageViewer from '@/components/uploaded-image-viewer'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import moment from 'moment'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useListMyEntitiesMinimalQuery } from '@/features/entities/api/entityApi'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedTransaction?: TransactionType | null;
}

type FileType = File | { url: string; name: string; isDeleted?: boolean; };


const ManageTransactionForm = ({ isOpen, onClose, selectedTransaction }: Props) => {

  const [files, setFiles] = React.useState<FileType[]>([])

  const { t } = useTranslation()
  const [createTransactionMutation, { isLoading: isCreatingEntity }] = useCreateTransactionMutation()
  const [editTransactionMutation, { isLoading: isEditingEntity }] = useEditTransactionMutation()
  const { data: minimalEntities, isLoading: isLoadingMinimalEntities } = useListMyEntitiesMinimalQuery({})
  const [createTagMutation, { isLoading: isCreatingTag }] = useCreateTagMutation()
  const { isLoading: isLoadingTags, data: tagsData } = useListMyTagsMinimalQuery({})
  const [fetchMinimalLoanTransactions, { data: minimalLoanTransactionsObj }] = useLazyListLoanTransactionsMinimalQuery({})

  const minimalLoanTransactionsArr = minimalLoanTransactionsObj?.data?.map(t => ({
    label: `Rs. ${t.remainingBalance} - ${t.note} (Rs. ${t.amount})`,
    value: String(t.id)
  }))

  const minimalEntitiesArr = minimalEntities?.data ?? []
  const tagsArray = tagsData?.data ? tagsData?.data?.map((tag: { name: string; id: number }) => ({
    label: tag.name,
    value: tag.id
  })) : []


  const form = useForm<z.infer<typeof CreateTransactionSchema>>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type: selectedTransaction && selectedTransaction?.type !== undefined && TransactionTypes.includes(selectedTransaction?.type) ? selectedTransaction?.type : "Purchase",
      amount: selectedTransaction?.amount ? String(selectedTransaction?.amount) : "0",
      note: selectedTransaction?.note ?? "",
      entityId: selectedTransaction?.entityId ? String(selectedTransaction?.entityId) : "",
      date: selectedTransaction?.date ? new Date(selectedTransaction?.date).toString() : new Date().toString(),
      tags: !selectedTransaction?.tags?.length ? [] : selectedTransaction?.tags?.map((tag: any) => ({
        label: tag.name,
        value: tag.id
      })),
      startDate: selectedTransaction?.startDate ? new Date(selectedTransaction?.startDate).toString() : "",
      endDate: selectedTransaction?.endDate ? new Date(selectedTransaction?.endDate).toString() : "",
      interestRate: selectedTransaction?.interestRate ? String(selectedTransaction?.interestRate) : "0",
      remainingBalance: selectedTransaction?.remainingBalance ? String(selectedTransaction?.remainingBalance) : "0",
      status: selectedTransaction?.status !== undefined && ['Ongoing', 'Completed'].includes(selectedTransaction?.status) ? selectedTransaction?.status : "Ongoing",
      loanMonthsSpan: selectedTransaction?.loanMonthsSpan !== undefined ? String(selectedTransaction?.loanMonthsSpan) : undefined,
      parentId: selectedTransaction?.parentId !== undefined ? String(selectedTransaction?.parentId) : ""
    },
  })



  const isLoadingAPI = isCreatingEntity || isEditingEntity

  const onSubmit = async (values: z.infer<typeof CreateTransactionSchema>) => {

    const payload = {
      ...JSON.parse(JSON.stringify(values)),
      startDate: values?.startDate ? new Date(values?.startDate).toString() : undefined,
      endDate: values?.endDate ? new Date(values?.endDate).toString() : undefined,
      parentId: values?.parentId ? Number(values?.parentId) ?? null : undefined,
      remainingBalance: values?.remainingBalance ? Number(values?.remainingBalance) : undefined,
      interestRate: values?.interestRate ? Number(values?.interestRate) : undefined,
      loanMonthsSpan: values?.loanMonthsSpan ? Number(values?.loanMonthsSpan) : undefined,
    }

    // payload.tags = values?.tags === undefined ? [] : values.tags.map(tag => tag.value)
    delete payload.tags;
    delete payload.files;

    const formData = new FormData();
    for (const key in payload) {
      if (payload[key]) {
        formData.append(key, payload[key])
      }
    }

    for (const file of files) {
      if ('url' in file) continue;
      formData.append("files", file)
    }

    const deletedFiles = files.filter(file => 'isDeleted' in file && file.isDeleted)
    for (const file of deletedFiles) {
      if ('url' in file) {
        formData.append("deletedAttachmentUrls", String(file.url))
      }
    }

    if (values?.tags && Array.isArray(values?.tags) && values?.tags.length > 0) {
      for (const tag of values.tags) {
        formData.append("tags[]", String(tag.value))
      }
    }

    if (isLoadingAPI) return;
    if (selectedTransaction) {
      // edit mode

      formData.append("id", String(selectedTransaction.id))

      const loadingId = toast.loading("Editing Transaction")
      try {
        await editTransactionMutation({ payload: formData, id: selectedTransaction.id }).unwrap()
        toast.dismiss(loadingId)
        toast.success(t("Transaction Edited Success"))
        form.reset()
        onClose()
      } catch (error) {
        const errorMessage = error?.data.message || t("Something went wrong")
        toast.dismiss(loadingId)
        toast.error(errorMessage)
      }
    } else {
      // add mode

      const loadingId = toast.loading(t("Adding Transaction"))
      try {
        await createTransactionMutation({ payload: formData }).unwrap()
        toast.dismiss(loadingId)
        toast.success(t("Transaction Added Success"))
        form.reset()
        onClose()
      } catch (error) {
        const errorMessage = error?.data.message || t("Something went wrong")
        toast.dismiss(loadingId)
        toast.error(errorMessage)
      }
    }

  }

  const handleCreateTag = async (tag: string) => {
    if (isCreatingTag) return
    try {
      await createTagMutation({
        name: tag
      }).unwrap()

    } catch (error) {
      const errorMessage = error?.data.message || t("Something went wrong")
      toast.error(errorMessage)

    }
  }

  const onAttachmentsChange = (e: any) => {
    const _files: FileList = e.target.files ?? []
    setFiles(prev => [...prev, ...Array.from(_files)])
  }

  const onDeleteAttachment = (index: number) => {
    const newFiles = [...files];
    if (newFiles[index]) {
      newFiles[index] = {
        ...newFiles[index],
        isDeleted: true,
      };
    }
    setFiles(newFiles);
  }

  React.useEffect(() => {
    if (!selectedTransaction) return;

    if (selectedTransaction.type === 'Payment') {
      fetchMinimalLoanTransactions({}, true)
    }

    if (selectedTransaction?.attachments) {
      setFiles(selectedTransaction?.attachments)
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[900px] max-w-[900px] max-h-[90vh] overflow-auto">

        <DialogHeader>
          <DialogTitle>{selectedTransaction ? t("Edit Transaction") : t("Add Transaction")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="transaction-form" className='py-4 grid grid-cols-12 md:grid-cols-3 gap-8' onSubmit={form.handleSubmit(onSubmit)}>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Amount")}</FormLabel>
                  <FormControl>
                    <Input type="number"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    {t("Type")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={_val => {
                        field.onChange(_val)
                        if (_val === 'Payment') {
                          fetchMinimalLoanTransactions({}, true)
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          TransactionTypes.map(type => (
                            <SelectItem key={type} value={type}>{t(type)}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />



            {/* Entity */}
            {
              form.watch("type") !== "Payment" &&
              <div className="mt-2">
                <FormField
                  control={form.control}
                  name="entityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        {t("Entity")}

                        {
                          isLoadingMinimalEntities && <Spinner size={24} />
                        }
                      </FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("Select Entity")} />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              minimalEntitiesArr?.map((entity: { id: number, name: string }) => (
                                <SelectItem key={entity.id} value={String(entity.id)}>{entity.name}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            }

            <div className="">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='w-full block mt-2'>{t("Date")}</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : new Date()}
                            onSelect={date => field.onChange(date?.toString())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* when type = Payment . this transaction is used to pay off a loan */}
            {
              (form.watch("type")) === "Payment" &&
              <>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel >
                          {t("Loan to Repay")}
                        </FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            onValueChange={_val => {
                              field.onChange(_val)

                              const selectedLoanToRepay = minimalLoanTransactionsObj?.data?.find(t => t.id === +_val)
                              if (!selectedLoanToRepay) return
                              form.setValue("entityId", String(selectedLoanToRepay.entity.id))
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select loan to repay" />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                minimalLoanTransactionsArr?.map((loan: { label: string; value: string; }) => (
                                  <SelectItem key={loan.value} value={loan.value}>{loan.label}</SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                {/* Entity */}
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name="entityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          {t("Entity")}

                          {
                            isLoadingMinimalEntities && <Spinner size={24} />
                          }
                        </FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            disabled
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("Select Entity")} />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                minimalEntitiesArr?.map((entity: { id: number, name: string }) => (
                                  <SelectItem key={entity.id} value={String(entity.id)}>{entity.name}</SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

              </>
            }

            {/* when type = Loan */}
            {
              (form.watch("type")) === "Loan" &&
              <>


                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Interest Rate")}</FormLabel>
                        <FormControl>
                          <Input type="number"  {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="remainingBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Remaining Balance")}</FormLabel>
                        <FormControl>
                          <Input type="number"  {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='w-full block mt-2'>{t("Start Date")}</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a start date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : new Date()}
                                onSelect={date => {
                                  field.onChange(date?.toString())
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="loanMonthsSpan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Total Months")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => {
                              field.onChange((e.target.value))

                              const _startDate = form.getValues().startDate
                              if (_startDate) {
                                const _endDate = moment(new Date(_startDate)).add(+e.target.value, "months").toString()
                                form.setValue("endDate", _endDate)
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='w-full block mt-2'>{t("End Date")}</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                disabled
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick an end date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : new Date()}
                                onSelect={date => field.onChange(date?.toString())}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>



              </>
            }

            <div className="col-span-3">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Note")}</FormLabel>
                    <FormControl>
                      <Textarea rows={2}  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-3">
              <FormField
                name="tags"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Tags")}</FormLabel>
                    <FormControl>
                      <CreatableSelect
                        classNames={defaultReactSelectClassNames}
                        styles={defaultReactSelectStyles}
                        isMulti
                        placeholder=""
                        isClearable
                        isDisabled={isLoadingTags}
                        isLoading={isLoadingTags}
                        onChange={newTags => field.onChange(newTags)}
                        // onChange={(newValue) => setValue(newValue)}
                        onCreateOption={handleCreateTag}
                        options={tagsArray}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              >

              </FormField>
            </div>

            <div className="col-span-3">
              <label htmlFor="files" className='font-medium text-[14px]'>Files</label>
              <Input
                type="file"
                multiple
                accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
                onChange={onAttachmentsChange}
              />

              <div className="mt-4 flex flex-wrap items-center gap-4">
                {files.map((file, index) => (
                  <UploadedImageViewer key={index} index={index} file={file} onDelete={onDeleteAttachment} />
                ))}
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} type="button" >
            {t("Cancel")}
          </Button>
          <Button form="transaction-form" type="submit" >
            {selectedTransaction ? t("Edit Transaction") : t("Add Transaction")}
          </Button>
        </DialogFooter>
      </DialogContent>

    </Dialog >
  )
}

export default ManageTransactionForm