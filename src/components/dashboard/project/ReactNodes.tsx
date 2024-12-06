'use client'

import { Project, Service } from '@payload-types'
import { Background, Controls, ReactFlow, useNodesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Ban,
  Box,
  CircleAlert,
  CircleCheckBig,
  CircleDashed,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/utils/cn'

const ReactNodes = ({
  children,
  services,
  slug,
}: {
  children: React.ReactNode
  services: Service[]
  slug: any
}) => {
  // const {
  //   data,
  //   isLoading: isServicesLoading,
  //   isFetching,
  //   refetch,
  // } = trpc.service.getServicesByProjectId.useQuery(
  //   {
  //     id: slug?.at(0),
  //   },
  //   { initialData: services },
  // )
  const initialNodes = services?.map((service, index) => ({
    id: service.id,
    position: { x: 350 * (index + 1), y: 250 },
    data: { ...service },
    type: 'custom',
  }))
  const updatedNodes = initialNodes?.map(node =>
    node.id === slug.at(-1)
      ? {
          ...node,
          position: { x: 50, y: 250 },
        }
      : node,
  )
  console.log('services', updatedNodes)

  const [nodes, setNodes, onNodesChange] = useNodesState(updatedNodes!)
  const deploymentStatus = {
    DEPLOYING: (
      <span title='Deploying' className='text-info'>
        <CircleDashed size={16} />
      </span>
    ),
    ERROR: (
      <span title='Error' className='text-error'>
        <Ban size={16} />
      </span>
    ),
    SUCCESS: (
      <span title='Success' className='text-success'>
        <CircleCheckBig size={16} />
      </span>
    ),
    NOT_YET_DEPLOYED: (
      <span title='Not yet deployed' className='text-warning'>
        <CircleAlert size={16} />
      </span>
    ),
  }

  const TestComponent = ({ data }: any) => {
    return (
      <div
        className={cn(
          'relative flex h-32 w-full flex-col items-start justify-between overflow-hidden rounded-md border border-base-content/20 bg-base-200 p-4 shadow-lg drop-shadow-md md:w-64',
          data?.id === slug?.at(-1)
            ? 'border-[1.5px] border-primary/50 bg-base-200'
            : '',
        )}>
        <Link
          className='flex h-full w-full flex-col justify-between'
          href={`/dashboard/project/${(data?.project as Project)?.id}/service/${data?.id}`}>
          <div className='space-y-0'>
            <div className='inline-flex items-center gap-x-2'>
              {data?.icon ? (
                <Image src={data?.icon} alt='' width={20} height={20} />
              ) : (
                <Box className='text-base-content/80' size={20} />
              )}
              <h4 className='line-clamp-1  text-lg font-bold capitalize text-base-content'>
                {data?.serviceName}
              </h4>
            </div>
            {data?.serviceDomains?.length! > 0 && (
              <p className='line-clamp text-sm text-base-content/80'>
                {data?.serviceDomains?.at(0)?.domainUrl}
              </p>
            )}
          </div>
          {/* <div className='inline-flex items-center gap-x-2'>
            {deploymentStatus[service?.deploymentStatus!]}
            <p className='text-sm text-base-content/80'>
              {service?.updatedAt
                ? formateDateByDays(service?.updatedAt)
                : formateDateByDays(service?.createdAt)}
            </p>
          </div> */}
        </Link>
      </div>
    )
  }

  const nodeTypes = {
    custom: TestComponent,
  }
  return (
    <div>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          //   onEdgesChange={onEdgesChange}
          //   onConnect={onConnect}
          nodeTypes={nodeTypes}
          className='z-10'>
          <div>{children}</div>
          <Background className='bg-base-100 text-base-content/80' />
          <Controls
            position='bottom-left'
            className='bg-base-100 text-base-content/80'
            style={{
              backgroundColor: 'blue',
            }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}

export default ReactNodes
