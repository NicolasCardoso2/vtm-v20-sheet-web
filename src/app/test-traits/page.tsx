'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TraitsModal } from '@/components/traits/TraitsModal'
import { SelectedTrait } from '@/types/traits'

export default function TraitsTestPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTraits, setSelectedTraits] = useState<SelectedTrait[]>([])

  const handleConfirm = (traits: SelectedTrait[]) => {
    setSelectedTraits(traits)
    console.log('Qualidades e Defeitos selecionados:', traits)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-200 mb-4">
            Teste: Qualidades e Defeitos
          </h1>
          <p className="text-red-300/80">
            Sistema de seleção para Vampiro: A Máscara V20
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-200">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setModalOpen(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Abrir Seletor de Qualidades e Defeitos
              </Button>

              <Button 
                variant="outline"
                onClick={() => setSelectedTraits([])}
                disabled={selectedTraits.length === 0}
              >
                Limpar Seleção
              </Button>
            </CardContent>
          </Card>

          {selectedTraits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-200">Seleção Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedTraits.map(trait => (
                    <div 
                      key={trait.itemId}
                      className="flex justify-between items-center p-2 bg-red-950/20 rounded"
                    >
                      <span className="text-sm font-medium">
                        {trait.itemId.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-red-300">
                        {Math.abs(trait.chosenPoints)} pt{Math.abs(trait.chosenPoints) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-red-800/50">
                  <pre className="text-xs text-red-300/80 overflow-auto">
                    {JSON.stringify(selectedTraits, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TraitsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        initialSelection={selectedTraits}
      />
    </div>
  )
}