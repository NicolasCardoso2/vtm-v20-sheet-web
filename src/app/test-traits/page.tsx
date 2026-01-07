'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TraitsModal } from '@/components/traits/TraitsModal'
import { SelectedTrait } from '@/types/traits'

export default function TraitsTestPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTraits, setSelectedTraits] = useState<SelectedTrait[]>([])

  const handleModalClose = (selection?: SelectedTrait[]) => {
    setModalOpen(false)
    if (selection) {
      setSelectedTraits(selection)
    }
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
            <Card className="bg-gradient-to-r from-red-950/40 to-black/40 border-2 border-red-800/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2 justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Seleção Atual
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedTraits.map(trait => (
                    <div 
                      key={trait.itemId}
                      className="flex justify-between items-center p-3 bg-black/40 border border-red-800/30 rounded-lg hover:border-red-700/50 transition-colors"
                    >
                      <span className="text-red-200 font-medium">
                        {trait.itemId.replace(/_/g, ' ')}
                      </span>
                      <span className="text-red-300 font-semibold px-2 py-1 bg-red-900/30 rounded text-sm">
                        {Math.abs(trait.chosenPoints)} pt{Math.abs(trait.chosenPoints) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-red-800/30">
                  <details className="text-red-300/60">
                    <summary className="cursor-pointer text-sm hover:text-red-300 transition-colors">
                      Dados técnicos (debug)
                    </summary>
                    <pre className="text-xs text-red-300/50 overflow-auto mt-2 p-2 bg-black/20 rounded border border-red-900/20">
                      {JSON.stringify(selectedTraits, null, 2)}
                    </pre>
                  </details>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TraitsModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        selectedTraits={selectedTraits}
      />
    </div>
  )
}