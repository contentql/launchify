import { railwayAPI } from '@/utils/railwayAPI'

import { CREATE_CUSTOM_DOMAIN } from './queries/domain/createCustomDomain'
import { DELETE_CUSTOM_DOMAIN } from './queries/domain/deleteCustomDomain'
import { GET_DOMAINS } from './queries/domain/getDomains'
import { GET_PROJECT_DETAILS } from './queries/getProjectDetails'
import { GET_SERVICE_DOMAINS } from './queries/getServiceDomains'
import { CREATE_EMPTY_PROJECT } from './queries/project/createEmptyProject'
import { DELETE_PROJECT } from './queries/project/deleteProject'
import { CREATE_TCP_PROXY } from './queries/proxy/createTcpProxy'
import { CREATE_SERVICE } from './queries/service/createService'
import { CREATE_SERVICE_DOMAIN } from './queries/service/createServiceDomain'
import { REDEPLOY_SERVICE } from './queries/service/redeployService'
import { SERVICE_INSTANCE_DEPLOY } from './queries/service/serviceInstanceDeploy'
import { SERVICE_INSTANCE_UPDATE } from './queries/service/serviceInstanceUpdate'
import { getQueryVariables } from './queries/template/queryVariables'
import { TEMPLATE_DEPLOY } from './queries/template/templateDeploy'
import { DELETE_VARIABLE } from './queries/variables/deleteVariable'
import { GET_VARIABLES } from './queries/variables/getVariables'
import { UPSERT_VARIABLES } from './queries/variables/upsertVariables'
import { CREATE_VOLUME } from './queries/volume/createVolume'
import { CREATE_WEBHOOK } from './queries/webhook/createWebhook'
import {
  CreateCustomDomainType,
  CreateDatabaseType,
  CreateEmptyProjectType,
  CreateServiceDomainType,
  CreateServiceType,
  CreateTcpProxyType,
  CreateVolumeType,
  CreateWebhookType,
  DeleteCustomDomainType,
  DeleteProjectType,
  DeleteVariableType,
  RedeployServiceType,
  ServiceInstanceDeployType,
  ServiceInstanceUpdateType,
  TemplateDeployType,
  UpsertVariablesType,
  getServiceDomainsSchemaType,
  getVariablesSchemaType,
} from './validator'

export const createEmptyProject = async (input: CreateEmptyProjectType) => {
  const { projectName, projectDescription } = input

  const queryVariables = {
    input: {
      name: projectName,
      description: projectDescription,
      defaultEnvironmentName: 'production',
    },
  }

  try {
    const response = await railwayAPI({
      query: CREATE_EMPTY_PROJECT,
      variables: queryVariables,
    })

    return response.data.projectCreate
  } catch (error: any) {
    throw new Error('Error during creating empty project: ', error)
  }
}

export const templateDeploy = async (input: TemplateDeployType) => {
  const { environmentId, projectId, template } = input
  try {
    const queryVariables = getQueryVariables({
      environmentId,
      projectId,
      template,
    })

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
      variables: queryVariables,
    })

    return response.data.serviceDomainCreate
  } catch (error: any) {
    const errorMsg = `create service domain error: ${error.message || error}`

    console.error(errorMsg)
    throw new Error(errorMsg)
  }
}

