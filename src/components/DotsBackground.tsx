'use client'

import { motion } from 'framer-motion'

import { cn } from '@/utils/cn'

export function DotBackground({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // drag
      // onDragStart={() => setIsDragging(true)}
      // onDragEnd={() => setIsDragging(false)}
      // dragConstraints={{
      //   left: -100,
      //   right: 100,
      //   bottom: 100,
      //   top: -100,
      // }}
      // dragElastic={0}
      className={cn('min-h-screen text-base-content bg-dot-white/20')}>
      {children}
    </motion.div>
  )
}
