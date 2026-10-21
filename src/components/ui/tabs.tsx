import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      className={cn('flex flex-col gap-6', className)}
      {...props}
    />
  )
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      className={cn('flex flex-wrap gap-2', className)}
      {...props}
    />
  )
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={(state) =>
        cn(
          buttonVariants({
            variant: state.active ? 'selected' : 'outline',
            size: 'sm',
          }),
          typeof className === 'function' ? className(state) : className,
        )
      }
      {...props}
    />
  )
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      className={cn('flex flex-col gap-6', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTab, TabsPanel }
