import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Crown, FileText, Shield, Zap, Users, BookOpen, Settings } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-red-950 relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20 animate-pulse" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-800/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 bg-gradient-to-r from-white via-red-200 to-red-300 bg-clip-text text-transparent drop-shadow-2xl">
              Vampiro: A Máscara
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-6"></div>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-red-300 mb-8 font-medium tracking-wide">
            Fichas Digitais - Edição do 20º Aniversário
          </h2>
          <p className="text-red-100/80 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed">
            Sistema completo de criação e gerenciamento de fichas com wizard guiado, 
            validação automática e controle de crônica.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="bg-gradient-to-br from-black/60 to-red-950/30 border-2 border-red-800/50 hover:border-red-600/80 transition-all duration-500 hover:shadow-2xl hover:shadow-red-900/40 backdrop-blur-sm group">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-3 text-xl group-hover:text-red-200 transition-colors">
                <div className="p-2 bg-red-900/50 rounded-lg group-hover:bg-red-800/60 transition-colors">
                  <User className="w-6 h-6 text-red-300" />
                </div>
                Jogador
              </CardTitle>
              <CardDescription className="text-red-100/70 text-base">
                Crie e gerencie seus personagens com facilidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-300 space-y-3">
                <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-red-400" /> Wizard de criação em 5 passos</li>
                <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-red-400" /> Validação automática de pontos</li>
                <li className="flex items-center gap-3"><BookOpen className="w-4 h-4 text-red-400" /> Auto-save e histórico</li>
                <li className="flex items-center gap-3"><FileText className="w-4 h-4 text-red-400" /> Exportar PDF</li>
              </ul>
              <Button asChild className="w-full bg-gradient-to-r from-red-800 via-red-700 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-500 transition-all duration-300 shadow-xl hover:shadow-2xl border border-red-600/50 hover:border-red-500 text-white font-semibold py-3 text-base group">
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Entrar como Jogador
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-black/60 to-red-950/30 border-2 border-red-800/50 hover:border-red-600/80 transition-all duration-500 hover:shadow-2xl hover:shadow-red-900/40 backdrop-blur-sm group">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-3 text-xl group-hover:text-red-200 transition-colors">
                <div className="p-2 bg-red-900/50 rounded-lg group-hover:bg-red-800/60 transition-colors">
                  <Crown className="w-6 h-6 text-red-300" />
                </div>
                Narrador
              </CardTitle>
              <CardDescription className="text-red-100/70 text-base">
                Controle suas crônicas e aprove personagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-300 space-y-3">
                <li className="flex items-center gap-3"><Users className="w-4 h-4 text-red-400" /> Criar e gerenciar crônicas</li>
                <li className="flex items-center gap-3"><Settings className="w-4 h-4 text-red-400" /> Configurar regras da mesa</li>
                <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-red-400" /> Aprovar fichas</li>
                <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-red-400" /> Registrar XP e evoluções</li>
              </ul>
              <Button asChild className="w-full bg-gradient-to-r from-red-800 via-red-700 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-500 transition-all duration-300 shadow-xl hover:shadow-2xl border border-red-600/50 hover:border-red-500 text-white font-semibold py-3 text-base group">
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Entrar como Narrador
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer melhorado */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-6"></div>
          <p className="text-red-200/60 text-sm mb-4">
            Sistema desenvolvido para facilitar a experiência de jogo
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-red-300/50">
            <span>Modo Offline Ativo</span>
            <span>•</span>
            <span>Dados Salvos Localmente</span>
            <span>•</span>
            <span>V20 Compatível</span>
          </div>
        </div>
      </div>
    </div>
  )
}