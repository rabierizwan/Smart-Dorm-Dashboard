"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingDown,
  TrendingUp,
  Target,
  DollarSign,
  Calendar,
  Zap,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { SDGPanel } from "@/components/sdg-panel"
import { UserTasks } from "@/components/user-tasks"

interface Device {
  id: string
  name: string
  baseWattage: number
  status: "on" | "off"
}

export default function InsightsPage() {
  const [devices, setDevices] = useState<Device[]>([
    { id: "1", name: "Ceiling Lights", baseWattage: 60, status: "on" },
    { id: "2", name: "Desk Lamp", baseWattage: 15, status: "on" },
    { id: "3", name: "Laptop", baseWattage: 65, status: "on" },
    { id: "4", name: "Monitor", baseWattage: 35, status: "on" },
    { id: "5", name: "Mini Fridge", baseWattage: 100, status: "on" },
    { id: "6", name: "Space Heater", baseWattage: 1500, status: "off" },
    { id: "7", name: "WiFi Router", baseWattage: 12, status: "on" },
    { id: "8", name: "Phone Charger", baseWattage: 5, status: "on" },
    { id: "9", name: "Oven", baseWattage: 2400, status: "off" },
    { id: "10", name: "Rice Cooker", baseWattage: 350, status: "off" },
    { id: "11", name: "Stove", baseWattage: 1800, status: "off" },
    { id: "12", name: "Air Conditioner", baseWattage: 1200, status: "off" },
  ])

  const [currentUsage, setCurrentUsage] = useState(0)
  const [dailyGoal, setDailyGoal] = useState(5) // kWh per day
  const [goalInput, setGoalInput] = useState("5")
  const [beforeUsage] = useState(8500) // Simulated "before" usage in Wh
  const [savingsScenarios, setSavingsScenarios] = useState<
    Array<{ device: string; savings: number; monthlySavings: number }>
  >([])
  const [co2Impact] = useState(10) // Simulated CO2 impact in kg

  // Load device states from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("deviceStates")
    if (stored) {
      const states = JSON.parse(stored)
      setDevices((prev) =>
        prev.map((device) => ({
          ...device,
          status: states[device.id] === "on" ? "on" : states[device.id] === "off" ? "off" : device.status,
        })),
      )
    }
  }, [])

  // Load stored goal from localStorage
  useEffect(() => {
    const storedGoal = localStorage.getItem("energyGoal")
    if (storedGoal) {
      const parsed = Number.parseFloat(storedGoal)
      if (!Number.isNaN(parsed) && parsed > 0) {
        setDailyGoal(parsed)
        setGoalInput(parsed.toString())
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "energyGoal" && event.newValue) {
        const parsed = Number.parseFloat(event.newValue)
        if (!Number.isNaN(parsed) && parsed > 0) {
          setDailyGoal(parsed)
          setGoalInput(parsed.toString())
        }
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // Calculate current usage
  useEffect(() => {
    const total = devices.reduce((sum, device) => {
      return sum + (device.status === "on" ? device.baseWattage : 0)
    }, 0)
    setCurrentUsage(total)

    // Calculate savings scenarios for devices that are currently on
    const scenarios = devices
      .filter((d) => d.status === "on" && d.baseWattage > 10)
      .map((device) => ({
        device: device.name,
        savings: device.baseWattage,
        monthlySavings: ((device.baseWattage / 1000) * 24 * 30 * 0.12).toFixed(2),
      }))
      .sort((a, b) => b.savings - a.savings)

    setSavingsScenarios(scenarios)
  }, [devices])

  const currentDailyUsage = (currentUsage / 1000) * 24 // kWh per day
  const goalProgress = Math.min((currentDailyUsage / dailyGoal) * 100, 100)
  const isUnderGoal = currentDailyUsage <= dailyGoal

  const currentMonthlyCost = ((currentUsage / 1000) * 24 * 30 * 0.12).toFixed(2)
  const projectedMonthlyCost = currentMonthlyCost

  const afterUsage = currentUsage
  const usageReduction = ((beforeUsage - afterUsage) / beforeUsage) * 100
  const costSavings = (((beforeUsage - afterUsage) / 1000) * 24 * 30 * 0.12).toFixed(2)

  const handleSetGoal = () => {
    const newGoal = Number.parseFloat(goalInput)
    if (newGoal > 0) {
      setDailyGoal(newGoal)
      setGoalInput(newGoal.toString())
      localStorage.setItem("energyGoal", newGoal.toString())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-3">
              <Target className="h-10 w-10 text-blue-400" />
              Energy Insights
            </h1>
            <p className="text-slate-400 text-lg mt-2">Track your progress and set energy goals</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/room">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Eye className="h-4 w-4 mr-2" />
                Room View
              </Button>
            </Link>
          </div>
        </div>

        {/* SDG Panel and User Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SDGPanel kwhUsed={currentDailyUsage} co2Saved={co2Impact} />
          <UserTasks currentUsage={currentUsage} />
        </div>

        {/* Monthly Bill Projection */}
        <Card className="bg-gradient-to-br from-indigo-950/80 via-slate-950/70 to-purple-950/70 border-indigo-800/60 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-emerald-300" />
              Monthly Bill Projection
            </CardTitle>
            <CardDescription className="text-indigo-200/80">Based on your current usage patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-indigo-200/80">Current Usage Rate</p>
                <p className="text-4xl font-bold text-slate-100">{currentUsage}W</p>
                <p className="text-sm text-indigo-200/80">
                  {currentDailyUsage.toFixed(2)} kWh/day • {(currentDailyUsage * 30).toFixed(2)} kWh/month
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-indigo-200/80">Projected Monthly Bill</p>
                <p className="text-4xl font-bold text-emerald-300">${projectedMonthlyCost}</p>
                <p className="text-sm text-indigo-100/90">At this rate, you'll pay ${projectedMonthlyCost} this month</p>
              </div>
            </div>
            <div className="bg-indigo-950/50 border border-indigo-700/60 rounded-lg p-4">
              <p className="text-indigo-100 text-sm">
                💡 Tip: If you reduce usage by just 20%, you could save $
                {(Number.parseFloat(projectedMonthlyCost) * 0.2).toFixed(2)} per month!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Goal Setting */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-6 w-6 text-yellow-400" />
              Daily Energy Goal
            </CardTitle>
            <CardDescription className="text-slate-400">Set a target to track your progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="Enter daily goal (kWh)"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Button onClick={handleSetGoal} className="bg-blue-600 hover:bg-blue-700">
                Set Goal
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isUnderGoal ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-400" />
                  )}
                  <span className="text-white font-medium">
                    {currentDailyUsage.toFixed(2)} / {dailyGoal} kWh per day
                  </span>
                </div>
                <Badge className={isUnderGoal ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}>
                  {isUnderGoal ? "On Track" : "Over Goal"}
                </Badge>
              </div>
              <Progress value={goalProgress} className="h-3" />
              <p className="text-sm text-slate-400">
                {isUnderGoal
                  ? `Great job! You're ${(((dailyGoal - currentDailyUsage) / dailyGoal) * 100).toFixed(0)}% under your goal.`
                  : `You're ${(((currentDailyUsage - dailyGoal) / dailyGoal) * 100).toFixed(0)}% over your goal. Try turning off high-power devices.`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Before/After Comparison */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-400" />
              Before vs After Comparison
            </CardTitle>
            <CardDescription className="text-slate-400">See the impact of your energy-saving efforts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Before (Baseline)</p>
                <p className="text-3xl font-bold text-slate-300">{beforeUsage}W</p>
                <p className="text-xs text-slate-500">Average usage last week</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-400">After (Current)</p>
                <p className="text-3xl font-bold text-white">{afterUsage}W</p>
                <p className="text-xs text-slate-500">Current usage</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Reduction</p>
                <div className="flex items-baseline gap-2">
                  {usageReduction > 0 ? (
                    <>
                      <TrendingDown className="h-6 w-6 text-green-400" />
                      <p className="text-3xl font-bold text-green-400">{usageReduction.toFixed(1)}%</p>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-6 w-6 text-red-400" />
                      <p className="text-3xl font-bold text-red-400">{Math.abs(usageReduction).toFixed(1)}%</p>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-500">{usageReduction > 0 ? "Savings" : "Increase"} vs baseline</p>
              </div>
            </div>

            {usageReduction > 0 && (
              <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-300 font-medium">
                  🎉 Excellent work! You're saving ${costSavings} per month compared to your baseline usage.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Calculator */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-400" />
              Savings Calculator
            </CardTitle>
            <CardDescription className="text-slate-400">
              See how much you could save by turning off devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {savingsScenarios.length > 0 ? (
              <div className="space-y-3">
                {savingsScenarios.map((scenario, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800/70 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{scenario.device}</p>
                      <p className="text-sm text-slate-400">Currently using {scenario.savings}W</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">${scenario.monthlySavings}</p>
                      <p className="text-xs text-slate-400">saved per month</p>
                    </div>
                  </div>
                ))}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                  <p className="text-yellow-300 text-sm">
                    💰 Total potential savings: $
                    {savingsScenarios.reduce((sum, s) => sum + Number.parseFloat(s.monthlySavings), 0).toFixed(2)} per
                    month if you turn off all non-essential devices when not in use.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>All high-power devices are currently off.</p>
                <p className="text-sm mt-2">Great job managing your energy consumption!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actionable Insights */}
        <Card className="bg-gradient-to-br from-indigo-950/80 via-purple-950/70 to-slate-950/80 border-indigo-800/60 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Target className="h-6 w-6 text-indigo-300" />
              Quick Actions & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-950/60 border border-slate-700/70 rounded-lg p-4">
                <p className="text-slate-100 font-medium mb-1">Current Status</p>
                <p className="text-slate-200 text-sm">
                  {isUnderGoal ? "✅ You're meeting your daily goal!" : "⚠️ You're over your daily goal"}
                </p>
              </div>
              <div className="bg-slate-950/60 border border-slate-700/70 rounded-lg p-4">
                <p className="text-slate-100 font-medium mb-1">Top Recommendation</p>
                <p className="text-slate-200 text-sm">
                  {savingsScenarios.length > 0
                    ? `Turn off ${savingsScenarios[0].device} to save $${savingsScenarios[0].monthlySavings}/mo`
                    : "Keep up the great work!"}
                </p>
              </div>
            </div>
            <div className="bg-indigo-950/50 border border-indigo-700/60 rounded-lg p-4">
              <p className="text-indigo-100 text-sm leading-relaxed">
                💡 Pro Tip: Set your daily goal 10-15% below your current usage for realistic, achievable energy
                savings. Small changes compound over time!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
