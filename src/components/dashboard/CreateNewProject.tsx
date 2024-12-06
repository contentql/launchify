'use client'

import Button from '../common/Button'
import Input from '../common/Input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../common/Select'
import { Textarea } from '../common/Textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Template } from '@payload-types'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/common/Dialog'
import { trpc } from '@/trpc/client'
import { cn } from '@/utils/cn'

import { ProjectSchema, ProjectSchemaType } from './validator'

const CreateNewProject = ({
  className,
  templates,
}: {
  className?: string
  templates: Template[]
}) => {
  const [open, setOpen] = useState(false)
  const trpcUtils = trpc.useUtils()

  const {
    formState: { errors },
    handleSubmit,
    setError,
    register,
    setValue,
    control,
  } = useForm<ProjectSchemaType>({
    resolver: zodResolver(ProjectSchema),
  })

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
  const {
    mutate: createProject,
    isPending: isProjectCreationPending,
    isError: isProjectCreationError,
  } = trpc.project?.createProject.useMutation({
    onSuccess: data => {
      console.log('Project Created data', data)
      toast?.success(`Project created successfully`)
      trpcUtils.project.getProjects.invalidate()
      setOpen(false)
    },
    onError: error => {
      if (error.data?.code === 'CONFLICT') {
        setError('name', { message: error.message })
      }
      toast?.error(`Failed to create project: ${error?.message}`)
    },
  })
  const onsubmit = (data: ProjectSchemaType) => {
    createProject({
      description: data?.description,
      name: data?.name,
      template: data?.template,
    })
  }
  console.log('Templates', templates)
  return (
    <>
      <Button className={cn(className)} onClick={() => setOpen(true)}>
        Create new site
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new blog site</DialogTitle>
            <DialogDescription>
              Pick your blog site address such as <strong>my-blog </strong>{' '}
              which will be used to access your blog. You will receive a free{' '}
              <strong>.contentql.blog</strong> domain which you can later
              redirect to your own domain if you have one.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onsubmit)}
            className='mt-6 flex flex-col gap-y-5'>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='mb-2 text-sm font-medium text-slate-300'>
                  Blog name <span className='text-red-500'>*</span>
                </label>
                <Input
                  className='mt-2'
                  placeholder='Enter your site name'
                  type='text'
                  {...register('name', {
                    onChange: handleServiceNameChange,
                  })}
                />
                {errors.name && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor='description'
                  className='text-sm font-medium text-slate-300'>
                  Description <span className='text-error'>*</span>
                </label>
                <Textarea
                  className='mt-2'
                  {...register('description')}
                  placeholder='Enter description'
                />
                {errors.description && (
                  <p className='mt-1 text-xs text-error'>
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  className='text-sm font-medium text-slate-300'
                  htmlFor='siteType'>
                  Project Type <span className='text-red-500'>*</span>
                </label>
                <Controller
                  name='template'
                  control={control}
                  defaultValue={templates?.[0]?.id || ''}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={templates?.length <= 1}>
                      <SelectTrigger className='mt-2 w-full'>
                        <SelectValue placeholder='Select template' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Template</SelectLabel>
                          {templates?.map((template, index) => (
                            <SelectItem
                              className='capitalize'
                              key={index}
                              value={template?.id}>
                              <p className='capitalize'>{template?.title}</p>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors?.template && (
                  <p className='mt-1 text-xs text-error'>
                    {errors?.template.message}
                  </p>
                )}
              </div>
            </div>
            <div className='inline-flex w-full justify-end'>
              <Button type='submit' disabled={isProjectCreationPending}>
                {isProjectCreationPending ? 'Creating site ...' : 'Create site'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateNewProject
