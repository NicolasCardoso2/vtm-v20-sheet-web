'use client'

import { useState, useEffect } from 'react'
import { Arquetipo, CharacterDraft } from '@/types/character-creation'
import { Character, Chronicle } from '@/types'
import { CharacterDataService } from '@/services/character-data'
import FieldSelector from '@/components/ui/field-selector'
import ModalSelector from '@/components/ui/modal-selector'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ConceitoStepProps {
  character: Partial<Character>
  chronicle: Chronicle
  onChange: (updates: Partial<Character>) => void
}

export default function ConceitoStep({ character, chronicle, onChange }: ConceitoStepProps) {
  const [naturezas, setNaturezas] = useState<Arquetipo[]>([])
  const [comportamentos, setComportamentos] = useState<Arquetipo[]>([])
  const [filteredNaturezas, setFilteredNaturezas] = useState<Arquetipo[]>([])
  const [filteredComportamentos, setFilteredComportamentos] = useState<Arquetipo[]>([])
  
  const [showNaturezaModal, setShowNaturezaModal] = useState(false)
  const [showComportamentoModal, setShowComportamentoModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadArquetipos()
  }, [])

  const loadArquetipos = async () => {
    setLoading(true)
    try {
      const [naturezasData, comportamentosData] = await Promise.all([
        CharacterDataService.getArquetipos('NATUREZA'),
        CharacterDataService.getArquetipos('COMPORTAMENTO')
      ])
      
      setNaturezas(naturezasData)
      setComportamentos(comportamentosData)
      setFilteredNaturezas(naturezasData)
      setFilteredComportamentos(comportamentosData)
    } catch (error) {
      console.error('Erro ao carregar arquétipos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNaturezaSearch = async (term: string) => {
    if (term.trim() === '') {
      setFilteredNaturezas(naturezas)
      return
    }

    try {
      const results = await CharacterDataService.searchArquetipos(term, 'NATUREZA')
      setFilteredNaturezas(results)
    } catch (error) {
      console.error('Erro na busca de naturezas:', error)
    }
  }

  const handleComportamentoSearch = async (term: string) => {
    if (term.trim() === '') {
      setFilteredComportamentos(comportamentos)
      return
    }

    try {
      const results = await CharacterDataService.searchArquetipos(term, 'COMPORTAMENTO')
      setFilteredComportamentos(results)
    } catch (error) {
      console.error('Erro na busca de comportamentos:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    onChange({ [field]: value })
  }

  const handleNaturezaSelect = (natureza: Arquetipo) => {
    onChange({ 
      nature: natureza.nome
    })
  }

  const handleComportamentoSelect = (comportamento: Arquetipo) => {
    onChange({ 
      demeanor: comportamento.nome
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Conceito</h2>
        <p className="text-gray-300">
          Defina a identidade, personalidade e história básica do seu personagem
        </p>
      </div>

      {/* Campos de texto */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Nome <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Nome do personagem"
            value={character.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="concept" className="text-white">
            Conceito <span className="text-red-400">*</span>
          </Label>
          <Input
            id="concept"
            placeholder="Ex: Empresário corrupto, Artista rebelde"
            value={character.concept || ''}
            onChange={(e) => handleInputChange('concept', e.target.value)}
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sire" className="text-white">Senhor (Opcional)</Label>
        <Input
          id="sire"
          placeholder="Nome do vampiro que o abraçou"
          value={character.sire || ''}
          onChange={(e) => handleInputChange('sire', e.target.value)}
          className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
        />
      </div>

      {/* Seletores de arquétipos */}
      <div className="grid md:grid-cols-2 gap-6">
        <FieldSelector
          title="Natureza"
          value={character.nature}
          placeholder="Escolha sua natureza..."
          onClick={() => setShowNaturezaModal(true)}
          required
          description=""
        />

        <FieldSelector
          title="Comportamento"
          value={character.demeanor}
          placeholder="Escolha seu comportamento..."
          onClick={() => setShowComportamentoModal(true)}
          required
          description=""
        />
      </div>

      {/* Detalhes dos arquétipos selecionados */}
      {(character.nature || character.demeanor) && (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {character.nature && (
            <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <h3 className="text-blue-300 font-semibold mb-2">Natureza: {character.nature}</h3>
            </div>
          )}

          {character.demeanor && (
            <div className="p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
              <h3 className="text-purple-300 font-semibold mb-2">Comportamento: {character.demeanor}</h3>
            </div>
          )}
        </div>
      )}

      {/* Modal de seleção de Natureza */}
      <ModalSelector
        isOpen={showNaturezaModal}
        onClose={() => setShowNaturezaModal(false)}
        title="Escolher Natureza"
        items={filteredNaturezas}
        onSelect={handleNaturezaSelect}
        onSearch={handleNaturezaSearch}
        searchPlaceholder="Buscar natureza..."
        loading={loading}
      />

      {/* Modal de seleção de Comportamento */}
      <ModalSelector
        isOpen={showComportamentoModal}
        onClose={() => setShowComportamentoModal(false)}
        title="Escolher Comportamento"
        items={filteredComportamentos}
        onSelect={handleComportamentoSelect}
        onSearch={handleComportamentoSearch}
        searchPlaceholder="Buscar comportamento..."
        loading={loading}
      />
    </div>
  )
}