import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from './ui/accordion'
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDictionary } from '@/get-dictionary'

export const FAQ = async () => {
  const t = await getDictionary()

  const items = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
    { q: t.faq.q6, a: t.faq.a6 },
    { q: t.faq.q7, a: t.faq.a7 },
    { q: t.faq.q8, a: t.faq.a8 },
  ]

  return (
    <section
      id="faq"
      className="w-full max-w-screen-xl mx-auto py-12 px-6 scroll-mt-24"
      aria-labelledby="faq-heading"
    >
      <h2
        id="faq-heading"
        className="text-center text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tighter"
      >
        {t.faq.title}
      </h2>
      <p className="mt-1.5 text-center xs:text-lg text-zinc-600">
        {t.faq.subtitle}
      </p>

      <div className="min-h-[550px] md:min-h-[320px] xl:min-h-[300px]">
        <Accordion
          className="mt-8 block space-y-4 md:columns-2 gap-4 overflow-visible rounded-none border-none"
        >
          {items.map(({ q, a }, index) => (
            <AccordionItem
              key={`faq-${index}`}
              value={`question-${index}`}
              className="bg-accent/60 data-open:bg-accent/60 py-1 px-4 rounded-xl border-none !mt-0 !mb-4 break-inside-avoid backdrop-blur-sm"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger
                  className={cn(
                    'group flex flex-1 items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline',
                    'text-start text-lg'
                  )}
                >
                  <span itemProp="name">{q}</span>
                  <PlusIcon
                    className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[panel-open]:rotate-45"
                    aria-hidden="true"
                  />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent
                className="px-0 text-[15px] leading-relaxed text-muted-foreground"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div itemProp="text">{a}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
