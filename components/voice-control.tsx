"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle } from "lucide-react"

interface VoiceControlProps {
  onCommand: (command: string, action: string, target?: string) => void
}

export function VoiceControl({ onCommand }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [feedback, setFeedback] = useState("")
  const [recognition, setRecognition] = useState<any>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt" | "checking">("checking")
  const [manualCommand, setManualCommand] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (!SpeechRecognition) {
        setIsSupported(false)
        setMicPermission("denied")
        return
      }

      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript.toLowerCase()
        setTranscript(speechResult)
        processCommand(speechResult)
      }

      recognitionInstance.onerror = (event: any) => {
        console.error("[v0] Speech recognition error:", event.error)

        if (event.error === "audio-capture") {
          setFeedback("Microphone access denied or unavailable. Please check your browser permissions.")
          setMicPermission("denied")
        } else if (event.error === "not-allowed") {
          setFeedback("Microphone permission denied. Please allow microphone access in your browser settings.")
          setMicPermission("denied")
        } else if (event.error === "no-speech") {
          setFeedback("No speech detected. Please try again.")
        } else {
          setFeedback(`Error: ${event.error}. Please try again.`)
        }

        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
      checkMicrophonePermission()
    }
  }, [])

  const checkMicrophonePermission = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: "microphone" as PermissionName })
        setMicPermission(result.state as "granted" | "denied" | "prompt")

        result.onchange = () => {
          setMicPermission(result.state as "granted" | "denied" | "prompt")
        }
      } else {
        setMicPermission("prompt")
      }
    } catch (error) {
      console.error("[v0] Error checking microphone permission:", error)
      setMicPermission("prompt")
    }
  }

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      setMicPermission("granted")
      setFeedback("Microphone access granted! Click 'Start Listening' to begin.")
      return true
    } catch (error) {
      console.error("[v0] Microphone permission denied:", error)
      setMicPermission("denied")
      setFeedback("Microphone access denied. Please check your browser settings.")
      return false
    }
  }

  const normalize = (s: string) =>
    s.toLowerCase()
     .replace(/_/g, " ")
     .replace(/[^a-z0-9\s]/g, " ")
     .replace(/\s+/g, " ")
     .trim();

  const processCommand = useCallback(
    (comm: string) => {
      console.log("[v0] Processing voice command:", comm)
      console.log("[v0] Voice command received:", JSON.stringify({ comm, action: "processing" }))

      const command = normalize(comm);

      const deviceNames = [
        "ceiling lights",
        "lights",
        "desk lamp",
        "lamp",
        "laptop",
        "monitor",
        "fridge",
        "heater",
        "space heater",
        "router",
        "wifi",
        "charger",
        "phone charger",
        "oven",
        "rice cooker",
        "stove",
        "air conditioner",
        "ac",
      ]

      if (command.includes("turn on") || command.includes("switch on") || command.includes("start")) {
        for (const device of deviceNames) {
          if (command.includes(device)) {
            const deviceId = getDeviceId(device)
            if (deviceId) {
              console.log(
                "[v0] Voice command received:",
                JSON.stringify({ command, action: "turn_on", target: deviceId }),
              )
              onCommand(command, "turn_on", deviceId)
              setFeedback(`Turning on ${device}`)
              speak(`Turning on ${device}`)
              return
            }
          }
        }
      }

      if (command.includes("turn off") || command.includes("switch off") || command.includes("stop")) {
        for (const device of deviceNames) {
          if (command.includes(device)) {
            const deviceId = getDeviceId(device)
            if (deviceId) {
              console.log(
                "[v0] Voice command received:",
                JSON.stringify({ command, action: "turn_off", target: deviceId }),
              )
              onCommand(command, "turn_off", deviceId)
              setFeedback(`Turning off ${device}`)
              speak(`Turning off ${device}`)
              return
            }
          }
        }
      }

      // if (
      //   command.includes("turn off all") ||
      //   command.includes("turn off all devices") ||
      //   command.includes("turn everything off") ||
      //   command.includes("leaving room")
      // ) {
      //   console.log("[v0] Voice command received:", JSON.stringify({ command, action: "turn_off_all" }))
      //   onCommand(command, "turn_off_all")
      //   setFeedback("Turning off all non-essential devices")
      //   speak("Turning off all non-essential devices")
      //   return
      // }

      // if (
      //   command.includes("turn on all") ||
      //   command.includes("turn on all devices") ||
      //   command.includes("turn everything on")
      
      // ) {
      //   console.log("[v0] Voice command received:", JSON.stringify({ command, action: "turn_on_all" }))
      //   onCommand(command, "turn_on_all")
      //   setFeedback("Turning on all  devices")
      //   speak("Turning on all  devices")
      //   return
      // }

      if (
        /\b(turn|switch)\s+(?:everything\s+)?off\b/.test(command) ||
        /\b(turn|switch)\s+off\s+all\b/.test(command) ||
        /\b(power|shut)\s*down\s+all\b/.test(command) ||
        /\bleaving\s+room\b/.test(command) ||
        /\bturn\s+off\s+all\s+(?:the\s+|of\s+the\s+)?(devices|appliances|things)\b/.test(command)
      ) {
        onCommand(comm, "turn_off_all");
        setFeedback("Turning off all non-essential devices");
        speak("Turning off all non-essential devices");
        return;
      }
    
      // Global ON  (covers “turn on everything”, “turn everything on”, “turn on all (the/of the) devices”)
      if (
        /\b(turn|switch)\s+on\s+everything\b/.test(command) ||
        /\b(turn|switch)\s+everything\s+on\b/.test(command) ||
        /\bturn\s+on\s+all\b/.test(command) ||
        /\bturn\s+on\s+all\s+(?:the\s+|of\s+the\s+)?(devices|appliances|things)\b/.test(command) ||
        /\bturn\s+everything\s+on\b/.test(command)
      ) {
        onCommand(comm, "turn_on_all");
        setFeedback("Turning on all devices");
        speak("Turning on all devices");
        return;
      }

      if (
        command.includes("what") &&
        (command.includes("usage") || command.includes("using") || command.includes("power"))
      ) {
        console.log("[v0] Voice command received:", JSON.stringify({ command, action: "query_usage" }))
        onCommand(command, "query_usage")
        setFeedback("Checking current usage...")
        return
      }

      if (
        command.includes("show") &&
        (command.includes("energy hogs") || command.includes("high power") || command.includes("most power"))
      ) {
        console.log("[v0] Voice command received:", JSON.stringify({ command, action: "show_energy_hogs" }))
        onCommand(command, "show_energy_hogs")
        setFeedback("Showing highest power devices")
        speak("Showing highest power devices")
        return
      }

      if (command.includes("go to") || command.includes("show") || command.includes("open")) {
        if (command.includes("dashboard") || command.includes("home")) {
          console.log(
            "[v0] Voice command received:",
            JSON.stringify({ command, action: "navigate", target: "dashboard" }),
          )
          onCommand(command, "navigate", "dashboard")
          setFeedback("Going to dashboard")
          speak("Going to dashboard")
          return
        }
        if (command.includes("room") || command.includes("room view")) {
          console.log("[v0] Voice command received:", JSON.stringify({ command, action: "navigate", target: "room" }))
          onCommand(command, "navigate", "room")
          setFeedback("Going to room view")
          speak("Going to room view")
          return
        }
        if (command.includes("insights") || command.includes("analytics")) {
          console.log(
            "[v0] Voice command received:",
            JSON.stringify({ command, action: "navigate", target: "insights" }),
          )
          onCommand(command, "navigate", "insights")
          setFeedback("Going to insights")
          speak("Going to insights")
          return
        }
      }

      if (/\bset\s+(?:my\s+)?goal\b/.test(command)) {
        const numbers = command.match(/\d+/)
        if (numbers) {
          console.log(
            "[v0] Voice command received:",
            JSON.stringify({ command, action: "set_goal", target: numbers[0] }),
          )
          onCommand(command, "set_goal", numbers[0])
          setFeedback(`Setting goal to ${numbers[0]} kWh`)
          speak(`Setting goal to ${numbers[0]} kilowatt hours`)
          return
        }
      }

      if (command.includes("help") || command.includes("what can you do")) {
        setFeedback("Try: 'Turn off heater', 'What's my usage?', 'Go to room', 'Turn off all devices'")
        speak("You can control devices, check usage, navigate pages, or set goals")
        return
      }

      setFeedback("Command not recognized. Say 'help' for available commands.")
      speak("Sorry, I didn't understand that command")
    },
    [onCommand],
  )

  const getDeviceId = (deviceName: string): string | null => {
    const deviceMap: Record<string, string> = {
      "ceiling lights": "1",
      lights: "1",
      "desk lamp": "2",
      lamp: "2",
      laptop: "3",
      monitor: "4",
      fridge: "5",
      "mini fridge": "5",
      "space heater": "6",
      heater: "6",
      wifi: "7",
      router: "7",
      "wifi router": "7",
      "phone charger": "8",
      charger: "8",
      oven: "9",
      "rice cooker": "10",
      stove: "11",
      "air conditioner": "12",
      ac: "12",
    }
    return deviceMap[deviceName] || null
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.1
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleListening = async () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      if (micPermission !== "granted") {
        const granted = await requestMicrophonePermission()
        if (!granted) return
      }

      try {
        setTranscript("")
        setFeedback("Listening...")
        recognition.start()
        setIsListening(true)
      } catch (error) {
        console.error("[v0] Error starting recognition:", error)
        setFeedback("Failed to start listening. Please check microphone permissions.")
      }
    }
  }

  if (!isSupported) {
    return (
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur p-4">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">Voice control is not supported in your browser. Try Chrome or Edge.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-purple-950/80 via-indigo-950/70 to-slate-950/80 border-purple-900/60 shadow-lg backdrop-blur">
      <div className="p-4 space-y-4 text-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-purple-300" />
            <h3 className="text-slate-100 font-semibold">Voice Control</h3>
            {micPermission === "granted" && (
              <CheckCircle className="h-4 w-4 text-emerald-300" title="Microphone access granted" />
            )}
            {micPermission === "denied" && (
              <AlertCircle className="h-4 w-4 text-rose-400" title="Microphone access denied" />
            )}
          </div>
          <Button
            onClick={toggleListening}
            className={`${
              isListening ? "bg-rose-600 hover:bg-rose-700 animate-pulse" : "bg-purple-600 hover:bg-purple-700"
            }`}
            size="sm"
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Listening
              </>
            )}
          </Button>
        </div>

        {micPermission === "denied" && (
          <div className="bg-rose-950/60 border border-rose-700/60 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-rose-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-rose-100 text-sm font-semibold mb-1">Microphone Access Required</p>
                <p className="text-rose-200/80 text-xs">
                  Please allow microphone access in your browser settings to use voice control. Click the lock icon in
                  the address bar and enable microphone permissions.
                </p>
              </div>
            </div>
          </div>
        )}

        {isListening && (
          <div className="bg-purple-900/60 border border-purple-700/60 rounded-lg p-3 animate-pulse">
            <p className="text-purple-100 text-sm flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Listening... Speak now
            </p>
          </div>
        )}

        {transcript && (
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">You said:</p>
            <p className="text-slate-100 text-sm">{transcript}</p>
          </div>
        )}

        {feedback && (
          <div className="bg-indigo-950/50 border border-indigo-700/60 rounded-lg p-3">
            <p className="text-indigo-100 text-sm">{feedback}</p>
          </div>
        )}

        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/70">
          <p className="text-xs text-slate-300 mb-2">Try saying:</p>
          <ul className="text-xs text-slate-200 space-y-1">
            <li>• "Turn off the heater"</li>
            <li>• "What's my current usage?"</li>
            <li>• "Go to room view"</li>
            <li>• "Turn off all devices"</li>
            <li>• "Set goal to 5"</li>
          </ul>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!manualCommand.trim()) return
            const command = manualCommand.trim()
            setTranscript(command.toLowerCase())
            processCommand(command)
            setManualCommand("")
          }}
          className="space-y-2"
        >
          <label className="block text-xs text-slate-300" htmlFor="manual-command">
            Prefer typing? Enter a command:
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="manual-command"
              value={manualCommand}
              onChange={(event) => setManualCommand(event.target.value)}
              placeholder='e.g. "turn off heater" or "show energy hogs"'
              className="bg-slate-950/70 border-purple-800/70 text-slate-100 placeholder:text-slate-500"
            />
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 sm:w-32">
              Send
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
