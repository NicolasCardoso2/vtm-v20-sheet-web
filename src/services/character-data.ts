import { Clan, Jeito, Arquetipo } from '@/types/character-creation'

// Dados mocados - Clãs do V20
const CLANS_DATA: Clan[] = [
  {
    id: 'brujah',
    nome: 'Brujah',
    resumo: 'Rebeldes passionais que lutam contra a autoridade',
    descricao: 'Os Brujah são conhecidos por sua paixão, rebeldia e tendência à violência. Valorizam a liberdade acima de tudo e frequentemente se encontram em conflito com as estruturas de poder estabelecidas. São guerreiros natos e revolucionários por natureza.',
    disciplinas: ['Potência', 'Rapidez', 'Presença'],
    tags: ['Rebelde', 'Violento', 'Passional', 'Guerreiro']
  },
  {
    id: 'gangrel',
    nome: 'Gangrel',
    resumo: 'Selvagens solitários próximos à natureza',
    descricao: 'Os Gangrel são os mais próximos de suas naturezas bestiais. Preferem a solidão das florestas às cidades superlotadas, e desenvolvem características animais conforme envelhecem. São independentes e desconfiam das políticas vampíricas.',
    disciplinas: ['Animalismo', 'Fortitude', 'Metamorfose'],
    tags: ['Selvagem', 'Solitário', 'Bestial', 'Natural']
  },
  {
    id: 'malkavian',
    nome: 'Malkavian',
    resumo: 'Profetas insanos com percepções distorcidas',
    descricao: 'Todos os Malkavian sofrem de algum tipo de demência, mas esta loucura frequentemente vem acompanhada de insights únicos sobre a realidade. Eles veem padrões e verdades que outros não conseguem perceber, tornando-os tanto temidos quanto respeitados.',
    disciplinas: ['Auspícios', 'Demência', 'Ofuscação'],
    tags: ['Insano', 'Profético', 'Visionário', 'Imprevisível']
  },
  {
    id: 'nosferatu',
    nome: 'Nosferatu',
    resumo: 'Informantes desfigurados das sombras',
    descricao: 'Amaldiçoados com aparências horrendas, os Nosferatu são forçados a viver nas sombras da sociedade vampírica. Compensam sua monstruosidade física com uma rede de informações sem igual, tornando-se os espiões e informantes mais valiosos.',
    disciplinas: ['Animalismo', 'Ofuscação', 'Potência'],
    tags: ['Desfigurado', 'Informante', 'Espião', 'Sombras']
  },
  {
    id: 'toreador',
    nome: 'Toreador',
    resumo: 'Artistas degenerados obcecados pela beleza',
    descricao: 'Os Toreador são os patronos das artes e da beleza. Apaixonados por tudo que é belo, podem ser tanto criadores inspirados quanto críticos cruéis. Sua obsessão pela estética os torna vulneráveis à paralisia diante da verdadeira beleza.',
    disciplinas: ['Auspícios', 'Rapidez', 'Presença'],
    tags: ['Artista', 'Belo', 'Passional', 'Esteta']
  },
  {
    id: 'tremere',
    nome: 'Tremere',
    resumo: 'Magos usurpadores que dominam a taumaturgia',
    descricao: 'Originalmente magos mortais que roubaram a imortalidade vampírica, os Tremere são mestres da magia de sangue. Organizados como uma pirâmide hierárquica rígida, são temidos por seu poder místico e ambição política.',
    disciplinas: ['Auspícios', 'Dominação', 'Taumaturgia'],
    tags: ['Mago', 'Hierárquico', 'Místico', 'Ambicioso']
  },
  {
    id: 'ventrue',
    nome: 'Ventrue',
    resumo: 'Líderes nobres que comandam a Camarilla',
    descricao: 'Os Ventrue se veem como a realeza vampírica, os verdadeiros líderes da sociedade dos mortos-vivos. Com senso natural de comando e política, frequentemente ocupam posições de poder na Camarilla. Seu sangue refinado os torna seletivos na alimentação.',
    disciplinas: ['Dominação', 'Fortitude', 'Presença'],
    tags: ['Nobre', 'Líder', 'Político', 'Refinado']
  },
  {
    id: 'assamitas',
    nome: 'Assamitas',
    resumo: 'Assassinos silenciosos do deserto',
    descricao: 'Os Assamitas são uma antiga linhagem de assassinos originária do Oriente Médio. Conhecidos por sua disciplina, código de honra e habilidades letais, servem como executores e caçadores de vampiros. Tradicionalmente leais ao Sabbat, alguns seguem caminhos independentes.',
    disciplinas: ['Rapidez', 'Ofuscação', 'Quietus'],
    tags: ['Assassino', 'Honrado', 'Disciplinado', 'Oriental']
  },
  {
    id: 'giovanni',
    nome: 'Giovanni',
    resumo: 'Necromantes incestuosos da família italiana',
    descricao: 'Os Giovanni são uma família italiana que pratica necromancia há séculos. Mantêm seus laços familiares após o Abraço, criando uma estrutura única baseada em sangue mortal e vampírico. Controlam o mundo dos mortos através de pactos sombrios.',
    disciplinas: ['Dominação', 'Fortitude', 'Necromancia'],
    tags: ['Necromante', 'Familiar', 'Italiano', 'Comerciante']
  },
  {
    id: 'lasombra',
    nome: 'Lasombra',
    resumo: 'Senhores das trevas que comandam o Sabbat',
    descricao: 'Os Lasombra são mestres das sombras e líderes naturais do Sabbat. Originários da nobreza espanhola, possuem um senso aristocrático de superioridade. Manipulam as trevas literalmente e figurativamente, sendo políticos consumados.',
    disciplinas: ['Dominação', 'Potência', 'Tenebrosidade'],
    tags: ['Sombrio', 'Líder', 'Aristocrata', 'Sabbat']
  },
  {
    id: 'ravnos',
    nome: 'Ravnos',
    resumo: 'Nômades trapaceiros mestres da ilusão',
    descricao: 'Os Ravnos são eternos viajantes e mestres do engano. Originários da Índia, espalham-se pelo mundo como nômades, vivendo através de truques, ilusões e pequenos crimes. Cada um possui um vício específico que deve satisfazer regularmente.',
    disciplinas: ['Animalismo', 'Fortitude', 'Quimerismo'],
    tags: ['Nômade', 'Trapaceiro', 'Ilusionista', 'Viajante']
  },
  {
    id: 'seguidores_set',
    nome: 'Seguidores de Set',
    resumo: 'Corruptores devotos do deus serpente Set',
    descricao: 'Os Seguidores de Set adoram o antigo deus egípcio Set e buscam corromper a sociedade mortal e vampírica. Através de drogas, vício e tentação, espalham a influência de seu senhor sombrio. São temidos por sua capacidade de encontrar e explorar fraquezas.',
    disciplinas: ['Ofuscação', 'Presença', 'Serpentis'],
    tags: ['Corruptor', 'Religioso', 'Tentador', 'Egípcio']
  },
  {
    id: 'tzimisce',
    nome: 'Tzimisce',
    resumo: 'Senhores feudais que moldam carne e osso',
    descricao: 'Os Tzimisce são os senhores demoníacos da Europa Oriental, mestres da Vicissitude que lhes permite moldar carne e osso. Extremamente territoriais e tradicionalistas, mantêm domínios ancestrais e praticam hospitalidade sinistra com seus "convidados".',
    disciplinas: ['Animalismo', 'Auspícios', 'Vicissitude'],
    tags: ['Senhor', 'Territorial', 'Tradicional', 'Moldador']
  }
]

