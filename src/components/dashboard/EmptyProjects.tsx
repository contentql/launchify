import { Template } from '@payload-types'

import CreateNewProject from './CreateNewProject'

const EmptyProjects = ({ templates }: { templates: Template[] }) => {
  return (
    <div className='flex h-[calc(100vh-18rem)]  w-full items-center justify-center'>
      <div className='empty-project-card relative flex max-w-lg flex-col items-center justify-center gap-y-4 rounded-md border-none bg-base-200 p-8  text-center shadow-lg'>
        <h3 className='text-2xl font-semibold text-base-content'>
          No Projects Found in Your Dashboard
        </h3>
        <p className='text-lg text-base-content/80'>
          You haven`t created any projects. Begin your first project to see it
          appear here
        </p>
        <CreateNewProject
          className='w-full'
          templates={templates as Template[]}
        />
      </div>
    </div>
  )
}

export default EmptyProjects
