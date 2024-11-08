import { railwayAPI } from '@/utils/railwayAPI'
import {
  ENVIRONMENT_ID,
  PROJECT_ID,
  TEAM_ID,
  TEMPLATE_ID,
} from '@/utils/railwayConstants'

import { CREATE_SERVICE_DOMAIN } from './queries/createServiceDomain'
import { GET_PROJECT_DETAILS } from './queries/getProjectDetails'
import { GET_SERVICE_DOMAINS } from './queries/getServiceDomains'
import { TEMPLATE_DEPLOY } from './queries/templateDeploy'
import { CREATE_WEBHOOK } from './queries/webhook/createWebhook'
import {
  CreateServiceDomainType,
  CreateWebhookType,
  TemplateDeployType,
  getServiceDomainsSchemaType,
} from './validator'

export const templateDeploy = async (input: TemplateDeployType) => {
  const { name } = input
  try {
    const queryVariables = {
      input: {
        projectId: PROJECT_ID,
        environmentId: ENVIRONMENT_ID,
        templateId: TEMPLATE_ID,
        teamId: TEAM_ID,
        serializedConfig: {
          services: {
            '488d104a-7fa8-4007-82c2-23eb2a3c0af5': {
              icon: 'https://devicons.railway.app/i/mysql.svg',
              name: `${name}-MySQL`,
              build: {},
              deploy: {
                startCommand:
                  'docker-entrypoint.sh mysqld --innodb-use-native-aio=0 --disable-log-bin --performance_schema=0',
                healthcheckPath: null,
              },
              source: {
                image: 'mysql',
              },
              variables: {
                MYSQLHOST: {
                  isOptional: false,
                  description: 'Railway TCP Proxy Domain.',
                  defaultValue: '${{RAILWAY_TCP_PROXY_DOMAIN}}',
                },
                MYSQLPORT: {
                  isOptional: false,
                  description: 'MySQL TCP Proxy port.',
                  defaultValue: '${{RAILWAY_TCP_PROXY_PORT}}',
                },
                MYSQLUSER: {
                  isOptional: false,
                  description: 'MySQL user, used for the Data panel.',
                  defaultValue: 'root',
                },
                MYSQL_URL: {
                  isOptional: false,
                  description:
                    'URL to connect to MySQL DB, used for Data panel.',
                  defaultValue:
                    'mysql://${{ MYSQLUSER }}:${{ MYSQL_ROOT_PASSWORD }}@${{ RAILWAY_TCP_PROXY_DOMAIN }}:${{ RAILWAY_TCP_PROXY_PORT }}/${{ MYSQL_DATABASE }}',
                },
                MYSQLDATABASE: {
                  isOptional: false,
                  description: 'Default database, used for Data panel.',
                  defaultValue: '${{ MYSQL_DATABASE }}',
                },
                MYSQLPASSWORD: {
                  isOptional: false,
                  description: 'Root password, used for Data panel.',
                  defaultValue: '${{ MYSQL_ROOT_PASSWORD }}',
                },
                MYSQL_DATABASE: {
                  isOptional: false,
                  description: 'Database to be created on image startup.',
                  defaultValue: 'railway',
                },
                MYSQL_PRIVATE_URL: {
                  isOptional: false,
                  description:
                    'URL to connect to MySQL DB, used for Data panel.',
                  defaultValue:
                    'mysql://${{ MYSQLUSER }}:${{ MYSQL_ROOT_PASSWORD }}@${{ RAILWAY_PRIVATE_DOMAIN }}:3306/${{ MYSQL_DATABASE }}',
                },
                MYSQL_ROOT_PASSWORD: {
                  isOptional: false,
                  description: 'Root password for MySQL DB.',
                  defaultValue:
                    '${{ secret(32, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") }}',
                },
              },
              networking: {
                tcpProxies: {
                  '3306': {},
                },
                serviceDomains: {},
              },
              volumeMounts: {
                '488d104a-7fa8-4007-82c2-23eb2a3c0af5': {
                  mountPath: '/var/lib/mysql',
                },
              },
            },
            '5944d643-ffdd-4738-8fb5-37043559cc9b': {
              name: name,
              build: {},
              deploy: {},
              source: {
                image: 'ghost:alpine',
              },
              variables: {
                url: {
                  isOptional: true,
                  defaultValue: 'https://${{RAILWAY_STATIC_URL}}',
                },
                PORT: {
                  isOptional: true,
                  defaultValue: '2368',
                },
                mail__from: {
                  isOptional: true,
                  description: '',
                  defaultValue: '',
                },
                mail__transport: {
                  isOptional: true,
                  description: '',
                  defaultValue: 'SMTP',
                },
                database__client: {
                  isOptional: true,
                  defaultValue: 'mysql',
                },
                mail__options__host: {
                  isOptional: true,
                  description: '',
                  defaultValue: '',
                },
                mail__options__port: {
                  isOptional: true,
                  description: '',
                  defaultValue: '',
                },
                mail__options__auth__pass: {
                  isOptional: true,
                  description: '',
                  defaultValue: '',
                },
                mail__options__auth__user: {
                  isOptional: true,
                  description: '',
                  defaultValue: '',
                },
                database__connection__host: {
                  isOptional: true,
                  description: '',
                  defaultValue: '${{MySQL.MYSQLHOST}}',
                },
                database__connection__port: {
                  isOptional: true,
                  description: '',
                  defaultValue: '${{MySQL.MYSQLPORT}}',
                },
                database__connection__user: {
                  isOptional: true,
                  description: '',
                  defaultValue: '${{MySQL.MYSQLUSER}}',
                },
                database__connection__database: {
                  isOptional: true,
                  description: '',
                  defaultValue: '${{MySQL.MYSQLDATABASE}}',
                },
                database__connection__password: {
                  isOptional: true,
                  description: '',
                  defaultValue: '${{MySQL.MYSQLPASSWORD}}',
                },
              },
              networking: {
                tcpProxies: {},
                serviceDomains: {
                  '<hasDomain>': {},
                },
              },
              volumeMounts: {
                '5944d643-ffdd-4738-8fb5-37043559cc9b': {
                  mountPath: '/var/lib/ghost/content',
                },
              },
            },
          },
        },
      },
    }

    const response = await railwayAPI({
      query: TEMPLATE_DEPLOY,
      variables: queryVariables,
    })

    return response.data.templateDeployV2
  } catch (error: any) {
    throw new Error('Error during deploying a template: ', error)
  }
}

