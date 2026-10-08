'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'

// Plain history.back(): the global 404 page renders outside the app router tree
export const BackButton = ({ label }: { label: string }) => {
  return (
    <Button onClick={() => window.history.back()} variant="outline">
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}
