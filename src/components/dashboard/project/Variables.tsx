import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  CalendarX2,
  Check,
  ClipboardPlus,
  EllipsisVertical,
  Plus,
  SquarePen,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useLocalStorage } from 'usehooks-ts'

import Button from '@/components/common/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/Dropdown'
import Input from '@/components/common/Input'
import { Skeleton } from '@/components/common/Skeleton'
import { trpc } from '@/trpc/client'
import { cn } from '@/utils/cn'

import CopyToClipboard from './CopyToClipboard'
import { ViewVariable } from './ViewVariable'
import { addNewVariableScheme, addVariableDataType } from './validator'

type Variable = { key: string; value: string; updated?: boolean }

const Variables = ({
  deploymentStatus,
  variables: initialVariables,
  id,
}: {
  variables: Variable[]
  id: string
  deploymentStatus: string
}) => {
  // filter railway variables
  const serviceVariables = initialVariables?.filter(
    (variable, index) => variable && !variable?.key?.startsWith('RAILWAY'),
  )

  const [value, setValue, removeValue] = useLocalStorage<Variable[]>(
    id,
    serviceVariables,
  )

  const storedValuesString = localStorage.getItem(id)
  let storedValues: Variable[] = []

  if (storedValuesString) {
    try {
      storedValues = JSON.parse(storedValuesString)
    } catch (error) {
      console.error('Error parsing stored values:', error)
    }
  }

  const [variables, setVariables] = useState<Variable[]>(
    storedValues?.length! > 0 ? storedValues : serviceVariables,
  )

  //toggle add variable form
  const [add, setAdd] = useState(false)
  const [key, setKey] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [discardChanges, setDiscardChanges] = useState(false)

  // react-hook-form methods
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<addVariableDataType>({
    resolver: zodResolver(addNewVariableScheme),
  })

  const trpcUtils = trpc.useUtils()

  const added = variables?.filter(
    variable =>
      !serviceVariables?.some(
        serviceVariable => serviceVariable.key === variable.key,
      ),
  )

  const edited = variables?.filter(variable =>
    serviceVariables?.some(
      serviceVariable =>
        serviceVariable.key === variable.key &&
        serviceVariable.value !== variable.value,
    ),
  )

  const deleted = serviceVariables?.filter(
    serviceVariable =>
      !variables.some(variable => variable.key === serviceVariable.key),
  )

  const addVariable = (data: addVariableDataType) => {
    if (variables.some(variable => variable.key === data.key)) {
      toast.error(`Key "${data.key}" already exists. Please edit it instead.`)
      return
    }
    setVariables(prev => [
      ...prev,
      { key: data.key, value: data.value, updated: true },
    ])
    setValue(prev => [
      ...prev,
      { key: data.key, value: data.value, updated: true },
    ])
    setAdd(false)
    reset()
  }

  // Edit an existing variable
  const editVariable = (key: string, newValue: string) => {
    setVariables(prev =>
      prev.map(variable =>
        variable.key === key
          ? {
              ...variable,
              value: newValue,
              updated: true,
            }
          : variable,
      ),
    )
    setValue(prev =>
      prev.map(variable =>
        variable.key === key
          ? {
              ...variable,
              value: newValue,
              updated: true,
            }
          : variable,
      ),
    )
    setKey('')
  }

  // Delete a single variable
  const deleteVariable = (key: string) => {
    setVariables(prev => prev.filter(variable => variable.key !== key))
    setValue(prev => prev.filter(variable => variable.key !== key))
  }

  // identify new added variables or edit values

  const { mutate: updatedVariables, isPending } =
    trpc.service.updateVariables.useMutation({
      onSuccess: () => {
        toast.success(`Variables updated successfully`)
        trpcUtils.service?.getServiceById.invalidate({ id })
        localStorage.removeItem(id)
      },
      onError: () => {
        toast.error(`Error while updating variables`)
      },
    })

  const handleApplyChanges = () => {
    updatedVariables({
      id,
      variables,
    })
  }

  const length = added?.length + edited?.length + deleted?.length
  return (
    <div className='pt-8 text-base-content'>
      {(added?.length > 0 || edited?.length > 0 || deleted?.length > 0) && (
        <>
          <motion.div
            initial={{ opacity: 0, y: '-40px' }}
            animate={{ opacity: 1, y: '0px' }}
            transition={{ duration: 0.2 }}
            className='fixed left-2 top-20 z-50 flex w-full items-center justify-between  rounded-md bg-primary/20 px-3 py-2 opacity-100 shadow-lg  backdrop-blur-md md:w-[26rem]'>
            <p className='text-sm font-bold text-primary'>
              Apply {length} {length === 1 ? 'change' : 'changes'}
            </p>
            <div className='inline-flex items-center gap-x-2'>
              <Button
                onClick={() => setModalOpen(true)}
                variant={'outline'}
                size={'sm'}>
                Details
              </Button>
              <Button
                size={'sm'}
                disabled={isPending}
                onClick={() => handleApplyChanges()}>
                {isPending ? 'Deploying' : 'Deploy Changes'}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <EllipsisVertical
                    className='cursor-pointer text-base-content/50'
                    size={16}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => setDiscardChanges(true)}>
                    <CalendarX2 size={14} />
                    Discard changes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {length} {length === 1 ? 'change' : 'changes'} to apply
                </DialogTitle>
              </DialogHeader>
              <div className='relative overflow-x-auto rounded-md'>
                <table className='w-full  text-left text-sm'>
                  <thead className=' border-b-base-200/20 text-xs uppercase text-base-content '>
                    <tr>
                      <th scope='col' className='px-6 py-3'>
                        Change
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {added?.map((variable, index) => (
                      <tr
                        key={index}
                        className='space-y-2 rounded-md border-b border-base-300/80 bg-transparent text-success/80'>
                        <td className='inline-flex items-center gap-x-2 whitespace-nowrap px-6  py-2 font-semibold'>
                          <ClipboardPlus size={14} />
                          {variable?.key}
                        </td>
                        <td className='px-6 py-2'>{variable?.value}</td>
                      </tr>
                    ))}

                    {edited?.map((variable, index) => (
                      <tr
                        key={index}
                        className='rounded-md border-b border-base-300/80 bg-transparent text-warning/80'>
                        <td className='inline-flex items-center gap-x-2  whitespace-nowrap px-6 py-2 font-semibold'>
                          <SquarePen size={14} />
                          {variable?.key}
                        </td>
                        <td className='px-6 py-2'>{variable?.value}</td>
                      </tr>
                    ))}
                    {deleted?.map((variable, index) => (
                      <tr
                        key={index}
                        className='space-y-2 rounded-md border-b border-base-300/80 bg-transparent text-error/80'>
                        <td className=' inline-flex items-center gap-x-2 whitespace-nowrap px-6  py-2 font-semibold'>
                          <Trash2 size={14} /> {variable?.key}
                        </td>
                        <td className='px-6 py-2'>{variable?.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className='mt-4 flex items-center justify-between'>
                  <div className='inline-flex items-center gap-x-2 text-sm text-base-content/40'>
                    This action will redeploy
                  </div>
                  <Button
                    size={'sm'}
                    disabled={isPending}
                    onClick={() => handleApplyChanges()}>
                    <Check size={16} />
                    {isPending ? 'Deploying' : 'Deploy changes'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={discardChanges} onOpenChange={setDiscardChanges}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Discard changes</DialogTitle>
                <DialogDescription>
                  Are you sure you want to discard all the changes you have made
                  to the variables? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant={'outline'}
                  size={'sm'}
                  onClick={() => {
                    localStorage?.removeItem(id)
                    setVariables(serviceVariables)
                    setDiscardChanges(false)
                  }}>
                  Discard changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
      <div className='pb-4'>
        {add ? (
          <form
            onSubmit={handleSubmit(addVariable)}
            className='flex flex-col gap-2 md:flex-row'>
            <div className='w-full space-y-1'>
              <Input
                {...register('key', { required: true })}
                placeholder='Key'
                className='h-8 w-full'
              />
              <div className='text-sm text-error'>
                {errors?.key && errors?.key?.message}
              </div>
            </div>
            <div className='w-full space-y-1'>
              <Input
                {...register('value')}
                placeholder='Value'
                className='h-8 w-full'
              />
              <div className='text-sm text-error'>
                {errors?.value && errors?.value?.message}
              </div>
            </div>
            <div className='inline-flex gap-x-2'>
              <Button type='submit' className='w-full' size={'sm'}>
                <Check size={14} />
                Add
              </Button>
              <Button
                onClick={() => {
                  setAdd(false)
                }}
                type='button'
                className='w-full'
                variant={'destructive'}
                size={'sm'}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <motion.div className='inline-flex w-full items-center justify-between'>
            <p className='text-md font-semibold'>
              {serviceVariables?.length} Service Variables
            </p>
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={() => {
                setAdd(true)
              }}>
              <Plus size={14} />
              New Variable
            </Button>
          </motion.div>
        )}
      </div>

      {/* Variables List */}
      <div className='space-y-1'>
        {variables?.length <= 0 &&
        (deploymentStatus === 'NOT_YET_DEPLOYED' ||
          deploymentStatus === 'DEPLOYING') ? (
          <LoadingSkeleton />
        ) : (
          variables?.map((variable, index) => (
            <div
              className={cn(
                'group grid grid-cols-3 items-center gap-x-2 rounded-md border border-transparent px-2 py-1 hover:border hover:border-primary/25 hover:bg-primary/5',
                variable?.updated ? 'bg-primary/15 hover:bg-primary/15' : '',
              )}
              key={index}>
              <p className='col-span-1 line-clamp-1 text-sm font-semibold text-base-content'>
                {variable.key}
              </p>
              <div className='relative col-span-2 inline-flex items-center justify-between gap-x-2'>
                <div className='inline-flex items-center gap-x-2'>
                  <EditVariable
                    editVariable={editVariable}
                    variable={variable}
                    variableKey={key}
                    setKey={setKey}
                  />
                  {key !== variable?.key && (
                    <CopyToClipboard textData={variable.value} />
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <EllipsisVertical
                      className='cursor-pointer text-base-content/80'
                      size={16}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={() => {
                        setKey(variable?.key)
                      }}>
                      <SquarePen size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteVariable(variable.key)}
                      className='text-error'>
                      <Trash2 size={14} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Variables

const EditVariable = ({
  editVariable,
  variable,
  setKey,
  variableKey,
}: {
  variable: Variable
  variableKey: string
  setKey: Function
  editVariable: Function
}) => {
  const [newValue, setNewValue] = useState(variable?.value)
  return (
    <>
      {variableKey === variable?.key ? (
        <form className='inline-flex w-full items-center justify-between gap-x-2'>
          <Input
            className='h-8 w-full'
            required
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            type='text'
          />
          <div className='inline-flex items-center gap-x-2'>
            <Check
              type='submit'
              size={16}
              className='cursor-pointer'
              onClick={() => editVariable(variable.key, newValue)}
            />

            <X
              size={16}
              className='cursor-pointer'
              onClick={() => {
                setKey('')
                setNewValue('')
              }}
            />
          </div>
        </form>
      ) : (
        <ViewVariable variable={variable.value} />
      )}
    </>
  )
}

// unable to open modal on sheet component
const DeleteVariable = ({
  variable,
  deleteVariable,
}: {
  variable: Variable
  deleteVariable: Function
}) => {
  const [deleteVariableOpen, setDeleteVariableOpen] = useState(false)
  return (
    <>
      <div
        onClick={() => {
          setDeleteVariableOpen(true)
        }}
        className='inline-flex items-center gap-x-2'>
        <Trash2 size={14} />
        Delete
      </div>
      <Dialog open={deleteVariableOpen} defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Variable</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong className='rounded-md bg-base-200 px-2  py-1'>
                {variable?.key}
              </strong>{' '}
              ? Once deleted, it will be gone forever.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => deleteVariable(variable.key)}
              variant={'destructive'}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

const LoadingSkeleton = () => {
  return (
    <div className='w-fill space-y-1 p-4'>
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
    </div>
  )
}
