import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'

import ProjectDetailsView from '@/components/dashboard/project'
import withAuth from '@/utils/withAuth'

const payload = await getPayloadHMR({ config: configPromise })
const page = async ({ params }: { params: Promise<{ route: any }> }) => {
  const slug = (await params).route

  const services = await payload.find({
    collection: 'services',
    where: {
      project: {
        equals: slug.at(0),
      },
    },
  })

  return <ProjectDetailsView slug={slug} services={services?.docs} />
}

export default withAuth(page)
