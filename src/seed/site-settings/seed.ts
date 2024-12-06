import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Ora } from 'ora'

import { logo, siteSettingsData, siteSettingsDataType } from './data'

const payload = await getPayloadHMR({ config: configPromise })

const seed = async ({ spinner }: { spinner: Ora }) => {
  try {
    spinner.start(`Started created site-settings...`)

    const { docs: pages, totalDocs: totalPages } = await payload.find({
      collection: 'pages',
    })

    const { docs: templates } = await payload.find({
      collection: 'templates',
    })
    const logoImageSeedResult = await payload.create({
      collection: 'media',
      data: { alt: logo?.alt },
      filePath: logo?.filePath,
    })

    const formattedSiteSettingsData: siteSettingsDataType = {
      ...siteSettingsData,
      general: {
        ...siteSettingsData?.general,
        faviconUrl: logoImageSeedResult?.id,
        ogImageUrl: logoImageSeedResult?.id,
      },
      navbar: {
        ...siteSettingsData?.navbar,
        logo: {
          ...siteSettingsData?.navbar?.logo,
          imageUrl: logoImageSeedResult?.id,
        },
        menuLinks: siteSettingsData?.navbar?.menuLinks?.map((link, index) => {
          return {
            ...link,
            menuLink: {
              ...link?.menuLink,
              label: pages?.at(index)?.title || 'Default Title', // Ensure label is defined
              page: {
                relationTo: 'pages',
                value: pages?.at(index)?.id as string,
              },
            },
          }
        }),
      },
      footer: {
        ...siteSettingsData?.footer,
        logo: {
          ...siteSettingsData?.navbar?.logo,
          imageUrl: logoImageSeedResult?.id,
        },
        footerLinks: siteSettingsData?.footer?.footerLinks?.map(
          (link, index) => {
            return {
              ...link,
              menuLink: {
                ...link?.menuLink,
                label: pages?.at(index)?.title || 'Default Title',
                page: {
                  relationTo: 'pages',
                  value: pages?.at(index)?.id as string,
                },
              },
            }
          },
        ),
      },
      Projects: siteSettingsData?.Projects?.map((project, index) => {
        return templates.at(-1)?.id!
      }),
    }

    const result = await payload.updateGlobal({
      slug: 'site-settings',
      data: formattedSiteSettingsData,
    })

    spinner.succeed(`Successfully created site-settings`)
    return result
  } catch (error) {
    spinner.succeed(`Failed to create site-settings`)
    throw error
  }
}
export default seed
