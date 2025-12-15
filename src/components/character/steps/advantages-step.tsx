'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AdvantagesStepProps {
  advantages: {
    backgrounds: { [key: string]: number }
    disciplines: { [key: string]: number }
    virtues: {
      conscience: number
      self_control: number
      courage: number
    }
    merits: { [key: string]: number }
    flaws: { [key: string]: number }
  }
  character: any
  onAdvantagesChange: (advantages: {
    backgrounds: { [key: string]: number }
    disciplines: { [key: string]: number }
    virtues: {
      conscience: number
      self_control: number
      courage: number
    }
    merits: { [key: string]: number }
    flaws: { [key: string]: number }
  }) => void
}

const BACKGROUND_DESCRIPTIONS = {
  allies: {
    name: 'Aliados',
    description: 'Aliados são humanos que apóiam ou ajudam você — família, amigos ou até mesmo uma organização mortal que lhe deve alguma lealdade. Eles têm suas próprias preocupações e só podem cooperar até um certo nível.',
    levels: {
      1: 'Um aliado, de influência e poder moderado',
      2: 'Dois aliados, ambos de poder moderado',
      3: 'Três aliados, um dos quais é razoavelmente influente',
      4: 'Quatro aliados, um dos quais é muito influente',
      5: 'Cinco aliados, um dos quais é extremamente influente'
    }
  },
  contacts: {
    name: 'Contatos',
    description: 'Você conhece gente por toda a cidade. Seus Contatos são pessoas que você pode subornar, manipular ou coagir a lhe fornecer informações, além de amigos confiáveis em áreas específicas.',
    levels: {
      1: 'Um contato importante',
      2: 'Dois contatos importantes',
      3: 'Três contatos importantes',
      4: 'Quatro contatos importantes',
      5: 'Cinco contatos importantes'
    }
  },
  fame: {
    name: 'Fama',
    description: 'Você desfruta de reconhecimento amplo dentro da sociedade mortal. Isso lhe dá privilégios ao interagir com mortais, mas também pode atrair atenção indesejada.',
    levels: {
      1: 'Conhecido por uma seleta tribo de uma cidade — boêmios locais ou círculo social dos ricaços.',
      2: 'A maioria da população reconhece o seu rosto; celebridade local, como apresentador de telejornais.',
      3: 'Sua fama é reconhecida em todo o estado; talvez senador ou estrela de interesse local.',
      4: 'Nacionalmente famoso; todos sabem algo sobre você.',
      5: 'Você é um ícone da mídia, mundialmente famoso.'
    }
  },
  generation: {
    name: 'Geração',
    description: 'Este Antecedente representa sua geração, a pureza do seu sangue e sua proximidade do Primeiro Vampiro. Sem pontos, você é da 13ª geração.',
    levels: {
      1: '12º Geração: 11 Pontos de Sangue / 1 ponto por turno',
      2: '11º Geração: 12 Pontos de Sangue / 1 ponto por turno',
      3: '10º Geração: 13 Pontos de Sangue / 1 ponto por turno',
      4: '9º Geração: 14 Pontos de Sangue / 2 pontos por turno',
      5: '8º Geração: 15 Pontos de Sangue / 3 pontos por turno'
    }
  },
  herd: {
    name: 'Rebanho',
    description: 'Você criou um grupo de mortais dos quais se alimenta sem medo. Pode ser círculos de boêmios pervertidos até um culto que o vê como figura divina.',
    levels: {
      1: '3 Fontes',
      2: '7 Fontes',
      3: '15 Fontes',
      4: '30 Fontes',
      5: '60 Fontes'
    }
  },
  influence: {
    name: 'Influência',
    description: 'Você tem influência dentro da sociedade mortal, através de riqueza, prestígio, cargo político, chantagem ou manipulação sobrenatural.',
    levels: {
      1: 'Moderadamente influente; um agente na política municipal',
      2: 'Boas conexões; uma força na política estadual',
      3: 'Posição de influência; um agente na política regional',
      4: 'Amplo poder pessoal; uma força na política nacional',
      5: 'Vastamente influente; um agente na política global'
    }
  },
  mentor: {
    name: 'Mentor',
    description: 'Um ancião que zela por você, oferecendo orientação ou ajuda. Pode aconselhá-lo, falar com autoridades em seu favor ou avisar sobre situações perigosas.',
    levels: {
      1: 'Seu mentor é um Ancillae de pouca influência.',
      2: 'Seu mentor é respeitado; um Ancião, por exemplo.',
      3: 'Seu mentor é altamente influente; como membro da Primigênie',
      4: 'Seu mentor tem grande poder; como um Príncipe ou arcebispo',
      5: 'Seu mentor é extraordinariamente poderoso, talvez justiçar ou Inconnu.'
    }
  },
  resources: {
    name: 'Recursos',
    description: 'Seus recursos financeiros pessoais ou acesso aos mesmos. Descreve seu padrão de vida, posses e poder de compra.',
    levels: {
      1: 'Economias Parcas: pequeno apartamento, motocicleta. $1.000 líquido, $500/mês',
      2: 'Classe Média: apartamento em condomínio. $8.000 líquido, $1.200/mês',
      3: 'Grandes Economias: casa própria, segurança. $50.000 líquido, $3.000/mês',
      4: 'Bem de Vida: classe alta, mansão. $500.000 líquido, $9.000/mês',
      5: 'Podre de Rico: multimilionário. $5.000.000 líquido, $30.000/mês'
    }
  },
  retainers: {
    name: 'Lacaios',
    description: 'Servos, assistentes ou companheiros leais. Podem ser carniçais, pessoas Dominadas ou seguidores enfeitiçados pela sua Presença.',
    levels: {
      1: 'Um lacaio',
      2: 'Dois lacaios',
      3: 'Três lacaios',
      4: 'Quatro lacaios',
      5: 'Cinco lacaios'
    }
  },
  status: {
    name: 'Status',
    description: 'Reputação e posição dentro da comunidade dos Membros. Na Camarilla deriva do status do senhor; no Sabá, do bando.',
    levels: {
      1: 'Conhecido: um neófito',
      2: 'Respeitado: um ancilla',
      3: 'Influente: um ancião',
      4: 'Poderoso: membro da Primigênie (ou bispo)',
      5: 'Luminar: um príncipe (ou arcebispo)'
    }
  }
}

