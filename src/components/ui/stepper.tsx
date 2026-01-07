'use client'

import { Check } from 'lucide-react'
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
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Mobile: Simple current step indicator */}
      <div className="block md:hidden mb-6">
        <div className="bg-black/30 border border-red-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-red-300/70">
                Etapa {currentStep} de {steps.length}
              </div>
              <div className="font-medium text-white">
                {steps.find(s => s.id === currentStep)?.title}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Simple horizontal stepper */}
      <div className="hidden md:flex items-center justify-center mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = step.completed

            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                      "text-sm font-medium",
                      isActive && "border-red-500 bg-red-500 text-white",
                      isCompleted && !isActive && "border-green-500 bg-green-500 text-white",
                      !isActive && !isCompleted && "border-gray-600 bg-gray-800 text-gray-300"
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="w-5 h-5" />
                    ) : isActive ? (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    ) : (
                      step.id
                    )}
                  </div>
                  
                  {/* Step Title */}
                  <div className="mt-2 text-center">
                    <div
                      className={cn(
                        "text-xs font-medium transition-colors duration-200",
                        isActive && "text-red-300",
                        isCompleted && "text-green-300",
                        !isActive && !isCompleted && "text-gray-400"
                      )}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-px mx-4 transition-colors duration-200 -mt-6",
                      "w-16",
                      step.completed ? "bg-red-500" : "bg-gray-600"
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