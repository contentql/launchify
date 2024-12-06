import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { TRPCError } from '@trpc/server'

import { router, userProcedure } from '@/trpc'

import {
  ProjectCreationSchema,
  getLatestSchema,
  getProjectsSchema,
  updateProjectSchema,
} from './validator'

const payload = await getPayloadHMR({ config: configPromise })

export const projectRouter = router({
  getProjects: userProcedure
    .input(getProjectsSchema)
    .query(async ({ ctx, input }) => {
      const { user } = ctx
      const { cursor = 1, limit = 12 } = input

      try {
        const { docs, hasNextPage } = await payload.find({
          collection: 'projects',
          user,
          limit,
          page: cursor,
          depth: 10,
          sort: '-createdAt',
          where: {
            and: [
              {
                deleted: {
                  equals: false,
                },
              },
              {
                ...(!user.role?.includes('admin') && {
                  'user.value': {
                    equals: user.id,
                  },
                }),
              },
            ],
          },
        })

        return {
          projects: docs,
          meta: {
            hasNextPage,
            nextCursor: hasNextPage ? cursor + 1 : undefined,
          }, // Include nextCursor in response
        }
      } catch (error) {
        console.error('Error during getting projects:', error)
        throw new Error('Error during getting projects')
      }
    }),
  createProject: userProcedure
    ?.input(ProjectCreationSchema)
    ?.mutation(async ({ input, ctx }) => {
      const { description, name, template } = input
      const { user } = ctx
      try {
        const { totalDocs: totalProjects } = await payload.find({
          collection: 'projects',
          where: {
            and: [
              {
                name: {
                  equals: name,
                },
              },
            ],
          },
        })

        if (totalProjects > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Project name already exists',
            cause: 'Duplicated project names',
          })
        }
        const projectData = await payload.create({
          collection: 'projects',
          data: {
            name: name,
            projectDescription: description,
            project: template,
            user: { relationTo: 'users', value: user?.id },
          },
        })
        return projectData
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error?.message || 'Internal server error occurred.',
        })
      }
    }),

  getProjectById: userProcedure
    ?.input(getLatestSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input
        const { user } = ctx

        const project = await payload?.findByID({
          collection: 'projects',
          id: id,
        })
        return project
      } catch (error) {
        console.log('Error while getting latest project')
      }
    }),
  updateProject: userProcedure
    .input(updateProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateProjectData } = input

      const filterValidValues = (obj: Record<string, any>) =>
        Object.fromEntries(
          Object.entries(obj).filter(
            ([, value]) => value !== undefined && value !== null,
          ),
        )

      const data = {
        ...filterValidValues(updateProjectData),
      }

      console.log('filtered data', data)

      try {
        // Check if name exists in the filtered data
        if (data?.name) {
          const { totalDocs: totalProjects } = await payload.find({
            collection: 'projects',
            where: {
              and: [
                {
                  name: {
                    equals: data.name,
                  },
                },
                {
                  deleted: { equals: false },
                },
              ],
            },
          })

          if (totalProjects > 0) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Project name already exists',
            })
          }
        }

        const updatedProjectedData = await payload.update({
          collection: 'projects',
          data,
          id,
        })

        return updatedProjectedData
      } catch (error: any) {
        console.log('Error while updating project', error.message)
        throw new TRPCError({
          code: 'CONFLICT',
          message: error?.message,
        })
      }
    }),

  // deleteProject: userProcedure
  //   ?.input(DeleteProjectSchema)
  //   .mutation(async ({ input }) => {
  //     const { id } = input
  //     try {
  //       await payload.delete({
  //         collection: 'projects',
  //         id,
  //       })
  //     } catch (error: any) {
  //       console.log('Error while Deleting project', error)
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: error?.message || 'Error while deleting project',
  //       })
  //     }
  //   }),
})