// Dados mocados - Jeitos/Seitas
const JEITOS_DATA: Jeito[] = [
  {
    id: 'camarilla',
    nome: 'Camarilla',
    resumo: 'A seita tradicionalista que mantém a Máscara',
    descricao: 'A Camarilla é a maior e mais influente seita vampírica, dedicada à preservação da Máscara - o grande segredo que oculta a existência dos vampiros dos mortais. Valoriza tradição, hierarquia e estabilidade, governando através de príncipes locais.'
  },
  {
    id: 'anarquista',
    nome: 'Movimento Anarquista',
    resumo: 'Rebeldes que rejeitam a autoridade estabelecida',
    descricao: 'O Movimento Anarquista surgiu como uma reação às rígidas hierarquias da Camarilla e à brutalidade do Sabbat. Defendem a liberdade individual e a igualdade entre vampiros, rejeitando títulos nobres e estruturas de poder tradicionais.'
  },
  {
    id: 'sabbat',
    nome: 'Sabbat',
    resumo: 'Fanáticos que abraçam sua natureza monstruosa',
    descricao: 'O Sabbat vê os vampiros como uma espécie superior aos mortais, rejeitando completamente a humanidade. Organizados em matilhas nômades, praticam rituais sangrentos e buscam a transcendência através do abraço de sua natureza bestial.'
  },
  {
    id: 'independente',
    nome: 'Independente',
    resumo: 'Vampiro sem afiliação sectária definida',
    descricao: 'Alguns vampiros escolhem não se afiliar a nenhuma seita maior, mantendo sua independência política. Isso pode oferecer liberdade, mas também significa abrir mão da proteção e recursos que as organizações proporcionam.'
  }
]

