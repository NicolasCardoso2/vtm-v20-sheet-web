import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Vampiro: A Máscara
          </h1>
          <h2 className="text-2xl text-red-300 mb-8">
            Fichas Digitais - Edição do 20º Aniversário
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Sistema completo de criação e gerenciamento de fichas com wizard guiado, 
            validação automática e controle de crônica.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-black/50 border-red-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Jogador
              </CardTitle>
              <CardDescription className="text-gray-300">
                Crie e gerencie seus personagens com facilidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Wizard de criação em 5 passos</li>
                <li>• Validação automática de pontos</li>
                <li>• Auto-save e histórico</li>
                <li>• Exportar PDF</li>
              </ul>
              <Button asChild className="w-full bg-red-700 hover:bg-red-600">
                <Link href="/auth">Entrar como Jogador</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-red-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Narrador
              </CardTitle>
              <CardDescription className="text-gray-300">
                Controle suas crônicas e aprove personagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Criar e gerenciar crônicas</li>
                <li>• Configurar regras da mesa</li>
                <li>• Aprovar fichas</li>
                <li>• Registrar XP e evoluções</li>
              </ul>
              <Button asChild className="w-full bg-red-700 hover:bg-red-600">
                <Link href="/auth">Entrar como Narrador</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Sistema desenvolvido para facilitar a experiência de jogo
          </p>
        </div>
      </div>
    </div>
  )
}