export const getServiceDomains = async (input: getServiceDomainsSchemaType) => {
  const queryVariables = {
    input,
  }
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

export const createCustomDomain = async (input: CreateCustomDomainType) => {
  const { projectId, serviceId, environmentId, domain } = input

  const queryVariables = {
    input: {
      projectId,
      serviceId,
      environmentId,
      domain,
    },
  }

  try {
    const response = await railwayAPI({
      query: CREATE_CUSTOM_DOMAIN,
      variables: queryVariables,
    })

    return response.data.customDomainCreate
  } catch (error: any) {
    throw new Error('Error during creating custom domain: ', error)
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

export const getVariables = async (input: getVariablesSchemaType) => {
  const queryVariables = {
    input,
  }
  try {
    const response = await railwayAPI({
      query: GET_VARIABLES,
      variables: queryVariables?.input,
    })

    return response.data
  } catch (error: any) {
    throw new Error('Error during getting domains: ', error)
  }
}

export const upsertVariables = async (input: UpsertVariablesType) => {
  const { projectId, serviceId, environmentId, variables } = input

  const queryVariables = {
    input: { projectId, serviceId, environmentId, variables },
  }

  try {
    const response = await railwayAPI({
      query: UPSERT_VARIABLES,
      variables: queryVariables,
    })

    return response.data.variableCollectionUpsert
  } catch (error: any) {
    throw new Error('Error during upsert variables: ', error)
  }
}

export const deleteVariable = async (input: DeleteVariableType) => {
  const { projectId, serviceId, environmentId, name } = input

  const queryVariables = {
    input: { projectId, serviceId, environmentId, name },
  }

  try {
    const response = await railwayAPI({
      query: DELETE_VARIABLE,
      variables: queryVariables,
    })

    return response.data.variableCollectionUpsert
  } catch (error: any) {
    throw new Error('Error during deleting variables: ', error)
  }
}

export const redeployService = async (input: RedeployServiceType) => {
  const { serviceId, environmentId } = input

  const queryVariables = {
    serviceId,
    environmentId,
  }

  try {
    const response = await railwayAPI({
      query: REDEPLOY_SERVICE,
      variables: queryVariables,
    })

    return response.data.serviceInstanceRedeploy
  } catch (error: any) {
    throw new Error('Error during redeploy service: ', error)
  }
}

export const getDomains = async (input: {
  projectId: string
  serviceId: string
  environmentId: string
}) => {
  const { projectId, serviceId, environmentId } = input

  try {
    const queryVariables = {
      projectId,
      serviceId,
      environmentId,
    }

    const domainsResponse = await railwayAPI({
      query: GET_DOMAINS,
      variables: queryVariables,
    })

    return domainsResponse?.data.domains
  } catch (error: any) {
    throw new Error('Error during getting valid domain: ', error)
  }
}

export const deleteCustomDomain = async (input: DeleteCustomDomainType) => {
  const { domainId } = input

  const queryVariables = {
    id: domainId,
  }

  try {
    const response = await railwayAPI({
      query: DELETE_CUSTOM_DOMAIN,
      variables: queryVariables,
    })

    return response.data.customDomainDelete
  } catch (error: any) {
    throw new Error('Error during deleting custom domain: ', error)
  }
}

export const deleteProject = async (input: DeleteProjectType) => {
  const { projectId } = input

  const queryVariables = {
    id: projectId,
  }

  try {
    const response = await railwayAPI({
      query: DELETE_PROJECT,
      variables: queryVariables,
    })

    return response.data.projectDelete
  } catch (error: any) {
    throw new Error('Error during deleting project: ', error)
  }
}

export const createService = async (input: CreateServiceType) => {
  const queryVariables = {
    input,
  }

  try {
    const response = await railwayAPI({
      query: CREATE_SERVICE,
      variables: queryVariables,
    })

    return response.data.serviceCreate
  } catch (error: any) {
    throw new Error('Error during create service: ', error)
  }
}

export const createVolume = async (input: CreateVolumeType) => {
  const queryVariables = {
    input,
  }

  try {
    const response = await railwayAPI({
      query: CREATE_VOLUME,
      variables: queryVariables,
    })

    return response.data.volumeCreate
  } catch (error: any) {
    throw new Error('Error during create volume: ', error)
  }
}

export const createMariaDBDatabase = async (input: CreateDatabaseType) => {
  const queryVariables = {
    input: {
      ...input,
      source: {
        image: 'mariadb',
      },
      variables: {
        ...input.variables,
        MARIADB_DATABASE: 'railway',
        MARIADB_HOST: '${{RAILWAY_TCP_PROXY_DOMAIN}}',
        MARIADB_PASSWORD:
          "${{secret(32, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_!~*')}}",
        MARIADB_PORT: '${{RAILWAY_TCP_PROXY_PORT}}',
        MARIADB_PRIVATE_HOST: '${{RAILWAY_PRIVATE_DOMAIN}}',
        MARIADB_PRIVATE_PORT: '3306',
        MARIADB_PRIVATE_URL:
          'mariadb://${{MARIADB_USER}}:${{MARIADB_PASSWORD}}@${{MARIADB_PRIVATE_HOST}}:${{MARIADB_PRIVATE_PORT}}/${{MARIADB_DATABASE}}',
        MARIADB_ROOT_PASSWORD:
          "${{secret(32, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_!~*')}}",
        MARIADB_URL:
          'mariadb://${{MARIADB_USER}}:${{MARIADB_PASSWORD}}@${{MARIADB_HOST}}:${{MARIADB_PORT}}/${{MARIADB_DATABASE}}',
        MARIADB_USER: 'railway',
      },
    },
  }

  try {
    const response = await railwayAPI({
      query: CREATE_SERVICE,
      variables: queryVariables,
    })

    return response.data.serviceCreate
  } catch (error: any) {
    throw new Error('Error during create MariaDB: ', error)
  }
}

export const createPostgreSQLDatabase = async (input: CreateDatabaseType) => {
  const queryVariables = {
    input: {
      ...input,
      source: {
        image: 'postgres:14-alpine',
      },
      variables: {
        ...input.variables,
        DATABASE_PRIVATE_URL:
          'postgres://${{POSTGRES_USER}}:${{POSTGRES_PASSWORD}}@${{PGHOST_PRIVATE}}:${{PGPORT_PRIVATE}}/${{POSTGRES_DB}}',
        DATABASE_URL:
          'postgres://${{POSTGRES_USER}}:${{POSTGRES_PASSWORD}}@${{PGHOST}}:${{PGPORT}}/${{POSTGRES_DB}}',
        PGHOST: '${{RAILWAY_TCP_PROXY_DOMAIN}}',
        PGHOST_PRIVATE: '${{RAILWAY_PRIVATE_DOMAIN}}',
        PGPORT: '${{RAILWAY_TCP_PROXY_PORT}}',
        PGPORT_PRIVATE: '5432',
        POSTGRES_DB: 'railway',
        POSTGRES_PASSWORD:
          '${{secret(32, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_!~*")}}',
        POSTGRES_USER: 'railway',
      },
    },
  }

  try {
    const response = await railwayAPI({
      query: CREATE_SERVICE,
      variables: queryVariables,
    })

    return response.data.serviceCreate
  } catch (error: any) {
    throw new Error('Error during create MongoDB: ', error)
  }
}

export const createMySQLDatabase = async (input: CreateDatabaseType) => {
  const queryVariables = {
    input: {
      ...input,
      source: {
        image: 'mysql:9',
      },
      variables: {
        ...input.variables,
        MYSQLDATABASE: '${{ MYSQL_DATABASE }}',
        MYSQLHOST: '${{RAILWAY_PRIVATE_DOMAIN}}',

        MYSQLPASSWORD: '${{ MYSQL_ROOT_PASSWORD }}',
        MYSQLPORT: '3306',
        MYSQLUSER: 'root',

        MYSQL_DATABASE: 'railway',
        MYSQL_PUBLIC_URL:
          'mysql://${{ MYSQLUSER }}:${{ MYSQL_ROOT_PASSWORD }}@${{ RAILWAY_TCP_PROXY_DOMAIN }}:${{ RAILWAY_TCP_PROXY_PORT }}/${{ MYSQL_DATABASE }}',

        MYSQL_ROOT_PASSWORD:
          '${{ secret(32, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") }}',

        MYSQL_URL:
          'mysql://${{ MYSQLUSER }}:${{ MYSQL_ROOT_PASSWORD }}@${{ RAILWAY_PRIVATE_DOMAIN }}:3306/${{ MYSQL_DATABASE }}',
      },
    },
  }

  try {
    const response = await railwayAPI({
      query: CREATE_SERVICE,
      variables: queryVariables,
    })

    return response.data.serviceCreate
  } catch (error: any) {
    throw new Error('Error during create MySQL: ', error)
  }
}

export const createRedisDatabase = async (input: CreateDatabaseType) => {
  const queryVariables = {
    input: {
      ...input,
      source: {
        image: 'bitnami/redis:7.2.5',
      },
      variables: {
        ...input.variables,
        RAILWAY_RUN_AS_ROOT: 'true',
        RAILWAY_RUN_UID: '0',
        REDISHOST: '${{ RAILWAY_PRIVATE_DOMAIN }}',
        REDISPASSWORD: '${{ REDIS_PASSWORD }}',
        REDISPORT: '6379',
        REDISUSER: 'default',
        REDIS_AOF_ENABLED: 'no',
        REDIS_PASSWORD:
          '${{ secret(32, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") }}',
        REDIS_PUBLIC_URL:
          'redis://default:${{ REDIS_PASSWORD }}@${{ RAILWAY_TCP_PROXY_DOMAIN }}:${{ RAILWAY_TCP_PROXY_PORT }}',
        REDIS_RDB_POLICY: '3600#1 300#100 60#10000',
        REDIS_URL:
          'redis://default:${{ REDIS_PASSWORD }}@${{ RAILWAY_PRIVATE_DOMAIN }}:6379',
      },
    },
  }

  try {
    const response = await railwayAPI({
      query: CREATE_SERVICE,
      variables: queryVariables,
    })

    return response.data.serviceCreate
  } catch (error: any) {
    throw new Error('Error during create Redis: ', error)
  }
}

export const createMongoDBDatabase = async (input: CreateDatabaseType) => {
  const queryVariables = {
    input: {
      ...input,
      source: {
        image: 'mongo:7',
      },
      variables: {
        MONGOHOST: '${{ RAILWAY_PRIVATE_DOMAIN }}',
        MONGOPASSWORD: '${{ MONGO_INITDB_ROOT_PASSWORD }}',
        MONGOPORT: '27017',
        MONGOUSER: '${{ MONGO_INITDB_ROOT_USERNAME }}',
        MONGO_INITDB_ROOT_PASSWORD:
          '${{ secret(32, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") }}',
        MONGO_INITDB_ROOT_USERNAME: 'mongo',
        MONGO_PUBLIC_URL:
          'mongodb://${{MONGO_INITDB_ROOT_USERNAME}}:${{MONGO_INITDB_ROOT_PASSWORD}}@${{RAILWAY_TCP_PROXY_DOMAIN}}:${{RAILWAY_TCP_PROXY_PORT}}',
        MONGO_URL:
          'mongodb://${{MONGO_INITDB_ROOT_USERNAME}}:${{MONGO_INITDB_ROOT_PASSWORD}}@${{RAILWAY_PRIVATE_DOMAIN}}:27017',
      },
    },
  }

  try {
    const response = await railwayAPI({
      query: CREATE_SERVICE,
      variables: queryVariables,
    })

    return response.data.serviceCreate
  } catch (error: any) {
    throw new Error('Error during create MongoDB: ', error)
  }
}

export const createTcpProxy = async (input: CreateTcpProxyType) => {
  const queryVariables = {
    input,
  }

  try {
    const response = await railwayAPI({
      query: CREATE_TCP_PROXY,
      variables: queryVariables,
    })

    return response.data
  } catch (error: any) {
    throw new Error('Error during create tcp_proxy: ', error)
  }
}

export const serviceInstanceDeploy = async (
  input: ServiceInstanceDeployType,
) => {
  const { environmentId, serviceId } = input
  try {
    const response = await railwayAPI({
      query: SERVICE_INSTANCE_DEPLOY,
      variables: { environmentId, serviceId },
    })

    return response.data
  } catch (error: any) {
    throw new Error('Error during service instance deploy : ', error)
  }
}

export const serviceInstanceUpdate = async (
  data: ServiceInstanceUpdateType,
) => {
  const { environmentId, input, serviceId } = data
  try {
    const response = await railwayAPI({
      query: SERVICE_INSTANCE_UPDATE,
      variables: {
        environmentId,
        serviceId,
        input,
      },
    })

    return response.data
  } catch (error: any) {
    throw new Error('Error during service instance update : ', error)
  }
}
