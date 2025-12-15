'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Save, Check, AlertCircle } from 'lucide-react'
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

const WIZARD_STEPS: WizardStep[] = [
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

  // Auto-save hook
  const { saveData } = useAutoSave({
    characterId: characterData.id || '',
    data: characterData,
    enabled: !!characterData.id,
    onSave: (success) => {
      if (success) {
        // Visual feedback do auto-save
      }
    }
  })

  useEffect(() => {
    if (characterData.attributes_json && characterData.skills_json && 
        characterData.advantages_json && characterData.morality_json) {
      const validationResult = validateCharacter(
        characterData.attributes_json,
        characterData.skills_json,
        characterData.advantages_json,
        characterData.morality_json,
        chronicleSettings
      )
      setValidation(validationResult)
    }
  }, [characterData, chronicleSettings])

  const updateCharacterData = (updates: Partial<Character>) => {
    setCharacterData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
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
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header com progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">
              Criação de Personagem
            </h1>
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Auto-save ativo</span>
            </div>
          </div>
          


          {/* Steps indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`flex flex-col items-center ${
                    step.id === currentStep ? 'text-red-300' :
                    step.id < currentStep ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step.id === currentStep ? 'border-red-300 bg-red-900' :
                    step.id < currentStep ? 'border-green-400 bg-green-900' : 'border-gray-500'
                  }`}>
                    {step.id < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 -mt-2 ${
                    step.id < currentStep ? 'bg-green-400' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <Card className="bg-black/50 border-red-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              {currentStepData?.title}
              <Badge variant="outline" className="border-red-600">
                Passo {currentStep} de 6
              </Badge>
            </CardTitle>
            <p className="text-gray-300">{currentStepData?.description}</p>
          </CardHeader>
          <CardContent>
            {/* Step content will be rendered here based on currentStep */}
            {currentStep === 1 && (
              <OrigemStep 
                character={characterData}
                chronicle={{ settings_json: chronicleSettings } as any}
                onChange={updateCharacterData}
              />
            )}
            {currentStep === 2 && (
              <ConceitoStep 
                character={characterData}
                chronicle={{ settings_json: chronicleSettings } as any}
                onChange={updateCharacterData}
              />
            )}
            {currentStep === 3 && (
              <AttributesStep 
                character={characterData}
                chronicle={{ settings_json: chronicleSettings } as any}
                onChange={updateCharacterData}
              />
            )}
            {currentStep === 4 && (
              <SkillsStep 
                skills={characterData.skills_json || { talents: {}, skills: {}, knowledges: {}, specializations: {} }}
                onSkillsChange={(skills) => updateCharacterData({ skills_json: skills })}
              />
            )}
            {currentStep === 5 && (
              <AdvantagesStep 
                advantages={characterData.advantages_json || { 
                  backgrounds: {}, 
                  disciplines: {},
                  virtues: { conscience: 1, self_control: 1, courage: 1 },
                  merits: {},
                  flaws: {}
                }}
                character={characterData}
                onAdvantagesChange={(advantages) => updateCharacterData({ advantages_json: advantages })}
              />
            )}
            {currentStep === 6 && (
              <div className="text-center text-gray-300 py-12">
                <h3 className="text-xl mb-4">Etapa 5: Vantagens</h3>
                <p>Componente em desenvolvimento...</p>
              </div>
            )}
            {currentStep === 6 && (
              <div className="text-center text-gray-300 py-12">
                <h3 className="text-xl mb-4">Etapa 6: Finalização</h3>
                <p>Componente em desenvolvimento...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Validation Messages */}
        {validation && (
          <Card className="bg-black/50 border-yellow-600 mb-6">
            <CardHeader>
              <CardTitle className="text-yellow-300 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Status da Validação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Pontos Gastos</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="text-gray-300">Atributos: {validation.pointsSpent.attributes}/{validation.pointsAvailable.attributes}</li>
                    <li className="text-gray-300">Habilidades: {validation.pointsSpent.skills}/{validation.pointsAvailable.skills}</li>
                    <li className="text-gray-300">Disciplinas: {validation.pointsSpent.disciplines}/{validation.pointsAvailable.disciplines}</li>
                    <li className="text-gray-300">Antecedentes: {validation.pointsSpent.backgrounds}/{validation.pointsAvailable.backgrounds}</li>
                  </ul>
                </div>
                <div>
                  {validation.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-300 mb-2">Avisos</h4>
                      <ul className="space-y-1 text-sm">
                        {validation.warnings.map((warning, i) => (
                          <li key={i} className="text-yellow-200">• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {validation.errors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-300 mb-2">Erros</h4>
                      <ul className="space-y-1 text-sm">
                        {validation.errors.map((error, i) => (
                          <li key={i} className="text-red-200">• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 1}
            variant="outline"
            className="border-red-600 text-red-300 hover:bg-red-900"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>

            {currentStep === 6 ? (
              <Button
                onClick={handleComplete}
                disabled={!validation?.isValid || saving}
                className="bg-green-700 hover:bg-green-600"
              >
                Finalizar Criação
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-red-700 hover:bg-red-600"
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}