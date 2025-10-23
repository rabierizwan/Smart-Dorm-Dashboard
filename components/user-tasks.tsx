import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Target } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
}

interface UserTasksProps {
  currentUsage: number
  onTaskComplete?: (taskId: string) => void
}

export function UserTasks({ currentUsage, onTaskComplete }: UserTasksProps) {
  const tasks: Task[] = [
    {
      id: "t1",
      title: "Task 1: Efficient Usage",
      description: "Reduce usage below 600W without turning off the fridge",
      completed: currentUsage < 600 && currentUsage > 0,
    },
    {
      id: "t2",
      title: "Task 2: Identify Energy Hogs",
      description: "Identify the top 2 energy-consuming devices and turn one off",
      completed: false,
    },
    {
      id: "t3",
      title: "Task 3: Set Realistic Goals",
      description: "Use Insights page to set a daily kWh target and estimate monthly savings",
      completed: false,
    },
  ]

  return (
    <Card className="bg-gradient-to-br from-purple-950/80 via-indigo-950/70 to-slate-950/80 border-purple-800/60 shadow-lg backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-400" />
          User Study Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-slate-300 text-sm mb-4">Complete these tasks to evaluate the dashboard's effectiveness</p>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
              task.completed
                ? "bg-emerald-900/50 border-emerald-600/60"
                : "bg-slate-900/60 border-slate-700/70"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              ) : (
                <Circle className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-slate-100 font-medium text-sm">{task.title}</p>
                {task.completed && (
                  <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 text-xs">
                    Complete
                  </Badge>
                )}
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">{task.description}</p>
            </div>
          </div>
        ))}
        <div className="bg-indigo-950/50 border border-indigo-700/60 rounded-lg p-3 mt-4">
          <p className="text-indigo-200 text-xs">
            📊 These tasks help measure completion time, errors, and user satisfaction for HCI evaluation
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