// Dados mocados - Arquétipos (Natureza e Comportamento)
const ARQUETIPOS_DATA: Arquetipo[] = [
  {
    id: 'arquiteto',
    tipo: 'AMBOS',
    nome: 'Arquiteto',
    resumo: 'Você precisa criar algo de valor duradouro',
    descricao: 'O Arquiteto possui a necessidade de criar algo de importância duradoura. Pode ser um império, uma obra de arte ou mesmo uma família. Sente-se realizado quando vê seus projetos tomarem forma e perdurar através do tempo.'
  },
  {
    id: 'autocrata',
    tipo: 'AMBOS',
    nome: 'Autocrata',
    resumo: 'Você deve estar no controle',
    descricao: 'O Autocrata deve estar no comando. Seja líder ou não, precisa exercer controle sobre sua situação e frequentemente sobre outras pessoas. A necessidade de dirigir e comandar é fundamental para sua personalidade.'
  },
  {
    id: 'bon_vivant',
    tipo: 'AMBOS',
    nome: 'Bon Vivant',
    resumo: 'A vida deve ser desfrutada',
    descricao: 'O Bon Vivant sabe que a vida deve ser desfrutada. Busca prazeres e experiências, evitando responsabilidades que possam interferir com sua diversão. Acredita que cada momento deve ser vivido intensamente.'
  },
  {
    id: 'cacador_emocoes',
    tipo: 'AMBOS',
    nome: 'Caçador de Emoções',
    resumo: 'Você busca constantemente novas experiências',
    descricao: 'O Caçador de Emoções vive para experimentar sensações intensas e novas aventuras. Entedia-se facilmente com rotinas e busca constantemente desafios que testem seus limites físicos e emocionais.'
  },
  {
    id: 'camaleao',
    tipo: 'AMBOS',
    nome: 'Camaleão',
    resumo: 'Você se adapta a qualquer situação',
    descricao: 'O Camaleão possui uma habilidade natural de se adaptar a diferentes grupos e situações. Muda sua personalidade conforme necessário para se encaixar, às vezes perdendo o senso de quem realmente é.'
  },
  {
    id: 'capitalista',
    tipo: 'AMBOS',
    nome: 'Capitalista',
    resumo: 'Dinheiro é poder, poder é tudo',
    descricao: 'O Capitalista acredita que riqueza material é a chave para o sucesso e felicidade. Busca constantemente formas de aumentar sua fortuna e vê todas as relações através de uma ótica comercial.'
  },
  {
    id: 'celebrante',
    tipo: 'AMBOS',
    nome: 'Celebrante',
    resumo: 'A vida é uma festa contínua',
    descricao: 'O Celebrante transforma qualquer ocasião em celebração. Possui energia contagiante e busca espalhar alegria, mesmo em situações sombrias, acreditando que a positividade pode superar qualquer adversidade.'
  },
  {
    id: 'cientista',
    tipo: 'AMBOS',
    nome: 'Cientista',
    resumo: 'O conhecimento é poder supremo',
    descricao: 'O Cientista busca compreender o mundo através da lógica e experimentação. Acredita que todos os mistérios podem ser desvendados através do método científico e dedica sua existência à busca do conhecimento.'
  },
  {
    id: 'competidor',
    tipo: 'AMBOS',
    nome: 'Competidor',
    resumo: 'Vencer é tudo que importa',
    descricao: 'O Competidor vê a vida como uma série de desafios a serem superados. Precisa ser o melhor em tudo que faz e transforma situações casuais em competições, às vezes alienando aliados no processo.'
  },
  {
    id: 'conformista',
    tipo: 'AMBOS',
    nome: 'Conformista',
    resumo: 'Seguir as regras garante segurança',
    descricao: 'O Conformista encontra conforto em seguir normas estabelecidas e tradições. Evita conflitos e prefere se integrar ao grupo dominante, mesmo que isso signifique sacrificar suas próprias convicções.'
  },
  {
    id: 'crianca',
    tipo: 'AMBOS',
    nome: 'Criança',
    resumo: 'Você age de forma infantil para obter cuidados',
    descricao: 'A Criança evita responsabilidades agindo de forma infantil e dependente. Busca constantemente proteção e cuidados de outros, usando charme e aparente inocência para conseguir o que deseja.'
  },
  {
    id: 'diretor',
    tipo: 'AMBOS',
    nome: 'Diretor',
    resumo: 'Você assume a liderança naturalmente',
    descricao: 'O Diretor toma a iniciativa em situações grupais, assumindo naturalmente posições de liderança. É organizado, responsável e inspira confiança nos outros, mesmo quando pode não se sentir preparado internamente.'
  },
  {
    id: 'diletante',
    tipo: 'AMBOS',
    nome: 'Diletante',
    resumo: 'Você tem interesse superficial em tudo',
    descricao: 'O Diletante possui curiosidade sobre muitos assuntos mas raramente se aprofunda em qualquer um. Prefere conhecer um pouco de tudo a se tornar especialista, valorizando a variedade sobre a maestria.'
  },
  {
    id: 'enigma',
    tipo: 'AMBOS',
    nome: 'Enigma',
    resumo: 'Mistério é sua essência',
    descricao: 'O Enigma cultiva propositalmente um ar de mistério. Raramente revela seus verdadeiros pensamentos ou motivações, preferindo manter outros adivinhando suas intenções através de ações ambíguas.'
  },
  {
    id: 'esperto',
    tipo: 'AMBOS',
    nome: 'Esperto',
    resumo: 'Inteligência supera força bruta',
    descricao: 'O Esperto confia em sua astúcia para superar obstáculos. Prefere soluções inteligentes a confrontos diretos, usando manipulação e estratégia para alcançar seus objetivos.'
  },
  {
    id: 'excentrico',
    tipo: 'AMBOS',
    nome: 'Excêntrico',
    resumo: 'Normalidade é superestimada',
    descricao: 'O Excêntrico abraça comportamentos e ideias não convencionais. Deliberadamente age de forma estranha ou única, às vezes para chamar atenção, outras vezes simplesmente porque não consegue se conformar com padrões sociais.'
  },
  {
    id: 'fanatico',
    tipo: 'AMBOS',
    nome: 'Fanático',
    resumo: 'Sua causa justifica qualquer meio',
    descricao: 'O Fanático dedica sua existência a uma causa ou ideal específico. Está disposto a fazer qualquer sacrifício por sua crença e vê aqueles que não compartilham sua paixão como inimigos ou ignorantes.'
  },
  {
    id: 'filantropo',
    tipo: 'AMBOS',
    nome: 'Filantropo',
    resumo: 'Ajudar outros traz significado',
    descricao: 'O Filantropo encontra propósito em ajudar aqueles menos afortunados. Genuinamente preocupa-se com o bem-estar dos outros e trabalha para aliviar sofrimento, mesmo que isso custe recursos pessoais.'
  },
  {
    id: 'galante',
    tipo: 'AMBOS',
    nome: 'Galante',
    resumo: 'Você busca romance e paixão',
    descricao: 'O Galante vive intensamente suas emoções e relacionamentos, buscando sempre romance e conexões apaixonadas. Tende a idealizar parceiros e situações, criando dramas onde não existem.'
  },
  {
    id: 'gozador',
    tipo: 'AMBOS',
    nome: 'Gozador',
    resumo: 'Humor é sua arma e escudo',
    descricao: 'O Gozador usa humor para lidar com situações difíceis e estabelecer conexões sociais. Pode usar piadas para desarmar tensões ou, alternativamente, para humilhar outros quando se sente ameaçado.'
  },
  {
    id: 'guru',
    tipo: 'AMBOS',
    nome: 'Guru',
    resumo: 'Você possui sabedoria para compartilhar',
    descricao: 'O Guru acredita possuir insights especiais sobre a vida e sente necessidade de compartilhar essa sabedoria. Naturalmente atrai seguidores que buscam orientação espiritual ou filosófica.'
  },
  {
    id: 'idealista',
    tipo: 'AMBOS',
    nome: 'Idealista',
    resumo: 'Você luta para tornar o mundo melhor',
    descricao: 'O Idealista acredita sinceramente que pode fazer a diferença e tornar o mundo um lugar melhor. Mantém altos padrões morais e trabalha incansavelmente para alcançar seus objetivos nobres.'
  },
  {
    id: 'juiz',
    tipo: 'AMBOS',
    nome: 'Juiz',
    resumo: 'Justiça deve prevalecer sempre',
    descricao: 'O Juiz possui um forte senso de certo e errado e sente-se compelido a fazer justiça. Avalia constantemente as ações dos outros e não hesita em confrontar aqueles que considera injustos.'
  },
  {
    id: 'malandro',
    tipo: 'AMBOS',
    nome: 'Malandro',
    resumo: 'Viver dos outros é uma arte',
    descricao: 'O Malandro sobrevive através de charme, astúcia e exploração de outros. Prefere ganhar a vida através de esquemas e manipulação em vez de trabalho honesto, vendo isso como superioridade intelectual.'
  },
  {
    id: 'martir',
    tipo: 'AMBOS',
    nome: 'Mártir',
    resumo: 'Sofrimento nobre traz propósito',
    descricao: 'O Mártir encontra significado no sofrimento, especialmente quando é por uma causa maior. Frequentemente se coloca em situações perigosas ou sacrifica seus próprios interesses pelo bem dos outros.'
  },
  {
    id: 'masoquista',
    tipo: 'AMBOS',
    nome: 'Masoquista',
    resumo: 'Dor física ou emocional traz prazer',
    descricao: 'O Masoquista deriva satisfação de dor física ou emocional. Pode buscar deliberadamente situações humilhantes ou dolorosas, encontrando nelas uma forma peculiar de prazer ou purificação.'
  },
  {
    id: 'monstro',
    tipo: 'AMBOS',
    nome: 'Monstro',
    resumo: 'Sua natureza sombria é libertadora',
    descricao: 'O Monstro abraçou completamente seus impulsos mais sombrios. Não sente remorso por atos cruéis e vê a moralidade como uma fraqueza humana que transcendeu ao aceitar sua verdadeira natureza.'
  },
  {
    id: 'olho_tempestade',
    tipo: 'AMBOS',
    nome: 'Olho da Tempestade',
    resumo: 'Caos é onde você prospera',
    descricao: 'O Olho da Tempestade permanece calmo no centro do caos. Prospera em situações de crise e conflito, muitas vezes sendo o único capaz de manter a sanidade quando tudo desmorona ao redor.'
  },
  {
    id: 'pedagogo',
    tipo: 'AMBOS',
    nome: 'Pedagogo',
    resumo: 'Ensinar outros é sua missão',
    descricao: 'O Pedagogo sente satisfação em educar e orientar outros. Acredita que o conhecimento deve ser compartilhado e frequentemente assume o papel de mentor, mesmo quando não solicitado.'
  },
  {
    id: 'penitente',
    tipo: 'AMBOS',
    nome: 'Penitente',
    resumo: 'Redenção através do arrependimento',
    descricao: 'O Penitente carrega o peso de culpa por ações passadas. Busca constantemente formas de se redimir e fazer penitência, acreditando que o sofrimento pode purificar sua alma corrompida.'
  },
  {
    id: 'perfeccionista',
    tipo: 'AMBOS',
    nome: 'Perfeccionista',
    resumo: 'Apenas a perfeição é aceitável',
    descricao: 'O Perfeccionista possui padrões extremamente altos para si mesmo e outros. Fica frustrado com imperfeições e trabalha obsessivamente para corrigir falhas, às vezes prejudicando relacionamentos no processo.'
  },
  {
    id: 'ranzinza',
    tipo: 'AMBOS',
    nome: 'Ranzinza',
    resumo: 'O mundo está sempre errado',
    descricao: 'O Ranzinza encontra defeitos em praticamente tudo e todos. Constantemente reclama e critica, raramente satisfeito com qualquer situação, mas paradoxalmente isso faz parte de seu charme peculiar.'
  },
  {
    id: 'rebelde',
    tipo: 'AMBOS',
    nome: 'Rebelde',
    resumo: 'Autoridade deve ser desafiada',
    descricao: 'O Rebelde instintivamente se opõe à autoridade e convenções sociais. Luta contra sistemas estabelecidos não necessariamente por ter uma alternativa melhor, mas porque acredita na importância da resistência.'
  },
  {
    id: 'sadico',
    tipo: 'AMBOS',
    nome: 'Sádico',
    resumo: 'Infligir sofrimento traz prazer',
    descricao: 'O Sádico deriva satisfação do sofrimento alheio. Pode torturar física ou emocionalmente, encontrando prazer no poder que exerce sobre vítimas indefesas. Vê a crueldade como uma forma de arte.'
  },
  {
    id: 'show_horrores',
    tipo: 'AMBOS',
    nome: 'Show de Horrores',
    resumo: 'Chocar outros é sua especialidade',
    descricao: 'O Show de Horrores busca atenção através de comportamentos extremos e chocantes. Usa sua aparência ou ações perturbadoras para provocar reações, alimentando-se do desconforto que causa nos outros.'
  },
  {
    id: 'sobrevivente',
    tipo: 'AMBOS',
    nome: 'Sobrevivente',
    resumo: 'Persistir é tudo que importa',
    descricao: 'O Sobrevivente superou adversidades extremas e desenvolveu uma determinação férrea. Fará qualquer coisa necessária para continuar existindo, priorizando a sobrevivência sobre princípios morais.'
  },
  {
    id: 'sociopata',
    tipo: 'AMBOS',
    nome: 'Sociopata',
    resumo: 'Outros são ferramentas para usar',
    descricao: 'O Sociopata vê outras pessoas como objetos para manipular em benefício próprio. Incapaz de empatia genuína, simula emoções quando conveniente mas não sente conexões reais com outros seres.'
  },
  {
    id: 'soldado',
    tipo: 'AMBOS',
    nome: 'Soldado',
    resumo: 'Disciplina e hierarquia trazem ordem',
    descricao: 'O Soldado valoriza disciplina, lealdade e estrutura hierárquica. Funciona melhor quando tem ordens claras para seguir e uma cadeia de comando definida, encontrando propósito no serviço a uma causa maior.'
  },
  {
    id: 'solitario',
    tipo: 'AMBOS',
    nome: 'Solitário',
    resumo: 'A solidão é preferível à companhia',
    descricao: 'O Solitário prefere sua própria companhia à dos outros. Pode ter sido ferido em relacionamentos passados ou simplesmente valorizar a independência acima de conexões sociais.'
  },
  {
    id: 'tradicionalista',
    tipo: 'AMBOS',
    nome: 'Tradicionalista',
    resumo: 'O passado deve ser preservado',
    descricao: 'O Tradicionalista acredita que métodos e valores antigos são superiores às novidades modernas. Luta para preservar tradições e costumes, resistindo a mudanças que considera degradação cultural.'
  },
  {
    id: 'valentao',
    tipo: 'AMBOS',
    nome: 'Valentão',
    resumo: 'Intimidação resolve problemas',
    descricao: 'O Valentão usa força e intimidação para conseguir o que quer. Prefere soluções diretas e agressivas, acreditando que demonstrar poder é a forma mais eficaz de lidar com conflitos.'
  },
  {
    id: 'visionario',
    tipo: 'AMBOS',
    nome: 'Visionário',
    resumo: 'Você vê possibilidades futuras',
    descricao: 'O Visionário possui uma perspectiva única sobre o futuro e possibilidades não realizadas. Inspira outros com suas ideias revolucionárias, mas às vezes é visto como impraticável ou excêntrico demais.'
  }
]

