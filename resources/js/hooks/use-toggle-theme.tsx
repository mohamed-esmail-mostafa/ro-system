import React from 'react'
import { useAppearance } from './use-appearance'

export default function useToggleTheme() {
    const { appearance, resolvedAppearance, updateAppearance } = useAppearance()
 

  const isDark = resolvedAppearance === 'dark'
    const toggleTheme = () => {
        updateAppearance(isDark ? 'light' : 'dark')
    }
  return {
    toggleTheme, isDark, appearance
  }
}
