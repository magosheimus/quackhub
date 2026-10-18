export const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex h-10 items-center gap-3 border px-3 py-2 rounded-md text-base ${
    isActive
      ? 'border-border bg-selected text-fg'
      : 'border-transparent text-fg hover:bg-hover'
  }`
