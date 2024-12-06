import { CollectionConfig } from 'payload'

export const Templates: CollectionConfig = {
  slug: 'templates',
  admin: {
    useAsTitle: 'title',
    group: 'Core',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      type: 'array',
      name: 'services',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Github Repo',
              value: 'github',
            },
            {
              label: 'DocKer Image',
              value: 'docker',
            },
            {
              label: 'Database',
              value: 'database',
            },
          ],
        },
        {
          name: 'image',
          label: 'Image',
          type: 'text',
          admin: {
            description: 'Add the docker image source',
            condition: (data, siblingsData) => {
              return siblingsData.type === 'docker'
            },
          },
        },
        {
          type: 'checkbox',
          name: 'addStartCommand',
          label: 'Add Start Comment',
          admin: {
            condition: (data, siblingsData) => {
              return siblingsData.type !== 'database'
            },
          },
        },
        {
          type: 'text',
          name: 'startCommand',
          label: 'Start Command',
          required: true,
          admin: {
            condition: (data, siblingsData) => {
              return siblingsData.addStartCommand === true
            },
          },
        },
        {
          name: 'repo',
          label: 'Repository',
          type: 'text',
          admin: {
            description: 'Add the Github repository url',
            condition: (data, siblingsData) => {
              return siblingsData.type === 'github'
            },
          },
        },
        {
          type: 'select',
          name: 'databaseType',
          label: 'Database Type',
          required: true,
          options: [
            {
              label: 'MongoDB',
              value: 'MONGODB',
            },
            {
              label: 'Redis',
              value: 'REDIS',
            },
            {
              label: 'MySQL',
              value: 'MYSQL',
            },
            {
              label: 'PostgreSQL',
              value: 'POSTGRESQL',
            },
            {
              label: 'MariaDB',
              value: 'MARIADB',
            },
          ],
          admin: {
            description: 'select database you want',
            condition: (data, siblingsData) => {
              return siblingsData.type === 'database'
            },
          },
        },
        {
          type: 'text',
          name: 'name',
          label: 'Name',
        },
        {
          type: 'upload',
          name: 'icon',
          label: 'Icon',
          relationTo: 'media',
        },

        {
          type: 'json',
          name: 'environmentVariables',
          label: 'Environment Variables',
          required: true,
          admin: {
            condition: (data, siblingsData) => {
              return siblingsData.type !== 'database'
            },
          },
        },
      ],
    },
  ],
}
