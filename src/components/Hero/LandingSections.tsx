'use client'

import { useUrlStore } from '@/lib/store'
import FeatureGrid from './FeatureGrid'
import StatsBar from './StatsBar'
import Steps from '../ui/Steps'

export default function LandingSections() {
  const { currentUrl, results } = useUrlStore()

  if (currentUrl || results) return null

  return (
    <div className="mt-10 space-y-10">
      <Steps />
      <FeatureGrid />
      <StatsBar />
    </div>
  )
}