// Serviço para acessar os dados
export class CharacterDataService {
  static async getClans(): Promise<Clan[]> {
    // Simula chamada de API
    return new Promise(resolve => {
      setTimeout(() => resolve(CLANS_DATA), 100)
    })
  }

  static async getJeitos(): Promise<Jeito[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(JEITOS_DATA), 100)
    })
  }

  static async getArquetipos(tipo?: 'NATUREZA' | 'COMPORTAMENTO'): Promise<Arquetipo[]> {
    return new Promise(resolve => {
      const filtered = tipo ? ARQUETIPOS_DATA.filter(a => a.tipo === tipo || a.tipo === 'AMBOS') : ARQUETIPOS_DATA
      setTimeout(() => resolve(filtered), 100)
    })
  }

  static searchClans(term: string): Promise<Clan[]> {
    return new Promise(resolve => {
      const filtered = CLANS_DATA.filter(clan => 
        clan.nome.toLowerCase().includes(term.toLowerCase()) ||
        clan.resumo.toLowerCase().includes(term.toLowerCase()) ||
        clan.tags?.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
      )
      setTimeout(() => resolve(filtered), 100)
    })
  }

  static searchJeitos(term: string): Promise<Jeito[]> {
    return new Promise(resolve => {
      const filtered = JEITOS_DATA.filter(jeito => 
        jeito.nome.toLowerCase().includes(term.toLowerCase()) ||
        jeito.resumo.toLowerCase().includes(term.toLowerCase())
      )
      setTimeout(() => resolve(filtered), 100)
    })
  }

  static searchArquetipos(term: string, tipo?: 'NATUREZA' | 'COMPORTAMENTO'): Promise<Arquetipo[]> {
    return new Promise(resolve => {
      let filtered = ARQUETIPOS_DATA.filter(arq => 
        arq.nome.toLowerCase().includes(term.toLowerCase()) ||
        arq.resumo.toLowerCase().includes(term.toLowerCase())
      )
      
      if (tipo) {
        filtered = filtered.filter(a => a.tipo === tipo || a.tipo === 'AMBOS')
      }
      
      setTimeout(() => resolve(filtered), 100)
    })
  }
}