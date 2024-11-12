import { CollectionBeforeChangeHook } from 'payload'

import { getServiceDomains, getVariables } from '@/railway'

export const updateCollectionBeforeChange: CollectionBeforeChangeHook = async ({
  collection,
  originalDoc,
  req,
  data,
  operation,
}) => {
  if (operation === 'update') {
    if (
      originalDoc?.deploymentStatus != data?.deploymentStatus &&
      (data?.deploymentStatus === 'SUCCESS' ||
        data?.deploymentStatus === 'Error')
    ) {
      try {
        const serviceDomains = await getServiceDomains({
          environmentId: originalDoc?.environmentId,
          projectId: originalDoc?.projectId,
          serviceId: originalDoc?.serviceId,
        })
        const variables = await getVariables({
          environmentId: originalDoc?.environmentId,
          projectId: originalDoc?.projectId,
          serviceId: originalDoc?.serviceId,
        })

        console.log('domains', variables, serviceDomains)

        if (!Array.isArray(originalDoc.serviceDomains)) {
          originalDoc.serviceDomains = []
        }
        const formattedVariables = Object.entries(variables?.variables).map(
          ([key, value]) => ({
            key,
            value: value as string | null | undefined,
          }),
        )

        if (
          serviceDomains?.length > 0 &&
          originalDoc?.serviceDomains?.length === 0
        ) {
          data.serviceDomains = [{ domainUrl: serviceDomains.at(0)?.domain }]
        }
        if (
          formattedVariables?.length > 0 &&
          originalDoc?.variables?.length === 0
        ) {
          data.variables = formattedVariables
        }
        return data
      } catch (error) {
        console.log('Error while getting domains', error)
      }
    }
  }
}