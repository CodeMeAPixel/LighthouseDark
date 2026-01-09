"use client"

import useUrlStore from "@/components/AppContext"
import FeatureGrid from "@/components/FeatureGrid"
import StatsBar from "@/components/StatsBar"
import Steps from "@/components/Steps"

export default function LandingSections() {
  const currentUrl = useUrlStore((s) => s.currentUrl)
  const results = useUrlStore((s) => s.results)

  if (currentUrl || results) return null

  return (
    <div className="mt-10 space-y-10">
       <Steps />
      <FeatureGrid />
      <StatsBar />
    </div>
  )
}
