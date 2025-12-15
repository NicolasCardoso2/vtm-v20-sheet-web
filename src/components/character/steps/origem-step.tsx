'use client'

import { useState, useEffect } from 'react'
import { Clan, Jeito, CharacterDraft } from '@/types/character-creation'
import { Character, Chronicle } from '@/types'
import { CharacterDataService } from '@/services/character-data'
import FieldSelector from '@/components/ui/field-selector'
import ModalSelector from '@/components/ui/modal-selector'

interface OrigemStepProps {
  character: Partial<Character>
  chronicle: Chronicle
  onChange: (updates: Partial<Character>) => void
}

export default function OrigemStep({ character, chronicle, onChange }: OrigemStepProps) {
  const [clans, setClans] = useState<Clan[]>([])
  const [jeitos, setJeitos] = useState<Jeito[]>([])
  const [filteredClans, setFilteredClans] = useState<Clan[]>([])
  const [filteredJeitos, setFilteredJeitos] = useState<Jeito[]>([])
  
  const [showClanModal, setShowClanModal] = useState(false)
  const [showJeitoModal, setShowJeitoModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [clansData, jeitosData] = await Promise.all([
        CharacterDataService.getClans(),
        CharacterDataService.getJeitos()
      ])
      
      setClans(clansData)
      setJeitos(jeitosData)
      setFilteredClans(clansData)
      setFilteredJeitos(jeitosData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClanSearch = async (term: string) => {
    if (term.trim() === '') {
      setFilteredClans(clans)
      return
    }

    try {
      const results = await CharacterDataService.searchClans(term)
      setFilteredClans(results)
    } catch (error) {
      console.error('Erro na busca de clãs:', error)
    }
  }

  const handleJeitoSearch = async (term: string) => {
    if (term.trim() === '') {
      setFilteredJeitos(jeitos)
      return
    }

    try {
      const results = await CharacterDataService.searchJeitos(term)
      setFilteredJeitos(results)
    } catch (error) {
      console.error('Erro na busca de jeitos:', error)
    }
  }

  const handleClanSelect = (clan: Clan) => {
    onChange({ 
      clan: clan.nome
    })
  }

  const handleJeitoSelect = (jeito: Jeito) => {
    onChange({ 
      // Por enquanto não há campo jeito em Character, pode ser adicionado depois
      concept: character.concept || jeito.nome
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Origem</h2>
        <p className="text-gray-300">
          Defina o jeito e clã do seu personagem - sua origem no mundo das trevas
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Seletor de Jeito */}
        <FieldSelector
          title="Jeito"
          value=""
          placeholder="Escolha seu jeito de vampiro..."
          onClick={() => setShowJeitoModal(true)}
          description=""
        />

        {/* Seletor de Clã */}
        <FieldSelector
          title="Clã"
          value={character.clan}
          placeholder="Escolha seu clã..."
          onClick={() => setShowClanModal(true)}
          required
          description=""
        />
      </div>

      {/* Detalhes do clã selecionado */}
      {character.clan && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <h3 className="text-red-300 font-semibold mb-2">Clã {character.clan}</h3>
        </div>
      )}

      {/* Modal de seleção de Jeito */}
      <ModalSelector
        isOpen={showJeitoModal}
        onClose={() => setShowJeitoModal(false)}
        title="Escolher Jeito"
        items={filteredJeitos}
        onSelect={handleJeitoSelect}
        onSearch={handleJeitoSearch}
        searchPlaceholder="Buscar jeito..."
        loading={loading}
      />

      {/* Modal de seleção de Clã */}
      <ModalSelector
        isOpen={showClanModal}
        onClose={() => setShowClanModal(false)}
        title="Escolher Clã"
        items={filteredClans}
        onSelect={handleClanSelect}
        onSearch={handleClanSearch}
        searchPlaceholder="Buscar clã..."
        loading={loading}
      />
    </div>
  )
}