const CLAN_DISCIPLINES = {
  brujah: ['celeridade', 'potencia', 'presenca'],
  gangrel: ['animalismo', 'fortitude', 'metamorfose'],
  malkavian: ['auspex', 'dementacao', 'ofuscacao'],
  nosferatu: ['animalismo', 'ofuscacao', 'potencia'],
  toreador: ['auspex', 'celeridade', 'presenca'],
  tremere: ['auspex', 'dominacao', 'taumaturgia'],
  ventrue: ['dominacao', 'fortitude', 'presenca'],
  assamite: ['celeridade', 'ofuscacao', 'quietus'],
  followers: ['animalismo', 'auspex', 'fortitude'],
  giovanni: ['dominacao', 'necromancia', 'potencia'],
  lasombra: ['dominacao', 'obtenebra', 'potencia'],
  tzimisce: ['animalismo', 'auspex', 'vicissitude'],
  ravnos: ['animalismo', 'fortitude', 'quimerismo'],
  caitiff: []
}

const DISCIPLINE_NAMES = {
  animalismo: 'Animalismo',
  auspex: 'Auspex',
  celeridade: 'Celeridade',
  dementacao: 'Dementação',
  dominacao: 'Dominação',
  fortitude: 'Fortitude',
  metamorfose: 'Metamorfose',
  necromancia: 'Necromancia',
  obtenebra: 'Obtenebração',
  ofuscacao: 'Ofuscação',
  potencia: 'Potência',
  presenca: 'Presença',
  quietus: 'Quietus',
  quimerismo: 'Quimerismo',
  taumaturgia: 'Taumaturgia',
  vicissitude: 'Vicissitude'
}

const BACKGROUND_SKILLS = ['allies', 'contacts', 'fame', 'generation', 'herd', 'influence', 'mentor', 'resources', 'retainers', 'status']




const MAX_BACKGROUND_POINTS = 5
const MAX_DISCIPLINE_POINTS = 3
const MAX_VIRTUE_POINTS = 7 // 3 pontos base + 4 para distribuir

