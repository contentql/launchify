'use client'

import { Service } from '@payload-types'
import { useState } from 'react'

import ProjectDetails from './ProjectDetails'
import ReactNodes from './ReactNodes'

const ProjectDetailsView = ({
  slug,
  services,
}: {
  slug: any
  services: Service[]
}) => {
  const [open, setOpen] = useState(slug?.length > 1)
  return (
    <ReactNodes slug={slug} services={services as Service[]}>
      <ProjectDetails slug={slug} open={open} setOpen={setOpen} />
    </ReactNodes>
  )
}

export default ProjectDetailsView
