"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Zap, AlertTriangle, X, Target } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SDGPanel } from "@/components/sdg-panel"
import { UserTasks } from "@/components/user-tasks"
import { VoiceControl } from "@/components/voice-control"
import { UsageInfoModal } from "@/components/usage-info-modal"

interface Device {
  id: string
  name: string
  status: "on" | "off"
  position: { x: string; y: string }
  size: { w: string; h: string }
}

export default function RoomView() {
  const [devices, setDevices] = useState<Device[]>([
    { id: "1", name: "Ceiling Lights", status: "on", position: { x: "50%", y: "8%" }, size: { w: "80px", h: "80px" } },
    { id: "2", name: "Desk Lamp", status: "on", position: { x: "72%", y: "48%" }, size: { w: "60px", h: "60px" } },
    { id: "3", name: "Laptop", status: "on", position: { x: "65%", y: "58%" }, size: { w: "100px", h: "70px" } },
    { id: "4", name: "Monitor", status: "on", position: { x: "55%", y: "42%" }, size: { w: "120px", h: "90px" } },
    { id: "5", name: "Mini Fridge", status: "on", position: { x: "12%", y: "55%" }, size: { w: "90px", h: "140px" } },
    { id: "6", name: "Space Heater", status: "off", position: { x: "82%", y: "78%" }, size: { w: "70px", h: "70px" } },
    { id: "7", name: "WiFi Router", status: "on", position: { x: "88%", y: "32%" }, size: { w: "50px", h: "50px" } },
    { id: "8", name: "Phone Charger", status: "on", position: { x: "78%", y: "62%" }, size: { w: "40px", h: "40px" } },
    { id: "9", name: "Oven", status: "off", position: { x: "28%", y: "72%" }, size: { w: "110px", h: "100px" } },
    { id: "10", name: "Rice Cooker", status: "off", position: { x: "45%", y: "75%" }, size: { w: "70px", h: "70px" } },
    { id: "11", name: "Stove", status: "off", position: { x: "28%", y: "50%" }, size: { w: "100px", h: "90px" } },
    {
      id: "12",
      name: "Air Conditioner",
      status: "off",
      position: { x: "88%", y: "15%" },
      size: { w: "90px", h: "70px" },
    },
  ])

  const router = useRouter()

  // Sync with localStorage
  useEffect(() => {
    const stored = localStorage.getItem("deviceStates")
    if (stored) {
      const states = JSON.parse(stored)
      setDevices((prev) =>
        prev.map((device) => ({
          ...device,
          status: states[device.id] || device.status,
        })),
      )
    }
  }, [])

  const toggleDevice = (id: string) => {
    setDevices((prev) => {
      const updated = prev.map((device) =>
        device.id === id ? { ...device, status: device.status === "on" ? "off" : "on" } : device,
      )

      // Save to localStorage
      const states = updated.reduce(
        (acc, device) => {
          acc[device.id] = device.status
          return acc
        },
        {} as Record<string, string>,
      )
      localStorage.setItem("deviceStates", JSON.stringify(states))

      return updated
    })
  }

  const getDeviceColor = (device: Device) => {
    if (device.status === "off") return "bg-slate-700 border-slate-600"

    switch (device.id) {
      case "1":
      case "2":
        return "bg-yellow-400 border-yellow-300 shadow-yellow-400/50"
      case "3":
      case "4":
        return "bg-blue-400 border-blue-300 shadow-blue-400/50"
      case "5":
        return "bg-cyan-400 border-cyan-300 shadow-cyan-400/50"
      case "6":
        return "bg-red-500 border-red-400 shadow-red-500/50"
      case "7":
        return "bg-purple-400 border-purple-300 shadow-purple-400/50"
      case "8":
        return "bg-green-400 border-green-300 shadow-green-400/50"
      case "9":
        return "bg-orange-600 border-orange-500 shadow-orange-600/50"
      case "10":
        return "bg-amber-500 border-amber-400 shadow-amber-500/50"
      case "11":
        return "bg-red-600 border-red-500 shadow-red-600/50"
      case "12":
        return "bg-sky-500 border-sky-400 shadow-sky-500/50"
      default:
        return "bg-slate-400 border-slate-300"
    }
  }

  const getDeviceIcon = (device: Device) => {
    switch (device.id) {
      case "1":
        return device.status === "on" ? "💡" : "🔌"
      case "2":
        return device.status === "on" ? "🔦" : "🔌"
      case "3":
        return "💻"
      case "4":
        return "🖥️"
      case "5":
        return "🧊"
      case "6":
        return device.status === "on" ? "🔥" : "❄️"
      case "7":
        return device.status === "on" ? "📡" : "📴"
      case "8":
        return device.status === "on" ? "🔋" : "🪫"
      case "9":
        return device.status === "on" ? "🔥" : "🍳"
      case "10":
        return device.status === "on" ? "🍚" : "🍚"
      case "11":
        return device.status === "on" ? "🔥" : "🍳"
      case "12":
        return device.status === "on" ? "❄️" : "🌡️"
      default:
        return "⚡"
    }
  }

  const [notification, setNotification] = useState<{
    show: boolean
    level: "high" | "very-high" | null
    message: string
  }>({
    show: false,
    level: null,
    message: "",
  })

  const [totalWattage, setTotalWattage] = useState(0)
  const [showUsageModal, setShowUsageModal] = useState(false)
  const [monthlyCost, setMonthlyCost] = useState(0)
  const [co2Impact, setCo2Impact] = useState(0)

  useEffect(() => {
    const deviceWattages: Record<string, number> = {
      "1": 60,
      "2": 15,
      "3": 65,
      "4": 35,
      "5": 100,
      "6": 1500,
      "7": 12,
      "8": 5,
      "9": 2400,
      "10": 350,
      "11": 1800,
      "12": 1200,
    }

    const total = devices.reduce((sum, device) => {
      return sum + (device.status === "on" ? deviceWattages[device.id] || 0 : 0)
    }, 0)

    setTotalWattage(total)

    const monthlyKwh = (total / 1000) * 24 * 30
    setMonthlyCost(Math.round(monthlyKwh * 0.12 * 100) / 100)
    setCo2Impact(Math.round(monthlyKwh * 0.92 * 10) / 10)

    if (total >= 1500) {
      setNotification({
        show: true,
        level: "very-high",
        message: `⚠️ Very High Power Usage: ${total}W! Consider turning off high-power devices.`,
      })
    } else if (total >= 1000) {
      setNotification({
        show: true,
        level: "high",
        message: `⚡ High Power Usage: ${total}W. Monitor your energy consumption.`,
      })
    } else {
      setNotification({ show: false, level: null, message: "" })
    }
  }, [devices])

  const handleVoiceCommand = (command: string, action: string, target?: string) => {
    console.log("[v0] Voice command received:", { command, action, target })

    switch (action) {
      case "turn_on":
        if (target) {
          const device = devices.find((d) => d.id === target)
          if (device && device.status === "off") {
            toggleDevice(target)
          } else if (device && device.status === "on") {
            console.log("[v0] Device is already on:", device.name)
          }
        }
        break
      case "turn_off":
        if (target) {
          const device = devices.find((d) => d.id === target)
          if (device && device.status === "on") {
            toggleDevice(target)
          } else if (device && device.status === "off") {
            console.log("[v0] Device is already off:", device.name)
          }
        }
        break
      case "turn_off_all":
        setDevices((prev) => {
          const updated = prev.map((device) => {
            if (device.status === "on" && device.id !== "5" && device.id !== "7") {
              return { ...device, status: "off" as const }
            }
            return device
          })

          const states = updated.reduce(
            (acc, device) => {
              acc[device.id] = device.status
              return acc
            },
            {} as Record<string, string>,
          )
          localStorage.setItem("deviceStates", JSON.stringify(states))

          return updated
        })
        break
      case "query_usage":
        setShowUsageModal(true)
        break
      case "navigate":
        if (target === "dashboard") router.push("/")
        else if (target === "insights") router.push("/insights")
        else if (target === "room") router.push("/room")
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
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

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="bg-slate-800 border-slate-700 hover:bg-slate-700">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-400" />
                Dorm Room View
              </h1>
              <p className="text-slate-400">Click on devices to toggle them on/off</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">View Dashboard</Button>
            </Link>
            <Link href="/insights">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Target className="h-4 w-4 mr-2" />
                View Insights
              </Button>
            </Link>
          </div>
        </div>

        {/* Room Container */}
        <div className="relative w-full aspect-video bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl">
          {/* Room Background Elements */}
          <div className="absolute inset-0">
            {/* Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-900/20 to-transparent" />

            {/* Window */}
            <div className="absolute top-8 right-8 w-32 h-40 bg-sky-400/20 border-4 border-slate-600 rounded-lg">
              <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1">
                <div className="bg-sky-300/10 border border-slate-600" />
                <div className="bg-sky-300/10 border border-slate-600" />
                <div className="bg-sky-300/10 border border-slate-600" />
                <div className="bg-sky-300/10 border border-slate-600" />
              </div>
            </div>

            {/* Desk */}
            <div className="absolute bottom-16 right-1/4 w-64 h-24 bg-amber-800/40 border-2 border-amber-900/60 rounded-t-lg" />

            {/* Bed */}
            <div className="absolute bottom-16 left-8 w-48 h-32 bg-indigo-900/40 border-2 border-indigo-800/60 rounded-lg" />

            {/* Kitchen Counter */}
            <div className="absolute bottom-20 left-1/4 w-40 h-20 bg-stone-700/40 border-2 border-stone-800/60 rounded-t-lg" />
          </div>

          {/* Devices */}
          {devices.map((device) => (
            <button
              key={device.id}
              onClick={() => toggleDevice(device.id)}
              className="absolute group cursor-pointer transition-transform hover:scale-110 active:scale-95"
              style={{
                left: device.position.x,
                top: device.position.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`relative rounded-lg border-2 transition-all duration-300 ${getDeviceColor(device)} ${
                  device.status === "on" ? "shadow-lg" : ""
                }`}
                style={{
                  width: device.size.w,
                  height: device.size.h,
                }}
              >
                {/* Device Icon/Representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`${device.id === "3" || device.id === "4" || device.id === "9" || device.id === "11" ? "text-4xl" : device.id === "5" ? "text-5xl" : device.id === "1" || device.id === "6" || device.id === "12" ? "text-4xl" : device.id === "2" || device.id === "7" || device.id === "10" ? "text-3xl" : "text-2xl"}`}
                  >
                    {getDeviceIcon(device)}
                  </div>
                </div>

                {/* Glow effect when on */}
                {device.status === "on" && (
                  <div className="absolute inset-0 rounded-lg animate-pulse opacity-50 blur-sm bg-current" />
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-700 pointer-events-none z-10">
                {device.name} - {device.status === "on" ? "ON" : "OFF"}
              </div>
            </button>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-2 font-semibold">Device Status</p>
            <div className="flex gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-400" />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-slate-700" />
                <span>Off</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Control */}
        <VoiceControl onCommand={handleVoiceCommand} />

        {/* SDG Panel and User Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SDGPanel kwhUsed={(totalWattage / 1000) * 24} co2Saved={(totalWattage / 1000) * 24 * 30 * 0.92} />
          <UserTasks currentUsage={totalWattage} />
        </div>

        {/* Instructions */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 backdrop-blur">
          <h3 className="text-white font-semibold mb-2">How to use:</h3>
          <ul className="text-slate-400 text-sm space-y-1">
            <li>• Click on any device in the room to toggle it on or off</li>
            <li>• Active devices glow with their characteristic color</li>
            <li>• Switch to the Dashboard view to see real-time energy consumption</li>
            <li>• Device states are synchronized between both views</li>
          </ul>
        </div>
      </div>

      {/* Usage Info Modal */}
      <UsageInfoModal
        isOpen={showUsageModal}
        onClose={() => setShowUsageModal(false)}
        currentUsage={totalWattage}
        monthlyCost={monthlyCost}
        co2Impact={co2Impact}
      />
    </div>
  )
}
