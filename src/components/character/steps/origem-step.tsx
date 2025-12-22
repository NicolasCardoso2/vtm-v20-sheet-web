'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { AccordionItem } from '@/components/ui/accordion-item'
import { Clan, Jeito, CharacterDraft } from '@/types/character-creation'
import { Character, Chronicle } from '@/types'
import { CharacterDataService } from '@/services/character-data'

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
  
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedClan, setExpandedClan] = useState<string | null>(null)
  const [expandedJeito, setExpandedJeito] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClans(clans)
      setFilteredJeitos(jeitos)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredClans(clans.filter(clan => 
        clan.nome.toLowerCase().includes(term) ||
        clan.resumo.toLowerCase().includes(term) ||
        clan.descricao.toLowerCase().includes(term)
      ))
      setFilteredJeitos(jeitos.filter(jeito =>
        jeito.nome.toLowerCase().includes(term) ||
        jeito.resumo.toLowerCase().includes(term) ||
        jeito.descricao.toLowerCase().includes(term)
      ))
    }
  }, [searchTerm, clans, jeitos])

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

  const handleClanSelect = (clan: Clan) => {
    onChange({ clan: clan.nome })
  }

  const handleJeitoSelect = (jeito: Jeito) => {
    onChange({ concept: jeito.nome })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Carregando opções...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clã ou jeito..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Clãs */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-heading-2 mb-2">Clã</h3>
            <p className="text-caption">
              A linhagem vampírica que define suas disciplinas e características
            </p>
          </div>
          
          <div className="space-y-3">
            {filteredClans.map((clan) => (
              <AccordionItem
                key={clan.id}
                id={clan.id}
                title={clan.nome}
                description={clan.resumo}
                tags={clan.disciplinas}
                expanded={expandedClan === clan.id}
                selected={character.clan === clan.nome}
                onToggle={() => setExpandedClan(expandedClan === clan.id ? null : clan.id)}
                onSelect={() => handleClanSelect(clan)}
              >
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-body leading-relaxed">
                    {clan.descricao}
                  </p>
                  {clan.disciplinas && clan.disciplinas.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Disciplinas de Clã:</h4>
                      <div className="flex flex-wrap gap-2">
                        {clan.disciplinas.map(disc => (
                          <span key={disc} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                            {disc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionItem>
            ))}
          </div>
        </div>

        {/* Jeitos */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-heading-2 mb-2">Jeito</h3>
            <p className="text-caption">
              O background e personalidade antes do Abraço
            </p>
          </div>
          
          <div className="space-y-3">
            {filteredJeitos.map((jeito) => (
              <AccordionItem
                key={jeito.id}
                id={jeito.id}
                title={jeito.nome}
                description={jeito.resumo}
                expanded={expandedJeito === jeito.id}
                selected={character.concept === jeito.nome}
                onToggle={() => setExpandedJeito(expandedJeito === jeito.id ? null : jeito.id)}
                onSelect={() => handleJeitoSelect(jeito)}
              >
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-body leading-relaxed">
                    {jeito.descricao}
                  </p>
                </div>
              </AccordionItem>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Summary */}
      {(character.clan || character.concept) && (
        <div className="bg-card/50 border border-border rounded-lg p-6 mt-8">
          <h4 className="text-heading-3 mb-4 text-center">Seleção Atual</h4>
          <div className="grid md:grid-cols-2 gap-4 text-center">
            {character.clan && (
              <div>
                <span className="text-caption">Clã:</span>
                <p className="font-medium text-primary">{character.clan}</p>
              </div>
            )}
            {character.concept && (
              <div>
                <span className="text-caption">Jeito:</span>
                <p className="font-medium text-primary">{character.concept}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}