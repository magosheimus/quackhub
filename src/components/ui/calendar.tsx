import type { ComponentProps } from 'react'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'
import { buttonVariants } from '@/components/ui/button'
import { IconChevronLeft, IconChevronRight } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn('w-fit', className)}
      classNames={{
        months: 'relative flex flex-col',
        month: 'flex flex-col gap-3',
        month_caption: 'flex h-8 items-center justify-center',
        caption_label: 'font-heading text-heading-3 capitalize text-fg',
        nav: 'absolute inset-x-0 top-0 flex h-8 items-center justify-between',
        button_previous: buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
        button_next: buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
        month_grid: 'border-collapse',
        weekdays: 'flex',
        weekday: 'w-9 text-micro font-normal',
        week: 'mt-1 flex',
        day: 'size-9 p-0 text-center',
        day_button:
          'flex size-9 items-center justify-center rounded-md border border-transparent text-body-sm text-fg outline-none hover:bg-hover focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        selected:
          '[&>button]:bg-accent [&>button]:font-semibold [&>button]:text-on-accent [&>button]:hover:bg-accent/90',
        today: '[&>button]:border-accent',
        outside: '[&>button]:text-fg-muted',
        disabled: 'opacity-40',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <IconChevronLeft size={16} aria-hidden="true" />
          ) : (
            <IconChevronRight size={16} aria-hidden="true" />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
