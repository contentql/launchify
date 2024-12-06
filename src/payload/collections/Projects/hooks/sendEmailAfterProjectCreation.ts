import { env } from '@env'
import { Media } from '@payload-types'
import { CollectionAfterChangeHook } from 'payload'

import { CreateProject } from '@/emails/create-project'

export const sendEmailAfterProjectCreation: CollectionAfterChangeHook = async ({
  collection,
  operation,
  doc,
  previousDoc,
  req,
}) => {
  if (operation === 'create') {
    try {
      const { payload } = req
      const user = await payload?.findByID({
        collection: 'users',
        id: doc?.user.value,
      })

      const siteSettings = await payload.findGlobal({
        slug: 'site-settings',
      })

      await payload.sendEmail({
        to: user?.email,
        from: env?.RESEND_SENDER_EMAIL,
        subject: 'Project Created Successfully',
        html: CreateProject({
          actionLabel: 'Your Project Has Been Created',
          logo: (siteSettings?.navbar?.logo?.imageUrl as Media)?.url!,
          projectName: doc.name,
          userName: user?.username || 'User',
        }),
      })
    } catch (error) {
      console.log('Error while sending email', error)
      throw error
    }
  }
}
