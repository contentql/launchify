import { CollectionConfig } from 'payload'

// import { assignUserId } from './field-level-hooks/assignUserId'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'serviceName',
    group: 'Core',
  },
  access: {
    create: () => true,
    update: () => true,
    read: () => true,
  },

  fields: [
    {
      name: 'serviceName',
      type: 'text',
      label: 'Name',

      admin: {
        description: 'Name of the service.',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
    },
    // {
    //   name: 'user',
    //   label: 'User',
    //   type: 'relationship',
    //   relationTo: ['users'],
    //   hasMany: false,
    //   defaultValue: ({ user }: { user: User }) => {
    //     if (!user) return undefined

    //     return { relationTo: 'users', value: user?.id }
    //   },
    //   admin: {
    //     position: 'sidebar',
    //     description: 'Select the user associated with this project.',
    //   },
    // },
    {
      name: 'variables',
      label: 'Variables',
      type: 'array',

      fields: [
        {
          name: 'key',
          label: 'Key',
          type: 'text',
        },
        {
          name: 'value',
          label: 'Value',
          type: 'text',
        },
      ],
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
          name: 'serviceId',
          type: 'text',
          label: 'Service Id',
          admin: {
            description:
              'The unique identifier for the railway project service.',
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
          name: 'serviceDomains',
          type: 'array',
          label: 'Service domains',
          fields: [
            {
              name: 'domainUrl',
              type: 'text',
              label: 'Domain URL',
              admin: {
                description: 'The URL of your railway domain.',
                placeholder: 'e.g., example.com',
              },
            },
          ],
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'deploymentStatus',
          type: 'select',
          label: 'Deployment Status',
          options: [
            {
              label: 'Not Yet Deployed',
              value: 'NOT_YET_DEPLOYED',
            },
            {
              label: 'Success',
              value: 'SUCCESS',
            },
            {
              label: 'Error',
              value: 'ERROR',
            },
            {
              label: 'Deploying',
              value: 'DEPLOYING',
            },
          ],
          defaultValue: 'NOT_YET_DEPLOYED',
          admin: {
            description:
              'Select the current deployment status of the project in Railway.',
          },
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
