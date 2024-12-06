import { TRPCError } from '@trpc/server'
import ora from 'ora'

import { seedFeaturesPage } from '@/seed/features-page'
import { seedHomePage } from '@/seed/home-page'
import { seedPricingPage } from '@/seed/pricing'
import { seedSiteSettingsGlobal } from '@/seed/site-settings'
import { seedSupportPage } from '@/seed/support-page'
import { seedTemplates } from '@/seed/templates'
import { seedThemesPage } from '@/seed/themes-page'
import { publicProcedure, router } from '@/trpc'

export const seedRouter = router({
  runSeed: publicProcedure.mutation(async () => {
    const spinner = ora({
      text: 'Starting the seeding process...',
      color: 'cyan',
      spinner: 'dots',
    }).start()
    try {
      // Ensure that the seeding functions are called in the correct order.
      // The blogs seeding depends on tags and authors being seeded first.
      // Therefore, make sure to seed tags and authors before seeding blogs.

      await seedHomePage(spinner)
      await seedFeaturesPage(spinner)
      await seedTemplates(spinner)
      await seedSupportPage(spinner)
      await seedThemesPage(spinner)
      await seedPricingPage(spinner)
      await seedSiteSettingsGlobal({ spinner })
      return { success: true }
    } catch (error: any) {
      console.error('Error seeding:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })
    }
  }),
})