export const getProjectDetails = async (input: { projectId: string }) => {
  const { projectId } = input

  const queryVariables = {
    id: projectId,
  }

  try {
    const response = await railwayAPI({
      query: GET_PROJECT_DETAILS,
      variables: queryVariables,
    })

    return response.data.project
  } catch (error: any) {
    throw new Error('Error during getting project details: ', error)
  }
}

export const createServiceDomain = async (input: CreateServiceDomainType) => {
  const queryVariables = {
    input,
  }

  try {
    const response = await railwayAPI({
      query: CREATE_SERVICE_DOMAIN,
      variables: queryVariables?.input,
    })

    return response.data.serviceDomainCreate
  } catch (error: any) {
    throw new Error('Error during create service domain: ', error)
  }
}

export const getServiceDomains = async (input: getServiceDomainsSchemaType) => {
  const queryVariables = {
    input,
  }
  console.log('data inputs', queryVariables)

  try {
    const response = await railwayAPI({
      query: GET_SERVICE_DOMAINS,
      variables: queryVariables?.input,
    })

    return response.data.domains?.serviceDomains
  } catch (error: any) {
    throw new Error('Error during getting domains: ', error)
  }
}

export const createWebhook = async (input: CreateWebhookType) => {
  const { projectId, url } = input

  const queryVariables = {
    input: {
      projectId,
      url,
    },
  }

  try {
    const response = await railwayAPI({
      query: CREATE_WEBHOOK,
      variables: queryVariables,
      authType: 'PERSONAL',
    })

    return response.data.webhookCreate
  } catch (error: any) {
    throw new Error('Error during creating webhook: ', error)
  }
}
