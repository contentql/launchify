'use client'

import { Params } from '../types'
import { PricingType } from '@payload-types'
import React from 'react'

import Button from '@/components/common/Button'
import Container from '@/components/common/Container'
import { Glow, GlowCapture } from '@/components/common/Glow'
import { cn } from '@/utils/cn'

interface PricingProps extends PricingType {
  params: Params
}
const Pricing: React.FC<PricingProps> = ({ params, ...block }) => {
  return (
    <Container>
      <div className='-mx-4 flex flex-wrap'>
        <div className='w-full px-4'>
          <div className='mx-auto mb-[60px] max-w-[510px] text-center'>
            <span className='mb-2 block text-lg font-semibold text-primary'>
              {block?.badge}
            </span>
            <h2 className=' mb-3 text-3xl font-bold leading-[1.208] sm:text-4xl'>
              {block?.title}
            </h2>
            <p className='text-base-content/80'>{block?.description}</p>
          </div>
        </div>
      </div>
      <GlowCapture>
        <div className='group grid grid-cols-1 gap-6 pb-2 md:grid-cols-2 lg:grid-cols-4'>
          {block?.pricing?.map((plan, index) => (
            <Glow key={index}>
              <PricingCard plan={plan} />
            </Glow>
          ))}
        </div>
      </GlowCapture>
    </Container>
  )
}

export default Pricing

