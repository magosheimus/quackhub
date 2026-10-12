import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { COMPACT_NAV_MEDIA_QUERY } from '@/shared/constants/breakpoints'

export function useMobileNav() {
  const isMobile = useMediaQuery(COMPACT_NAV_MEDIA_QUERY)
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState(pathname)

  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setIsOpen(false)
  }

  return { isMobile, isOpen, setIsOpen }
}
