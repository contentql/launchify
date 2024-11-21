import { router } from '@/trpc'
import { authRouter } from '@/trpc/routers/auth'
import { projectRouter } from '@/trpc/routers/project'
import { userRouter } from '@/trpc/routers/user'

import { cloudflareRouter } from './cloudflare'
import { pageRouter } from './page'
import { railwayRouter } from './railway'
import { serviceRouter } from './service'

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  project: projectRouter,
  service: serviceRouter,
  railway: railwayRouter,
  cloudflare: cloudflareRouter,
  page: pageRouter,
})

export type AppRouter = typeof appRouter
