import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Ora } from 'ora'
import { RequiredDataFromCollectionSlug } from 'payload'

import { templateData, templateImageData } from './data'

const payload = await getPayloadHMR({ config: configPromise })

const seed = async (spinner: Ora): Promise<any> => {
  try {
    spinner.start(`Started creating templates...`)

    const templateImagesSeedResult = await Promise.allSettled(
      templateImageData.map(templateImage =>
        payload.create({
          collection: 'media',
          data: {
            alt: templateImage.alt,
          },
          filePath: templateImage.filePath,
        }),
      ),
    )

    const formattedTemplateImagesResult = templateImagesSeedResult
      .map(result =>
        result.status === 'fulfilled'
          ? result.value
          : `Failed to seed: ${result.reason}`,
      )
      .filter(result => typeof result !== 'string')

    const TemplateResult: RequiredDataFromCollectionSlug<'templates'> = {
      ...templateData,
      services: templateData?.services?.map((service, index) => {
        return {
          ...service,
          icon: formattedTemplateImagesResult?.at(index)?.id,
        }
      }),
    }
    const result = await payload.create({
      collection: 'templates',
      data: TemplateResult,
    })
    spinner.succeed(`Successfully created templates`)
    return result
  } catch (error) {
    spinner.succeed(`Failed to create Template`)
    throw error
  }
}

export default seed
