'use client'

// import * as Icons from 'lucide-react'
import Button from '../common/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../common/Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../common/Dropdown'
import Input from '../common/Input'
import { Skeleton } from '../common/Skeleton'
import { zodResolver } from '@hookform/resolvers/zod'
import { Project, Template } from '@payload-types'
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'

import { trpc } from '@/trpc/client'

import EmptyProjects from './EmptyProjects'
import { updateProjectSchema, updateProjectSchemaType } from './validator'

// const iconList = Object.keys(Icons)
const List = ({
  projects,
  isLoading,
  isProjectsEmpty,
  templates,
}: {
  projects: Project[]
  isLoading: boolean
  isProjectsEmpty: boolean
  templates: Template[]
}) => {
  return (
    <div>
      {isLoading ? (
        <div className='z-10 grid grid-cols-1 items-center gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Skeleton className='h-48 w-full' />
          <Skeleton className='h-48 w-full' />
          <Skeleton className='h-48 w-full' />
        </div>
      ) : isProjectsEmpty ? (
        <EmptyProjects templates={templates as Template[]} />
      ) : (
        <div className='z-10 grid grid-cols-1 items-center gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {projects?.map((site, index) => <ListItem key={index} site={site} />)}
        </div>
      )}
    </div>
  )
}

export default List

const ListItem = ({ site }: { site: Project }) => {
  const { id, name } = site

  const [editProject, setEditProject] = useState(false)
  const [deleteProject, setDeleteProject] = useState(false)

  const trpcUtils = trpc.useUtils()

  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
    watch,
  } = useForm<updateProjectSchemaType>({
    resolver: zodResolver(updateProjectSchema),
  })

  const watchedProjectName = watch('name')

  const handleServiceNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // Sanitize and format the project name using slugify
    const value = slugify(event.target.value, {
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
      locale: 'en',
      trim: false,
    })

    // Update the form value with the sanitized project name
    setValue('name', value, {
      shouldValidate: true,
    })
  }

  const { mutate: updateProjectMutation, isPending } =
    trpc.project.updateProject.useMutation({
      onSuccess: () => {
        toast.success(`Project Name updated successfully`)
        setEditProject(false)
        trpcUtils.project.getProjects.invalidate()
      },
      onError: error => {
        toast.error(`Failed to update name: ${error.message}`)
      },
    })

  const { mutate: handleDeleteProject, isPending: isProjectDeletePending } =
    trpc.project.updateProject.useMutation({
      onSuccess: () => {
        toast.success(`Project deleted successfully`)
        setDeleteProject(false)
        trpcUtils.project.getProjects.invalidate()
      },
      onError: () => {
        toast.error(`Failed to delete project`)
      },
    })
  const onsubmit = (data: updateProjectSchemaType) => {
    updateProjectMutation({
      id,
      name: data.name,
    })
  }

  const handleProjectDelete = (data: updateProjectSchemaType) => {
    if (data.name !== site.name) {
      toast.error('Project name does not match')
      return
    }

    handleDeleteProject({ id, deleted: true })
  }

  return (
    <Link
      href={`/dashboard/project/${site?.id}`}
      //
      className='card group relative flex h-48 w-full flex-col items-start justify-between gap-y-2 rounded-md bg-base-200 p-4  shadow-lg transition-all duration-300 hover:border-none '>
      <div className='space-y-2'>
        <Link
          href={`/dashboard/project/${site?.id}`}
          className='cur text-lg font-semibold '>
          {site?.name}
        </Link>
        <p className='line-clamp-2 text-sm text-base-content/80'>
          {site?.projectDescription}
        </p>
      </div>
      <p className='inline-flex items-center  justify-start gap-x-2 text-sm text-base-content/80'>
        {site?.Services?.docs?.length} Services
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger onClick={e => e.stopPropagation()} asChild>
          <EllipsisVertical
            className='absolute right-2 top-2 cursor-pointer'
            size={16}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation()
              setEditProject(true)
            }}>
            <SquarePen size={14} />
            <p>Edit</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-error'
            onClick={e => {
              e.stopPropagation()
              setDeleteProject(true)
            }}>
            <Trash2 size={14} />
            <p>Delete</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={deleteProject} onOpenChange={setDeleteProject}>
        <DialogContent onClick={e => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              Do you really want to delete this project. once delete you wont e
              ale to undo <br />
              <br />
              Type{' '}
              <code className='mx-0.5 rounded-md bg-base-200 px-2 py-1'>
                {site.name}
              </code>{' '}
              to delete the project!
            </DialogDescription>
          </DialogHeader>

          <form
            className='flex w-full flex-col'
            onSubmit={handleSubmit(handleProjectDelete)}>
            <Input
              type='text'
              className='text-cq-text'
              disabled={isPending}
              placeholder='Project Name'
              {...register('name')}
            />

            <DialogFooter>
              <Button
                disabled={
                  watchedProjectName !== site.name || isProjectDeletePending
                }
                type='submit'
                className='mt-4'
                variant={'destructive'}>
                {isProjectDeletePending ? 'Deleting' : 'Delete'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={editProject} onOpenChange={setEditProject}>
        <DialogContent onClick={e => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Update Project Name</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the project name? This update will
              be reflected throughout your dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onsubmit)}>
            <Input
              type='text'
              id='name'
              placeholder={name || 'Enter project name'}
              {...register('name', {
                onChange: handleServiceNameChange,
              })}
            />
            <p>{errors?.name && errors?.name?.message}</p>

            <DialogFooter>
              <Button disabled={isPending} className='mt-4' type='submit'>
                {isPending ? 'Updating' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Link>
  )
}