export default function AdvantagesStep({ advantages, character, onAdvantagesChange }: AdvantagesStepProps) {
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({})

  const toggleExpanded = (itemKey: string) => {
    setExpandedItems(prev => {
      const isCurrentlyExpanded = prev[itemKey]
      
      if (!isCurrentlyExpanded) {
        return { [itemKey]: true }
      }
      
      return {}
    })
  }

  const updateBackground = (backgroundKey: string, change: number) => {
    const newAdvantages = { ...advantages }
    const currentValue = newAdvantages.backgrounds[backgroundKey] || 0
    const newValue = Math.max(0, Math.min(5, currentValue + change))
    
    const currentTotal = Object.values(newAdvantages.backgrounds).reduce((sum, val) => sum + val, 0)
    
    if (change > 0 && currentTotal >= MAX_BACKGROUND_POINTS) {
      return
    }
    
    newAdvantages.backgrounds = {
      ...newAdvantages.backgrounds,
      [backgroundKey]: newValue
    }
    
    onAdvantagesChange({
      ...newAdvantages,
      merits: advantages.merits || {},
      flaws: advantages.flaws || {}
    })
  }

  const updateDiscipline = (disciplineKey: string, change: number) => {
    const newAdvantages = { ...advantages }
    const currentValue = newAdvantages.disciplines[disciplineKey] || 0
    const newValue = Math.max(0, Math.min(5, currentValue + change))
    
    const currentTotal = Object.values(newAdvantages.disciplines).reduce((sum, val) => sum + val, 0)
    
    if (change > 0 && currentTotal >= MAX_DISCIPLINE_POINTS) {
      return
    }
    
    newAdvantages.disciplines = {
      ...newAdvantages.disciplines,
      [disciplineKey]: newValue
    }
    
    onAdvantagesChange({
      ...newAdvantages,
      merits: advantages.merits || {},
      flaws: advantages.flaws || {}
    })
  }

  const updateVirtue = (virtueKey: keyof typeof advantages.virtues, change: number) => {
    const newAdvantages = { ...advantages }
    const currentValue = newAdvantages.virtues[virtueKey] || 1
    const newValue = Math.max(1, Math.min(5, currentValue + change))
    
    const currentTotal = Object.values(newAdvantages.virtues).reduce((sum, val) => sum + val, 0)
    
    if (change > 0 && currentTotal >= MAX_VIRTUE_POINTS) {
      return
    }
    
    newAdvantages.virtues = {
      ...newAdvantages.virtues,
      [virtueKey]: newValue
    }
    
    onAdvantagesChange({
      ...newAdvantages,
      merits: advantages.merits || {},
      flaws: advantages.flaws || {}
    })
  }

  const getTotalBackgroundPoints = () => {
    return Object.values(advantages.backgrounds).reduce((sum, val) => sum + val, 0)
  }

  const getTotalDisciplinePoints = () => {
    return Object.values(advantages.disciplines).reduce((sum, val) => sum + val, 0)
  }

  const getTotalVirtuePoints = () => {
    return Object.values(advantages.virtues).reduce((sum, val) => sum + val, 0)
  }

  const getRemainingBackgroundPoints = () => {
    return MAX_BACKGROUND_POINTS - getTotalBackgroundPoints()
  }

  const getRemainingDisciplinePoints = () => {
    return MAX_DISCIPLINE_POINTS - getTotalDisciplinePoints()
  }

  const getRemainingVirtuePoints = () => {
    return MAX_VIRTUE_POINTS - getTotalVirtuePoints()
  }



  const getClanDisciplines = () => {
    const clan = character?.clan || 'caitiff'
    // Normalizar o nome do clã para lowercase para garantir match
    const normalizedClan = clan.toLowerCase().trim()
    console.log('Clã detectado:', normalizedClan) // Debug
    return CLAN_DISCIPLINES[normalizedClan as keyof typeof CLAN_DISCIPLINES] || []
  }

  const BackgroundControl = ({ backgroundKey, backgroundData }: { backgroundKey: string, backgroundData: any }) => {
    const currentValue = advantages.backgrounds[backgroundKey] || 0
    const isExpanded = expandedItems[backgroundKey]

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div className="flex-1">
            <span className="font-medium text-green-300">{backgroundData.name}</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 flex-1">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-full border ${
                    currentValue >= level
                      ? 'bg-green-500 border-green-400'
                      : 'border-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateBackground(backgroundKey, -1)}
              disabled={currentValue === 0}
              className="w-8 h-8 p-0 text-red-400 border-green-600 hover:bg-red-900/20"
            >
              <Minus className="w-3 h-3" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateBackground(backgroundKey, 1)}
              disabled={currentValue === 5 || getRemainingBackgroundPoints() === 0}
              className="w-8 h-8 p-0 text-green-400 border-green-600 hover:bg-green-900/20"
            >
              <Plus className="w-3 h-3" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleExpanded(backgroundKey)}
              className="w-8 h-8 p-0 text-white hover:bg-gray-700"
            >
              ?
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="bg-gray-900/50 p-4 rounded-lg space-y-3 text-sm">
            <div>
              <span className="font-medium text-green-300">Descrição: </span>
              <span className="text-gray-300">{backgroundData.description}</span>
            </div>
            
            <div>
              <span className="font-medium text-green-300">Níveis:</span>
              <div className="mt-1 space-y-1">
                {Object.entries(backgroundData.levels).map(([level, desc]) => (
                  <div key={level} className="flex items-start space-x-2">
                    <span className="text-green-400 font-mono">●</span>
                    <span className="text-gray-300">{String(desc)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const DisciplineControl = ({ disciplineKey }: { disciplineKey: string }) => {
    const currentValue = advantages.disciplines[disciplineKey] || 0
    const disciplineName = DISCIPLINE_NAMES[disciplineKey as keyof typeof DISCIPLINE_NAMES] || disciplineKey

    return (
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
        <div className="flex-1">
          <span className="font-medium text-purple-300">{disciplineName}</span>
        </div>
        
        <div className="flex items-center justify-center space-x-2 flex-1">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-full border ${
                  currentValue >= level
                    ? 'bg-purple-500 border-purple-400'
                    : 'border-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateDiscipline(disciplineKey, -1)}
            disabled={currentValue === 0}
            className="w-8 h-8 p-0 text-red-400 border-purple-600 hover:bg-red-900/20"
          >
            <Minus className="w-3 h-3" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateDiscipline(disciplineKey, 1)}
            disabled={currentValue === 5 || getRemainingDisciplinePoints() === 0}
            className="w-8 h-8 p-0 text-green-400 border-purple-600 hover:bg-green-900/20"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )
  }



  const VirtueControl = ({ virtueKey, virtueName }: { virtueKey: keyof typeof advantages.virtues, virtueName: string }) => {
    const currentValue = advantages.virtues[virtueKey] || 1

    return (
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
        <div className="flex-1">
          <span className="font-medium text-yellow-300">{virtueName}</span>
        </div>
        
        <div className="flex items-center justify-center space-x-2 flex-1">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-full border ${
                  currentValue >= level
                    ? 'bg-yellow-500 border-yellow-400'
                    : 'border-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateVirtue(virtueKey, -1)}
            disabled={currentValue === 1}
            className="w-8 h-8 p-0 text-red-400 border-yellow-600 hover:bg-red-900/20"
          >
            <Minus className="w-3 h-3" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateVirtue(virtueKey, 1)}
            disabled={currentValue === 5 || getRemainingVirtuePoints() === 0}
            className="w-8 h-8 p-0 text-green-400 border-yellow-600 hover:bg-green-900/20"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Vantagens</h2>
        <p className="text-gray-300">
          Distribua pontos entre antecedentes, disciplinas e virtudes
        </p>
      </div>

      {/* Antecedentes */}
      <Card className="bg-gray-800 border-green-900">
        <CardHeader>
          <CardTitle className="text-green-300 flex items-center justify-between">
            <div>
              <span>Antecedentes</span>
              <span className="text-sm font-normal text-gray-400 ml-2">
                (Vantagens de nascença e circunstâncias)
              </span>
            </div>
            <span className="text-sm">
              {getRemainingBackgroundPoints()}/{MAX_BACKGROUND_POINTS} pontos restantes
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-400 mb-4">
            Características externas que descrevem posses materiais, conexões sociais e oportunidades.
          </p>
          {BACKGROUND_SKILLS.map(backgroundKey => (
            <BackgroundControl 
              key={backgroundKey} 
              backgroundKey={backgroundKey}
              backgroundData={BACKGROUND_DESCRIPTIONS[backgroundKey as keyof typeof BACKGROUND_DESCRIPTIONS]} 
            />
          ))}
        </CardContent>
      </Card>

      {/* Disciplinas */}
      <Card className="bg-gray-800 border-purple-900">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center justify-between">
            <div>
              <span>Disciplinas</span>
              <span className="text-sm font-normal text-gray-400 ml-2">
                (Poderes sobrenaturais do seu clã)
              </span>
            </div>
            <span className="text-sm">
              {getRemainingDisciplinePoints()}/{MAX_DISCIPLINE_POINTS} pontos restantes
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-400 mb-4">
            Poderes sobrenaturais disponíveis para o seu clã. Cada clã tem acesso a três disciplinas específicas.
            {character?.clan && <span className="block mt-1 text-purple-300">Clã: {character.clan}</span>}
          </p>
          {getClanDisciplines().length > 0 ? (
            getClanDisciplines().map(disciplineKey => (
              <DisciplineControl key={disciplineKey} disciplineKey={disciplineKey} />
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">
              <p>Nenhuma disciplina encontrada para este clã</p>
              <p className="text-xs mt-1">Clã atual: {character?.clan || 'não definido'}</p>
              <p className="text-xs">Disciplinas disponíveis: {JSON.stringify(getClanDisciplines())}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Virtudes */}
      <Card className="bg-gray-800 border-yellow-900">
        <CardHeader>
          <CardTitle className="text-yellow-300 flex items-center justify-between">
            <div>
              <span>Virtudes</span>
              <span className="text-sm font-normal text-gray-400 ml-2">
                (Força moral e autocontrole)
              </span>
            </div>
            <span className="text-sm">
              {getRemainingVirtuePoints()}/{MAX_VIRTUE_POINTS} pontos restantes
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-400 mb-4">
            Todas as virtudes começam com 1 ponto. Você tem 4 pontos adicionais para distribuir.
          </p>
          <VirtueControl virtueKey="conscience" virtueName="Consciência" />
          <VirtueControl virtueKey="self_control" virtueName="Autocontrole" />
          <VirtueControl virtueKey="courage" virtueName="Coragem" />
        </CardContent>
      </Card>


    </div>
  )
}