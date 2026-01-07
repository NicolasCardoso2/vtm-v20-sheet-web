'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [chronicles, setChronicles] = useState<any[]>([])
  const [characters, setCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadDashboard = async () => {
      // Modo de desenvolvimento - usuário simulado
      const mockUser = {
        id: 'dev-user-123',
        email: 'dev@vampiro.com'
      } as User
      
      setUser(mockUser)
      await loadMockData()
      setLoading(false)
    }

    loadDashboard()
  }, [])

  const loadMockData = async () => {
    // Dados simulados para modo de desenvolvimento
    const mockChronicles = [
      {
        id: 'mock-chronicle-1',
        name: 'Crônica de Demonstração',
        created_at: new Date().toISOString(),
        storyteller_user_id: 'dev-user-123'
      }
    ]
    
    const mockCharacters = [
      {
        id: 'mock-char-1',
        name: 'Personagem Demo',
        clan: 'Ventrue',
        concept: 'Empresário',
        status: 'draft',
        chronicles: { name: 'Crônica de Demonstração' }
      }
    ]
    
    setChronicles(mockChronicles)
    setCharacters(mockCharacters)
  }

  const loadUserData = async (userId: string) => {
    try {
      // Carregar crônicas onde é narrador
      const { data: chroniclesData } = await supabase
        .from('chronicles')
        .select('*')
        .eq('storyteller_user_id', userId)
      
      // Carregar personagens
      const { data: charactersData } = await supabase
        .from('characters')
        .select('*, chronicles(name)')
        .eq('owner_user_id', userId)

      setChronicles(chroniclesData || [])
      setCharacters(charactersData || [])
    } catch (error) {
      // Erro ao carregar dados
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    // Modo de desenvolvimento - logout simples
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center">
        <div className="text-white flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
          <p>Carregando seu universo vampíresco...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-red-950 relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10" />
      <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-red-900/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Aviso de modo offline melhorado */}
        {(!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-600/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <p className="text-amber-200 font-semibold">
                Modo de Desenvolvimento Offline
              </p>
            </div>
            <p className="text-amber-100/80 text-sm leading-relaxed">
              Os dados estão sendo salvos localmente. Configure o Supabase em 
              <code className="bg-amber-900/30 px-1 py-0.5 rounded text-amber-200 mx-1">.env.local</code> 
              para sincronização na nuvem.
            </p>
          </div>
        )}
        
        {/* Header melhorado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              Dashboard Vampiríco
            </h1>
            <p className="text-red-200/80 text-lg">
              Bem-vindo às sombras, <span className="text-red-300 font-medium">{user?.email}</span>
            </p>
            <div className="w-20 h-px bg-gradient-to-r from-red-600 to-transparent"></div>
          </div>
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="border-red-600/50 bg-black/30 text-red-300 hover:bg-red-900/50 hover:border-red-500 transition-all duration-200 backdrop-blur-sm px-6"
          >
            Sair
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Crônicas */}
          <Card className="bg-gradient-to-br from-black/60 to-red-950/30 border-2 border-red-800/50 backdrop-blur-sm hover:border-red-600/80 transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-2">
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Minhas Crônicas
                </CardTitle>
                <CardDescription className="text-red-200/70">
                  Crônicas que você narra
                </CardDescription>
              </div>
              <Button asChild className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-600/50 hover:border-red-500 shadow-lg hover:shadow-xl transition-all duration-200">
                <Link href="/dashboard/chronicles/new" className="flex items-center gap-2">
                  <span>+</span> Nova Crônica
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {chronicles.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧡</span>
                  </div>
                  <p className="text-red-200/60 mb-2">Nenhuma crônica criada ainda</p>
                  <p className="text-red-300/50 text-sm">Crie sua primeira crônica para começar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chronicles.map((chronicle) => (
                    <div
                      key={chronicle.id}
                      className="p-4 bg-gradient-to-r from-red-950/40 to-black/40 rounded-lg border border-red-800/30 hover:border-red-600/50 transition-all duration-200 hover:shadow-lg hover:shadow-red-900/20"
                    >
                      <h3 className="font-semibold text-white mb-1">{chronicle.name}</h3>
                      <p className="text-sm text-red-200/60 mb-3">
                        Criada em {new Date(chronicle.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          asChild 
                          size="sm"
                          className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Link href={`/dashboard/chronicles/${chronicle.id}`}>
                            Gerenciar
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personagens */}
          <Card className="bg-gradient-to-br from-black/60 to-red-950/30 border-2 border-red-800/50 backdrop-blur-sm hover:border-red-600/80 transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-2">
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Meus Personagens
                </CardTitle>
                <CardDescription className="text-red-200/70">
                  Personagens que você criou
                </CardDescription>
              </div>
              <Button asChild className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-600/50 hover:border-red-500 shadow-lg hover:shadow-xl transition-all duration-200">
                <Link href="/dashboard/characters/new" className="flex items-center gap-2">
                  <span>+</span> Novo Personagem
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {characters.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧛</span>
                  </div>
                  <p className="text-red-200/60 mb-2">Nenhum personagem criado ainda</p>
                  <p className="text-red-300/50 text-sm">Crie seu primeiro vampiro para começar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {characters.map((character) => (
                    <div
                      key={character.id}
                      className="p-3 bg-gray-800/50 rounded border border-gray-700 hover:border-red-600 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white">{character.name}</h3>
                          <p className="text-sm text-gray-400">
                            {character.clan} • {character.concept}
                          </p>
                          <p className="text-xs text-gray-500">
                            Crônica: {character.chronicles?.name || 'N/A'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          character.status === 'approved' ? 'bg-green-900 text-green-300' :
                          character.status === 'pending_approval' ? 'bg-yellow-900 text-yellow-300' :
                          character.status === 'rejected' ? 'bg-red-900 text-red-300' :
                          'bg-gray-900 text-gray-300'
                        }`}>
                          {character.status === 'approved' ? 'Aprovado' :
                           character.status === 'pending_approval' ? 'Pendente' :
                           character.status === 'rejected' ? 'Rejeitado' : 'Rascunho'}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          asChild 
                          size="sm"
                          className="bg-red-700 hover:bg-red-600"
                        >
                          <Link href={`/dashboard/characters/${character.id}`}>
                            {character.status === 'draft' ? 'Continuar Criação' : 'Visualizar'}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}