"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Zap, DollarSign, Leaf, TrendingUp } from "lucide-react"

interface UsageInfoModalProps {
  isOpen: boolean
  onClose: () => void
  currentUsage: number
  monthlyCost: number
  co2Impact: number
}

export function UsageInfoModal({ isOpen, onClose, currentUsage, monthlyCost, co2Impact }: UsageInfoModalProps) {
  if (!isOpen) return null

  const getUsageLevel = (wattage: number) => {
    if (wattage < 500)
      return {
        label: "Excellent",
        color: "text-green-400",
        gradient: "from-green-500/20 to-emerald-500/20",
        border: "border-green-500/50",
      }
    if (wattage < 1000)
      return {
        label: "Good",
        color: "text-yellow-400",
        gradient: "from-yellow-500/20 to-amber-500/20",
        border: "border-yellow-500/50",
      }
    if (wattage < 1500)
      return {
        label: "High",
        color: "text-orange-400",
        gradient: "from-orange-500/20 to-red-500/20",
        border: "border-orange-500/50",
      }
    return {
      label: "Very High",
      color: "text-red-400",
      gradient: "from-red-500/20 to-pink-500/20",
      border: "border-red-500/50",
    }
  }

  const usageLevel = getUsageLevel(currentUsage)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card
        className={`w-full max-w-lg bg-gradient-to-br ${usageLevel.gradient} border-2 ${usageLevel.border} backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-200`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600`}>
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Energy Usage Report</h2>
                <p className="text-slate-300 text-sm">Real-time consumption data</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Stats */}
          <div className="space-y-4">
            {/* Current Usage */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300 font-medium">Current Usage</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${usageLevel.color} bg-white/10`}>
                  {usageLevel.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">{Math.round(currentUsage)}</span>
                <span className="text-2xl text-slate-400 font-medium">W</span>
              </div>
              <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${currentUsage < 500 ? "from-green-500 to-emerald-500" : currentUsage < 1000 ? "from-yellow-500 to-amber-500" : currentUsage < 1500 ? "from-orange-500 to-red-500" : "from-red-500 to-pink-500"} transition-all duration-500`}
                  style={{ width: `${Math.min((currentUsage / 2000) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Monthly Cost */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                <span className="text-slate-300 font-medium">Estimated Monthly Cost</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">${monthlyCost.toFixed(2)}</span>
                <span className="text-lg text-slate-400">/month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Based on $0.12 per kWh</p>
            </div>

            {/* CO2 Impact */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-300 font-medium">Carbon Footprint</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{co2Impact.toFixed(1)}</span>
                <span className="text-lg text-slate-400">lbs CO₂</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Per month • 0.92 kg CO₂ per kWh</p>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-300 mb-1">Energy Saving Tip</p>
                <p className="text-xs text-slate-300">
                  {currentUsage > 1500
                    ? "Your usage is very high. Consider turning off high-power devices like heaters or ovens."
                    : currentUsage > 1000
                      ? "You're using a moderate amount of power. Turn off unused devices to save more."
                      : "Great job! Your energy usage is efficient. Keep it up!"}
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
          >
            Got it!
          </Button>
        </div>
      </Card>
    </div>
  )
}
