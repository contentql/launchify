import configPromise from '@payload-config'
import { Service } from '@payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { EditServiceScheme } from '@/components/dashboard/project/validator'
import { router, userProcedure } from '@/trpc'

const payload = await getPayloadHMR({ config: configPromise })

export const serviceRouter = router({
  getServicesByProjectId: userProcedure
    ?.input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input
      try {
        const { docs, totalDocs } = await payload.find({
          collection: 'services',
          where: {
            project: {
              equals: id,
            },
          },
        })
        return { services: docs as Service[] }
      } catch (error) {
        console.log('Error while fetching services', error)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Error while fetching services',
        })
      }
    }),

  getServiceById: userProcedure
    .input(z.object({ id: z.string() }))
    ?.query(async ({ input }) => {
      const { id } = input
      try {
        const service = await payload.findByID({
          collection: 'services',
          id: id,
        })
        return service
      } catch (error) {
        console.log('Error while fetching service', error)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Error while fetching service',
        })
      }
    }),
  updateCustomDomain: userProcedure
    .input(
      z.object({
        id: z.string(),
        domain: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { domain, id } = input
      try {
        await payload.update({
          collection: 'services',
          where: {
            id: {
              equals: id,
            },
          },
          data: {
            customDomain: domain,
          },
        })
      } catch (error: any) {
        console.log('Error while updating custom domain', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Error while updating custom domain',
        })
      }
    }),
  updateVariables: userProcedure
    .input(
      z.object({
        id: z.string(),
        variables: z.array(
          z.object({
            key: z.string(),
            value: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, variables } = input
      try {
        await payload.update({
          collection: 'services',
          where: {
            id: {
              equals: id,
            },
          },
          data: {
            variables,
          },
        })
      } catch (error) {
        console.log('Error while updating variables', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error while updating variables',
        })
      }
    }),
  updateServiceName: userProcedure
    .input(EditServiceScheme)
    ?.mutation(async ({ input }) => {
      const { serviceName, id } = input
      try {
        await payload.update({
          collection: 'services',
          data: {
            serviceName,
          },
          where: {
            id: {
              equals: id,
            },
          },
        })
      } catch (error: any) {
        console.log('Error while updating service name', error.message)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error?.message || 'Error while updating service name',
        })
      }
    }),
})
