'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, X, Eye, Settings } from 'lucide-react'
import { Character, Chronicle } from '@/types'

interface ChronicleManagementPageProps {
  params: { id: string }
}

export default function ChronicleManagementPage({ params }: ChronicleManagementPageProps) {
  const [chronicle, setChronicle] = useState<Chronicle | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadChronicleData()
  }, [params.id])

  const loadChronicleData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      // Carregar crônica
      const { data: chronicleData, error: chronicleError } = await supabase
        .from('chronicles')
        .select('*')
        .eq('id', params.id)
        .eq('storyteller_user_id', user.id)
        .single()

      if (chronicleError) {
        console.error('Erro ao carregar crônica:', chronicleError)
        router.push('/dashboard')
        return
      }

      setChronicle(chronicleData)

      // Carregar personagens da crônica
      const { data: charactersData } = await supabase
        .from('characters')
        .select('*')
        .eq('chronicle_id', params.id)
        .order('created_at', { ascending: false })

      setCharacters(charactersData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveCharacter = async (characterId: string, approved: boolean) => {
    if (!chronicle) return
    
    try {
      const { error } = await supabase
        .from('characters')
        .update({
          status: approved ? ('approved' as const) : ('rejected' as const),
          approved_at: approved ? new Date().toISOString() : null
        })
        .eq('id', characterId)

      if (error) throw error

      // Log da aprovação
      await supabase
        .from('character_changelog')
        .insert([{
          character_id: characterId,
          change_type: 'approval',
          diff_json: { status: approved ? 'approved' : 'rejected' },
          notes: approved ? 'Personagem aprovado pelo narrador' : 'Personagem rejeitado pelo narrador',
          created_by: chronicle?.storyteller_user_id || ''
        }])

      await loadChronicleData()
    } catch (error) {
      console.error('Erro ao aprovar personagem:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-900 text-green-300 border-green-600">Aprovado</Badge>
      case 'pending_approval':
        return <Badge className="bg-yellow-900 text-yellow-300 border-yellow-600">Pendente</Badge>
      case 'rejected':
        return <Badge className="bg-red-900 text-red-300 border-red-600">Rejeitado</Badge>
      default:
        return <Badge className="bg-gray-900 text-gray-300 border-gray-600">Rascunho</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (!chronicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">Crônica não encontrada</h2>
          <Button onClick={() => router.push('/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const pendingCharacters = characters.filter(c => c.status === 'pending_approval')
  const approvedCharacters = characters.filter(c => c.status === 'approved')
  const rejectedCharacters = characters.filter(c => c.status === 'rejected')
  const draftCharacters = characters.filter(c => c.status === 'draft')

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{chronicle.name}</h1>
            <p className="text-gray-300">Gestão de Crônica</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="border-red-600 text-red-300 hover:bg-red-900"
            >
              Voltar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/50">
            <TabsTrigger value="pending" className="text-white">
              Pendentes ({pendingCharacters.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-white">
              Aprovados ({approvedCharacters.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-white">
              Rejeitados ({rejectedCharacters.length})
            </TabsTrigger>
            <TabsTrigger value="drafts" className="text-white">
              Rascunhos ({draftCharacters.length})
            </TabsTrigger>
          </TabsList>

          {/* Personagens Pendentes */}
          <TabsContent value="pending" className="space-y-4">
            {pendingCharacters.length === 0 ? (
              <Card className="bg-black/50 border-gray-600">
                <CardContent className="pt-6 text-center text-gray-400">
                  Nenhum personagem pendente de aprovação
                </CardContent>
              </Card>
            ) : (
              pendingCharacters.map((character) => (
                <Card key={character.id} className="bg-black/50 border-yellow-600">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{character.name}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {character.clan} • {character.concept}
                        </CardDescription>
                      </div>
                      {getStatusBadge(character.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-300">
                          <strong>Natureza:</strong> {character.nature || 'Não definida'}
                        </p>
                        <p className="text-sm text-gray-300">
                          <strong>Comportamento:</strong> {character.demeanor || 'Não definido'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">
                          <strong>Geração:</strong> {character.generation || 'Não definida'}ª
                        </p>
                        <p className="text-sm text-gray-300">
                          <strong>Criado em:</strong> {new Date(character.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-300 hover:bg-blue-900"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApproveCharacter(character.id, true)}
                        className="bg-green-700 hover:bg-green-600"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApproveCharacter(character.id, false)}
                        variant="destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Outras abas com layouts similares */}
          <TabsContent value="approved" className="space-y-4">
            {approvedCharacters.map((character) => (
              <Card key={character.id} className="bg-black/50 border-green-600">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{character.name || 'Nome não definido'}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {character.clan || 'Clã não definido'} • {character.concept || 'Conceito não definido'}
                      </CardDescription>
                    </div>
                    {getStatusBadge(character.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-blue-600 text-blue-300 hover:bg-blue-900"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Ficha
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedCharacters.map((character) => (
              <Card key={character.id} className="bg-black/50 border-red-600">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{character.name || 'Nome não definido'}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {character.clan || 'Clã não definido'} • {character.concept || 'Conceito não definido'}
                      </CardDescription>
                    </div>
                    {getStatusBadge(character.status)}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            {draftCharacters.map((character) => (
              <Card key={character.id} className="bg-black/50 border-gray-600">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{character.name || 'Sem nome'}</CardTitle>
                      <CardDescription className="text-gray-300">
                        Em desenvolvimento
                      </CardDescription>
                    </div>
                    {getStatusBadge(character.status)}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}