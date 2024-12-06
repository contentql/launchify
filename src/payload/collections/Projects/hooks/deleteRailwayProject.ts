import { env } from '@env'
import { Media } from '@payload-types'
import { CollectionBeforeChangeHook } from 'payload'

import { DeleteProject } from '@/emails/delete-project'
import { deleteProject } from '@/railway'

export const deleteRailwayProject: CollectionBeforeChangeHook = async ({
  req,
  operation,
  collection,
  originalDoc,
  data,
  context,
}) => {
  const { payload } = req
  if (
    operation === 'update' &&
    !originalDoc?.deleted &&
    data?.deleted &&
    originalDoc?.projectId
  ) {
    try {
      const user = await payload?.findByID({
        collection: 'users',
        id: data?.user.value,
      })
      console.log('user', user)
      const siteSettings = await payload.findGlobal({
        slug: 'site-settings',
      })
      await deleteProject({ projectId: originalDoc?.projectId })
      await payload.update({
        collection: 'services',
        data: {
          deleted: true,
        },
        where: {
          projectId: {
            equals: originalDoc?.projectId,
          },
        },
      })
      await payload.sendEmail({
        to: user?.email,
        from: env?.RESEND_SENDER_EMAIL,
        subject: 'Your Project Has Been Deleted Successfully',
        html: DeleteProject({
          actionLabel:
            'Confirmation: Your Project Has Been Deleted Successfully',
          logo: (siteSettings?.navbar?.logo?.imageUrl as Media)?.url!,
          projectName: originalDoc.name,
          userName: user?.username || 'User',
        }),
      })
    } catch (error) {
      payload.logger.error(`Unable to delete ${originalDoc?.name} project.`)
      throw error
    }
  }
}
