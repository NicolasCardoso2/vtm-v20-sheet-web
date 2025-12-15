'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Character, Chronicle, CharacterAttributes } from '@/types'
import { Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react'

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
  const [expandedAttribute, setExpandedAttribute] = useState<string | null>(null)
  
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

  const AttributeControl = ({ 
    category, 
    attr, 
    label, 
    value 
  }: { 
    category: keyof CharacterAttributes
    attr: string
    label: string
    value: number 
  }) => {
    const remainingPoints = category === 'physical' ? physicalPointsRemaining : 
                          category === 'social' ? socialPointsRemaining : 
                          mentalPointsRemaining
    
    const isExpanded = expandedAttribute === attr
    const attrData = ATTRIBUTE_DESCRIPTIONS[attr as keyof typeof ATTRIBUTE_DESCRIPTIONS]
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded border border-gray-600">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setExpandedAttribute(isExpanded ? null : attr)}
              className="h-6 w-6 p-0 border-gray-600 text-white hover:text-red-300 hover:bg-gray-700"
            >
              ?
            </Button>
            <span className="text-white font-medium">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateAttribute(category, attr, value - 1)}
              disabled={value <= 1}
              className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-white font-bold w-8 text-center">{value}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateAttribute(category, attr, value + 1)}
              disabled={value >= maxLevel || remainingPoints <= 0}
              className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isExpanded && attrData && (
          <div className="bg-gray-900/50 rounded border border-gray-700 p-4 ml-4">
            <h4 className="text-white font-medium mb-2">{attrData.name}</h4>
            {attrData.description && (
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{attrData.description}</p>
            )}
            <h5 className="text-white font-medium mb-3">Níveis:</h5>
            <div className="space-y-2">
              {Object.entries(attrData.levels).map(([level, description]) => (
                <div key={level} className="flex items-start gap-3">
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < parseInt(level) ? 'bg-red-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm ${
                    parseInt(level) === value ? 'text-white font-medium' : 'text-gray-300'
                  }`}>
                    {description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">


      {/* Atributos Físicos */}
      <Card className="bg-red-900/20 border-red-600">
        <CardHeader>
          <CardTitle className="text-red-300 flex justify-between items-center">
            Atributos Físicos
            <span className="text-sm font-normal">
              Pontos: {physicalPointsRemaining} de {physicalPointsTotal}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AttributeControl 
            category="physical" 
            attr="strength" 
            label="Força" 
            value={attributes.physical.strength} 
          />
          <AttributeControl 
            category="physical" 
            attr="dexterity" 
            label="Destreza" 
            value={attributes.physical.dexterity} 
          />
          <AttributeControl 
            category="physical" 
            attr="stamina" 
            label="Vigor" 
            value={attributes.physical.stamina} 
          />
        </CardContent>
      </Card>

      {/* Atributos Sociais */}
      <Card className="bg-blue-900/20 border-blue-600">
        <CardHeader>
          <CardTitle className="text-blue-300 flex justify-between items-center">
            Atributos Sociais
            <span className="text-sm font-normal">
              Pontos: {socialPointsRemaining} de {socialPointsTotal}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AttributeControl 
            category="social" 
            attr="charisma" 
            label="Carisma" 
            value={attributes.social.charisma} 
          />
          <AttributeControl 
            category="social" 
            attr="manipulation" 
            label="Manipulação" 
            value={attributes.social.manipulation} 
          />
          <AttributeControl 
            category="social" 
            attr="appearance" 
            label="Aparência" 
            value={attributes.social.appearance} 
          />
        </CardContent>
      </Card>

      {/* Atributos Mentais */}
      <Card className="bg-purple-900/20 border-purple-600">
        <CardHeader>
          <CardTitle className="text-purple-300 flex justify-between items-center">
            Atributos Mentais
            <span className="text-sm font-normal">
              Pontos: {mentalPointsRemaining} de {mentalPointsTotal}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AttributeControl 
            category="mental" 
            attr="perception" 
            label="Percepção" 
            value={attributes.mental.perception} 
          />
          <AttributeControl 
            category="mental" 
            attr="intelligence" 
            label="Inteligência" 
            value={attributes.mental.intelligence} 
          />
          <AttributeControl 
            category="mental" 
            attr="wits" 
            label="Raciocínio" 
            value={attributes.mental.wits} 
          />
        </CardContent>
      </Card>

      {/* Dica */}
      <Card className="bg-yellow-900/20 border-yellow-600">
        <CardHeader>
          <CardTitle className="text-yellow-300 text-sm">Dica</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-200 text-sm">
            Todos os atributos começam no nível 1. Distribua os pontos por categoria: {physicalPointsTotal} Físicos, {socialPointsTotal} Sociais e {mentalPointsTotal} Mentais. 
            Nenhum atributo pode exceder {maxLevel} durante a criação. Pense no conceito do seu personagem 
            ao distribuir os pontos - um hacker pode ter Inteligência alta, enquanto um lutador privilegia Força.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}