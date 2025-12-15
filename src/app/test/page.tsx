'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">🎉 Funcionou!</h1>
        <p className="text-xl mb-8">Você conseguiu sair da página de login!</p>
        <a href="/dashboard" className="text-red-300 hover:text-red-200 underline">
          Ir para Dashboard
        </a>
      </div>
    </div>
  )
}