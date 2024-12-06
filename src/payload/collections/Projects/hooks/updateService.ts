import { CollectionAfterChangeHook } from 'payload'

export const updateService: CollectionAfterChangeHook = async ({
  collection,
  context,
  req,
  operation,
  doc,
  previousDoc,
}) => {
  if (operation === 'create') {
    const { payload } = req
    try {
      const updateService = await payload?.update({
        collection: 'services',
        data: {
          project: doc.id,
        },
        where: {
          projectId: {
            equals: doc?.projectId,
          },
        },
      })
    } catch (error) {
      console.log('Error While updating empty project')
      throw error
    }
  }
}
