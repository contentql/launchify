// import { assignUserId } from './field-level-hooks/assignUserId'
import { User } from '@payload-types'
import { CollectionConfig } from 'payload'

import { isAdminOrCurrentUser } from './access'
import { deployTemplate } from './hooks/deployTemplate'
import { updateService } from './hooks/updateService'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    group: 'Core',
  },
  access: {
    create: isAdminOrCurrentUser,
    read: isAdminOrCurrentUser,
    update: isAdminOrCurrentUser,
  },

  hooks: {
    beforeChange: [deployTemplate],
    afterChange: [updateService],
    // afterChange: [createService, sendEmailAfterProjectCreation],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Project Name',
      // required: true,
      unique: true,
      admin: {
        position: undefined,
        description: 'Name of the railway project.',
        placeholder: 'Enter the name of the railway project',
      },
    },
    {
      type: 'textarea',
      name: 'projectDescription',
      admin: {
        description: 'Description of the railway project.',
        placeholder: 'Enter the Description of the railway project',
      },
    },
    {
      type: 'join',
      name: 'Services',
      collection: 'services',
      on: 'project',
    },
    {
      name: 'user',
      label: 'User',
      type: 'relationship',
      relationTo: ['users'],
      hasMany: false,
      defaultValue: ({ user }: { user: User }) => {
        if (!user) return undefined

        return { relationTo: 'users', value: user?.id }
      },
      admin: {
        position: 'sidebar',
        description: 'Select the user associated with this project.',
      },
    },
    {
      type: 'collapsible',
      label: 'Railway project Details',
      fields: [
        {
          name: 'projectId',
          type: 'text',
          label: 'Project Id',
          admin: {
            description: 'The unique identifier for the railway project.',
            placeholder: 'Auto-generated after project creation',
          },
        },
        {
          name: 'environmentId',
          type: 'text',
          label: 'Environment Id',
          admin: {
            description:
              'The unique identifier for the railway project environment.',
            placeholder: 'Auto-generated after project creation',
          },
        },
        {
          name: 'project',
          type: 'relationship',
          relationTo: 'templates',
          label: 'Template',
          required: true,
          admin: {
            readOnly: false,
          },
          // filterOptions: async ({
          //   relationTo,
          //   siblingData,
          //   user,
          //   data,
          //   id,
          // }) => {
          //   const siteSettings = await payload.findGlobal({
          //     slug: 'site-settings',
          //   })
          //   // if (relationTo === 'templates') {
          //   //   return {
          //   //     'contest.value': {
          //   //       equals: id,
          //   //     },
          //   //   }
          //   // }

          //   return true
          // },
        },
        {
          name: 'deleted',
          type: 'checkbox',
          label: 'Deleted',
          defaultValue: false,
          admin: {
            readOnly: false,
            description: 'Boolean to identify project deletion in railway.',
          },
        },
      ],

      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto filled after successful project creation.',
      },
    },
  ],
}
