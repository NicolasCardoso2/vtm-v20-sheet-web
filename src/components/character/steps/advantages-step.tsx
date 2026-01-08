'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import TraitsModal from '@/components/traits/TraitsModal'
import { SelectedTrait } from '@/types/traits'
import { CharacterDraft } from '@/types/character-creation'

interface AdvantagesStepProps {
  character: CharacterDraft
  onUpdate: (updates: Partial<CharacterDraft>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function AdvantagesStep({
  character,
  onUpdate,
  onNext,
  onPrevious
}: AdvantagesStepProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editMode, setEditMode] = useState<'qualidades' | 'defeitos' | 'both'>('both')
  const [showValidation, setShowValidation] = useState(false)

  const qualidades = character.qualidades || []
  const defeitos = character.defeitos || []
  const allSelected = character.qualidadesEDefeitos || [...qualidades, ...defeitos]

  const handleTraitsConfirm = (selectedTraits: SelectedTrait[]) => {
    // Como o sistema de traits já separa por tipo, precisamos processar isso
    // O modalTraits retorna todos os traits selecionados, mas precisa ser separado
    // baseado no tipo real do item, não no sinal dos pontos
    
    // Por enquanto, vamos armazenar tudo junto e separar na lógica de validação
    onUpdate({
      qualidadesEDefeitos: selectedTraits
    })
  }

  const canProceed = () => {
    // Verificar se as regras estão sendo atendidas
    const totalQualidades = qualidades.reduce((sum, q) => sum + Math.abs(q.chosenPoints), 0)
    const totalDefeitos = defeitos.reduce((sum, d) => sum + Math.abs(d.chosenPoints), 0)
    
    return totalQualidades <= 7 && totalDefeitos === 7
  }

  const handleNext = () => {
    if (canProceed()) {
      setShowValidation(false)
      onNext()
    } else {
      setShowValidation(true)
    }
  }

  const getTotals = () => {
    const totalQualidades = qualidades.reduce((sum, q) => sum + Math.abs(q.chosenPoints), 0)
    const totalDefeitos = defeitos.reduce((sum, d) => sum + Math.abs(d.chosenPoints), 0)
    
    return { totalQualidades, totalDefeitos }
  }

  const { totalQualidades, totalDefeitos } = getTotals()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-200 mb-2">
          Etapa 5: Vantagens
        </h2>
        <p className="text-red-300/80">
          Selecione Qualidades (até 7 pts) e Defeitos (exatamente 7 pts)
        </p>
      </div>

      {/* Resumo dos Pontos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={totalQualidades > 7 ? "border-red-500/50" : "border-green-500/50"}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-lg ${totalQualidades > 7 ? "text-red-400" : "text-green-400"}`}>
              Qualidades: {totalQualidades}/7
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {totalQualidades <= 7 ? "Dentro do limite" : `${totalQualidades - 7} pontos em excesso`}
            </p>
          </CardContent>
        </Card>

        <Card className={totalDefeitos !== 7 ? "border-red-500/50" : "border-green-500/50"}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-lg ${totalDefeitos !== 7 ? "text-red-400" : "text-green-400"}`}>
              Defeitos: {totalDefeitos}/7
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {totalDefeitos === 7 ? "Perfeito!" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botão Principal */}
      <div className="text-center">
        <Button
          onClick={() => {
            setEditMode('both')
            setModalOpen(true)
          }}
          className="bg-red-600 hover:bg-red-700"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          {allSelected.length === 0 ? 'Selecionar Qualidades e Defeitos' : 'Editar Seleção'}
        </Button>
      </div>

      {/* Lista de Selecionados */}
      {allSelected.length > 0 && (
        <div className="space-y-4">
          {qualidades.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-green-400">
                  Qualidades Selecionadas
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditMode('qualidades')
                    setModalOpen(true)
                  }}
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Editar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {qualidades.map(qualidade => (
                    <div
                      key={qualidade.itemId}
                      className="flex items-center justify-between p-2 bg-green-950/20 rounded border border-green-800/30"
                    >
                      <div className="flex-1">
                        <span className="font-medium">
                          {qualidade.itemId.replace(/qualidade_[^_]+_[^_]+_/, '').replace(/_/g, ' ')}
                        </span>
                        {qualidade.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {qualidade.notes}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {Math.abs(qualidade.chosenPoints)} pt{Math.abs(qualidade.chosenPoints) !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {defeitos.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-red-400">
                  Defeitos Selecionados
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditMode('defeitos')
                    setModalOpen(true)
                  }}
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Editar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {defeitos.map(defeito => (
                    <div
                      key={defeito.itemId}
                      className="flex items-center justify-between p-2 bg-red-950/20 rounded border border-red-800/30"
                    >
                      <div className="flex-1">
                        <span className="font-medium">
                          {defeito.itemId.replace(/defeito_[^_]+_[^_]+_/, '').replace(/_/g, ' ')}
                        </span>
                        {defeito.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {defeito.notes}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {Math.abs(defeito.chosenPoints)} pt{Math.abs(defeito.chosenPoints) !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {allSelected.length > 0 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => onUpdate({ qualidades: [], defeitos: [] })}
                className="text-red-400 border-red-400 hover:bg-red-950/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Tudo
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Validação */}
      {showValidation && !canProceed() && (
        <Card className="border-amber-500/50 bg-amber-950/20">
          <CardContent className="pt-4">
            <div className="text-center text-amber-300">
              <p className="font-medium">Atenção</p>
              <p className="text-sm mt-1">
                Para prosseguir você precisa:
              </p>
              <ul className="text-xs mt-2 space-y-1">
                {totalQualidades > 7 && (
                  <li>• Reduzir qualidades para no máximo 7 pontos</li>
                )}
                {totalDefeitos !== 7 && (
                  <li>• Ajustar defeitos para exatamente 7 pontos</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      <TraitsModal
        isOpen={modalOpen}
        onClose={(selectedTraits) => {
          if (selectedTraits) {
            handleTraitsConfirm(selectedTraits)
          }
          setModalOpen(false)
        }}
        selectedTraits={allSelected}
        type="qualidade" // Tipo padrão, mas mode controlará o que é mostrado
        mode={editMode}
      />
    </div>
  )
}