import type { CollectionConfig, Field } from 'payload'

const urlField: Field = {
  name: 'url',
  type: 'text',
}

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  // admin: {
  //   group: ADMIN_UPLOADS_GROUP,
  // },
  admin: {
    group: 'Content',
  },
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'blog_image_size2',
        width: 986,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'blog_image_size3',
        width: 1470,
        height: undefined,
        position: 'centre',
      },
    ],
    focalPoint: false,
    crop: false,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
    },

    // The following fields should be able to be merged in to default upload fields
    urlField,
    {
      name: 'sizes',
      type: 'group',
      fields: [
        {
          name: 'square',
          type: 'group',
          fields: [urlField],
        },
      ],
    },
  ],
}
