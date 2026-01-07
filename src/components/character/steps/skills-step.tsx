'use client'

import { useState } from 'react'
import { Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SkillsStepProps {
  skills: {
    talents: { [key: string]: number }
    skills: { [key: string]: number }
    knowledges: { [key: string]: number }
    specializations: { [key: string]: string[] }
  }
  onSkillsChange: (skills: {
    talents: { [key: string]: number }
    skills: { [key: string]: number }
    knowledges: { [key: string]: number }
    specializations: { [key: string]: string[] }
  }) => void
}

const SKILL_DESCRIPTIONS = {
  // Talentos
  alertness: {
    name: 'Prontidão',
    description: 'Aptidão de perceber o que acontece ao seu redor, mesmo quando você não está procurando ativamente. Costuma ser somada à Percepção e é mais efetiva para estímulos físicos (e não pistas sociais/psicológicas).',
    levels: {
      1: 'Amador: Você não é nenhum autômato estúpido.',
      2: 'Praticante: Bisbilhoteiro ocasional.',
      3: 'Competente: Você mantém um olhar atento à sua volta.',
      4: 'Especialista: Por paranoia ou bom senso, você raramente é apanhado desprevenido.',
      5: 'Mestre: Seus sentidos são tão aguçados quanto os de um animal selvagem.'
    },
    possessed: 'Caçadores, guarda-costas, pessoal de segurança, jornalistas, ladrões.',
    specializations: 'Ruídos, bisbilhotar, emboscadas, armas ocultas, multidões, florestas, animais.'
  },
  athletics: {
    name: 'Esporte',
    description: 'Habilidades atléticas básicas: corridas, saltos, arremessos, natação e atividades esportivas similares. Não inclui levantamento de peso (força bruta) nem feitos cobertos por outras Habilidades (como Armas Brancas).',
    levels: {
      1: 'Amador: Você teve uma infância ativa.',
      2: 'Praticante: Atleta do colégio.',
      3: 'Competente: Atleta profissional.',
      4: 'Especialista: Ponto alto no seu esporte.',
      5: 'Mestre: Medalhista olímpico.'
    },
    possessed: 'Atletas, entusiastas, guardas-florestais, jóqueis, garotos.',
    specializations: 'Natação, escalar, acrobacia, dançar, corrida de resistência, esporte específico.'
  },
  brawl: {
    name: 'Briga',
    description: 'Capacidade de lutar corpo-a-corpo "com unhas e dentes", por treino (artes marciais) ou experiência. Envolve coordenação, resistência à dor, rapidez e dureza.',
    levels: {
      1: 'Amador: Mexiam com você quando criança.',
      2: 'Praticante: Você já viu algumas brigas de bar.',
      3: 'Competente: Você luta com frequência e costuma terminar melhor do que o oponente.',
      4: 'Especialista: Você poderia competir seriamente em um circuito de boxe.',
      5: 'Mestre: Você é capaz de matar três homens em quatro segundos.'
    },
    possessed: 'Militares, policiais, valentões/capangas.',
    specializations: 'Boxe, luta romana, chutes, karatê, judô, boxe tailandês, garras, arremessos, imobilizações, luta específica.'
  },
  dodge: {
    name: 'Esquiva',
    description: 'Auto-preservação: evitar golpes, tiros ou até carros. Inclui se jogar, mergulhar, saltar e encontrar cobertura para sair da linha do ataque.',
    levels: {
      1: 'Amador: Você se protege instintivamente.',
      2: 'Praticante: Você teve aulas de defesa pessoal.',
      3: 'Competente: Você evita pedras e talvez até facas.',
      4: 'Especialista: Só um lutador habilidoso conseguiria acertá-lo.',
      5: 'Mestre: Você pode virtualmente desviar-se de balas em campo aberto.'
    },
    possessed: 'Policiais, criminosos, lutadores, boxeadores, moradores de áreas violentas.',
    specializations: 'Encontrar abrigo, esquivar-se, finta, pular.'
  },
  empathy: {
    name: 'Empatia',
    description: 'Entender emoções e motivações alheias; identificar mentiras; conectar-se a ponto de ser afetado pelo que os outros sentem.',
    levels: {
      1: 'Amador: Você às vezes oferece o ombro para alguém chorar.',
      2: 'Praticante: Às vezes você literalmente sente o sofrimento do outro.',
      3: 'Competente: Percepção aguçada das motivações alheias.',
      4: 'Especialista: É praticamente impossível mentir para você.',
      5: 'Mestre: A alma humana não esconde seus mistérios de você.'
    },
    possessed: 'Assistentes sociais, pais, atores, psicólogos, detetives, sedutores, médiuns, melhores amigos.',
    specializations: 'Emoções, personalidades, motivações, ganhar confiança.'
  },
  expression: {
    name: 'Expressão',
    description: 'Capacidade de expressar opiniões com força (conversa, poesia, escrita, e-mail etc.). Também cobre atuação, expressão corporal, redação criativa e artes literárias.',
    levels: {
      1: 'Amador: Você vai além da poesia no caderno da escola.',
      2: 'Praticante: Você poderia liderar um grupo de debates na faculdade.',
      3: 'Competente: Você poderia ser um escritor de sucesso.',
      4: 'Especialista: Seus trabalhos merecem prêmio.',
      5: 'Mestre: Visionários assim surgem uma vez por geração.'
    },
    possessed: 'Atores, escritores, poetas, políticos, jornalistas, instrutores, agitadores populares.',
    specializations: 'Atuação, poesia, ficção, improviso, conversação.'
  },
  intimidation: {
    name: 'Intimidação',
    description: 'Coerção por ameaça, violência física ou força de personalidade. Você sabe o método certo para cada ocasião.',
    levels: {
      1: 'Amador: Adolescente cruel e tirano.',
      2: 'Praticante: Assaltante.',
      3: 'Competente: Sargento instrutor.',
      4: 'Especialista: Seu ar de autoridade acovarda estranhos.',
      5: 'Mestre: Você pode assustar animais sanguinários.'
    },
    possessed: 'Tiranos, executivos, oficiais do exército, capangas, seguranças, gângsters, Sabá.',
    specializations: 'Ameaças ocultas, hierarquia, coerção física, chantagens.'
  },
  leadership: {
    name: 'Liderança',
    description: 'Inspirar e guiar pessoas. Menos manipulação e mais "presença" como alguém digno de seguir. Costuma ligar-se mais a Carisma do que a Manipulação.',
    levels: {
      1: 'Amador: Capitão do time infantil.',
      2: 'Praticante: Presidente do corpo estudantil.',
      3: 'Competente: Diretor eficiente.',
      4: 'Especialista: Candidato a presidente.',
      5: 'Mestre: Senhor e mestre de uma nação.'
    },
    possessed: 'Políticos, príncipes, gerentes, executivos, oficiais do exército, policial.',
    specializations: 'Oratória, constrangimento, amigável, aberto, nobre, militar, autoridade.'
  },
  streetwise: {
    name: 'Manha',
    description: 'Conhecimento das ruas: misturar-se, ouvir rumores, entender gírias e participar de negócios escusos.',
    levels: {
      1: 'Amador: Você sabe quem vende drogas.',
      2: 'Praticante: Você impõe respeito nas ruas.',
      3: 'Competente: Você poderia liderar uma gangue.',
      4: 'Especialista: Você tem pouco a temer até nas piores vizinhanças.',
      5: 'Mestre: "Se você ainda não ouviu, ainda não foi dito."'
    },
    possessed: 'Criminosos, sem-teto, repórteres, detetives de entorpecentes, Sabá.',
    specializations: 'Receptadores, drogas ilegais, armas ilegais, rumores, gangues, bater carteira, gíria local.'
  },
  subterfuge: {
    name: 'Lábia',
    description: 'Ocultar motivos, ler motivos alheios e usá-los contra a pessoa. Intrigas, segredos, jogos duplos; útil para sedução e espionagem.',
    levels: {
      1: 'Amador: Você conta mentirinhas inofensivas.',
      2: 'Praticante: Vampiro.',
      3: 'Competente: Advogado criminalista.',
      4: 'Especialista: Agente disfarçado.',
      5: 'Mestre: Ninguém suspeitaria de você.'
    },
    possessed: 'Políticos, advogados, vampiros, adolescentes, vigaristas, artistas famosos.',
    specializations: 'Sedução, mentiras impecáveis, simular mortalidade.'
  },

  // Perícias
  animalKen: {
    name: 'Empatia com Animais',
    description: 'Entender padrões de comportamento animal; prever reações; treinar/domesticar; acalmar ou enervar animais.',
    levels: {
      1: 'Amador: Um cavalo domesticado deixa você acariciá-lo.',
      2: 'Praticante: Ensina truques simples a um bichinho.',
      3: 'Competente: Treina um animal como "espião".',
      4: 'Especialista: Treinador de circo.',
      5: 'Mestre: Domestica selvagens sem poderes sobrenaturais.'
    },
    possessed: 'Fazendeiros, adestradores, guardas de zoológico, guardas-florestais, donos de animais.',
    specializations: 'Cachorros, ataque, grandes felinos, cavalos, animais de fazenda, falcoaria.'
  },
  crafts: {
    name: 'Ofícios',
    description: 'Construir e consertar coisas com as mãos (carpintaria, couro, costura, mecânica etc.). Também pode criar arte duradoura. Escolha sempre uma especialização, mesmo tendo alguma habilidade em múltiplos campos.',
    levels: {
      1: 'Amador: Carpintaria da escola.',
      2: 'Praticante: Começa a desenvolver um estilo próprio.',
      3: 'Competente: Poderia viver do seu trabalho.',
      4: 'Especialista: Seu trabalho é citado em livros universitários da área.',
      5: 'Mestre: Sua arte é virtualmente sem igual.'
    },
    possessed: 'Mecânicos, artesãos, artistas, projetistas, inventores, rústicos.',
    specializations: 'Cerâmica, costura, conserto de casas, carpintaria, avaliação, carburadores, outras profissões.'
  },
  drive: {
    name: 'Condução',
    description: 'Dirigir carros e possivelmente outros veículos. Familiaridade com veículos complexos (tanques, caminhões) não é automática; a dificuldade varia conforme experiência.',
    levels: {
      1: 'Amador: Só dirige automático.',
      2: 'Praticante: Dirige câmbio manual.',
      3: 'Competente: Caminhoneiro profissional.',
      4: 'Especialista: Piloto audacioso de corridas ou tanques.',
      5: 'Mestre: Faz um Fusca manobrar como filme de espionagem.'
    },
    possessed: 'Choferes, caminhoneiros, pilotos de corrida, maioria dos residentes de nações ocidentais do séc. XX.',
    specializations: 'Off-road, veículos modificados, curvas, câmbios manuais, paradas súbitas, tráfego pesado.'
  },
  etiquette: {
    name: 'Etiqueta',
    description: 'Comportamento formal (mortal e dos Membros). A especialidade costuma ser a cultura que você melhor conhece. Usada em diplomacia, sedução, dança, bons modos e negociações.',
    levels: {
      1: 'Amador: Sabe quando ficar calado.',
      2: 'Praticante: Já foi a eventos sociais importantes.',
      3: 'Competente: Sabe usar talheres e utensílios de prata obscuros.',
      4: 'Especialista: Sua Majestade acharia você charmoso.',
      5: 'Mestre: Poderia terminar — ou iniciar — guerras num jantar.'
    },
    possessed: 'Diplomatas, viajantes, alta sociedade, executivos.',
    specializations: 'Jantares formais, negócios, cultura de rua, sociedade dos Membros.'
  },
  firearms: {
    name: 'Arma de Fogo',
    description: 'Familiaridade com armas de fogo (pistolas, rifles, metralhadoras etc.), incluindo reconhecer, limpar, consertar e atirar. Pode servir para destravar armas (Raciocínio + Armas de Fogo). Não inclui artilharia pesada (morteiros/canhões).',
    levels: {
      1: 'Amador: Pistola de água na infância.',
      2: 'Praticante: Treinava semanalmente no clube de tiro.',
      3: 'Competente: Sobreviveu a um ou dois tiroteios.',
      4: 'Especialista: Poderia viver de matar pessoas.',
      5: 'Mestre: Pratica desde a invenção do Winchester.'
    },
    possessed: 'Sabá, policiais, militares, sobreviventes, caçadores.',
    specializations: 'Sacar rápido, armeiro, pistolas, atirador de elite, revólveres, espingardas.'
  },
  larceny: {
    name: 'Segurança',
    description: 'Ferramentas e técnicas de arrombamento, desativar alarmes, ligação direta, abrir cofres, invasão. Também pode ser usada para criar "sistemas" ou deduzir invasões.',
    levels: {
      1: 'Amador: Arromba uma fechadura simples.',
      2: 'Praticante: Faz ligação direta em carros.',
      3: 'Competente: Engana/desarma alarmes residenciais.',
      4: 'Especialista: Arromba um cofre.',
      5: 'Mestre: Desarma — ou instala — uma bomba no Pentágono.'
    },
    possessed: 'Ladrões, consultores de segurança, policiais.',
    specializations: 'Cofres, ligação direta, alarmes elétricos, blindagens.'
  },
  melee: {
    name: 'Armas Brancas',
    description: 'Uso de armas de mão (espadas, clavas, facas, equipamentos marciais como sai/nunchaku). Estacas de madeira entram aqui.',
    levels: {
      1: 'Amador: Sabe segurar uma faca.',
      2: 'Praticante: Talvez tenha participado de briga de rua.',
      3: 'Competente: Poderia estar na equipe de esgrima da faculdade.',
      4: 'Especialista: Mantém a ordem na corte de um príncipe.',
      5: 'Mestre: Inimigos preferem enfrentar uma SWAT a encarar sua lâmina.'
    },
    possessed: 'Assassinos, membros de gangue, artistas marciais, policiais, duelistas, fãs medievais.',
    specializations: 'Facas, espadas, bastões improvisados, estacas, desarmar, machados.'
  },
  performance: {
    name: 'Performance',
    description: 'Fazer performances artísticas (cantar, dançar, atuar, tocar instrumento). Cobre técnica e capacidade de envolver a audiência.',
    levels: {
      1: 'Amador: Canta em coral de igreja.',
      2: 'Praticante: Papel principal em produção universitária.',
      3: 'Competente: Disputado pelas boates locais.',
      4: 'Especialista: Potencial para sensação nacional.',
      5: 'Mestre: Virtuoso sem igual.'
    },
    possessed: 'Músicos, estudantes, atores, bailarinas, mímicos.',
    specializations: 'Dança, canto, rock and roll, atuação, solos de guitarra, bêbado no karaokê.'
  },
  stealth: {
    name: 'Furtividade',
    description: 'Evitar ser detectado, escondido ou em movimento. Normalmente é testada contra a Percepção de alguém.',
    levels: {
      1: 'Amador: Esconde-se num quarto escuro.',
      2: 'Praticante: Na rua, usa sombras e postes para se ocultar.',
      3: 'Competente: Encontra presas à noite sem dificuldade.',
      4: 'Especialista: Move-se em silêncio sobre folhas secas.',
      5: 'Mestre: Nível "Ancião Nosferatu".'
    },
    possessed: 'Ladrões, assassinos, Membros, espiões, repórteres, autoridades.',
    specializations: 'Esconder-se, mover-se em silêncio, sombras, multidões.'
  },
  survival: {
    name: 'Sobrevivência',
    description: 'Vida ao ar livre: encontrar abrigo, navegar, rastrear presas, sobreviver sem conforto e lidar com perigos da natureza. Ao usar Furtividade em áreas selvagens, você não pode ter parada de dados maior que seu nível em Sobrevivência.',
    levels: {
      1: 'Amador: Sobrevive a uma caminhada de 8 km.',
      2: 'Praticante: Vive sem conforto.',
      3: 'Competente: Sabe cogumelos venenosos e comestíveis.',
      4: 'Especialista: Vive meses na área selvagem escolhida.',
      5: 'Mestre: Largado nu nos Andes, você se vira sozinho.'
    },
    possessed: 'Escoteiros, soldados, entusiastas, sobreviventes, caçadores, guardas-florestais.',
    specializations: 'Rastrear, áreas florestais, selvas, armadilhas, caça.'
  },

  // Conhecimentos
  academics: {
    name: 'Acadêmicos',
    description: 'Erudição em "ciências humanas": literatura, história, arte, filosofia e áreas liberais. Pode impressionar no Elísio e ajudar na Jyhad.',
    levels: {
      1: 'Estudante: Você sabe que 1066 é mais que um código de área.',
      2: 'Universitário: Cita clássicos, identifica movimentos culturais e diferencia Ming de Moghul.',
      3: 'Mestre: Publica artigo em jornal erudito.',
      4: 'Doutor: Professor emérito.',
      5: 'Catedrático: Reconhecido como um dos principais peritos do seu tempo.'
    },
    possessed: 'Professores, literatos, aficionados, anciões.',
    specializations: 'Pós-estrutura, pinturas impressionistas, Roma imperial, realismo americano.'
  },
  computer: {
    name: 'Computador',
    description: 'Operar e programar computadores; compreender tecnologia avançada.',
    levels: {
      1: 'Estudante: Aperta e clica.',
      2: 'Universitário: Processa dados com facilidade.',
      3: 'Mestre: Desenvolve software.',
      4: 'Doutor: Vive bem como consultor de informática.',
      5: 'Catedrático: Cria tecnologia de ponta.'
    },
    possessed: 'Hackers, funcionários de escritório, programadores, processadores de dados, estudantes.',
    specializations: 'Linguagens, internet, quebrar códigos, vírus, recuperação de dados.'
  },
  finance: {
    name: 'Finanças',
    description: 'Comércio, avaliação, câmbio e registros. Útil para vendas, contabilidade, apostas e mercado.',
    levels: {
      1: 'Estudante: Aulas sobre negócios.',
      2: 'Universitário: Experiência prática e registros organizados.',
      3: 'Mestre: Bom corretor de ações.',
      4: 'Doutor: Corporações seguem sua liderança financeira.',
      5: 'Catedrático: Faz fortuna com uma nota de $20.'
    },
    possessed: 'Executivos, classe alta, cambistas, contadores, revendedores, traficantes, contrabandistas.',
    specializations: 'Mercado de ações, lavagem de dinheiro, avaliação, moedas estrangeiras, contabilidade, revenda, corporações.'
  },
  investigation: {
    name: 'Investigação',
    description: 'Notar detalhes ignorados, pesquisar e seguir pistas.',
    levels: {
      1: 'Estudante: Leu Agatha Christie o suficiente.',
      2: 'Universitário: Oficial da polícia.',
      3: 'Mestre: Detetive particular.',
      4: 'Doutor: Agente federal.',
      5: 'Catedrático: Sherlock Holmes.'
    },
    possessed: 'Detetives, fãs de mistério, policiais, bisbilhoteiros.',
    specializations: 'Criminologia, pistas ocultas, revistar, descoloração.'
  },
  law: {
    name: 'Direito',
    description: 'Leis, processos e brechas; útil para evitar prisão, arquivar processos e explorar Tradições.',
    levels: {
      1: 'Estudante: Viu muitos filmes de julgamento.',
      2: 'Universitário: Preparando-se (ou fez) exame da OAB.',
      3: 'Mestre: Chave-de-cadeia.',
      4: 'Doutor: Personalidades importantes têm seu telefone.',
      5: 'Catedrático: Encontra brechas até em contrato com o Diabo.'
    },
    possessed: 'Advogados, policiais, juízes, detetives, legisladores.',
    specializations: 'Criminal, processos, cortes, contratos, procedimentos policiais.'
  },
  linguistics: {
    name: 'Linguística',
    description: 'Você começa com uma língua nativa; para falar outras línguas (modernas ou antigas), precisa de Linguística. Em níveis altos, entende estruturas, sotaques e códigos.',
    levels: {
      1: 'Estudante: Uma língua adicional.',
      2: 'Universitário: Duas línguas adicionais.',
      3: 'Mestre: Quatro línguas adicionais.',
      4: 'Doutor: Oito línguas adicionais.',
      5: 'Catedrático: Dezesseis línguas adicionais.'
    },
    possessed: 'Diplomatas, embaixadores, viajantes, vampiros antigos, criptólogos, eruditos.',
    specializations: 'Línguas românicas, kanji, idiomas, hieróglifos, expressão escrita, códigos.'
  },
  medicine: {
    name: 'Medicina',
    description: 'Corpo humano (e em menor grau o vampírico): doenças, medicamentos, primeiros socorros, diagnóstico e tratamento.',
    levels: {
      1: 'Estudante: Cursos de primeiros socorros.',
      2: 'Universitário: Residente ou paramédico.',
      3: 'Mestre: Clínico geral.',
      4: 'Doutor: Realiza transplantes.',
      5: 'Catedrático: Respeitado mundialmente como um Esculápio moderno.'
    },
    possessed: 'Estudantes, médicos, salva-vidas, pais, paramédicos, Tzimisce.',
    specializations: 'Transplantes, emergência, venenos, patologia, farmacêuticos.'
  },
  occult: {
    name: 'Ocultismo',
    description: 'Misticismo, maldições, magia, folclore e cultura vampírica. Nem tudo é fato: pode ser rumor, mito ou especulação — mas ainda é útil.',
    levels: {
      1: 'Estudante: Frequentou a seção de esoterismo.',
      2: 'Universitário: Há alguma verdade perturbadora nos rumores.',
      3: 'Mestre: Ouviu muito e presenciou algumas coisas.',
      4: 'Doutor: Reconhece fontes falsas e tem bons palpites sobre outras.',
      5: 'Catedrático: Conhece a maioria das verdades básicas do mundo oculto.'
    },
    possessed: 'Ocultistas, supersticiosos, reformistas, Tremere.',
    specializations: 'Cultura da família, rituais, infernalistas, bruxas.'
  },
  politics: {
    name: 'Política',
    description: 'Política atual, pessoas no poder e como chegaram lá. Útil para influenciar políticos e entender estruturas de poder (mortal e Cainita).',
    levels: {
      1: 'Estudante: Ativista.',
      2: 'Universitário: Estudante de ciência política.',
      3: 'Mestre: Diretor de campanha ou locutor de rádio.',
      4: 'Doutor: Senador.',
      5: 'Catedrático: Escolhe o próximo presidente dos EUA.'
    },
    possessed: 'Ativistas, políticos, advogados, vampiros de todos os tipos.',
    specializations: 'Municipal, estadual, federal, suborno, dogma, radical, Camarilla.'
  },
  science: {
    name: 'Ciência',
    description: 'Entendimento das ciências físicas (química, biologia, física, geologia etc.) e aplicação prática.',
    levels: {
      1: 'Estudante: Conhecimentos básicos do ensino médio.',
      2: 'Universitário: Familiaridade com teorias principais.',
      3: 'Mestre: Ensina ciências no colegial.',
      4: 'Doutor: Capaz de avançar no próprio campo.',
      5: 'Catedrático: Seu Nobel está esperando.'
    },
    possessed: 'Cientistas, estudantes, pesquisadores, professores, engenheiros, técnicos, pilotos.',
    specializations: 'Química, biologia, geologia, física, astronomia.'
  }
}

const TALENT_SKILLS = ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge']
const SKILL_SKILLS = ['animalKen', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival']
const KNOWLEDGE_SKILLS = ['academics', 'computer', 'finance', 'investigation', 'law', 'linguistics', 'medicine', 'occult', 'politics', 'science']

const MAX_POINTS = {
  talents: 13,
  skills: 9,
  knowledges: 5
}

export default function SkillsStep({ skills, onSkillsChange }: SkillsStepProps) {
  const [expandedSkills, setExpandedSkills] = useState<{ [key: string]: boolean }>({})

  const toggleExpanded = (skillKey: string) => {
    setExpandedSkills(prev => {
      const isCurrentlyExpanded = prev[skillKey]
      
      // Se está expandindo uma nova skill, fecha todas as outras
      if (!isCurrentlyExpanded) {
        return { [skillKey]: true }
      }
      
      // Se está fechando a atual, apenas fecha ela
      return {}
    })
  }

  const updateSkill = (category: 'talents' | 'skills' | 'knowledges', skillKey: string, change: number) => {
    const newSkills = { ...skills }
    const currentValue = newSkills[category][skillKey] || 0
    const newValue = Math.max(0, Math.min(5, currentValue + change))
    
    // Verificar se há pontos disponíveis
    const currentTotal = Object.values(newSkills[category]).reduce((sum, val) => sum + val, 0)
    const maxForCategory = MAX_POINTS[category]
    
    if (change > 0 && currentTotal >= maxForCategory) {
      return // Não pode adicionar mais pontos
    }
    
    newSkills[category] = {
      ...newSkills[category],
      [skillKey]: newValue
    }
    
    onSkillsChange({
      ...newSkills,
      specializations: skills.specializations || {}
    })
  }

  const getTotalPoints = (category: 'talents' | 'skills' | 'knowledges') => {
    return Object.values(skills[category]).reduce((sum, val) => sum + val, 0)
  }

  const getRemainingPoints = (category: 'talents' | 'skills' | 'knowledges') => {
    return MAX_POINTS[category] - getTotalPoints(category)
  }

  const SkillControl = ({ 
    skillKey, 
    category,
    skillData 
  }: { 
    skillKey: string
    category: 'talents' | 'skills' | 'knowledges'
    skillData: any
  }) => {
    const currentValue = skills[category][skillKey] || 0
    const isExpanded = expandedSkills[skillKey]
    
    const getCategoryColors = () => {
      switch (category) {
        case 'talents':
          return { name: 'text-red-300', dots: 'bg-red-500 border-red-400', buttons: 'border-red-600' }
        case 'skills':
          return { name: 'text-blue-300', dots: 'bg-blue-500 border-blue-400', buttons: 'border-blue-600' }
        case 'knowledges':
          return { name: 'text-purple-300', dots: 'bg-purple-500 border-purple-400', buttons: 'border-purple-600' }
        default:
          return { name: 'text-red-300', dots: 'bg-red-500 border-red-400', buttons: 'border-red-600' }
      }
    }
    
    const colors = getCategoryColors()

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          {/* Nome à esquerda */}
          <div className="flex-1">
            <span className={`font-medium ${colors.name}`}>{skillData.name}</span>
          </div>
          
          {/* Pontos no meio */}
          <div className="flex items-center justify-center space-x-2 flex-1">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-full border ${
                    currentValue >= level
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
              onClick={() => updateSkill(category, skillKey, -1)}
              disabled={currentValue === 0}
              className={`
                group relative w-9 h-9 p-0 rounded-lg border-2 transition-all duration-300
                ${currentValue === 0
                  ? 'border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                  : 'border-red-700/70 text-red-300 hover:border-red-500 hover:bg-red-950/50 hover:text-red-200 hover:scale-105 active:scale-95'
                }
                shadow-lg hover:shadow-red-900/30
              `}
            >
              <Minus className="w-4 h-4 group-hover:drop-shadow-md transition-all duration-200" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateSkill(category, skillKey, 1)}
              disabled={currentValue === 5 || getRemainingPoints(category) === 0}
              className={`
                group relative w-9 h-9 p-0 rounded-lg border-2 transition-all duration-300
                ${currentValue === 5 || getRemainingPoints(category) === 0
                  ? 'border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                  : 'border-green-700/70 text-green-300 hover:border-green-500 hover:bg-green-950/50 hover:text-green-200 hover:scale-105 active:scale-95'
                }
                shadow-lg hover:shadow-green-900/30
              `}
            >
              <Plus className="w-4 h-4 group-hover:drop-shadow-md transition-all duration-200" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleExpanded(skillKey)}
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
              <span className="text-gray-300">{skillData.description}</span>
            </div>
            
            <div>
              <span className={`font-medium ${colors.name}`}>Níveis:</span>
              <div className="mt-1 space-y-1">
                {Object.entries(skillData.levels).map(([level, desc]) => (
                  <div key={level} className="flex items-start space-x-2">
                    <span className={`${colors.name.replace('300', '400')} font-mono`}>●</span>
                    <span className="text-gray-300">{String(desc)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className={`font-medium ${colors.name}`}>Possuído por: </span>
              <span className="text-gray-300">{skillData.possessed}</span>
            </div>

            <div>
              <span className={`font-medium ${colors.name}`}>Especializações: </span>
              <span className="text-gray-300">{skillData.specializations}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-300 mb-2">Habilidades</h2>
        <p className="text-gray-300">
          Distribua os pontos entre as três categorias de habilidades
        </p>
      </div>

      {/* Talentos */}
      <Card className="bg-gray-800 border-red-900">
        <CardHeader>
          <CardTitle className="text-red-300 flex items-center justify-between">
            <div>
              <span>Talentos</span>
              <span className="text-sm font-normal text-gray-400 ml-2">
                (Habilidades intuitivas e não treinadas)
              </span>
            </div>
            <span className="text-sm">
              {getRemainingPoints('talents')}/{MAX_POINTS.talents} pontos restantes
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-400 mb-4">
            Os Talentos descrevem Habilidades intuitivas e não treinadas. Eles não podem ser treinados ou estudados formalmente apenas aprendidos por experiência direta.
          </p>
          {TALENT_SKILLS.map(skillKey => (
            <SkillControl 
              key={skillKey} 
              skillKey={skillKey} 
              category="talents"
              skillData={SKILL_DESCRIPTIONS[skillKey as keyof typeof SKILL_DESCRIPTIONS]} 
            />
          ))}
        </CardContent>
      </Card>

      {/* Perícias */}
      <Card className="bg-gray-800 border-blue-900">
        <CardHeader>
          <CardTitle className="text-blue-300 flex items-center justify-between">
            <div>
              <span>Perícias</span>
              <span className="text-sm font-normal text-gray-400 ml-2">
                (Habilidades adquiridas por treinamento)
              </span>
            </div>
            <span className="text-sm">
              {getRemainingPoints('skills')}/{MAX_POINTS.skills} pontos restantes
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-400 mb-4">
            As Perícias são Habilidades adquiridas por aprendizado ou treinamento rigoroso. Se você tentar usar uma Perícia que não possui, a dificuldade do teste aumenta em 1.
          </p>
          {SKILL_SKILLS.map(skillKey => (
            <SkillControl 
              key={skillKey} 
              skillKey={skillKey} 
              category="skills"
              skillData={SKILL_DESCRIPTIONS[skillKey as keyof typeof SKILL_DESCRIPTIONS]} 
            />
          ))}
        </CardContent>
      </Card>

      {/* Conhecimentos */}
      <Card className="bg-gray-800 border-purple-900">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center justify-between">
            <div>
              <span>Conhecimentos</span>
              <span className="text-sm font-normal text-gray-400 ml-2">
                (Habilidades acadêmicas e especializadas)
              </span>
            </div>
            <span className="text-sm">
              {getRemainingPoints('knowledges')}/{MAX_POINTS.knowledges} pontos restantes
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-400 mb-4">
            Conhecimentos exigem aplicação rigorosa da mente. Se você não possui um Conhecimento, em geral não pode tentar usá-lo.
          </p>
          {KNOWLEDGE_SKILLS.map(skillKey => (
            <SkillControl 
              key={skillKey} 
              skillKey={skillKey} 
              category="knowledges"
              skillData={SKILL_DESCRIPTIONS[skillKey as keyof typeof SKILL_DESCRIPTIONS]} 
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}