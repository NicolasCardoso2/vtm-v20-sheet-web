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
    const getUser = async () => {
      // SEMPRE usar modo de desenvolvimento por enquanto
      console.log('Dashboard: Carregando em modo de desenvolvimento')
      
      // Modo de desenvolvimento - usuário simulado
      const mockUser = {
        id: 'dev-user-123',
        email: 'dev@vampiro.com'
      } as User
      
      setUser(mockUser)
      await loadMockData()
      setLoading(false)
      
      // Código original comentado para debug:
      /*
      const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'

      if (!isSupabaseConfigured) {
        const mockUser = { id: 'dev-user-123', email: 'dev@vampiro.com' } as User
        setUser(mockUser)
        await loadMockData()
        setLoading(false)
        return
      }

      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/auth')
        return
      }
      setUser(user)
      await loadUserData(user.id)
      */
    }
    
    getUser()
  }, [router])

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
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    // Modo de desenvolvimento - logout simples
    console.log('Fazendo logout...')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900">
      <div className="container mx-auto px-4 py-8">
        {/* Aviso de modo de desenvolvimento */}
        {(!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') && (
          <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg">
            <p className="text-yellow-200 text-sm">
              <strong>Modo de Desenvolvimento:</strong> Configure o Supabase em .env.local para usar todas as funcionalidades.
            </p>
          </div>
        )}
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-300">Bem-vindo, {user?.email}</p>
          </div>
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="border-red-600 text-red-300 hover:bg-red-900"
          >
            Sair
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Crônicas */}
          <Card className="bg-black/50 border-red-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Minhas Crônicas</CardTitle>
                <CardDescription className="text-gray-300">
                  Crônicas que você narra
                </CardDescription>
              </div>
              <Button asChild className="bg-red-700 hover:bg-red-600">
                <Link href="/dashboard/chronicles/new">Nova Crônica</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {chronicles.length === 0 ? (
                <p className="text-gray-400">Nenhuma crônica criada ainda</p>
              ) : (
                <div className="space-y-3">
                  {chronicles.map((chronicle) => (
                    <div
                      key={chronicle.id}
                      className="p-3 bg-gray-800/50 rounded border border-gray-700 hover:border-red-600 transition-colors"
                    >
                      <h3 className="font-medium text-white">{chronicle.name}</h3>
                      <p className="text-sm text-gray-400">
                        Criada em {new Date(chronicle.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          asChild 
                          size="sm"
                          className="bg-red-700 hover:bg-red-600"
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
          <Card className="bg-black/50 border-red-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Meus Personagens</CardTitle>
                <CardDescription className="text-gray-300">
                  Personagens que você criou
                </CardDescription>
              </div>
              <Button asChild className="bg-red-700 hover:bg-red-600">
                <Link href="/dashboard/characters/new">Novo Personagem</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {characters.length === 0 ? (
                <p className="text-gray-400">Nenhum personagem criado ainda</p>
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