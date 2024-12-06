import { CollectionBeforeChangeHook } from 'payload'

import { deleteVariable, redeployService, upsertVariables } from '@/railway'

export const updateVariables: CollectionBeforeChangeHook = async ({
  collection,
  context,
  data,
  operation,
  req,
  originalDoc,
}) => {
  if (operation === 'update') {
    const { variables: originalVariables = [] } = originalDoc || {}
    const { variables: updatedVariables = [] } = data || {}
    if (originalVariables?.length > 0) {
      const added = updatedVariables.filter(
        (updatedVariable: any) =>
          !originalVariables?.some(
            (originalVariable: any) =>
              originalVariable.key === updatedVariable.key,
          ),
      )

      const edited = updatedVariables.filter((updatedVariable: any) =>
        originalVariables?.some(
          (originalVariable: any) =>
            originalVariable.key === updatedVariable.key &&
            originalVariable.value !== updatedVariable.value,
        ),
      )
      const deleted = originalVariables?.filter(
        (originalVariable: any) =>
          !updatedVariables?.some(
            (updateVariable: any) =>
              updateVariable.key === originalVariable.key,
          ),
      )
      if (added.length > 0 || deleted.length > 0 || edited.length > 0) {
        try {
          const { projectId, serviceId, environmentId } = originalDoc

          if (added.length > 0 || edited.length > 0) {
            const combinedVariables = updatedVariables?.reduce(
              (
                acc: Record<string, string>,
                curr: { key?: string | null; value?: string | null },
              ) => {
                // Check if curr.key is a valid string before processing
                if (typeof curr.key === 'string') {
                  // Use curr.value or an empty string if curr.value is null or undefined
                  acc[curr.key] = curr.value ?? ''
                }
                return acc
              },
              {},
            )
            await upsertVariables({
              projectId,
              serviceId,
              environmentId,
              variables: combinedVariables,
            })
          }

          if (deleted?.length > 0) {
            for (const variable of deleted) {
              await deleteVariable({
                environmentId,
                projectId,
                serviceId,
                name: variable.key,
              })
            }
          }

          await redeployService({
            serviceId,
            environmentId,
          })
        } catch (error) {
          console.log('Error while updating variables', error)
          throw error
        }
      }
    }
  }
}
