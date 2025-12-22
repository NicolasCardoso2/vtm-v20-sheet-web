'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Character, Chronicle, CharacterAttributes } from '@/types'
import { Minus, Plus, Info } from 'lucide-react'
import { AccordionItem } from '@/components/ui/accordion-item'

// Componente para controle individual de atributo
interface AttributeControlProps {
  attrKey: string
  category: 'physical' | 'social' | 'mental'
  attrData: any
  value: number
  onChange: (category: string, attr: string, value: number) => void
  disabled?: boolean
  isExpanded?: boolean
  onToggleExpanded?: () => void
}

function AttributeControl({ 
  attrKey, 
  category, 
  attrData, 
  value, 
  onChange, 
  disabled, 
  isExpanded,
  onToggleExpanded 
}: AttributeControlProps) {
  const getCategoryColors = () => {
    switch (category) {
      case 'physical':
        return { name: 'text-red-300', dots: 'bg-red-500 border-red-400', buttons: 'border-red-600' }
      case 'social':
        return { name: 'text-blue-300', dots: 'bg-blue-500 border-blue-400', buttons: 'border-blue-600' }
      case 'mental':
        return { name: 'text-purple-300', dots: 'bg-purple-500 border-purple-400', buttons: 'border-purple-600' }
      default:
        return { name: 'text-red-300', dots: 'bg-red-500 border-red-400', buttons: 'border-red-600' }
    }
  }
  
  const colors = getCategoryColors()

  const handleChange = (delta: number) => {
    const newValue = value + delta
    if (newValue >= 1 && newValue <= 5) {
      onChange(category, attrKey, newValue)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
        {/* Nome à esquerda */}
        <div className="flex-1">
          <span className={`font-medium ${colors.name}`}>{attrData.name}</span>
        </div>
        
        {/* Pontos no meio */}
        <div className="flex items-center justify-center space-x-2 flex-1">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-full border ${
                  value >= level
                    ? colors.dots
                    : 'border-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Controles à direita */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleChange(-1)}
            disabled={disabled || value <= 1}
            className={`w-8 h-8 p-0 text-red-400 ${colors.buttons} hover:bg-red-900/20`}
          >
            <Minus className="w-3 h-3" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleChange(1)}
            disabled={disabled || value >= 5}
            className={`w-8 h-8 p-0 text-green-400 ${colors.buttons} hover:bg-green-900/20`}
          >
            <Plus className="w-3 h-3" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleExpanded}
            className="w-8 h-8 p-0 text-white hover:bg-gray-700"
          >
            ?
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-900/50 p-4 rounded-lg space-y-3 text-sm">
          <div>
            <span className={`font-medium ${colors.name}`}>Descrição: </span>
            <span className="text-gray-300">{attrData.description}</span>
          </div>
          
          <div>
            <span className={`font-medium ${colors.name}`}>Níveis:</span>
            <div className="mt-1 space-y-1">
              {Object.entries(attrData.levels).map(([level, desc]) => (
                <div key={level} className="flex items-start space-x-2">
                  <span className={`${colors.name.replace('300', '400')} font-mono`}>●</span>
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

// Descrições dos atributos por nível
const ATTRIBUTE_DESCRIPTIONS = {
  strength: {
    name: 'Força',
    description: 'A Força é o poder puro e bruto de um personagem. Ela indica quanto peso um personagem é capaz de levantar, quanto ele pode empurrar e com qual força ele pode atingir um outro personagem ou objeto. A Característica Força é adicionada à parada de dano de um personagem quando ele atinge um personagem em combate corpo-a-corpo. Ela também é usada quando o personagem deseja quebrar, levantar ou carregar alguma coisa, ou quando deseja pular grandes distâncias.',
    levels: {
      1: 'Fraco: Você pode levantar 20 kg',
      2: 'Médio: Você pode levantar 50 kg',
      3: 'Bom: Você pode levantar 125 kg',
      4: 'Excepcional: Você pode levantar 200 kg',
      5: 'Extraordinário: Você pode levantar 325 kg e esmagar crânios como uvas.'
    }
  },
  dexterity: {
    name: 'Destreza',
    description: 'O Atributo Destreza mede a habilidade física geral de um personagem. Ela abrange a velocidade, agilidade e a rapidez geral do personagem, assim como sua agilidade em manipular objetos com controle e precisão. Também incluídos sob o título Destreza estão a coordenação visual e motora, os reflexos e a graciosidade dos movimentos.',
    levels: {
      1: 'Fraco: Você é desajeitado e deselegante. Abaixe essa arma antes que você se machuque.',
      2: 'Médio: Você não é nenhum estúpido, mas também não é um bailarino.',
      3: 'Bom: Você possui algum potencial atlético.',
      4: 'Excepcional: Você poderia ser um acrobata se quisesse.',
      5: 'Extraordinário: Seus movimentos são fluidos e hipnóticos — quase sobrenaturais.'
    }
  },
  stamina: {
    name: 'Vigor',
    description: 'A Característica Vigor reflete a saúde, a resistência e o poder de recuperação do personagem. Ela indica por quanto tempo um personagem pode se esforçar e quanta punição física ele é capaz de suportar antes de sofrer traumas físicos. O Vigor também inclui um pouco de força psicológica, indicando a determinação e a tenacidade de um personagem em não desistir.',
    levels: {
      1: 'Fraco: Você se machuca com um vento forte.',
      2: 'Médio: Você tem saúde mediana e aguenta um soco ou dois.',
      3: 'Bom: Você está em boa forma e raramente fica doente.',
      4: 'Excepcional: Você pode correr — e talvez vencer — em qualquer maratona que escolher.',
      5: 'Extraordinário: Você possui a constituição de um verdadeiro Hércules.'
    }
  },
  charisma: {
    name: 'Carisma',
    description: 'O Carisma é a habilidade de um personagem em atrair e agradar os outros através de sua personalidade. O Carisma é usado quando um personagem tenta ganhar a simpatia de outro ou encorajá-lo a confiar nele. O Carisma descreve a habilidade de um personagem de convencer os outros a concordarem com o seu ponto de vista.',
    levels: {
      1: 'Fraco: Pare de cutucar o nariz.',
      2: 'Médio: Você é razoavelmente agradável e tem muitos amigos.',
      3: 'Bom: As pessoas confiam implicitamente em você.',
      4: 'Excepcional: Você tem um magnetismo pessoal significativo.',
      5: 'Extraordinário: Culturas inteiras poderiam seguir a sua liderança.'
    }
  },
  manipulation: {
    name: 'Manipulação',
    description: 'A Manipulação mede a habilidade de auto-expressão de um personagem com o objetivo de fazer com que os outros compartilhem de suas perspectivas ou sigam seus caprichos. A Manipulação é usada para enganar, blefar, usar de lábia e despachar outros personagens.',
    levels: {
      1: 'Fraco: Uma pessoa de poucas (e frequentemente ineficientes) palavras.',
      2: 'Médio: Você consegue enganar algumas pessoas, algumas vezes, como qualquer outra pessoa.',
      3: 'Bom: Você nunca paga o preço integral.',
      4: 'Excepcional: Você poderia ser um político ou o líder de um culto.',
      5: 'Extraordinário: "E claro que eu vou dizer ao príncipe que fui eu quem tentou fincar a estaca!"'
    }
  },
  appearance: {
    name: 'Aparência',
    description: 'O Atributo Aparência mede a beleza de um personagem. Mais do que o visual, a Aparência é a soma da graciosidade, beleza e do inexplicável je ne sais quoi que tornam as pessoas desejáveis. Em situações onde a primeira impressão é fundamental, um personagem não pode ter mais dados em uma parada Social do que o seu nível em Aparência.',
    levels: {
      1: 'Fraco: Feio como um macaco.',
      2: 'Médio: Você não se destaca na multidão, nem para melhor e nem para pior.',
      3: 'Bom: Estranhos se oferecem para lhe pagar uma bebida.',
      4: 'Excepcional: Você é atraente o suficiente para ser um modelo e as pessoas frequentemente lhe dizem isso.',
      5: 'Extraordinário: Você causa tanto ciúmes insanos como reverências beatas.'
    }
  },
  perception: {
    name: 'Percepção',
    description: 'A percepção mede a habilidade do personagem de observar seus arredores. Pode envolver um esforço consciente, mas é mais frequentemente intuitivo, conforme os sentidos aguçados do personagem notam que algo está fora do normal. A Percepção é usada para determinar se o personagem entende uma dada situação ou detecta um estímulo no ambiente.',
    levels: {
      1: 'Fraco: Talvez você seja absurdamente distraído, talvez meramente um cabeça-de-vento; de qualquer modo, até mesmo os detalhes mais óbvios o enganam.',
      2: 'Médio: Você desconhece os detalhes, mas está ciente do todo.',
      3: 'Bom: Você distingue temperamentos, texturas e pequenas mudanças no ambiente.',
      4: 'Excepcional: Praticamente nada lhe passa desapercebido.',
      5: 'Extraordinário: Você observa instantaneamente coisas que são quase imperceptíveis aos sentidos humanos.'
    }
  },
  intelligence: {
    name: 'Inteligência',
    description: 'O Atributo Inteligência se refere à compreensão do personagem sobre os fatos e conhecimentos. Governa a habilidade de argumentar, resolver problemas e avaliar situações. Também abrange o senso crítico e a flexibilidade de pensamento.',
    levels: {
      1: 'Fraco: Não é a faca mais afiada da gaveta (QI 80).',
      2: 'Médio: Esperto o suficiente para perceber que é normal (QI 100).',
      3: 'Bom: Mais esclarecido que as massas (QI 120).',
      4: 'Excepcional: Você não é apenas brilhante, você é absolutamente brilhante (QI 140).',
      5: 'Extraordinário: Um verdadeiro gênio (QI 160+).'
    }
  },
  wits: {
    name: 'Raciocínio',
    description: 'A Característica Raciocínio mede a habilidade de um personagem de pensar rapidamente e reagir com velocidade a certas situações. Também reflete a esperteza geral do personagem. Personagens com altos níveis de Raciocínio quase sempre têm um plano e se adaptam a novos ambientes com rapidez notável.',
    levels: {
      1: 'Fraco: Puxe meu dedo.',
      2: 'Médio: Você sabe quando apostar e quando passar no pôquer.',
      3: 'Bom: Você raramente é pego de surpresa ou fica sem palavras.',
      4: 'Excepcional: Você é uma daquelas pessoas que fazem os outros pensar, "Oh, eu deveria ter dito isso..." no dia seguinte.',
      5: 'Extraordinário: Você pensa e responde quase tão velozmente quanto é capaz de agir.'
    }
  }
}

interface AttributesStepProps {
  character: Partial<Character>
  chronicle: Chronicle
  onChange: (updates: Partial<Character>) => void
}

export default function AttributesStep({ character, chronicle, onChange }: AttributesStepProps) {
  const [expandedAttributes, setExpandedAttributes] = useState<{[key: string]: boolean}>({})
  const [expandedAttribute, setExpandedAttribute] = useState<string | null>(null)
  
  const toggleExpanded = (attrKey: string) => {
    setExpandedAttributes(prev => ({
      ...prev,
      [attrKey]: !prev[attrKey]
    }))
  }
  
  const attributes = character.attributes_json || {
    physical: { strength: 1, dexterity: 1, stamina: 1 },
    social: { charisma: 1, manipulation: 1, appearance: 1 },
    mental: { perception: 1, intelligence: 1, wits: 1 }
  }

  const maxLevel = chronicle.settings_json.limits.maxAttributeAtCreation || 4
  
  // Calcular pontos gastos por categoria (cada atributo começa em 1)
  const physicalPointsSpent = Object.values(attributes.physical).reduce((sum, val) => sum + (val as number), 0) - 3
  const socialPointsSpent = Object.values(attributes.social).reduce((sum, val) => sum + (val as number), 0) - 3
  const mentalPointsSpent = Object.values(attributes.mental).reduce((sum, val) => sum + (val as number), 0) - 3

  const physicalPointsTotal = chronicle.settings_json.initialPoints.physicalAttributes || 7
  const socialPointsTotal = chronicle.settings_json.initialPoints.socialAttributes || 5
  const mentalPointsTotal = chronicle.settings_json.initialPoints.mentalAttributes || 3
  
  const physicalPointsRemaining = physicalPointsTotal - physicalPointsSpent
  const socialPointsRemaining = socialPointsTotal - socialPointsSpent
  const mentalPointsRemaining = mentalPointsTotal - mentalPointsSpent

  const updateAttribute = (category: keyof CharacterAttributes, attr: string, value: number) => {
    const newAttributes = {
      ...attributes,
      [category]: {
        ...attributes[category],
        [attr]: Math.max(1, Math.min(5, value))
      }
    }
    onChange({ attributes_json: newAttributes })
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Atributos</h2>
        <p className="text-gray-300">
          Defina as características básicas do seu personagem. Todos começam no nível 1.
        </p>
      </div>


      {/* Atributos Físicos */}
      <Card className="bg-gray-800 border-red-900">
        <CardHeader>
          <CardTitle className="text-red-300 flex items-center justify-between">
            Atributos Físicos
            <span className="text-sm font-normal">
              Pontos: {physicalPointsRemaining} de {physicalPointsTotal}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AttributeControl 
            attrKey="strength"
            category="physical" 
            attrData={ATTRIBUTE_DESCRIPTIONS.strength}
            value={attributes.physical.strength}
            onChange={updateAttribute}
            isExpanded={expandedAttributes.strength}
            onToggleExpanded={() => toggleExpanded('strength')}
          />
          <AttributeControl 
            attrKey="dexterity"
            category="physical" 
            attrData={ATTRIBUTE_DESCRIPTIONS.dexterity}
            value={attributes.physical.dexterity}
            onChange={updateAttribute}
            isExpanded={expandedAttributes.dexterity}
            onToggleExpanded={() => toggleExpanded('dexterity')}
          />
          <AttributeControl 
            attrKey="stamina"
            category="physical" 
            attrData={ATTRIBUTE_DESCRIPTIONS.stamina}
            value={attributes.physical.stamina}
            onChange={updateAttribute}
            isExpanded={expandedAttributes.stamina}
            onToggleExpanded={() => toggleExpanded('stamina')}
          />
        </CardContent>
      </Card>

      {/* Atributos Sociais */}
      <Card className="bg-gray-800 border-blue-900">
        <CardHeader>
          <CardTitle className="text-blue-300 flex items-center justify-between">
            Atributos Sociais
            <span className="text-sm font-normal">
              Pontos: {socialPointsRemaining} de {socialPointsTotal}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AttributeControl 
            attrKey="charisma"
            category="social" 
            attrData={ATTRIBUTE_DESCRIPTIONS.charisma}
            value={attributes.social.charisma}
            onChange={updateAttribute}
            isExpanded={expandedAttributes.charisma}
            onToggleExpanded={() => toggleExpanded('charisma')}
          />
          <AttributeControl 
            attrKey="manipulation"
            category="social" 
            attrData={ATTRIBUTE_DESCRIPTIONS.manipulation}
            value={attributes.social.manipulation}
            onChange={updateAttribute}
            isExpanded={expandedAttributes.manipulation}
            onToggleExpanded={() => toggleExpanded('manipulation')}
          />
          <AttributeControl 
            attrKey="appearance"
            category="social" 
            attrData={ATTRIBUTE_DESCRIPTIONS.appearance}
            value={attributes.social.appearance}
            onChange={updateAttribute}
            isExpanded={expandedAttributes.appearance}
            onToggleExpanded={() => toggleExpanded('appearance')}
          />
        </CardContent>
      </Card>

      {/* Atributos Mentais */}
      <Card className="bg-gray-800 border-purple-900">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center justify-between">
            Atributos Mentais
            <span className="text-sm font-normal">
              Pontos: {mentalPointsRemaining} de {mentalPointsTotal}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AttributeControl 
            attrKey="perception"
            category="mental" 
            attrData={ATTRIBUTE_DESCRIPTIONS.perception}
            value={attributes.mental.perception}
            onChange={updateAttribute}
            isExpanded={expandedAttributes.perception}
            onToggleExpanded={() => toggleExpanded('perception')}
          />
          <AttributeControl 
            attrKey="intelligence"
            category="mental" 
            attrData={ATTRIBUTE_DESCRIPTIONS.intelligence}
            value={attributes.mental.intelligence}
            onChange={updateAttribute}
            isExpanded={expandedAttributes.intelligence}
            onToggleExpanded={() => toggleExpanded('intelligence')}
          />
          <AttributeControl 
            attrKey="wits"
            category="mental" 
            attrData={ATTRIBUTE_DESCRIPTIONS.wits}
            value={attributes.mental.wits}
            onChange={updateAttribute}
            isExpanded={expandedAttributes.wits}
            onToggleExpanded={() => toggleExpanded('wits')}
          />
        </CardContent>
      </Card>

      {/* Dica */}
      <Card className="bg-gray-800 border-yellow-600">
        <CardHeader>
          <CardTitle className="text-yellow-300 text-sm">💡 Dica</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 text-sm">
            Todos os atributos começam no nível 1. Distribua os pontos por categoria: {physicalPointsTotal} Físicos, {socialPointsTotal} Sociais e {mentalPointsTotal} Mentais. 
            Nenhum atributo pode exceder {maxLevel} durante a criação. Pense no conceito do seu personagem 
            ao distribuir os pontos - um hacker pode ter Inteligência alta, enquanto um lutador privilegia Força.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}