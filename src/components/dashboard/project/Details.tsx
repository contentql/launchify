import { Service } from '@payload-types'
import { Boxes, Globe, GlobeLock, Settings } from 'lucide-react'
import Link from 'next/link'

import { Skeleton } from '@/components/common/Skeleton'
import { formatDate } from '@/utils/dateFormatter'

import CopyToClipboard from './CopyToClipboard'
import CustomDomain from './CustomDomain'

const Details = ({ service }: { service: Service }) => {
  const Component = {
    DEPLOYING: (
      <span title='Deploying' className='relative flex h-2 w-2'>
        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-info/90 opacity-75'></span>
        <span className='relative inline-flex h-2 w-2 rounded-full bg-info'></span>
      </span>
    ),
    ERROR: (
      <span
        title='Error'
        className='relative inline-flex h-2 w-2 rounded-full bg-error'></span>
    ),
    SUCCESS: (
      <span
        title='Success'
        className='relative inline-flex h-2 w-2 rounded-full bg-success'></span>
    ),
    NOT_YET_DEPLOYED: (
      <span title='Not yet deployed' className='relative flex h-2 w-2'>
        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/90 opacity-75'></span>
        <span className='relative inline-flex h-2 w-2 rounded-full bg-warning'></span>
      </span>
    ),
  }
  return (
    <section className='pt-8 text-base-content'>
      {service?.serviceDomains?.at(0)?.domainUrl && (
        <div className='inline-flex items-center gap-x-2 text-sm font-normal text-base-content'>
          <Globe className='text-primary opacity-50' size={16} />

          <Link
            className='line-clamp'
            href={`https://${service?.serviceDomains?.at(0)?.domainUrl!}`}
            target='_blank'>
            {service?.serviceDomains?.at(0)?.domainUrl!}
          </Link>
        </div>
      )}

      <div className='relative ml-4 mt-4 border-l border-base-content/80 pr-4'>
        <div className='inline-flex items-center'>
          <span className='absolute -start-4 flex h-8 w-8 items-center justify-center rounded-full bg-base-300'>
            <Settings className='text-base-content opacity-80' size={16} />
          </span>
          <h3 className='text-md pl-8 font-semibold text-base-content opacity-100 '>
            Details
          </h3>
        </div>
        <div className='ml-8 w-full space-y-2 pt-2 text-sm md:w-2/3'>
          <div className='grid grid-cols-3'>
            <p className='col-span-1 '>ProjectId</p>
            <div className='col-span-2'>
              {service?.projectId ? (
                service?.projectId
              ) : (
                <Skeleton className='h-full w-full' />
              )}
            </div>
          </div>
          <div className='grid grid-cols-3'>
            <p className='col-span-1  text-base-content'>serviceId</p>
            <div className='col-span-2 text-base-content'>
              {service?.serviceId ? (
                service?.serviceId
              ) : (
                <Skeleton className='h-full w-full' />
              )}
            </div>
          </div>

          <div className='grid grid-cols-3'>
            <p className='col-span-1 text-base-content'>Created</p>
            <div className='col-span-2 text-base-content'>
              {service?.createdAt ? (
                formatDate(service?.createdAt)
              ) : (
                <Skeleton className='h-full w-full' />
              )}
            </div>
          </div>
          <div className='grid grid-cols-3'>
            <p className='col-span-1 '>Status</p>
            <p className='col-span-2 inline-flex items-center gap-x-2 uppercase'>
              {Component[service?.deploymentStatus!]}
              <span className='capitalize'> {service?.deploymentStatus}</span>
            </p>
          </div>
        </div>
        {service?.serviceDomains?.at(0)?.domainUrl && (
          <>
            <div className='mt-8 inline-flex items-center'>
              <span className='absolute -start-4 flex h-8 w-8 items-center justify-center rounded-full bg-base-300'>
                <Boxes className='text-base-content opacity-80' size={16} />
              </span>
              <h3 className='text-md pl-8 font-semibold text-base-content opacity-100 '>
                Service Domain
              </h3>
            </div>
            <div className='ml-8 mt-2  w-full space-y-2 md:w-2/3'>
              <p className='text-sm text-base-content/80'>
                Access your project with ease using a shared domain provided by
                our platform.
              </p>
              <div className='group flex w-full items-center justify-between rounded-md border border-base-content/20 px-4 py-2 shadow-lg hover:bg-base-300 '>
                <Link
                  className='text-sm font-semibold text-base-content '
                  href={
                    `https://${service?.serviceDomains?.at(0)?.domainUrl}` || ''
                  }
                  target='_blank'>
                  {service?.serviceDomains?.at(0)?.domainUrl}
                </Link>
                <CopyToClipboard
                  textData={service?.serviceDomains?.at(0)?.domainUrl!}
                />
              </div>
            </div>
            <div className='mt-8 inline-flex items-center'>
              <span className='absolute -start-4 flex h-8 w-8 items-center justify-center rounded-full bg-base-300'>
                <GlobeLock className='text-base-content opacity-80' size={16} />
              </span>
              <h3 className='text-md pl-8 font-semibold text-base-content opacity-100 '>
                Custom Domains
              </h3>
            </div>
            <div className='ml-8 w-full md:w-2/3'>
              <p className='mt-2 text-sm text-base-content/80'>
                {service?.customDomain
                  ? 'Make your brand stand out with a personalized domain that adds professionalism and recognition'
                  : 'Create a unique web presence with your own custom domain.'}
              </p>
              <CustomDomain service={service} />
            </div>
          </>
        )}
        {/* <div className='mt-8 inline-flex items-center'>
          <span className='absolute -start-4 flex h-8 w-8 items-center justify-center rounded-full bg-base-300'>
            <Group className='text-error opacity-80' size={16} />
          </span>
          <h3 className='text-md pl-8 font-semibold text-error opacity-100 '>
            Delete Service
          </h3>
        </div>
        <div className='ml-8 w-full md:w-2/3'>
          <p className='mt-2 text-sm text-error/80 '>
            Deleting this service will permanently delete all its deployments
            and remove it from this environment. This cannot be undone.
          </p>

          <Button size={'sm'} className='mt-2' variant={'destructive'}>
            Delete Service
          </Button>
        </div> */}
      </div>
    </section>
  )
}

export default Details
