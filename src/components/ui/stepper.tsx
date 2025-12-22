'use client'

import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepItem {
  id: number
  title: string
  description?: string
  completed: boolean
  valid: boolean
}

interface StepperProps {
  steps: StepItem[]
  currentStep: number
  onStepClick?: (stepId: number) => void
  className?: string
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Mobile: Dropdown/Current step indicator */}
      <div className="block md:hidden mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">
                Etapa {currentStep} de {steps.length}
              </div>
              <div className="font-medium">
                {steps.find(s => s.id === currentStep)?.title}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {steps.filter(s => s.completed).length} concluídas
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Horizontal stepper */}
      <div className="hidden md:flex items-center justify-center mb-8">
        <div className="flex items-center space-x-1">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = step.completed
            const isPast = step.id < currentStep
            const isClickable = onStepClick && (isPast || isCompleted)

            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "flex flex-col items-center transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isClickable && "cursor-pointer hover:scale-105",
                    !isClickable && "cursor-default"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                      "text-sm font-medium",
                      isActive && "border-primary bg-primary text-primary-foreground shadow-lg",
                      isCompleted && "border-primary bg-primary text-primary-foreground",
                      !isActive && !isCompleted && "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="w-5 h-5" />
                    ) : isActive ? (
                      <Circle className="w-5 h-5 fill-current" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center min-w-[80px]">
                    <div
                      className={cn(
                        "text-xs font-medium transition-colors duration-200",
                        isActive && "text-primary",
                        isCompleted && "text-foreground",
                        !isActive && !isCompleted && "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </div>
                  </div>
                </button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-px mx-4 transition-colors duration-200",
                      "w-12 lg:w-16",
                      step.completed ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}