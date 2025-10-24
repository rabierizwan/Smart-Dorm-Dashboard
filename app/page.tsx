"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Lightbulb, Monitor, Flame, Wind, Wifi, Eye, AlertTriangle, X, Target } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SDGPanel } from "@/components/sdg-panel"
import { UserTasks } from "@/components/user-tasks"
import { VoiceControl } from "@/components/voice-control"
import { UsageInfoModal } from "@/components/usage-info-modal"

interface Device {
  id: string
  name: string
  icon: React.ReactNode
  baseWattage: number
  currentWattage: number
  status: "on" | "off"
  color: string
}

export default function SmartDormDashboard() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "Ceiling Lights",
      icon: <Lightbulb className="h-5 w-5" />,
      baseWattage: 60,
      currentWattage: 60,
      status: "on",
      color: "bg-yellow-500",
    },
    {
      id: "2",
      name: "Desk Lamp",
      icon: <Lightbulb className="h-5 w-5" />,
      baseWattage: 15,
      currentWattage: 15,
      status: "on",
      color: "bg-yellow-400",
    },
    {
      id: "3",
      name: "Laptop",
      icon: <Monitor className="h-5 w-5" />,
      baseWattage: 65,
      currentWattage: 65,
      status: "on",
      color: "bg-blue-500",
    },
    {
      id: "4",
      name: "Monitor",
      icon: <Monitor className="h-5 w-5" />,
      baseWattage: 35,
      currentWattage: 35,
      status: "on",
      color: "bg-blue-400",
    },
    {
      id: "5",
      name: "Mini Fridge",
      icon: <Wind className="h-5 w-5" />,
      baseWattage: 100,
      currentWattage: 100,
      status: "on",
      color: "bg-cyan-500",
    },
    {
      id: "6",
      name: "Space Heater",
      icon: <Flame className="h-5 w-5" />,
      baseWattage: 1500,
      currentWattage: 0,
      status: "off",
      color: "bg-red-500",
    },
    {
      id: "7",
      name: "WiFi Router",
      icon: <Wifi className="h-5 w-5" />,
      baseWattage: 12,
      currentWattage: 12,
      status: "on",
      color: "bg-purple-500",
    },
    {
      id: "8",
      name: "Phone Charger",
      icon: <Zap className="h-5 w-5" />,
      baseWattage: 5,
      currentWattage: 5,
      status: "on",
      color: "bg-green-500",
    },
    {
      id: "9",
      name: "Oven",
      icon: <Flame className="h-5 w-5" />,
      baseWattage: 2400,
      currentWattage: 0,
      status: "off",
      color: "bg-orange-600",
    },
    {
      id: "10",
      name: "Rice Cooker",
      icon: <Flame className="h-5 w-5" />,
      baseWattage: 350,
      currentWattage: 0,
      status: "off",
      color: "bg-amber-500",
    },
    {
      id: "11",
      name: "Stove",
      icon: <Flame className="h-5 w-5" />,
      baseWattage: 1800,
      currentWattage: 0,
      status: "off",
      color: "bg-red-600",
    },
    {
      id: "12",
      name: "Air Conditioner",
      icon: <Wind className="h-5 w-5" />,
      baseWattage: 1200,
      currentWattage: 0,
      status: "off",
      color: "bg-sky-500",
    },
  ])

  const [totalWattage, setTotalWattage] = useState(0)
  const [monthlyCost, setMonthlyCost] = useState(0)
  const [co2Impact, setCo2Impact] = useState(0)

  const [notification, setNotification] = useState<{
    show: boolean
    level: "high" | "very-high" | null
    message: string
  }>({
    show: false,
    level: null,
    message: "",
  })

  const router = useRouter()
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening" | "night">("afternoon")

  const [showUsageModal, setShowUsageModal] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("deviceStates")
    if (stored) {
      const states = JSON.parse(stored)
      setDevices((prev) =>
        prev.map((device) => ({
          ...device,
          status: states[device.id] === "on" ? "on" : states[device.id] === "off" ? "off" : device.status,
          currentWattage: states[device.id] === "off" ? 0 : device.currentWattage,
        })),
      )
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prevDevices) =>
        prevDevices.map((device) => {
          if (device.status === "off") return device

          const fluctuation = (Math.random() - 0.5) * 0.2 * device.baseWattage
          const newWattage = Math.max(0, device.baseWattage + fluctuation)

          return { ...device, currentWattage: Math.round(newWattage * 10) / 10 }
        }),
      )
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const total = devices.reduce((sum, device) => sum + device.currentWattage, 0)
    setTotalWattage(Math.round(total * 10) / 10)

    const monthlyKwh = (total / 1000) * 24 * 30
    setMonthlyCost(Math.round(monthlyKwh * 0.12 * 100) / 100)

    setCo2Impact(Math.round(monthlyKwh * 0.92 * 10) / 10)

    if (total >= 1500) {
      setNotification({
        show: true,
        level: "very-high",
        message: `⚠️ Very High Power Usage: ${Math.round(total)}W! Consider turning off high-power devices like heaters or ovens.`,
      })
    } else if (total >= 1000) {
      setNotification({
        show: true,
        level: "high",
        message: `⚡ High Power Usage: ${Math.round(total)}W. Monitor your energy consumption to avoid excessive costs.`,
      })
    } else {
      setNotification({ show: false, level: null, message: "" })
    }
  }, [devices])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) setTimeOfDay("morning")
    else if (hour >= 12 && hour < 17) setTimeOfDay("afternoon")
    else if (hour >= 17 && hour < 21) setTimeOfDay("evening")
    else setTimeOfDay("night")
  }, [])

  const getUsageLevel = (wattage: number) => {
    if (wattage < 500) return { label: "Low", color: "text-green-500", bg: "bg-green-500/10" }
    if (wattage < 1000) return { label: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500/10" }
    if (wattage < 1500) return { label: "High", color: "text-orange-500", bg: "bg-orange-500/10" }
    return { label: "Very High", color: "text-red-500", bg: "bg-red-500/10" }
  }

  const usageLevel = getUsageLevel(totalWattage)

  const persistDeviceStates = (devices: Device[]) => {
    const states = devices.reduce(
      (acc, device) => {
        acc[device.id] = device.status
        return acc
      },
      {} as Record<string, string>,
    )
    localStorage.setItem("deviceStates", JSON.stringify(states))
  }

  const setDeviceStatus = (id: string, status: "on" | "off") => {
    setDevices((prevDevices) => {
      let changed = false
      const updated = prevDevices.map((device) => {
        if (device.id !== id) return device
        if (device.status === status) return device
        changed = true
        return {
          ...device,
          status,
          currentWattage: status === "on" ? device.baseWattage : 0,
        }
      })

      if (!changed) {
        return prevDevices
      }

      persistDeviceStates(updated)
      return updated
    })
  }

  const handleVoiceCommand = (command: string, action: string, target?: string) => {
    console.log("[v0] Voice command received:", { command, action, target })

    switch (action) {
      case "turn_on":
        if (target) {
          const device = devices.find((d) => d.id === target)
          if (device && device.status === "on") {
            console.log("[v0] Device is already on:", device.name)
          }
          setDeviceStatus(target, "on")
        }
        break
      case "turn_off":
        if (target) {
          const device = devices.find((d) => d.id === target)
          if (device && device.status === "off") {
            console.log("[v0] Device is already off:", device.name)
          }
          setDeviceStatus(target, "off")
        }
        break
      case "turn_off_all":
        setDevices((prevDevices) => {
          const updated = prevDevices.map((device) => {
            if (device.status === "on" && device.id !== "5" && device.id !== "7") {
              return {
                ...device,
                status: "off" as const,
                currentWattage: 0,
              }
            }
            return device
          })

          persistDeviceStates(updated)
          return updated
        })
        break

      case "turn_on_all":
        setDevices((prevDevices) => {
          const updated = prevDevices.map((device) => {
            if (device.status === "off") {
              return {
                ...device,
                status: "on" as const,
                currentWattage: device.baseWattage,
              }
            }
            return device
          })

          persistDeviceStates(updated)
          return updated
        })
        break
      case "query_usage":
        setShowUsageModal(true)
        break
      // case "show_energy_hogs":
      //   const topDevices = devices
      //     .filter((d) => d.status === "on")
      //     .sort((a, b) => b.currentWattage - a.currentWattage)
      //     .slice(0, 5)
      //     .map((d) => `${d.name}: ${d.currentWattage}W`)
      //     .join("\n")
      //   alert(`Top energy consumers:\n${topDevices}`)
      //   break
      case "show_energy_hogs":
        const n = 3;
        // If your schema uses `on: boolean`, use d.on. If it's a string, keep your check.
        const isOn = (d: any) => (typeof d.on === "boolean" ? d.on : d.status === "on");
        const watts = (d: any) => Number.isFinite(d.currentWattage) ? d.currentWattage : 0;
      
        const top = [...devices]
          .filter((d) => isOn(d) && watts(d) > 0)
          .sort((a, b) => watts(b) - watts(a))
          .slice(0, n);
      
        if (top.length === 0) {
          alert("No active devices drawing power right now.");
          break;
        }
      
        const fmt = new Intl.NumberFormat();
        const msg = top.map((d) => `${d.name}: ${fmt.format(watts(d))} W`).join("\n");
        alert(`Top power consumers (now):\n${msg}`);
        break;
            
      case "navigate":
        if (target === "room") router.push("/room")
        else if (target === "insights") router.push("/insights")
        else if (target === "dashboard") router.push("/")
        break
      case "set_goal":
        if (target) {
          localStorage.setItem("energyGoal", target)
          alert(`Goal set to ${target} kWh per day`)
        }
        break
    }
  }

  const getAdaptiveStyles = () => {
    switch (timeOfDay) {
      case "night":
        return {
          gradient: "from-slate-950 via-indigo-950 to-slate-950",
          emphasis: "Evening mode: Focus on lights and heater",
          highlightDevices: ["1", "2", "6"], // Lights and heater
        }
      case "morning":
        return {
          gradient: "from-slate-950 via-amber-950 to-slate-950",
          emphasis: "Morning mode: Monitor laptop and lights",
          highlightDevices: ["1", "3", "4"], // Lights and work devices
        }
      case "evening":
        return {
          gradient: "from-slate-950 via-purple-950 to-slate-950",
          emphasis: "Evening mode: Watch for high-power devices",
          highlightDevices: ["6", "9", "11"], // Heater and cooking
        }
      default:
        return {
          gradient: "from-slate-950 via-slate-900 to-slate-950",
          emphasis: "Standard monitoring mode",
          highlightDevices: [],
        }
    }
  }

  const adaptiveStyles = getAdaptiveStyles()

  const toggleDevice = (id: string) => {
    setDevices((prevDevices) => {
      const updated = prevDevices.map((device) =>
        device.id === id
          ? {
              ...device,
              status: device.status === "on" ? "off" : "on",
              currentWattage: device.status === "on" ? 0 : device.baseWattage,
            }
          : device,
      )

      persistDeviceStates(updated)

      return updated
    })
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${adaptiveStyles.gradient} p-4 md:p-8 transition-colors duration-1000`}
    >
      {notification.show && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full mx-4 ${
            notification.level === "very-high" ? "bg-red-500/95 border-red-400" : "bg-orange-500/95 border-orange-400"
          } border-2 rounded-lg shadow-2xl backdrop-blur animate-in slide-in-from-top duration-300`}
        >
          <div className="flex items-start gap-3 p-4">
            <AlertTriangle className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
            <p className="text-white font-semibold flex-1 text-balance">{notification.message}</p>
            <button
              onClick={() => setNotification({ show: false, level: null, message: "" })}
              className="text-white hover:bg-white/20 rounded p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <UsageInfoModal
        isOpen={showUsageModal}
        onClose={() => setShowUsageModal(false)}
        currentUsage={totalWattage}
        monthlyCost={monthlyCost}
        co2Impact={co2Impact}
      />

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center justify-center gap-3">
            <Zap className="h-10 w-10 text-yellow-400" />
            Smart Dorm Dashboard
          </h1>
          <p className="text-slate-400 text-lg">Real-time energy monitoring for your dorm room</p>
          <p className="text-slate-500 text-sm italic">{adaptiveStyles.emphasis}</p>
          <div className="pt-2">
            <Link href="/room">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Eye className="h-4 w-4 mr-2" />
                View Room
              </Button>
            </Link>
            <Link href="/insights" className="ml-2">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Target className="h-4 w-4 mr-2" />
                View Insights
              </Button>
            </Link>
          </div>
        </div>

        <VoiceControl onCommand={handleVoiceCommand} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">Current Usage</CardDescription>
              <CardTitle className="text-4xl font-bold text-white flex items-baseline gap-2">
                {totalWattage}
                <span className="text-xl text-slate-400">W</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`${usageLevel.bg} ${usageLevel.color} border-0`}>{usageLevel.label}</Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">Monthly Cost</CardDescription>
              <CardTitle className="text-4xl font-bold text-white flex items-baseline gap-2">
                ${monthlyCost}
                <span className="text-xl text-slate-400">/mo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">Based on $0.12/kWh</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">CO₂ Impact</CardDescription>
              <CardTitle className="text-4xl font-bold text-white flex items-baseline gap-2">
                {co2Impact}
                <span className="text-xl text-slate-400">lbs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">Per month</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Active Devices</CardTitle>
            <CardDescription className="text-slate-400">Click to toggle devices on/off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {devices.map((device) => (
                <button key={device.id} onClick={() => toggleDevice(device.id)} className="w-full group">
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      device.status === "on"
                        ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                        : "bg-slate-900/30 border-slate-800 hover:bg-slate-900/50 opacity-60"
                    } ${adaptiveStyles.highlightDevices.includes(device.id) ? "ring-2 ring-yellow-500/50" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${device.status === "on" ? device.color : "bg-slate-700"} text-white`}
                      >
                        {device.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">{device.name}</p>
                        <p className="text-sm text-slate-400">{device.status === "on" ? "Active" : "Off"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:block w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${device.status === "on" ? device.color : "bg-slate-700"} transition-all duration-500`}
                          style={{
                            width: `${device.status === "on" ? (device.currentWattage / device.baseWattage) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className={`text-2xl font-bold ${device.status === "on" ? "text-white" : "text-slate-600"}`}>
                          {device.currentWattage}
                        </p>
                        <p className="text-xs text-slate-500">watts</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SDGPanel kwhUsed={(totalWattage / 1000) * 24} co2Saved={co2Impact} />
          <UserTasks currentUsage={totalWattage} />
        </div>

        <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">💡 Energy Saving Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300">
              <li>• Turn off your space heater when leaving the room - it uses 1500W!</li>
              <li>• Unplug chargers when not in use to eliminate phantom power draw</li>
              <li>• Use natural light during the day to reduce lighting costs</li>
              <li>• Your current setup costs ${monthlyCost}/month - small changes add up!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
