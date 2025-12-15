'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import CharacterWizard from '@/components/character/character-wizard'
import { Character, Chronicle } from '@/types'
import { DEFAULT_ATTRIBUTES, DEFAULT_SKILLS, DEFAULT_DISCIPLINES } from '@/lib/character-validation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function NewCharacterPage() {
  const [chronicles, setChronicles] = useState<Chronicle[]>([])
  const [selectedChronicle, setSelectedChronicle] = useState<Chronicle | null>(null)
  const [character, setCharacter] = useState<Partial<Character> | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadChronicles()
  }, [])

  const loadChronicles = async () => {
    try {
      // Modo de desenvolvimento - usuário simulado
      console.log('Criação de personagem: Carregando em modo de desenvolvimento')
      
      // Dados simulados para desenvolvimento
      const mockChronicles: Chronicle[] = [
        {
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
      ]
      
      setChronicles(mockChronicles)
      setSelectedChronicle(mockChronicles[0])
      
      // Código original comentado para debug:
      /*
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      */
      
    } catch (error) {
      console.error('Erro ao carregar crônicas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChronicle = async (chronicle: Chronicle) => {
    setSelectedChronicle(chronicle)
    
    // Criar personagem inicial - modo desenvolvimento
    console.log('Criando personagem para crônica:', chronicle.name)

    const newCharacter: Partial<Character> = {
      chronicle_id: chronicle.id,
      owner_user_id: 'dev-user-123', // ID do usuário simulado
      name: '',
      concept: '',
      clan: '',
      nature: '',
      demeanor: '',
      generation: chronicle.settings_json.defaultGeneration || 13,
      sire: '',
      attributes_json: DEFAULT_ATTRIBUTES,
      skills_json: DEFAULT_SKILLS,
      advantages_json: {
        disciplines: {},
        backgrounds: {},
        virtues: { conscience: 1, self_control: 1, courage: 1 },
        merits: {},
        flaws: {}
      },
      morality_json: {
        path: 'humanity',
        rating: 7,
        willpower: { permanent: 1, temporary: 1 },
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
      status: 'draft'
    }

    // Modo desenvolvimento - simular criação de personagem
    const mockCharacterWithId = {
      ...newCharacter,
      id: `mock-char-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('Personagem simulado criado:', mockCharacterWithId)
    setCharacter(mockCharacterWithId as Character)
  }

  const handleSaveCharacter = async (characterData: Partial<Character>) => {
    if (!character?.id) return

    try {
      const { error } = await supabase
        .from('characters')
        .update(characterData)
        .eq('id', character.id)

      if (error) throw error

      // Log da mudança
      await supabase
        .from('character_changelog')
        .insert([{
          character_id: character.id,
          change_type: 'edit',
          diff_json: characterData,
          notes: 'Salvamento automático durante criação',
          created_by: character.owner_user_id
        }])
    } catch (error) {
      console.error('Erro ao salvar personagem:', error)
      throw error
    }
  }

  const handleCompleteCharacter = async (characterData: Partial<Character>) => {
    if (!character?.id) return

    try {
      const { error } = await supabase
        .from('characters')
        .update({
          ...characterData,
          status: selectedChronicle?.settings_json.houseRules.requireApproval 
            ? 'pending_approval' 
            : 'approved'
        })
        .eq('id', character.id)

      if (error) throw error

      // Log da finalização
      await supabase
        .from('character_changelog')
        .insert([{
          character_id: character.id,
          change_type: 'creation',
          diff_json: characterData,
          notes: 'Personagem criado e finalizado',
          created_by: character.owner_user_id
        }])

      router.push('/dashboard')
    } catch (error) {
      console.error('Erro ao finalizar personagem:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  // Se não selecionou crônica ainda
  if (!selectedChronicle || !character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Novo Personagem</h1>
            <p className="text-gray-300">Escolha a crônica para criar seu personagem</p>
          </div>

          {chronicles.length === 0 ? (
            <Card className="bg-black/50 border-red-800">
              <CardHeader>
                <CardTitle className="text-white">Nenhuma crônica disponível</CardTitle>
                <CardDescription className="text-gray-300">
                  Você precisa participar de uma crônica para criar um personagem.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-red-700 hover:bg-red-600"
                >
                  Voltar ao Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {chronicles.map((chronicle) => (
                <Card 
                  key={chronicle.id} 
                  className="bg-black/50 border-red-800 hover:border-red-600 transition-colors cursor-pointer"
                  onClick={() => handleSelectChronicle(chronicle)}
                >
                  <CardHeader>
                    <CardTitle className="text-white">{chronicle.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      Criada em {new Date(chronicle.created_at).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-300">
                          <strong>Geração Padrão:</strong> {chronicle.settings_json.defaultGeneration}ª
                        </p>
                        <p className="text-gray-300">
                          <strong>Aprovação:</strong> {chronicle.settings_json.houseRules.requireApproval ? 'Necessária' : 'Automática'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-300">
                          <strong>Pontos Iniciais:</strong>
                        </p>
                        <ul className="text-xs text-gray-400 ml-4">
                          <li>Físicos: {chronicle.settings_json.initialPoints.physicalAttributes}</li>
                          <li>Sociais: {chronicle.settings_json.initialPoints.socialAttributes}</li>
                          <li>Mentais: {chronicle.settings_json.initialPoints.mentalAttributes}</li>
                          <li>Habilidades: {chronicle.settings_json.initialPoints.skills}</li>
                          <li>Disciplinas: {chronicle.settings_json.initialPoints.disciplines}</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Renderizar o wizard
  return (
    <CharacterWizard
      character={character}
      chronicleSettings={selectedChronicle.settings_json}
      onSave={handleSaveCharacter}
      onComplete={handleCompleteCharacter}
    />
  )
}