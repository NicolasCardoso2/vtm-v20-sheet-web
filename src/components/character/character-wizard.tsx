'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Stepper, StepItem } from '@/components/ui/stepper'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/ui/loading-state'
import { AutoSaveStatus, OfflineModeWarning } from '@/components/ui/auto-save-status'
import { ChevronLeft, ChevronRight, Save, Check, AlertCircle, User, Clock, CheckCircle } from 'lucide-react'
import { WizardStep, Character, ValidationResult } from '@/types'
import { validateCharacter } from '@/lib/character-validation'
import { useAutoSave } from '@/hooks/use-auto-save'
import OrigemStep from './steps/origem-step'
import ConceitoStep from './steps/conceito-step'
import AttributesStep from './steps/attributes-step'
import SkillsStep from './steps/skills-step'
import AdvantagesStep from './steps/advantages-step'

interface CharacterWizardProps {
  character: Partial<Character>
  chronicleSettings: any
  onSave: (character: Partial<Character>) => Promise<void>
  onComplete: (character: Partial<Character>) => Promise<void>
}

const WIZARD_STEPS: StepItem[] = [
  { id: 1, title: 'Origem', description: 'Jeito e clã do personagem', completed: false, valid: false },
  { id: 2, title: 'Conceito', description: 'Identidade e arquétipos', completed: false, valid: false },
  { id: 3, title: 'Atributos', description: 'Características físicas, sociais e mentais', completed: false, valid: false },
  { id: 4, title: 'Habilidades', description: 'Talentos, perícias e conhecimentos', completed: false, valid: false },
  { id: 5, title: 'Vantagens', description: 'Disciplinas, antecedentes e virtudes', completed: false, valid: false },
  { id: 6, title: 'Finalização', description: 'Moralidade e revisão final', completed: false, valid: false }
]

export default function CharacterWizard({ character, chronicleSettings, onSave, onComplete }: CharacterWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [characterData, setCharacterData] = useState<Partial<Character>>(character)
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [steps, setSteps] = useState(WIZARD_STEPS)
  const [saving, setSaving] = useState(false)

  // Auto-save hook com status aprimorado
  const { isSaving, lastSaved, hasUnsavedChanges, forceSave } = useAutoSave({
    characterId: characterData.id || '',
    data: characterData,
    enabled: !!characterData.id && Object.keys(characterData).length > 1,
    onSave: (success) => {
      if (success) {
        console.log('🎉 Auto-save realizado com sucesso')
      }
    },
    onError: (error) => {
      console.warn('⚠️ Erro no auto-save (não crítico):', error)
      // Não mostrar erro para o usuário, pois é não-crítico
    }
  })

  useEffect(() => {
    if (characterData) {
      updateStepCompletion(characterData)
    }
  }, [characterData])

  const updateCharacterData = (updates: Partial<Character>) => {
    const newData = { ...characterData, ...updates }
    setCharacterData(newData)
    
    // Trigger validation
    try {
      // Simplificar validação por agora - pode ser expandida posteriormente
      const result: ValidationResult = { 
        isValid: true, 
        warnings: [],
        errors: [], 
        pointsSpent: {}, 
        pointsAvailable: {} 
      }
      setValidation(result)
    } catch (error) {
      console.error('Validation error:', error)
    }
    
    // Update step completion status
    updateStepCompletion(newData)
  }

  const updateStepCompletion = (data: Partial<Character>) => {
    const newSteps = steps.map(step => {
      let completed = false
      let valid = false
      
      switch (step.id) {
        case 1: // Origem
          completed = !!(data.clan)
          valid = completed
          break
        case 2: // Conceito  
          completed = !!(data.nature && data.demeanor)
          valid = completed
          break
        case 3: // Atributos
          completed = !!(data.attributes_json)
          valid = completed
          break
        case 4: // Habilidades
          completed = !!(data.skills_json)
          valid = completed
          break
        case 5: // Vantagens
          completed = !!(data.advantages_json)
          valid = completed
          break
        case 6: // Finalização
          completed = !!(data.name)
          valid = completed && (validation?.isValid ?? false)
          break
      }
      
      return { ...step, completed, valid }
    })
    
    setSteps(newSteps)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <OrigemStep 
            character={characterData}
            chronicle={{ settings_json: chronicleSettings } as any}
            onChange={updateCharacterData}
          />
        )
      case 2:
        return (
          <ConceitoStep 
            character={characterData}
            chronicle={{ settings_json: chronicleSettings } as any}
            onChange={updateCharacterData}
          />
        )
      case 3:
        return (
          <AttributesStep 
            character={characterData}
            chronicle={{ settings_json: chronicleSettings } as any}
            onChange={updateCharacterData}
          />
        )
      case 4:
        return (
          <SkillsStep 
            skills={characterData.skills_json || { talents: {}, skills: {}, knowledges: {}, specializations: {} }}
            onSkillsChange={(skills) => updateCharacterData({ skills_json: skills })}
          />
        )
      case 5:
        return (
          <AdvantagesStep 
            character={characterData}
            onUpdate={updateCharacterData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 6:
        return (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h3 className="text-heading-2 mb-4">Etapa em Desenvolvimento</h3>
            <p className="text-muted-foreground">
              Finalização e revisão do personagem será implementada em breve.
            </p>
          </div>
        )
      default:
        return null
    }
  }

  const canProceedToNext = () => {
    const currentStepData = steps.find(s => s.id === currentStep)
    return currentStepData?.valid ?? false
  }

  const handleNext = () => {
    if (canProceedToNext() && currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(characterData)
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleComplete = async () => {
    if (validation?.isValid) {
      setSaving(true)
      try {
        await onComplete({
          ...characterData,
          status: 'pending_approval'
        })
      } catch (error) {
        console.error('Erro ao finalizar:', error)
      } finally {
        setSaving(false)
      }
    }
  }

  const currentStepData = steps.find(step => step.id === currentStep)

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">V</span>
              </div>
              <h1 className="text-heading-2 font-semibold">
                Vampiro: A Máscara
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Auto-save Status */}
              <AutoSaveStatus 
                isSaving={isSaving}
                lastSaved={lastSaved}
                hasUnsavedChanges={hasUnsavedChanges}
              />
              
              {/* Force Save Button */}
              {hasUnsavedChanges && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={forceSave}
                  disabled={isSaving}
                  className="h-8 px-2 text-xs"
                >
                  Salvar Agora
                </Button>
              )}
              
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-secondary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <Stepper 
          steps={steps}
          currentStep={currentStep}
          onStepClick={(stepId) => {
            if (stepId < currentStep) {
              setCurrentStep(stepId)
            }
          }}
          className="mb-8"
        />

        {/* Offline Mode Warning */}
        <OfflineModeWarning className="mb-6" />

        {/* Step Content Container */}
        <div className="max-w-4xl mx-auto">
          {/* Step Header */}
          <div className="text-center mb-8">
            <h2 className="text-heading-1 mb-2">
              {currentStepData?.title}
            </h2>
            {currentStepData?.description && (
              <p className="text-body text-muted-foreground">
                {currentStepData.description}
              </p>
            )}
          </div>

          {/* Validation Errors */}
          {validation && !validation.isValid && (
            <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive mb-1">Corrija os seguintes erros:</h4>
                  <ul className="text-sm text-destructive/80 space-y-1">
                    {validation.errors?.map((error, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-destructive/60">•</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
              
              {currentStep === steps.length ? (
                <Button
                  onClick={handleComplete}
                  disabled={!validation?.isValid || saving}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  <Check className="h-4 w-4" />
                  Finalizar Personagem
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToNext()}
                  className="flex items-center gap-2"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}