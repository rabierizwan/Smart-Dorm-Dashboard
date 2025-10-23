import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Zap } from "lucide-react"

interface SDGPanelProps {
  co2Saved?: number
  kwhUsed?: number
}

export function SDGPanel({ co2Saved = 0, kwhUsed = 0 }: SDGPanelProps) {
  return (
    <Card className="bg-gradient-to-br from-emerald-950/80 via-emerald-900/70 to-teal-900/70 border-emerald-800/60 shadow-lg backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Leaf className="h-5 w-5 text-green-400" />
          Why This Matters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-100 font-medium text-sm">Energy Impact</p>
              <p className="text-emerald-100/90 text-sm">Every 1 kWh saved ≈ 0.92 kg CO₂ avoided</p>
              {kwhUsed > 0 && (
                <p className="text-emerald-200 text-xs mt-1">
                  Your current usage: {kwhUsed.toFixed(2)} kWh/day = {(kwhUsed * 0.92).toFixed(2)} kg CO₂/day
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-700/60 pt-3">
          <p className="text-emerald-100 font-medium text-sm mb-2">UN Sustainable Development Goals</p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white border-0">
              <span className="mr-1">7</span> Affordable & Clean Energy
            </Badge>
            <Badge className="bg-orange-600 hover:bg-orange-700 text-white border-0">
              <span className="mr-1">12</span> Responsible Consumption
            </Badge>
            <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">
              <span className="mr-1">13</span> Climate Action
            </Badge>
          </div>
        </div>

        <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-lg p-3">
          <p className="text-emerald-100 text-xs leading-relaxed">
            By monitoring and reducing your energy consumption, you're directly contributing to global sustainability
            efforts and helping combat climate change.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
