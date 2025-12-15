'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Character, Chronicle } from '@/types'
import { DEFAULT_CLANS, DEFAULT_NATURES } from '@/lib/character-validation'

interface ConceptStepProps {
  character: Partial<Character>
  chronicle: Chronicle
  onChange: (updates: Partial<Character>) => void
}

export default function ConceptStep({ character, chronicle, onChange }: ConceptStepProps) {
  const allowedClans = chronicle.settings_json.allowedClans.length > 0 
    ? chronicle.settings_json.allowedClans 
    : DEFAULT_CLANS

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white text-lg">Identidade Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome do Personagem *</Label>
              <Input
                id="name"
                value={character.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Nome completo"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="concept" className="text-white">Conceito *</Label>
              <Input
                id="concept"
                value={character.concept || ''}
                onChange={(e) => onChange({ concept: e.target.value })}
                placeholder="Ex: Hacker Rebelde, Artista Torturado"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clan" className="text-white">Clã *</Label>
              <select
                id="clan"
                value={character.clan || ''}
                onChange={(e) => onChange({ clan: e.target.value })}
                className="w-full h-10 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Selecione um clã</option>
                {allowedClans.map((clan) => (
                  <option key={clan} value={clan}>
                    {clan}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="generation" className="text-white">Geração</Label>
              <Input
                id="generation"
                type="number"
                min={chronicle.settings_json.minGeneration || 4}
                max={chronicle.settings_json.maxGeneration || 15}
                value={character.generation || chronicle.settings_json.defaultGeneration}
                onChange={(e) => onChange({ generation: parseInt(e.target.value) })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nature" className="text-white">Natureza *</Label>
              <select
                id="nature"
                value={character.nature || ''}
                onChange={(e) => onChange({ nature: e.target.value })}
                className="w-full h-10 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Selecione a natureza</option>
                {DEFAULT_NATURES.map((nature) => (
                  <option key={nature} value={nature}>
                    {nature}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="demeanor" className="text-white">Comportamento *</Label>
              <select
                id="demeanor"
                value={character.demeanor || ''}
                onChange={(e) => onChange({ demeanor: e.target.value })}
                className="w-full h-10 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Selecione o comportamento</option>
                {DEFAULT_NATURES.map((demeanor) => (
                  <option key={demeanor} value={demeanor}>
                    {demeanor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sire" className="text-white">Senhor (Opcional)</Label>
            <Input
              id="sire"
              value={character.sire || ''}
              onChange={(e) => onChange({ sire: e.target.value })}
              placeholder="Nome do senhor/criador"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-900/20 border-blue-600">
        <CardHeader>
          <CardTitle className="text-blue-300 text-sm">💡 Dica</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-200 text-sm">
            O conceito é uma frase curta que resume quem seu personagem era antes do Abraço e como ele se vê agora. 
            A Natureza representa a verdadeira personalidade, enquanto o Comportamento é a máscara que ele usa na sociedade.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}