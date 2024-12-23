import Container from '../common/Container'

import { Faqs } from '@/data/faqs'

const Faq = () => {
  return (
    <Container className='mt-20'>
      <h1 className='mb-8 text-center text-3xl font-medium leading-normal lg:text-4xl xl:text-5xl'>
        Frequently Asked Questions
      </h1>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {Faqs?.map((faq, index) => (
          <div key={index} className='space-y-2'>
            <h2 className='text-lg  font-semibold text-base-content'>
              {faq?.question}
            </h2>
            <p className='text-md text-base-content/80'>{faq?.answer}</p>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default Faq
