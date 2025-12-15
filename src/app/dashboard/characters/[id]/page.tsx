'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Character, Chronicle } from '@/types'
import { Button } from '@/components/ui/button'
import CharacterWizard from '@/components/character/character-wizard'

export default function EditCharacterPage() {
  const params = useParams()
  const router = useRouter()
  const [character, setCharacter] = useState<Character | null>(null)
  const [chronicle, setChronicle] = useState<Chronicle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCharacterData()
  }, [params.id])

  const loadCharacterData = async () => {
    // Modo de desenvolvimento - dados simulados
    console.log('Carregando personagem ID:', params.id)
    
    const mockCharacter: Character = {
      id: params.id as string,
      name: 'Personagem Demo',
      clan: 'Ventrue',
      concept: 'Empresário',
      sire: 'Marcus Vitel',
      nature: 'Autocrata',
      demeanor: 'Diretor',
      generation: 13,
      status: 'draft',
      chronicle_id: 'mock-chronicle-1',
      owner_user_id: 'dev-user-123',
      attributes_json: {
        physical: { strength: 2, dexterity: 2, stamina: 2 },
        social: { charisma: 3, manipulation: 2, appearance: 2 },
        mental: { perception: 2, intelligence: 3, wits: 2 }
      },
      skills_json: {
        talents: { alertness: 1, athletics: 0, awareness: 0, brawl: 0, empathy: 2, expression: 1, intimidation: 2, leadership: 3, streetwise: 1, subterfuge: 2 },
        skills: { animalken: 0, crafts: 0, drive: 1, etiquette: 2, firearms: 0, larceny: 0, melee: 0, performance: 0, stealth: 1, survival: 0 },
        knowledges: { academics: 2, computer: 1, finance: 3, investigation: 0, law: 2, medicine: 0, occult: 0, politics: 2, science: 0, technology: 1 },
        specializations: {}
      },
      advantages_json: {
        disciplines: { dominate: 1, fortitude: 1, presence: 1 },
        backgrounds: { contacts: 2, influence: 2, resources: 3, retainers: 1, status: 1 },
        virtues: { conscience: 3, self_control: 3, courage: 3 },
        merits: {},
        flaws: {}
      },
      morality_json: {
        path: 'humanity',
        rating: 7,
        willpower: { permanent: 5, temporary: 5 },
        blood_pool: { current: 10, per_turn: 1 },
        health_levels: {
          bruised: false,
          hurt: false,
          injured: false,
          wounded: false,
          mauled: false,
          crippled: false,
          incapacitated: false
        }
      },
      approval_notes: '',
      experience_points: 0,
      experience_total: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approved_at: null
    }

    const mockChronicle: Chronicle = {
      id: 'mock-chronicle-1',
      name: 'Crônica de Demonstração',
      storyteller_user_id: 'dev-user-123',
      settings_json: {
        limits: {
          maxAttributeAtCreation: 4,
          maxSkillAtCreation: 4,
          maxDisciplineAtCreation: 3,
          maxBackgroundAtCreation: 5
        },
        initialPoints: {
          physicalAttributes: 7,
          socialAttributes: 5,
          mentalAttributes: 3,
          skills: 13,
          disciplines: 3,
          backgrounds: 5,
          virtues: 7,
          freebie: 15
        },
        houseRules: {
          useExtendedVirtues: false,
          allowCustomClans: false,
          requireApproval: true,
          allowSelfApproval: false
        },
        allowedClans: ['Brujah', 'Gangrel', 'Malkavian', 'Nosferatu', 'Toreador', 'Tremere', 'Ventrue'],
        defaultGeneration: 13,
        maxGeneration: 13,
        minGeneration: 8,
        requiredFields: ['name', 'clan', 'concept', 'nature', 'demeanor'],
        experienceRules: {
          attributeCost: [5, 10, 15, 20, 25],
          skillCost: [3, 6, 9, 12, 15],
          disciplineCost: [10, 15, 20, 25, 30],
          backgroundCost: [3, 6, 9, 12, 15],
          virtueCost: [2, 4, 6, 8, 10]
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setCharacter(mockCharacter)
    setChronicle(mockChronicle)
    setLoading(false)
  }

  const handleSave = async (updatedCharacter: Partial<Character>) => {
    console.log('Salvando personagem:', updatedCharacter)
    // Em modo de desenvolvimento, simular salvamento
    setCharacter(prev => ({ ...prev!, ...updatedCharacter }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center">
        <div className="text-white">Carregando personagem...</div>
      </div>
    )
  }

  if (!character || !chronicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">Personagem não encontrado</h2>
          <Button onClick={() => router.push('/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button 
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            ← Voltar ao Dashboard
          </Button>
        </div>

        <CharacterWizard
          character={character}
          chronicleSettings={chronicle.settings_json}
          onSave={handleSave}
          onComplete={handleSave}
        />
      </div>
    </div>
  )
}