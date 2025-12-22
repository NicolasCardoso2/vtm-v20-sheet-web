'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Arquetipo, CharacterDraft } from '@/types/character-creation'
import { Character, Chronicle } from '@/types'
import { CharacterDataService } from '@/services/character-data'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AccordionItem } from '@/components/ui/accordion-item'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadArquetipos()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNaturezas(naturezas)
      setFilteredComportamentos(comportamentos)
    } else {
      const filtered = naturezas.filter(item => 
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredNaturezas(filtered)

      const filteredComp = comportamentos.filter(item => 
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredComportamentos(filteredComp)
    }
  }, [searchTerm, naturezas, comportamentos])

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

  const handleInputChange = (field: string, value: string) => {
    onChange({ [field]: value })
  }

  const handleNaturezaSelect = (natureza: Arquetipo) => {
    onChange({ nature: natureza.nome })
  }

  const handleComportamentoSelect = (comportamento: Arquetipo) => {
    onChange({ demeanor: comportamento.nome })
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Conceito</h2>
        <p className="text-muted-foreground">
          Defina a identidade, personalidade e história básica do seu personagem
        </p>
      </div>

      {/* Campos de texto básicos */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Nome <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Nome do personagem"
            value={character.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-card/50 border-border text-white placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="concept" className="text-white">
            Conceito <span className="text-destructive">*</span>
          </Label>
          <Input
            id="concept"
            placeholder="Ex: Empresário corrupto, Artista rebelde"
            value={character.concept || ''}
            onChange={(e) => handleInputChange('concept', e.target.value)}
            className="bg-card/50 border-border text-white placeholder:text-muted-foreground"
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
          className="bg-card/50 border-border text-white placeholder:text-muted-foreground"
        />
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar natureza ou comportamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-card/50 border-border text-white placeholder:text-muted-foreground"
        />
      </div>

      {/* Lista de naturezas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Naturezas</h3>
        {loading ? (
          <div className="text-muted-foreground">Carregando...</div>
        ) : (
          <div className="space-y-2">
            {filteredNaturezas.map((natureza) => (
              <AccordionItem
                key={natureza.id}
                title={natureza.nome}
                description={natureza.descricao || ''}
                tags={natureza.detalhes ? [natureza.detalhes] : []}
                isSelected={character.nature === natureza.nome}
                onSelect={() => handleNaturezaSelect(natureza)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lista de comportamentos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Comportamentos</h3>
        {loading ? (
          <div className="text-muted-foreground">Carregando...</div>
        ) : (
          <div className="space-y-2">
            {filteredComportamentos.map((comportamento) => (
              <AccordionItem
                key={comportamento.id}
                title={comportamento.nome}
                description={comportamento.descricao || ''}
                tags={comportamento.detalhes ? [comportamento.detalhes] : []}
                isSelected={character.demeanor === comportamento.nome}
                onSelect={() => handleComportamentoSelect(comportamento)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Resumo das seleções */}
      {(character.nature || character.demeanor) && (
        <div className="bg-card/30 p-6 rounded-lg border border-border">
          <h3 className="text-white font-semibold mb-4">Seleções</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {character.nature && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Natureza:</span>
                <div className="text-white font-medium">{character.nature}</div>
              </div>
            )}
            {character.demeanor && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Comportamento:</span>
                <div className="text-white font-medium">{character.demeanor}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}