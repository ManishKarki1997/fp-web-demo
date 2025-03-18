import { useRestoreEntityMutation, useSoftDeleteEntityMutation } from "../api/entityApi";

import { EntityType } from "../types/EntityTypes";
import { toast } from "sonner";

type HandleDeleteEntityProps = {
  entity: EntityType;
  callbackFn: () => void;
}

type HandleRestoreEntityProps = {
  entity: EntityType;
  callbackFn: () => void;
}

export const useEntity = () => {

  const [softDeleteEntityMutation, { isLoading: isSoftDeleting }] = useSoftDeleteEntityMutation()
  const [restoreEntityMutation, { isLoading: isRestoring }] = useRestoreEntityMutation()

  const handleDeleteEntity = async ({entity, callbackFn = () => {}}:HandleDeleteEntityProps) => { 
    if (isSoftDeleting) return;
    if (!entity) return;

    const loadingId = toast.loading("Deleting Entity")
    try {
      await softDeleteEntityMutation({ id: entity.id }).unwrap()
      toast.dismiss(loadingId)
      toast.success("Entity created successfully.")
      callbackFn()
    } catch (error) {
      const errorMessage = error?.data.message || "Something went wrong"
      toast.dismiss(loadingId)
      toast.error(errorMessage)
    }
  }


  const handleRestoreEntity = async ({entity, callbackFn = () => {}}:HandleRestoreEntityProps) => {
    if (isRestoring) return;
    if (!entity) return;

    const loadingId = toast.loading("Restoring Entity")
    try {
      await restoreEntityMutation({ id: entity.id }).unwrap()
      toast.dismiss(loadingId)
      toast.success("Entity restored successfully.")
      callbackFn()
    } catch (error) {
      const errorMessage = error?.data.message || "Something went wrong"
      toast.dismiss(loadingId)
      toast.error(errorMessage)
    }
  }


  return {
    handleRestoreEntity,
    handleDeleteEntity,
    isRestoring,
    isSoftDeleting
  }

}