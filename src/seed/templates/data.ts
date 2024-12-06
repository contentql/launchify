import path from 'path'
import { Template } from 'payload-types'

export type TemplateDataType = Omit<Template, 'id' | 'createdAt' | 'updatedAt'>
export type TemplateImageType = {
  alt: string
  filePath: string
}
export const templateData: TemplateDataType = {
  title: 'Ghost',
  services: [
    {
      type: 'database',
      databaseType: 'MYSQL',
      icon: '',
      name: 'MySQL',
    },
    {
      type: 'docker',
      name: 'Ghost',
      environmentVariables: {
        PORT: '2368',
        database__client: 'mysql',
        database__connection__database: '${{MySQL.MYSQLDATABASE}}',
        database__connection__host: '${{MySQL.MYSQLHOST}}',
        database__connection__password: '${{MySQL.MYSQLPASSWORD}}',
        database__connection__port: '${{MySQL.MYSQLPORT}}',
        database__connection__user: '${{MySQL.MYSQLUSER}}',
        mail__from: '',
        mail__options__auth__user: '',
        mail__options__auth__pass: '',
        mail__options__host: '',
        mail__options__port: '',
        mail__transport: '',
        url: 'https://${{RAILWAY_STATIC_URL}}',
      },
      icon: '',
      image: 'ghost:alpine',
    },
  ],
}

export const templateImageData: TemplateImageType[] = [
  {
    alt: 'icon 1',
    filePath: path.join(process.cwd(), '/public/images/template/mysql.png'),
  },
  {
    alt: 'icon 1',
    filePath: path.join(process.cwd(), '/public/images/template/ghost.png'),
  },
]
