// Dados estáticos para sistema de criação de personagens
// Este arquivo mantém dados que não mudam frequentemente

import { Clan, Jeito, Arquetipo } from '@/types/character-creation'

export const CLANS_DATA: Clan[] = [
  {
    id: 'brujah',
    nome: 'Brujah',
    resumo: 'Rebeldes passionais que lutam contra a autoridade',
    descricao: 'Os Brujah são conhecidos por sua paixão, rebeldia e tendência à violência. Valorizam a liberdade acima de tudo e frequentemente se encontram em conflito com as estruturas de poder estabelecidas.',
    disciplinas: ['Potência', 'Rapidez', 'Presença'],
    tags: ['Rebelde', 'Violento', 'Passional']
  },
  {
    id: 'gangrel',
    nome: 'Gangrel',
    resumo: 'Selvagens solitários próximos à natureza',
    descricao: 'Os Gangrel são os mais próximos de suas naturezas bestiais. Preferem a solidão das florestas às cidades superlotadas, e desenvolvem características animais conforme envelhecem.',
    disciplinas: ['Animalismo', 'Fortitude', 'Metamorfose'],
    tags: ['Selvagem', 'Solitário', 'Bestial']
  },
  {
    id: 'malkavian',
    nome: 'Malkavian',
    resumo: 'Profetas insanos com percepções distorcidas',
    descricao: 'Todos os Malkavian sofrem de algum tipo de demência, mas esta loucura frequentemente vem acompanhada de insights únicos sobre a realidade.',
    disciplinas: ['Auspícios', 'Demência', 'Ofuscação'],
    tags: ['Insano', 'Profético', 'Visionário']
  },
  {
    id: 'nosferatu',
    nome: 'Nosferatu',
    resumo: 'Informantes desfigurados das sombras',
    descricao: 'Amaldiçoados com aparências horrendas, os Nosferatu são forçados a viver nas sombras da sociedade vampírica. Compensam sua monstruosidade física com uma rede de informações sem igual.',
    disciplinas: ['Animalismo', 'Ofuscação', 'Potência'],
    tags: ['Desfigurado', 'Informante', 'Espião']
  },
  {
    id: 'toreador',
    nome: 'Toreador',
    resumo: 'Artistas degenerados obcecados pela beleza',
    descricao: 'Os Toreador são os patronos das artes e da beleza. Apaixonados por tudo que é belo, podem ser tanto criadores inspirados quanto críticos cruéis.',
    disciplinas: ['Auspícios', 'Rapidez', 'Presença'],
    tags: ['Artista', 'Belo', 'Passional']
  },
  {
    id: 'tremere',
    nome: 'Tremere',
    resumo: 'Magos usurpadores que dominam a taumaturgia',
    descricao: 'Originalmente magos mortais que roubaram a imortalidade vampírica, os Tremere são mestres da magia de sangue. Organizados como uma pirâmide hierárquica rígida.',
    disciplinas: ['Auspícios', 'Dominação', 'Taumaturgia'],
    tags: ['Mago', 'Hierárquico', 'Ambicioso']
  },
  {
    id: 'ventrue',
    nome: 'Ventrue',
    resumo: 'Aristocratas naturais que lideram a Camarilla',
    descricao: 'Os Ventrue se veem como os líderes naturais dos vampiros. São aristocratas que valorizam tradição, liderança e ordem. Muitos ocupam posições de poder na Camarilla.',
    disciplinas: ['Dominação', 'Fortitude', 'Presença'],
    tags: ['Aristocrata', 'Líder', 'Tradicional']
  }
  // ... outros clãs podem ser adicionados conforme necessário
]

export const JEITOS_DATA: Jeito[] = [
  {
    id: 'caminhante',
    nome: 'Caminhante',
    resumo: 'Nômade sem raízes fixas',
    descricao: 'Você nunca se estabelece em lugar algum por muito tempo.'
  },
  {
    id: 'forasteiro',
    nome: 'Forasteiro', 
    resumo: 'Estranho em terras alheias',
    descricao: 'Você não é daqui, é um estrangeiro em terra estranha.'
  },
  {
    id: 'rebelde',
    nome: 'Rebelde',
    resumo: 'Contra o sistema estabelecido',
    descricao: 'Você se opõe à autoridade e às regras impostas.'
  },
  {
    id: 'soldado',
    nome: 'Soldado',
    resumo: 'Seguidor disciplinado de ordens',
    descricao: 'Você segue ordens e mantém disciplina militar.'
  },
  {
    id: 'erudito',
    nome: 'Erudito',
    resumo: 'Dedicado ao conhecimento',
    descricao: 'Você busca sempre aprender e compartilhar conhecimento.'
  }
  // ... outros jeitos podem ser adicionados conforme necessário
]

export const ARQUETIPOS_DATA: Arquetipo[] = [
  {
    id: 'arquiteto',
    tipo: 'AMBOS',
    nome: 'Arquiteto',
    resumo: 'Criador de estruturas duradouras',
    descricao: 'Você constrói coisas que perduram através do tempo.'
  },
  {
    id: 'autocrata',
    tipo: 'AMBOS', 
    nome: 'Autocrata',
    resumo: 'Líder autoritário natural',
    descricao: 'Você deve liderar, e os outros devem seguir.'
  },
  {
    id: 'bon_vivant',
    tipo: 'AMBOS',
    nome: 'Bon Vivant',
    resumo: 'Hedonista que busca prazer',
    descricao: 'A vida deve ser saboreada em cada momento.'
  },
  {
    id: 'bravo',
    tipo: 'AMBOS',
    nome: 'Bravo',
    resumo: 'Valentão intimidador',
    descricao: 'Você usa força e intimidação para conseguir o que quer.'
  },
  {
    id: 'crianca',
    tipo: 'AMBOS',
    nome: 'Criança',
    resumo: 'Inocente dependente de outros',
    descricao: 'Você mantém uma visão infantil do mundo.'
  },
  {
    id: 'celebrante',
    tipo: 'AMBOS',
    nome: 'Celebrante',
    resumo: 'Festeiro social extrovertido',
    descricao: 'Você vive para celebrar e ser o centro das atenções.'
  },
  {
    id: 'competidor',
    tipo: 'AMBOS',
    nome: 'Competidor',
    resumo: 'Sempre busca vencer',
    descricao: 'Tudo na vida é uma competição que deve ser vencida.'
  },
  {
    id: 'conformista',
    tipo: 'AMBOS',
    nome: 'Conformista',
    resumo: 'Segue as regras estabelecidas',
    descricao: 'Você prefere seguir a tradição e as regras.'
  },
  {
    id: 'sobrevivente',
    tipo: 'AMBOS',
    nome: 'Sobrevivente',
    resumo: 'Sobrevive a qualquer custo',
    descricao: 'Você faz o que for necessário para sobreviver.'
  }
  // ... mais arquétipos podem ser adicionados conforme necessário
]