const PricingCard = ({
  plan,
}: {
  plan: {
    type: string
    price: string
    subscription: string
    description: string
    buttonText: string
    features?:
      | {
          feature: string
          id?: string | null
        }[]
      | null
    active?: boolean | null
    id?: string | null
  }
}) => {
  const {
    buttonText,
    description,
    price,
    subscription,
    type,
    active,
    features,
    id,
  } = plan

  return (
    <div className='mx-auto h-full  max-w-7xl '>
      <div
        className={cn(
          'glowable relative mb-10   h-full  overflow-hidden rounded-md border-[2px] border-transparent bg-base-200 px-8 py-10',
          active
            ? 'bg-primary/10 opacity-100 shadow-lg ring-2 ring-primary ring-offset-0'
            : '',
        )}>
        <span className='mb-3 block text-lg font-semibold text-primary'>
          {type}
        </span>
        <h2 className='text-dark mb-5 text-[42px] font-bold'>
          {price}
          <span className='text-sm font-medium text-base-content/80'>
            / {subscription}
          </span>
        </h2>
        <p className='mb-8 border-b border-base-300 pb-8 text-base-content/80 '>
          {description}
        </p>
        <div className='mb-9 flex flex-col gap-[14px]'>
          {features?.map((feature, index) => (
            <div key={index}>
              <List key={index}>{feature?.feature}</List>
            </div>
          ))}
        </div>
        <Button
          className={cn(
            'absolute bottom-4 left-[50%] h-12 w-[calc(100%-3rem)] -translate-x-[50%]',
          )}>
          {buttonText}
        </Button>
        <div>
          {/* <span className='absolute right-0 top-7 z-[-1]'>
              <svg
                width={77}
                height={172}
                viewBox='0 0 77 172'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <circle cx={86} cy={86} r={86} fill='url(#paint0_linear)' />
                <defs>
                  <linearGradient
                    id='paint0_linear'
                    x1={86}
                    y1={0}
                    x2={86}
                    y2={172}
                    gradientUnits='userSpaceOnUse'>
                    <stop stopColor='#3056D3' stopOpacity='0.09' />
                    <stop offset={1} stopColor='#C4C4C4' stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
            </span> */}
          {active && (
            <span className='absolute right-4 top-4 z-10'>
              <svg
                width={41}
                height={89}
                viewBox='0 0 41 89'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <circle
                  cx='38.9138'
                  cy='87.4849'
                  r='1.42021'
                  transform='rotate(180 38.9138 87.4849)'
                  fill='#6D28D9'
                />
                <circle
                  cx='38.9138'
                  cy='74.9871'
                  r='1.42021'
                  transform='rotate(180 38.9138 74.9871)'
                  fill='#6D28D9'
                />
                <circle
                  cx='38.9138'
                  cy='62.4892'
                  r='1.42021'
                  transform='rotate(180 38.9138 62.4892)'
                  fill='#6D28D9'
                />
                <circle
                  cx='38.9138'
                  cy='38.3457'
                  r='1.42021'
                  transform='rotate(180 38.9138 38.3457)'
                  fill='#6D28D9'
                />
                <circle
                  cx='38.9138'
                  cy='13.634'
                  r='1.42021'
                  transform='rotate(180 38.9138 13.634)'
                  fill='#6D28D9'
                />
                <circle
                  cx='38.9138'
                  cy='50.2754'
                  r='1.42021'
                  transform='rotate(180 38.9138 50.2754)'
                  fill='#6D28D9'
                />
                <circle
                  cx='38.9138'
                  cy='26.1319'
                  r='1.42021'
                  transform='rotate(180 38.9138 26.1319)'
                  fill='#6D28D9'
                />
                <circle
                  cx='38.9138'
                  cy='1.42021'
                  r='1.42021'
                  transform='rotate(180 38.9138 1.42021)'
                  fill='#6D28D9'
                />
                <circle
                  cx='26.4157'
                  cy='87.4849'
                  r='1.42021'
                  transform='rotate(180 26.4157 87.4849)'
                  fill='#6D28D9'
                />
                <circle
                  cx='26.4157'
                  cy='74.9871'
                  r='1.42021'
                  transform='rotate(180 26.4157 74.9871)'
                  fill='#6D28D9'
                />
                <circle
                  cx='26.4157'
                  cy='62.4892'
                  r='1.42021'
                  transform='rotate(180 26.4157 62.4892)'
                  fill='#6D28D9'
                />
                <circle
                  cx='26.4157'
                  cy='38.3457'
                  r='1.42021'
                  transform='rotate(180 26.4157 38.3457)'
                  fill='#6D28D9'
                />
                <circle
                  cx='26.4157'
                  cy='13.634'
                  r='1.42021'
                  transform='rotate(180 26.4157 13.634)'
                  fill='#6D28D9'
                />
                <circle
                  cx='26.4157'
                  cy='50.2754'
                  r='1.42021'
                  transform='rotate(180 26.4157 50.2754)'
                  fill='#6D28D9'
                />
                <circle
                  cx='26.4157'
                  cy='26.1319'
                  r='1.42021'
                  transform='rotate(180 26.4157 26.1319)'
                  fill='#6D28D9'
                />
                <circle
                  cx='26.4157'
                  cy='1.4202'
                  r='1.42021'
                  transform='rotate(180 26.4157 1.4202)'
                  fill='#6D28D9'
                />
                <circle
                  cx='13.9177'
                  cy='87.4849'
                  r='1.42021'
                  transform='rotate(180 13.9177 87.4849)'
                  fill='#6D28D9'
                />
                <circle
                  cx='13.9177'
                  cy='74.9871'
                  r='1.42021'
                  transform='rotate(180 13.9177 74.9871)'
                  fill='#6D28D9'
                />
                <circle
                  cx='13.9177'
                  cy='62.4892'
                  r='1.42021'
                  transform='rotate(180 13.9177 62.4892)'
                  fill='#6D28D9'
                />
                <circle
                  cx='13.9177'
                  cy='38.3457'
                  r='1.42021'
                  transform='rotate(180 13.9177 38.3457)'
                  fill='#6D28D9'
                />
                <circle
                  cx='13.9177'
                  cy='13.634'
                  r='1.42021'
                  transform='rotate(180 13.9177 13.634)'
                  fill='#6D28D9'
                />
                <circle
                  cx='13.9177'
                  cy='50.2754'
                  r='1.42021'
                  transform='rotate(180 13.9177 50.2754)'
                  fill='#6D28D9'
                />
                <circle
                  cx='13.9177'
                  cy='26.1319'
                  r='1.42021'
                  transform='rotate(180 13.9177 26.1319)'
                  fill='#6D28D9'
                />
                <circle
                  cx='13.9177'
                  cy='1.42019'
                  r='1.42021'
                  transform='rotate(180 13.9177 1.42019)'
                  fill='#6D28D9'
                />
                <circle
                  cx='1.41963'
                  cy='87.4849'
                  r='1.42021'
                  transform='rotate(180 1.41963 87.4849)'
                  fill='#6D28D9'
                />
                <circle
                  cx='1.41963'
                  cy='74.9871'
                  r='1.42021'
                  transform='rotate(180 1.41963 74.9871)'
                  fill='#6D28D9'
                />
                <circle
                  cx='1.41963'
                  cy='62.4892'
                  r='1.42021'
                  transform='rotate(180 1.41963 62.4892)'
                  fill='#6D28D9'
                />
                <circle
                  cx='1.41963'
                  cy='38.3457'
                  r='1.42021'
                  transform='rotate(180 1.41963 38.3457)'
                  fill='#6D28D9'
                />
                <circle
                  cx='1.41963'
                  cy='13.634'
                  r='1.42021'
                  transform='rotate(180 1.41963 13.634)'
                  fill='#6D28D9'
                />
                <circle
                  cx='1.41963'
                  cy='50.2754'
                  r='1.42021'
                  transform='rotate(180 1.41963 50.2754)'
                  fill='#6D28D9'
                />
                <circle
                  cx='1.41963'
                  cy='26.1319'
                  r='1.42021'
                  transform='rotate(180 1.41963 26.1319)'
                  fill='#6D28D9'
                />
                <circle
                  cx='1.41963'
                  cy='1.4202'
                  r='1.42021'
                  transform='rotate(180 1.41963 1.4202)'
                  fill='#6D28D9'
                />
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const List = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className='text-body-color dark:text-dark-6 text-base'>{children}</p>
  )
}
