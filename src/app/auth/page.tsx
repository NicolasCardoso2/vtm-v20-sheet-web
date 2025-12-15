'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submetido, iniciando handleAuth...')
    setLoading(true)
    setMessage('')

    // Verificar se Supabase está configurado - usar uma verificação mais simples
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const isDevMode = !supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co' || supabaseUrl.includes('placeholder')

    console.log('Supabase URL:', supabaseUrl)
    console.log('Modo desenvolvimento:', isDevMode)

    if (isDevMode) {
      // Modo de desenvolvimento - simular autenticação
      setTimeout(() => {
        setLoading(false)
        if (isLogin) {
          setMessage('Modo de desenvolvimento - Login simulado!')
          setTimeout(() => router.push('/dashboard'), 1500)
        } else {
          setMessage('Modo de desenvolvimento - Conta criada com sucesso!')
          setTimeout(() => {
            setIsLogin(true)
            setMessage('')
          }, 2000)
        }
      }, 1000)
      return
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Verifique seu email para confirmar a conta')
      }
    } catch (error: any) {
      // Se der erro no Supabase, ativar modo de desenvolvimento
      console.log('Erro Supabase, ativando modo dev:', error.message)
      setLoading(false)
      if (isLogin) {
        setMessage('Modo de desenvolvimento ativado - Login simulado!')
        setTimeout(() => router.push('/dashboard'), 1500)
      } else {
        setMessage('Modo de desenvolvimento ativado - Conta criada!')
        setTimeout(() => {
          setIsLogin(true)
          setMessage('')
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="text-white hover:text-red-300 text-sm">
            ← Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h1>
          <p className="text-gray-300">
            Acesse o sistema de fichas digitais
          </p>
        </div>

        <Card className="bg-black/50 border-red-800">
          <CardHeader>
            <CardTitle className="text-white">
              {isLogin ? 'Login' : 'Registro'}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin 
                ? 'Entre com suas credenciais' 
                : 'Crie uma nova conta'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              {message && (
                <div className={`text-sm p-3 rounded ${
                  message.includes('erro') || message.includes('Error')
                    ? 'bg-red-900/50 text-red-200'
                    : 'bg-green-900/50 text-green-200'
                }`}>
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-700 hover:bg-red-600"
              >
                {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  type="button"
                  onClick={() => {
                    console.log('Tentando ir para teste...')
                    router.push('/test')
                  }}
                  className="w-full bg-blue-700 hover:bg-blue-600"
                >
                  TESTE - Sair Daqui
                </Button>
                
                <Button
                  type="button"
                  onClick={() => {
                    console.log('Tentando ir para dashboard...')
                    router.push('/dashboard')
                  }}
                  className="w-full bg-green-700 hover:bg-green-600"
                >
                  Ir Direto para Dashboard
                </Button>
                
                <Button
                  type="button"
                  onClick={() => {
                    setMessage('Entrando no modo demonstração...')
                    setTimeout(() => router.push('/dashboard'), 1000)
                  }}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Modo Demonstração
                </Button>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-red-300 hover:text-red-200 text-sm"
                >
                  {isLogin 
                    ? 'Não tem conta? Criar uma'
                    : 'Já tem conta? Fazer login'
                  }
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}