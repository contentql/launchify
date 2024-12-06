import { env } from '@env'
import { Media, Template } from '@payload-types'
import { CollectionBeforeChangeHook } from 'payload'

import {
  createEmptyProject,
  createMariaDBDatabase,
  createMongoDBDatabase,
  createMySQLDatabase,
  createPostgreSQLDatabase,
  createRedisDatabase,
  createService,
  createServiceDomain,
  createTcpProxy,
  createVolume,
  createWebhook,
  serviceInstanceUpdate,
} from '@/railway'

export const deployTemplate: CollectionBeforeChangeHook = async ({
  collection,
  req,
  context,
  originalDoc,
  operation,
  data,
}) => {
  if (operation === 'create') {
    try {
      const { payload } = req

      const emptyProject = await createEmptyProject({
        projectName: data?.name,
        projectDescription: data?.projectDescription,
      })

      console.log('Empty Project', emptyProject)

      data.projectId = emptyProject.id
      data.environmentId = emptyProject.environments.edges.at(0).node.id

      await createWebhook({
        projectId: data.projectId,
        url: `${env.PAYLOAD_URL}/api/webhook/railway`,
      })

      const template = await payload.findByID({
        collection: 'templates',
        id: data.project,
      })

      console.log('template', template)
      console.log('variables', template?.services?.at(1)?.environmentVariables)

      // Polling utility to wait for deployment success
      async function waitForDeploymentSuccess(serviceId: string) {
        let status = ''
        do {
          const service = await payload.findByID({
            collection: 'services',
            id: serviceId,
          })
          status = service?.deploymentStatus || ''
          if (status === 'Success') break
          console.log(`Waiting for deployment of service ${serviceId}...`)
          await new Promise(resolve => setTimeout(resolve, 5000)) // Poll every 5 seconds
        } while (status !== 'SUCCESS' && status !== 'ERROR')
      }

      // Handle database services creation
      async function handleDatabaseService(service: any, data: any) {
        switch (service.databaseType) {
          case 'MARIADB':
            const mariadb = await createMariaDBDatabase({
              environmentId: data.environmentId,
              projectId: data.projectId,
              icon: (service?.icon as Media)?.url || '',
              name: service.name!,
            })
            return mariadb
          case 'POSTGRESQL':
            const postgreSQL = await createPostgreSQLDatabase({
              environmentId: data.environmentId,
              projectId: data.projectId,
              icon: (service?.icon as Media)?.url || '',
              name: service.name!,
              variables: { PGDATA: `/var/lib/${service.type}/${service.name}` },
            })
            return postgreSQL
          case 'MYSQL':
            const mysql = await createMySQLDatabase({
              environmentId: data.environmentId,
              projectId: data.projectId,
              icon: (service?.icon as Media)?.url || '',
              name: service.name!,
            })

            await serviceInstanceUpdate({
              environmentId: data.environmentId,
              input: {
                startCommand:
                  'docker-entrypoint.sh mysqld --innodb-use-native-aio=0 --disable-log-bin --performance_schema=0',
              },
              serviceId: mysql?.id,
            })
            await createTcpProxy({
              applicationPort: 3306,
              environmentId: data.environmentId,
              serviceId: mysql?.id,
            })
            return mysql
          case 'MONGODB':
            const mongodb = await createMongoDBDatabase({
              environmentId: data.environmentId,
              projectId: data.projectId,
              icon: (service?.icon as Media)?.url || '',
              name: service.name!,
            })
            return mongodb
          case 'REDIS':
            const redis = await createRedisDatabase({
              environmentId: data.environmentId,
              projectId: data.projectId,
              icon: (service?.icon as Media)?.url || '',
              name: service.name!,
            })
            return redis
        }
      }

      // Handle Docker services creation
      async function handleDockerService(service: any, data: any) {
        const dockerService = await createService({
          environmentId: data.environmentId,
          projectId: data.projectId,
          icon: (service?.icon as Media)?.url || '',
          name: service.name!,
          source: { image: service.image! },
          variables: Object.fromEntries(
            Object.entries(service.environmentVariables || {}).map(
              ([key, value]) => [key, String(value)],
            ),
          ),
        })

        const serviceDomain = await createServiceDomain({
          environmentId: data.environmentId,
          serviceId: dockerService?.id,
        })

        if (service.addStartCommand) {
          await serviceInstanceUpdate({
            environmentId: data.environmentId,
            input: { startCommand: service.startCommand! },
            serviceId: dockerService.id,
          })
        }
        return dockerService
      }

      // Main logic for iterating over services
      async function deployServices(template: Template, data: any) {
        if (!template?.services?.length) return
        for (const service of template.services) {
          let serviceDetails

          if (service.type === 'database') {
            serviceDetails = await handleDatabaseService(service, data)
          } else if (service.type === 'docker') {
            serviceDetails = await handleDockerService(service, data)
          }

          console.log('Service Details of deployed service', serviceDetails)

          // Create volume after successful deployment
          await createVolume({
            mountPath: `/var/lib/${service.type}/${service.name}`,
            environmentId: data.environmentId,
            projectId: data.projectId,
            serviceId: serviceDetails?.id,
          })

          const payloadService = await payload.create({
            collection: 'services',
            data: {
              serviceName: serviceDetails?.name,
              icon: serviceDetails?.icon,
              serviceId: serviceDetails?.id,
              projectId: serviceDetails?.projectId,
              environmentId: data?.environmentId,
              project: data?.id,
            },
          })

          console.log('payloadService', payloadService, data)
          // Wait for deployment to complete
          if (serviceDetails) {
            await waitForDeploymentSuccess(payloadService?.id)
          }

          console.log(`Service ${service.name} deployed and volume created.`)
        }
      }

      // Deploy service
      await deployServices(template, data)

      console.log('docs data', data, originalDoc)
    } catch (error) {
      console.log('Error while deploying template', error)
      throw error
    }
  }
}
