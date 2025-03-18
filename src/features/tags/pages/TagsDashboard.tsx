import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { TagListType, TagType, TagTypeWithCount } from '../types/TagTypes'

import AppHeaderPortal from '@/components/layout/AppHeaderPortal'
import { Button } from '@/components/ui/button'
import EntityTransactions from '@/features/entities/components/detail/EntityTransactions'
import { EntityType } from '@/features/entities/types/EntityTypes'
import React from 'react'
import Spinner from '@/components/ui/spinner'
import TagCard from '../components/ui/TagCard'
import { useLazyListMyEntitiesQuery } from '@/features/entities/api/entityApi'
import { useListMyTagsQuery } from '../api/tagApi'
import { usePagination } from '@/hooks/usePagination'
import { useTag } from '../hooks/useTag'
import { useTransactionFilters } from '@/features/transactions/hooks/useTransactionFilters'

const TagsDashboard = () => {

  const [selectedEntity, setSelectedEntity] = React.useState<null | EntityType>(null)

  const [isDeleteEntityDialogOpen, setIsDeleteEntityDialogOpen] = React.useState(false)
  const [isRestoreEntityDialogOpen, setIsRestoreEntityDialogOpen] = React.useState(false)


  const {
    handleRestoreEntity,
    handleDeleteEntity,
    isRestoring,
    isSoftDeleting
  } = useTag()

  const [fetchMyEntities, { isFetching: isFetchingEntities, data: myEntitiesObj }] = useLazyListMyEntitiesQuery()

  const { isLoading: isLoadingTags, data: tagsObj = {} } = useListMyTagsQuery({})
  const { data: tagsArray } = tagsObj as TagListType




  const { onPaginationChange, pagination } = usePagination();


  const cancelDeleteEntity = () => {
    setIsDeleteEntityDialogOpen(false)
    setSelectedEntity(null)
  }

  const cancelRestoreEntity = () => {
    setIsRestoreEntityDialogOpen(false)
    setSelectedEntity(null)
  }


  const {
    selectedTags,
    setSelectedTags,
    debouncedFilters
  } = useTransactionFilters({})




  const onSelectTag = (tag: TagType) => {
    const isTagSelected = selectedTags.find(t => t.value === tag.id)
    if (isTagSelected) {
      setSelectedTags(prev => prev.filter(t => t.value !== tag.id))
    } else {
      setSelectedTags(prev => [...prev, { label: tag.name, value: tag.id }])
    }
  }

  React.useEffect(() => {
    fetchMyEntities({ pageSize: pagination.pageSize, page: pagination.pageIndex + 1 }, true)
  }, [fetchMyEntities, pagination])


  return (
    <div>
      <AppHeaderPortal
        title={
          <div className='flex items-center gap-2'>
            Tags
            {
              isLoadingTags &&
              <Spinner size={24} />
            }
          </div>
        }
      >
        <div className="w-full flex justify-between gap-4 items-center">
          {/* <Button size="sm" variant="default" onClick={() => { }}>Add Tag</Button> */}
        </div>
      </AppHeaderPortal>


      <div className="py-4">
        <div className="flex flex-wrap items-center gap-4">
          {
            tagsArray?.map((tag: TagTypeWithCount, idx: number) => (
              <TagCard key={tag.id} tag={tag} idx={idx} onClick={onSelectTag} selected={!!selectedTags.find(t => t.value === tag.id)} />
            ))
          }
        </div>
      </div>

      <div className="py-4">

        <EntityTransactions
          manageFiltersInternally={false}
          initialFilters={{ ...debouncedFilters, tags: selectedTags.map(t => t.value) }}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
        />
      </div>

      {
        isDeleteEntityDialogOpen &&
        selectedEntity &&
        <AlertDialog open={isDeleteEntityDialogOpen} onOpenChange={cancelDeleteEntity}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Entity?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you absolutely sure? You can always restore it later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDeleteEntity}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={isSoftDeleting} onClick={() => handleDeleteEntity({ entity: selectedEntity, callbackFn: cancelDeleteEntity })}>Yes, Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }

      {
        isRestoreEntityDialogOpen &&
        selectedEntity &&
        <AlertDialog open={isRestoreEntityDialogOpen} onOpenChange={cancelRestoreEntity}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restore Entity?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelRestoreEntity}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={isRestoring} onClick={() => handleRestoreEntity({ entity: selectedEntity, callbackFn: cancelRestoreEntity })}>Yes, Restore</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
    </div>
  )
}

export default TagsDashboard